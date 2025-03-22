const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] // References event IDs
});

module.exports = mongoose.model('Organizer', OrganizerSchema);