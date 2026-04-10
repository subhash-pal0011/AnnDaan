import { auth } from "@/auth";
import connectDb from "@/db/connectDb";
import Notification from "@/model/notification";
import User from "@/model/user";
import { NextResponse } from "next/server";


export async function GET() {
       try {
              await connectDb();

              const session = await auth();
              if (!session?.user) {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }

              const user = await User.findOne({ email: session.user.email });

              if (!user || user.role !== "ngo") {
                     return NextResponse.json(
                            { success: false, message: "Not an NGO" },
                            { status: 403 }
                     );
              }

              const activeOrder = await Notification.findOne({
                     ngoUserId: user._id,
                     ngoStatus: { $in: ["accepted", "out_for_delivery"] },
              })
                     .populate("foodId")
                     .populate("donationUserId");

              if (activeOrder) {
                     return NextResponse.json(
                            { success: true, data: [activeOrder] },
                            { status: 200 }
                     );
              }

              const notifications = await Notification.find({
                     ngoUserId: user._id,
                     ngoStatus: "assigned",
              })
                     .sort({ createdAt: -1 })
                     .populate("foodId")
                     .populate("donationUserId");

              return NextResponse.json(
                     { success: true, data: notifications },
                     { status: 200 }
              );
       } catch (error) {
              console.log("Get Notifications Error:", error);
              return NextResponse.json(
                     { success: false, message: error.message },
                     { status: 500 }
              );
       }
}