import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Donation from "@/model/donation";
import User from "@/model/user";
import connectDb from "@/db/connectDb";
import Notification from "@/model/notification";

export async function POST(req) {
       try {
              await connectDb();

              const session = await auth();
              if (!session?.user) {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }

              const body = await req.json();
              const {
                     food,
                     foodType,
                     quantity,
                     location,
                     address,
                     city,
                     state,
                     pinCode,
                     date,
                     time,
                     period,
                     storedInFridge,
                     expiry,
                     foodStatus,
                     color,
                     safetyScore,
                     notes,
              } = body;

              if (
                     !food ||
                     !foodType ||
                     !quantity ||
                     !location ||
                     !location.coordinates ||
                     !address ||
                     !date ||
                     !time ||
                     !period ||
                     !expiry ||
                     !foodStatus
              ) {
                     return NextResponse.json(
                            { success: false, message: "Something is missing" },
                            { status: 400 }
                     );
              }

              const newDonation = await Donation.create({
                     user: session.user.id,
                     food,
                     foodType,
                     quantity,
                     location,
                     address,
                     city,
                     state,
                     pinCode,
                     date,
                     time,
                     period,
                     storedInFridge,
                     expiry,
                     foodStatus,
                     color,
                     safetyScore,
                     notes,
              });

              //  Find nearby NGOs within 5km
              const [foodLng, foodLat] = location.coordinates;
              const nearbyNgos = await User.find({
                     role: "ngo",
                     location: {
                            $near: {
                                   $geometry: { type: "Point", coordinates: [foodLng, foodLat] },
                                   $maxDistance: 5000,
                            },
                     },
              });


              const notifications = [];
              for (const ngo of nearbyNgos) {
                     notifications.push({
                            foodId: newDonation._id,           // Link to donation
                            donationUserId: session.user.id,   // Donor
                            ngoUserId: ngo._id,                // NGO
                            ngoStatus: "assigned",
                            isNotified: true,
                     });
              }

              if (notifications.length > 0) {
                     await Notification.insertMany(notifications);
              }

              return NextResponse.json(
                     {
                            success: true,
                            message: "Donation created & NGOs notified 🚀",
                            data: newDonation,
                     },
                     { status: 201 }
              );
       } catch (error) {
              console.log("Donation API Error:", error);
              return NextResponse.json(
                     { success: false, message: error.message },
                     { status: 500 }
              );
       }
}