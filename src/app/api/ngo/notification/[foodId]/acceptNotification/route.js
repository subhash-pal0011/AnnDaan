import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/db/connectDb";
import notiifcation from "@/model/notification";
import Donation from "@/model/donation";
import eventHandler from "@/lib/eventHandler";

export async function POST(req, { params }) {
       try {
              await connectDb();

              const session = await auth();

              if (!session?.user?.id) {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }

              const { foodId } = await params;
              const ngoId = session.user.id;

              if (!foodId) {
                     return NextResponse.json(
                            { success: false, message: "NotificationId is required" },
                            { status: 400 }
                     );
              }

              const alreadyBusy = await notiifcation.findOne({
                     ngoUserId: ngoId,
                     ngoStatus: { $in: ["accepted", "out_for_delivery"] },
              });

              if (alreadyBusy) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "You already have an active delivery 🚛",
                            },
                            { status: 400 }
                     );
              }

              const notification = await notiifcation.findOneAndUpdate(
                     {
                            _id: foodId,
                            ngoStatus: "assigned",
                     },
                     {
                            ngoStatus: "accepted",
                            ngoUserId: ngoId,
                     },
              );

              await eventHandler({
                     eventName: "donation-accepted",
                     data: {
                            foodId: notification.foodId,
                            acceptedBy: {
                                   _id: session.user.id,
                                   name: session.user.name,
                                   phone: session.user.phone,
                            },
                     },
              });

              if (!notification) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "Already accepted by another NGO 😕",
                            },
                            { status: 400 }
                     );
              }

              await Donation.findByIdAndUpdate(notification.foodId, {
                     status: "Accepted",
                     acceptedBy: ngoId,
              });

              await notiifcation.deleteMany({
                     foodId: notification.foodId,
                     _id: { $ne: notification._id },
              });

              // 🔥 OPTIONAL: real-time event (recommended)
              // await eventHandler({
              //        eventName: "ngo-accepted",
              //        data: notification,
              // });

              return NextResponse.json(
                     {
                            success: true,
                            message: "Donation accepted successfully ☑️",
                            data: notification,
                     },
                     { status: 200 }
              );

       } catch (error) {
              console.error("Accept API Error:", error);

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

