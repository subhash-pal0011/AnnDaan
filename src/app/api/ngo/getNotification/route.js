import { auth } from "@/auth";
import connectDb from "@/db/connectDb";
import User from "@/model/user";
import Notification from "@/model/notification";
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
              if (!user) {
                     return NextResponse.json(
                            { success: false, message: "User does not exist" },
                            { status: 404 }
                     );
              }

              if (user.role !== "ngo") {
                     return NextResponse.json(
                            { success: false, message: "Not an NGO" },
                            { status: 403 }
                     );
              }

      
              const notifications = await Notification.find({ ngoUserId: user._id })
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