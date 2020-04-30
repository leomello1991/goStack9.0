module.exports = {
  up: (queryInterface, Sequelize) => {
    // criar uma coluna em uma tabela existente
    return queryInterface.addColumn(
      // tabela que vai ser criado a coluna
      'users',
      // coluna que esta criando
      'avatar_id',
      // campos da coluna que ta criando
      {
        // tipo do campo
        type: Sequelize.INTEGER,
        // onde essa coluna referencica em outra tabela (CHAVE ESTRANGEIRA)
        // neste caso referencia a tabela files o campo id com avatar_id ou seja o mesmo numero que tiver em
        // id da tabela (files) é o do campo avatar_id da tabela (users)
        references: { model: 'files', key: 'id' },
        // o que vai acontecer se fizer update do avatar
        onUpdate: 'CASCADE', // atualizara o avatar_id
        // o que vai acontecer se deletar o avatar
        onDelete: 'SET NULL', // colocara o campo como num
        allowNull: true, // inicia sempre como (null sem avatar)
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
