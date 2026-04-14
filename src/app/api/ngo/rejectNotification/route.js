import connectDb from "@/db/connectDb";
import Notification from "@/model/notification";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await connectDb();

              const { notificationId } = await req.json();

              if (!notificationId) {
                     return NextResponse.json(
                            { success: false, message: "Notification ID is required" },
                            { status: 400 }
                     );
              }

              const notification = await Notification.findById(notificationId);

              if (!notification) {
                     return NextResponse.json(
                            { success: false, message: "Notification not found" },
                            { status: 404 }
                     );
              }

              // ✅ Sirf us NGO ka notification delete hoga
              await Notification.findByIdAndDelete(notificationId);

              return NextResponse.json({
                     success: true,
                     message: "Request rejected successfully",
              });

       } catch (error) {
              console.log("Reject ERROR:", error);

              return NextResponse.json(
                     {
                            success: false,
                            message: error.message || "Something went wrong",
                     },
                     { status: 500 }
              );
       }
}