//adds new uuidv4 to context.data as context.data.id if context.data.id doesnt exist
const { v4: uuidv4} = require('uuid');

module.exports = (options = {}) => {
  return async context => {
    if(!context.data.id)
    context.data.id = uuidv4();
    return context;
  };
};
