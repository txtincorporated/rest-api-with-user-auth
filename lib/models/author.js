const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  centuries: [{
    type: String,
    required: true,
    default: ''
  }],
  altnames: [{
    type: String,
    default: ''
  }], 
  books: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  }]

});

module.exports = mongoose.model('Author', schema);