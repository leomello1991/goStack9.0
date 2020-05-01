import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-handlebars';
import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    // pego as configuraçoes do email
    const { host, port, secure, auth } = mailConfig;

    // crio a conexão para envio de email

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    // criar nova funcao para o transporte uso o .use
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // responsavel pelo envio

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
