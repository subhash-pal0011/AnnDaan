import connectDb from "@/db/connectDb";
import Donation from "@/model/donation";
import Notification from "@/model/notification";
import { NextResponse } from "next/server";
import eventHandler from "@/lib/eventHandler";

export async function POST(req) {
       try {
              await connectDb();

              const { foodId } = await req.json();

              const donation = await Donation.findById(foodId);

              if (!donation) {
                     return NextResponse.json(
                            { success: false, message: "Donation not found" },
                            { status: 404 }
                     );
              }

              if (donation.status === "Delivered") {
                     return NextResponse.json(
                            { success: false, message: "Already delivered" },
                            { status: 400 }
                     );
              }

              if (!donation.otpVerified) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "Please verify OTP (pick food) before delivery",
                            },
                            { status: 400 }
                     );
              }

              donation.status = "Delivered";
              await donation.save();

              await Notification.deleteMany({ foodId });

              await eventHandler({
                     eventName: "donation-delivered",
                     data: {
                            foodId,
                            status: "Delivered",
                     },
              });

              return NextResponse.json({
                     success: true,
                     message: "Food delivered successfully",
              });

       } catch (error) {
              console.log("DELIVER ERROR:", error);

              return NextResponse.json(
                     { success: false, message: error.message },
                     { status: 500 }
              );
       }
}