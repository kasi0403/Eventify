const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
    name: { type: String, default: "admin" },
    password: { type: String, default: "admin" },
    commission: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Event reference
        amount: { type: Number, required: true }, // Commission amount for the event
      }
    ],
  });

  adminSchema.statics.getAdmin = async function () {
    const admin = await this.findOne();
    if (!admin) {
      return this.create({ commission: [] });
    }
    return admin;
  };

  module.exports = mongoose.model("Admin", adminSchema);