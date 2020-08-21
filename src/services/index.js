const users = require('./users/users.service.js')
const posts = require('./posts/posts.service.js');
const messages = require('./messages/messages.service.js');
const rooms = require('./rooms/rooms.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users)
  app.configure(posts);
  app.configure(messages);
  app.configure(rooms);
}
