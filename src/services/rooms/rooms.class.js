/* eslint-disable no-unused-vars */


const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

exports.Rooms = class Rooms {


  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    this.sequelizeClient = app.get('sequelizeClient');
  }


  //async find (params) {
    //return [];
  //}

  //async get (id, params) {
    //return {
      //id, text: `A new message with ID: ${id}!`
    //};
  //}

  //creates a new message room
  async create (data, params) {
    //need to use this in different scope
    const self = this;
    //get the users model (i hope anyways)
    const users = this.sequelizeClient.model.Users;
    //get roomID and user array (user array being an array of userIds, not names or objects) (include creator id)
    const {roomId, userArray} = data;
    //add new room to each users room array. I could see an issue arrising hea ebecause its technically an array of sequelize UUID objects
    //and honestly I have no idea how that translates to JS types. If that turns out to be a problem its gonna be a problem in a lot of places
    userArray.forEach(function (user) {
      users.update({'rooms': Sequelize.fn('array_append', Sequelize.col('rooms'), roomId)},
        {'where': {'id': user}}
      );
      //if the user is in the authenticated channel (meaning connected and logged in) add them to the new room
      //"a nested for loop? that seems kinda clunky!" i hear you exclaim. i agree.
      self.app.channel('authenticated').connections.forEach(function (connection){
        if(connection.user.id === user){
          //why isn't the ${roomId} changing color to indicate variable interpolation like it usually does? idk bro but im p sure its working
          //also maybe i should make a custom service for joining and leaving channels, seems like it would be good practice, prolly wont tho
         self.app.channel('rooms/${roomId}').join(connection);
        }
      })
    });

    return data;
  }


  //this function may seem like its for removing a room altogether. however that would make to much sense.
  //rather this is for removing and individual from a room. I am not going to make it possible to remove rooms all together
  //id is room id, user id is params.user
  async remove (id, params) {
    //need to use this in different scope
    const self = this;
    const roomId = id;
    //prolly get user model maybe (why is it caps???)
    const users = this.sequelizeClient.model.Users;
    //get user to be removed
    const {user} = params;
    //remove roomId from users "rooms" array (ide says i need an await here but i dont think i do)
    users.update({'rooms': Sequelize.fn('array_remove', Sequelize.col('rooms'), roomId)},
      {'where': {'id': user}});
    //if user is connected to the rooms/roomId channel remove them
    self.app.channel('rooms/${roomId}').connections.forEach(function (connection){
      if(connection.user.id === user){
        self.app.channel('room/${roomId}').leave(connection);
      }
    });

    return { id };
  }

  //yo fuck what the docs say these functions are supposed to do.
  //this one adds users to a room
  //suck my dick CRUD.
  //side note, i realize i could create an external function for adding a user to a room and
  //then i wouldnt have duplicate code in create and update, however im not gonna do that.
  //id is room id params.user is user id to add

  async update (id, data, params){
    //need to use this in different scope
    const self = this;
    const roomId = id;
    //idk about this one i hope its getting the users model
    const users = this.sequelizeClient.model.Users;
    //get user to be added
    const {user} = params;
    //add roomid to users "rooms" list
    users.update({'rooms': Sequelize.fn('array_append', Sequelize.col('rooms'), roomId)},
      {'where': {'id': user}}
    );
    //if user to be added is authed add them to  the channel
    this.app.channel('authentication').connections.forEach( function (connection) {
      if(connection.user.id === user){
        self.app.channel('rooms/${roomsId}').join(connection);
      }
    })
  }
};
