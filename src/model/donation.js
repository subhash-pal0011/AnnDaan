import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
       {
              user: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },

              food: {
                     type: String,
                     required: true,
                     trim: true,
              },

              foodType: {
                     type: String,
                     enum: ["veg", "non-veg"],
                     required: true,
              },

              quantity: {
                     type: String,
                     required: true,
              },

              location: {
                     type: String,
                     required: true,
              },

              city: {
                     type: String,
                     trim: true,
              },

              state: {
                     type: String,
                     trim: true,
              },

              pinCode: {
                     type: String,
                     trim: true,
              },

              date: {
                     type: Date,
                     required: true,
              },

              time: {
                     type: String,
                     required: true,
              },

              period: {
                     type: String,
                     enum: ["AM", "PM"],
                     required: true,
              },

              storedInFridge: {
                     type: Boolean,
                     default: false,
              },

              expiry: {
                     type: String,
              },

              status: {
                     type: String,
                     enum: ["Pending", "Accepted", "Picked", "Rejected"],
                     default: "Pending",
              },

              color: {
                     type: String,
              },

              safetyScore: {
                     type: Number,
                     min: 0,
                     max: 100,
                     default: 0,
              },

              notes: {
                     type: String,
                     trim: true,
              },
       },
       { timestamps: true }
);

const Donation = mongoose.models.Donation || mongoose.model("Donation", DonationSchema);

export default Donation;