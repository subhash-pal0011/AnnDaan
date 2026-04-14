import connectDb from "@/db/connectDb";
import eventHandler from "@/lib/eventHandler";
import Donation from "@/model/donation";
import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
       try {
              await connectDb();

              const { otp, phone, acceptFoodId } = await req.json();


              if (!otp || !phone || !acceptFoodId) {
                     return NextResponse.json(
                            { success: false, message: "OTP, phone and foodId required" },
                            { status: 400 }
                     );
              }

              const donationFood = await Donation.findById(acceptFoodId);

              if (!donationFood) {
                     return NextResponse.json(
                            { success: false, message: "Food not exists" },
                            { status: 404 }
                     );
              }

              if (donationFood.otpVerified) {
                     return NextResponse.json(
                            { success: false, message: "Invalid OTP (already used)" },
                            { status: 400 }
                     );
              }

              // Twilio verify
              const verificationCheck = await client.verify.v2
                     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
                     .verificationChecks.create({
                            to: `+91${phone}`,
                            code: otp,
                     });

              // TWILIO MEA WRONG OTP IS TRIKE SE  CHECK KI JATI HII 
              if (verificationCheck.status !== "approved") {
                     return NextResponse.json(
                            { success: false, message: "Invalid OTP" },
                            { status: 400 }
                     );
              }

              donationFood.otpVerified = true;
              donationFood.status = "Picked";

              await donationFood.save();


              await eventHandler({
                     eventName: "donation-picked",
                     data: {
                            foodId: acceptFoodId,
                     },
              });

              return NextResponse.json({
                     success: true,
                     message: "OTP verified & food picked successfully",
                     data: donationFood,
              });

       } catch (error) {
              console.log("VERIFY OTP ERROR:", error);

              return NextResponse.json(
                     {
                            success: false,
                            message: error.message || "Something went wrong",
                     },
                     { status: 500 }
              );
       }
}