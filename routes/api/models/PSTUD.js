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
    type: Number,
    required: true
    },
  rollNo: {
    type: Number,
    required: true
  },
  semester: {
      type: Number,
      required: true
  },

});
  module.exports = pstud = mongoose.model('pstud',ProfileSchema);
