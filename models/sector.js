const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const sectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true
  },
  parentSector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sector',
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sector'
    }
  ]
});

sectorSchema.plugin(uniqueValidator);


sectorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

sectorSchema.set('toObject', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Sector', sectorSchema);