// db.js
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://vekkulurivinay9390:el1o1X86NfpiVBd8@users-media.y06cbv5.mongodb.net/?retryWrites=true&w=majority&appName=users-media"
  )
  .then(() => console.log("Connected successfully to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
