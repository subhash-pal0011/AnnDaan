import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
       foodId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Donation",
       },

       donationUserId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
       },

       ngoUserId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
       },

       ngoStatus: {
              type: String,
              enum: ["assigned" , "accepted" ,"out_for_delivery" ,"delivered"],
              default: "assigned",
       },

       isNotified: {
              type: Boolean,
              default: true,
       },

}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
