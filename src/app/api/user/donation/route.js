import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Donation from "@/model/donation";
import User from "@/model/user";
import connectDb from "@/db/connectDb";
import Notification from "@/model/notification";
import eventHandler from "@/lib/eventHandler";

export async function POST(req) {
       try {
              await connectDb();

              const session = await auth();
              if (!session?.user?.id) {
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
                     location.type !== "Point" ||
                     !Array.isArray(location.coordinates) ||
                     location.coordinates.length !== 2 ||
                     !address ||
                     !date ||
                     !time ||
                     !period ||
                     !expiry ||
                     !foodStatus
              ) {
                     return NextResponse.json(
                            { success: false, message: "Invalid or missing fields" },
                            { status: 400 }
                     );
              }

              const [lng, lat] = location.coordinates;

              if (typeof lng !== "number" || typeof lat !== "number") {
                     return NextResponse.json(
                            { success: false, message: "Invalid coordinates" },
                            { status: 400 }
                     );
              }


              const newDonation = await Donation.create({
                     user: session.user.id,
                     food,
                     foodType,
                     quantity,
                     location: {
                            type: "Point",
                            coordinates: [lng, lat],
                     },
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


              let nearbyNgos = [];
              const radiusList = [5000, 10000, 20000];

              for (let radius of radiusList) {
                     const ngos = await User.find({
                            role: "ngo",
                            isOnline: true,
                            location: {
                                   $near: {
                                          $geometry: {
                                                 type: "Point",
                                                 coordinates: [lng, lat],
                                          },
                                          $maxDistance: radius,
                                   },
                            },
                     }).select("_id");

                     if (ngos.length > 0) {
                            nearbyNgos = ngos;
                            break;
                     }
              }

              if (nearbyNgos.length === 0) {
                     return NextResponse.json(
                            {
                                   success: true,
                                   message: "Donation saved. No NGOs nearby",
                                   data: newDonation,
                                   notifiedNgos: 0,
                            },
                            { status: 201 }
                     );
              }


              const busyNgos = await Notification.distinct("ngoUserId", {
                     ngoStatus: { $in: ["accepted", "out_for_delivery"] },
              });


              const busySet = new Set(busyNgos.map((id) => id.toString()));

              const availableNgos = nearbyNgos.filter(
                     (ngo) => !busySet.has(ngo._id.toString())
              );

              if (availableNgos.length === 0) {
                     return NextResponse.json(
                            {
                                   success: true,
                                   message: "All NGOs busy 😕",
                                   data: newDonation,
                                   totalNearby: nearbyNgos.length,
                                   busyNgos: busyNgos.length,
                                   notifiedNgos: 0,
                            },
                            { status: 201 }
                     );
              }


              const notifications = availableNgos.map((ngo) => ({
                     foodId: newDonation._id,
                     donationUserId: session.user.id,
                     ngoUserId: ngo._id,
                     ngoStatus: "assigned",
                     isNotified: false,
              }));

              const createdNotifications = await Notification.insertMany(notifications);

              for (let notif of createdNotifications) {

                     const isBusy = await Notification.findOne({
                            ngoUserId: notif.ngoUserId,
                            ngoStatus: { $in: ["accepted", "out_for_delivery"] },
                     });

                     if (isBusy) continue;

                     await eventHandler({
                            eventName: "new-food",
                            room: notif.ngoUserId.toString(),
                            data: {
                                   _id: notif._id,
                                   foodId: newDonation,
                                   donationUserId: {
                                          _id: session.user.id,
                                          name: session.user.name,
                                          phone: session.user.phone,
                                   },
                                   ngoUserId: notif.ngoUserId,
                                   ngoStatus: notif.ngoStatus,
                                   createdAt: notif.createdAt,
                            },
                     });
              }

              return NextResponse.json(
                     {
                            success: true,
                            message: "Donation created & notified available NGOs ✅",
                            data: newDonation,
                            totalNearby: nearbyNgos.length,
                            busyNgos: busyNgos.length,
                            notifiedNgos: notifications.length,
                     },
                     { status: 201 }
              );
       } catch (error) {
              console.error("Donation API Error:", error);
              return NextResponse.json(
                     {
                            success: false,
                            message: "Internal Server Error",
                            error: error.message,
                     },
                     { status: 500 }
              );
       }
}

