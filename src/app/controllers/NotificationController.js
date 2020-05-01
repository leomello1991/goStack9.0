import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    // checar se o usuario logado é barbeiro

    const checkProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });
    if (!checkProvider) {
      return res.status(401).json({ error: 'Usuario nao é funcionario' });
    }
    const notification = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notification);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate (req.params.id,
        {read:true},
        {new:true}
        );

    return res.json(notification);
  }
}

export default new NotificationController();
