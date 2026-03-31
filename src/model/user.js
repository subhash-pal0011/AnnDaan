import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
       {
              name: {
                     type: String,
                     required: true,
                     trim: true,
              },

              email: {
                     type: String,
                     required: true,
                     unique: true,
                     trim: true,
              },

              password: {
                     type: String,
                     required: function () {
                            return this.provider === "credentials";
                     },
              },

              provider: {
                     type: String,
                     enum: ["credentials", "google"],
                     default: "credentials",
              },

              isVerified: {
                     type: Boolean,
                     default: false,
              },

              image: {
                     type: String,
              },

              phone: {
                     type: String,
                     trim: true,
              },

              phoneVerified: {
                     type: Boolean,
                     default: false,
              },

              otp: {
                     type: String,
                     default: null,
              },

              otpExp: {
                     type: Date,
                     default: null,
              },

              role: {
                     type: String,
                     enum: ["organizer", "ngo", "restaurant"],
                     default: "organizer"
              },

              location: {
                     type: {
                            type: String,
                            enum: ["Point"],
                            default: "Point",
                     },
                     coordinates: {
                            type: [Number], // [longitude, latitude]
                            default: [0, 0],
                     },
              },

              lastLogin: {
                     type: Date,
              },
       },
       { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User
