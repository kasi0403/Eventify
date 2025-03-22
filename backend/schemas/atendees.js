const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }], // References Group schema

  bookedTickets: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Event reference
      tickets: [
        {
          ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true }, // Ticket reference
          category: { type: String, required: true }, // e.g., VIP, Gold, Silver
          qrCode: { type: String, required: true }, // Stores the QR image URL or base64 data
          checked: { type: Boolean, default: false }, // Indicates if the ticket has been scanned
        }
      ]
    }
  ],
});

module.exports = mongoose.model("Attendee", attendeeSchema);
