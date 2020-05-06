import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointments from '../models/Appointments';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointments.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 28,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validations Fails' });
    }

    const { provider_id, date } = req.body;

    // verificar se o provider_id é um provider
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });
    if (!isProvider) {
      return res.json({ error: 'Voce so pode marcar com um prestador de serviços' });
    }
    // verificar se a data é anterior de hj ja esta marcado
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.json({ error: 'nao é possivel data anteriores' });
    }

    // checar se o horario é permitido

    const horarioLivre = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (horarioLivre) {
      return res.json({ error: 'horario ja marcado' });
    }
    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    // salvar o usuario para mandar na notificação
    const user = await User.findByPk(req.userId);
    // pegar data
    const formatDate = format(hourStart, " 'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt });

    // notificando novo agendamento

    await Notification.create({
      content: `Novo agendamento para ${user.name} para o ${formatDate}`,
      user: provider_id,
    });

    return res.json(appointments);
  }

  async delete(req, res) {
    const appointments = await Appointments.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointments.user_id !== req.userId) {
      return res.status(401).json({ error: ' voce nao pode cancelar o agendamento do amiginho' });
    }
    // verificando se esta dentro do horario de cancelamento passando a hora que ta agendado - 2 horas que é minimo

    const horaMinima = subHours(appointments.date, 2);

    if (isBefore(horaMinima, new Date())) {
      return res.status(401).json({ error: 'Não pode cancelar com menos de 2 horas do agendamento' });
    }

    appointments.canceled_at = new Date();

    await appointments.save() 

    await Queue.add(CancellationMail.key, {
      appointments,
    });

    return res.json(appointments);
  }
}

export default new AppointmentsController();
