import * as Yup from 'yup';
import Appointments from '../models/Appointments';
import User from '../models/User';

class appointmentsController {
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

    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointments);
  }
}

export default new appointmentsController();
