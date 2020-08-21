// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const messages = sequelizeClient.define('messages', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    text: {
      //1000 character limit, subject to change I just need to read up on the text datatype
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: " "
    },
    //dont be fooled, unlike all other ids, this doesnt reference a primary key in a table.
    //I'm way too stupid to learn and implement many to many associations in this short a time,
    //so I said fuck it and put roomIds as an array in each user. kinda jank, might fix
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false
    },
    //id of sender
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  messages.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const {users} = models;
    messages.belongsTo(users);
  };

  return messages;
};
