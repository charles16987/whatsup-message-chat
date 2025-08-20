const express = require("express");
const cors = require("cors");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
app.use(cors());              // allow cross-origin requests
app.use(express.json());      // built-in body parser

// Initialize WhatsApp client
const client = new Client();

client.on("qr", qr => {
  console.log("📲 Scan this QR code in your WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp client is ready!");
});

client.initialize();

// API endpoint to send WhatsApp message
app.post("/send-enquiry", async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      category,
      fuelType,
      brand,
      model,
      location,
      notes,
      serviceType
    } = req.body;

    // Send to your number (India format)
    const targetNumber = "917598825487@c.us";   // 91 + number + @c.us

// Get current date & time
const now = new Date();
const formattedDate = now.toLocaleDateString("en-IN"); // DD/MM/YYYY
const formattedTime = now.toLocaleTimeString("en-IN"); // HH:MM:SS AM/PM

const message = `🔋 *New Battery Enquiry* 🔋

📅 Date: ${formattedDate}
⏰ Time: ${formattedTime}

👤 Name: ${fullName}
📞 Mobile: ${mobileNumber}
📂 Category: ${category}
⛽ Fuel Type: ${fuelType || "N/A"}
🏷️ Brand: ${brand}
🚘 Model: ${model}
📍 Location: ${location}
🛠️ Service Type: ${serviceType}
📝 Notes: ${notes || "None"}
`;

    await client.sendMessage(targetNumber, message);

    res.json({ success: true, message: "Enquiry sent to WhatsApp ✅" });
  } catch (error) {
    console.error("❌ Error sending enquiry:", error);
    res.status(500).json({ success: false, error: "Failed to send enquiry" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
