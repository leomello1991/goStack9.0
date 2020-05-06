import { format , parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  // para cada job é preciso fazer um return com chave unica com o mesmo nome da classe
  get key() {
    return 'CancellationMail';
  }

  // a tarefa que vai executa quando o processo for executado exemplo envio de 10 vai ser chamado pela cada um dos emails
  // vai ficar o codigo a ser executado
  async handle({ data }) {
    const { appointments } = data;

    await Mail.sendMail({
      // escrito do email
      to: `${appointments.provider.name} <${appointments.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancelation',
      context: {
        provider: appointments.provider.name,
        user: appointments.user.name,
        date: format(parseISO(appointments.date), " 'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt }),
      },
    });
  }
}

export default new CancellationMail();
