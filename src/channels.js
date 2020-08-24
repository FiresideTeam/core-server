
module.exports = function (app) {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
    const time = new Date().toLocaleTimeString()
    console.log(`${time} -- ${connection.request.connection.remoteAddress} joined`)



  })

  app.on('login', (authResult, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection


      const user = connection.user
      const time = new Date().toLocaleTimeString()
      //log user and time
      console.log(`${time} -- User ${user.firstname} with id ${user.id} joined.`)
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection)

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection)
      console.log(connection.headers.cookie, 'auth joined')
      // Debugging

      // If the user has joined e.g. chat rooms
      if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room}`).join(connection));

    }
  })
  app.on('logout', (payload, { connection }) => {
    if(connection){
      //get user (tbh not sure if this will work on logout or if connection will still have the user but also might not matter
      //tbh if it doesnt just shut down the connection client side on logout and start a new one
      //disconnecting auto leaves all channels
      //get time
      const time = new Date().toLocaleTimeString()
      const {user} = connection
      //log logout
      console.log(`${time} -- User ${user.name} with id ${user.id} left`)
      //join anonymous channel
      app.channel('anonymous').join(connection)
      //leave authed channel
      app.channel('authenticated').leave(connection)
      //leave room channels
      if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room}`).leave(connection));
    }
  })
  //publish message events only to their room
  app.service('messages').publish((data, context) => {
    return app.channel(`rooms/${data.roomId}`);
  });
  // Publish the `created` event to admins and the user that sent it
  app.service('users').publish('created', (data, context) => {
    return [
      app.channel('admins'),
      app.channel(app.channels).filter(connection =>
        connection.user.id === context.params.user.id
      )
    ];
  });
  //publish specific room events to only to specific room channel
  //(shit like create and remove)
  app.service('rooms').publish((data, context) => {
    return app.channel(`rooms/${data.roomId}`);
  });

};
