const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Number, required: true }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  venue: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  tickets: { type: [TicketSchema], required: true },
  organization: { type: String, required: true },
  tags: { type: [String], required: true },
  attendance: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  commissionPaid: { type: Boolean, default: false }, // Boolean to track commission payment
  featured: { 
    type: Boolean, 
    default: function () { return this.commissionPaid; } // Auto-set based on commissionPaid
  },
  createdAt: { type: Date, default: Date.now }
});

// Admin Schema to track total earnings and commission payments
const AdminSchema = new mongoose.Schema({
  name: { type: String, default: "admin" },
  password: { type: String, default: "admin" },
  totalEarnings: { type: Number, default: 0 }, // Total admin earnings
  commissions: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Event reference
      organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Organizer reference
      date: { type: Date, default: Date.now } // Timestamp of commission transaction
    }
  ]
});

// Static method to get or create the admin record
AdminSchema.statics.getAdmin = async function () {
  let admin = await this.findOne();
  if (!admin) {
    admin = await this.create({ commissions: [] });
  }
  return admin;
};

const Event = mongoose.model("Event", EventSchema);
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = {Event,Admin};
