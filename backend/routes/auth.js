const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Attendee = require("../schemas/atendees");
const Organizer = require("../schemas/organizer");
const Admin = require("../schemas/admin");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { role, name, email, password, phone, organization } = req.body;
    
    let newUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "Attendee") {
      const existingAttendee = await Attendee.findOne({ email });
      if (existingAttendee) {
        return res.status(400).json({ message: "Email already in use" });
      }
      newUser = new Attendee({
        name,
        email,
        password: hashedPassword,
        phone,
        groups: [],
        bookedTickets: [],
      });
    } 
    else if (role === "Event Organizer") {
      const existingOrganizer = await Organizer.findOne({ email });
      if (existingOrganizer) {
        return res.status(400).json({ message: "Organizer email already in use" });
      }
      newUser = new Organizer({
        name,
        email,  // Ensure organizers have email
        password: hashedPassword,
        organization,
        events: [],
      });
    } 
    else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", role });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { role, username, password } = req.body;

  try {
    let user;
    if (role === "Attendee") {
      user = await Attendee.findOne({ name: username });
    } 
    else if (role === "Event Organizer") {
      user = await Organizer.findOne({ name: username });
    } 
    else if (role === "Admin") {
      user = await Admin.findOne({ name: "admin" }); // Single admin account
    }

    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    // Validate password securely
    const isMatch = role === "Admin" 
      ? password === user.password 
      : await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, "yourSecretKey", { expiresIn: "1h" });

    res.status(200).json({ success: true, token, role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
