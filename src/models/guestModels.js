const mongoose = require("mongoose");

const guest = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    phone: { type: String, unique: true, required: true, trim: true },
    password: { type: String, unique: true, required: true, trim: true },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps }
);

module.exports = mongoose.model("guestDB", guest);
