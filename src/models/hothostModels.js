const mongoose = require("mongoose");

const hotalOrHostalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Hotal", "Hostal"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDB",
      required: true,
      trim: true,
    },
    services: {
      foods: { type: String, required: true, trim: true },
      roomServic: { type: String, required: true, trim: true },
    },
    reviews:{ type:Number, default:0,trim:true},
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
    registerAt: { type: Date },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HotalOrHostalDB", hotalOrHostalSchema);
