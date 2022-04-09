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
  regNo: {
    type: String,
    required: true
    },
  rollNo: {
    type: String,
    required: true
  },
  semester: {
      type: String,
      required: true
  },

});
  module.exports = pstud = mongoose.model('pstud',ProfileSchema);
