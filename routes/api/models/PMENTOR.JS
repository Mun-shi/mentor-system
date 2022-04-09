const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
},
name: {
    type: String,
    required: true
  },
  mentees: {
    type: [String]
    },
  id: {
    type: String,
    required: true
  },
  mobno: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true
  },
  noOfStudent: {
      type: String,
      required:true
  }
});
  module.exports = pmentor = mongoose.model('pmentor',ProfileSchema);
