import Sequelize from 'sequelize';
import mongoose from 'mongoose';
// importa o model

import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';

// importa a configuração de database para fazer a conexão com o banco de Dados

import databaseConfig from '../config/database';

// Array de models para que eu possa percorrer e acessar os models e seu metodos para fazer a ligação com o banco

const models = [User, File, Appointments];

// Criar Classe com as configuraçoes do DB

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    // instancio uma nova conexão
    // passando o parametro que chamei no MODELS dentro do init= sequelize
    this.connection = new Sequelize(databaseConfig);
    // percorro o array de models procurando o parametro init dentro do Model e passo como parametro o this.connection
    // que foi instanciado anteriormente
    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/gobarber', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
