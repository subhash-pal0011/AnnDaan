import { NextResponse } from "next/server";
import { auth } from "@/auth"; 
import Donation from "@/model/donation";
import connectDb from "@/db/connectDb";

export async function POST(req) {
       try {
              await connectDb()
              const session = await auth();
              if (!session) {
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

              if (!food || !foodType || !quantity || !location || !date || !time || !period || !expiry || !foodStatus || !safetyScore){
                     return NextResponse.json(
                            { success: false, message: "Somting Missing" },
                            { status: 400 }
                     );
              }

              const newDonation = await Donation.create({
                     user: session.user.id,
                     food,
                     foodType,
                     quantity,
                     location,
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

              return NextResponse.json(
                     {
                            success: true,
                            message: "Donation created successfully",
                            data: newDonation,
                     },
                     { status: 201 }
              );
       } catch (error) {
              console.log("Donation API Error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}