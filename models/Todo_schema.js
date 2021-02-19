const {Schema, model} = require('mongoose')

const schema = new Schema({
  
    title: {type: String}
})

module.exports = model('Todo_schema', schema)