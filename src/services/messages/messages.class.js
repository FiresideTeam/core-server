const { Service } = require('feathers-sequelize');

exports.Messages = class Messages extends Service {

  //creating a new message
  create(data, params) {
    const {id, roomId} = data;
    //using a var?? what is this bullshit >:(
    var text;
    //could be done in hook, gonna do it here
    const userId = params.user.id;
    if(!param.text){
      text = " "
    }
    else{
      text = params.text;
    }

    //The complete message as given to sequelize, sequelize will add a createdAt and updatedAt property automatically.
    //Thanks sequelize :)
    const msgData = {
      //assigned by client
      id,
      text,
      roomId,
      userId
    }
    //calls creat method from "service", which i thought would use the sequilize create, actually I think does use sequelize (feathers-sequelize?) create,
    //however its unclear how or if it knows which model to use because feathers-sequelize has trash-ass docs,
    return super.create(msgData, params);
  }
  //find all messages relevant to the user created after a given timestamp (of sequelize.DataTypes.DATE type (specifically for postgres))
  //I query so that you dont have to, youre welcome. make sure params.query.last is the date of last recieved message
  find(params){
    const {rooms} = params.user;
    const {last} = params.query.last;
    let messages = [];
    rooms.forEach(function (roomId) {
     messages.push(
       //ay well it turn out querying is confusing as hell, who would've thought. This works tho i believe
       Service.find({
          query: {
            roomId : roomId,
            createdAt : {
              $gt : last
            }
          }
        })
       );
    });
  return messages}
};
