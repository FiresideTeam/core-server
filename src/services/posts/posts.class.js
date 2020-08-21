const { Service } = require('feathers-sequelize');

exports.Posts = class Posts extends Service {
  create(data, params) {
    //This is the data needed from client upon post creation
    const {id, first_name, last_name, username, email, password, rooms} = data;
    //the complete user as will be stored in the database
    const userData = {
      //assigned in uuid hook
      id,
      first_name,
      last_name,
      username,
      email,
      password,
      rooms
    }
    //calls creat method from "service", which i though would use the sequilize create, actually I think does use sequelize create,
    //however its unclear how or if it knows which model to use because feathers-sequelize has trash-ass docs,
    return super.create(userData, params);
  }
};
