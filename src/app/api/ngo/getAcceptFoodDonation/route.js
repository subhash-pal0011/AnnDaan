import { auth } from "@/auth";
import connectDb from "@/db/connectDb";
import Notification from "@/model/notification";
import { NextResponse } from "next/server";

export async function GET(req) {
       try {
              await connectDb();

              const session = await auth();
              const ngoUserId = session?.user?.id;

              if (!ngoUserId) {
                     return NextResponse.json(
                            { success: false, message: "NGO user not found" },
                            { status: 401 }
                     );
              }

              const activeOrder = await Notification.findOne({
                     ngoUserId,
                     ngoStatus: { $in: ["accepted", "out_for_delivery"] },
              })
                     .populate({
                            path: "foodId",
                            select:
                                   "food foodType quantity address city state pinCode location expiry time notes", 
                            populate: {
                                   path: "acceptedBy",
                                   select: "name phone location",
                            },
                     })
                     .populate({
                            path: "donationUserId",
                            select: "name phone",
                     }).lean()

              if (!activeOrder) {
                     return NextResponse.json(
                            { success: true, message: "No active order", data: null },
                            { status: 200 }
                     );
              }

              return NextResponse.json(
                     {
                            success: true,
                            message: "Active order fetched",
                            data: activeOrder,
                     },
                     { status: 200 }
              );
       } catch (error) {
              console.error("GET Active Order Error:", error);

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