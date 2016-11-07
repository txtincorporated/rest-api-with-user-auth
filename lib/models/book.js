const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String,
    required: true
  }, 
  author: {
    type: String,
    required: true
  },
  authId: {
    type: Schema.Types.ObjectId,
    // type: String,
    required: true,
    ref: 'Author'
  },
  genres: [{
    type: String,
    default: 'literature'
  }]
});

module.exports = mongoose.model('Book', schema);
