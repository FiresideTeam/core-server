const { Service } = require('feathers-sequelize')

exports.Users = class Users extends Service {
  //creating a new user
  create(data, params) {
    //This is the data needed from client upon account creation
    const {id, first_name, last_name, username, email, password, rooms} = data;
    //The complete user as given to sequelize, sequelize will add a createdAt and updatedAt property automatically.
    //Thanks sequelize :)
    const userData = {
      //assigned in uuid hook
      id,
      first_name,
      last_name,
      username,
      email,
      password,
      //array of UUIDV4 representing room ids, room ids should be generated in the client that initiates the chat and then will be added to the arrays of the other ccounts
      rooms
    }
    //calls create method from "service", which i thought would use the sequelize create, actually I think does use sequelize (feathers-sequelize?) create,
    //however its unclear how or if it knows which model to use because feathers-sequelize has trash-ass docs,
    return super.create(userData, params);
  }
};
