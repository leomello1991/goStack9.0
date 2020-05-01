import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointments from '../models/Appointments';
import User from '../models/User';

class AgendaController {
  async index(req, res) {
    const checkPrestador = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });
    if (!checkPrestador) {
      return res.json({ Error: 'Usuario nao é Prestador de serviço' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date)
    const appointments = await Appointments.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
        order:['date']
    });
    return res.json(appointments);
  }
}

export default new AgendaController();
