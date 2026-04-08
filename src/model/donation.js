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

              // GEO LOCATION (for distance search a NGO)
              location: {
                     type: {
                            type: String,
                            enum: ["Point"],
                            required: true,
                     },
                     coordinates: {
                            type: [Number],
                            required: true,
                     },
              },

              //  ISSE  JO DONATE FOOD USER RHEGA JB O APNA DONATE FOOD DEKHEGA TO USE YE ADDRESS KA USE HOGA .
              address: {
                     type: String,
                     required: true,
              },

              city: {
                     type: String,
                     trim: true,
                     index: true, // ISSE FAST SURCHING KE LIYE USE
              },

              state: {
                     type: String,
                     trim: true,
              },

              pinCode: {
                     type: String,
                     trim: true,
                     index: true,
              },

              date: {
                     type: Date,
                     required: true,
                     index: true,
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
                     enum: ["Pending", "Accepted", "Picked"],
                     default: "Pending",
                     index: true,
              },

              // isse  GET DONATION FOOD MEA JO NGO VALE NE ACCEPT KIYA HII USE NGO KA DETAIL SE DIKHEGA.
              acceptedBy: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     default: null,
              },


              foodStatus: {
                     type: String,
                     enum: ["Safe", "Unsafe", "Donate Immediately"],
                     default: null,
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

DonationSchema.index({ location: "2dsphere" });

const Donation = mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
export default Donation;