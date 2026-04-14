import connectDb from "@/db/connectDb";
import Donation from "@/model/donation";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
       try {
              await connectDb();

              const { orderId } = await params;

              if (!orderId) {
                     return NextResponse.json(
                            { success: false, message: "orderId not exists" },
                            { status: 400 }
                     );
              }

              const order = await Donation.findById(orderId).populate("acceptedBy");

              if (!order) {
                     return NextResponse.json(
                            { success: false, message: "Order not found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     { success: true, data:order },
                     { status: 200 }
              );

       } catch (error) {
              console.error("GET Order Error:", error);

              return NextResponse.json(
                     { success: false, message: "Server Error" },
                     { status: 500 }
              );
       }
}