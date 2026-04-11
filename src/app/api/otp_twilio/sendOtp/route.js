import twilio from "twilio";
import { NextResponse } from "next/server";

const client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
       try {
              const { phone } = await req.json();

              if (!phone) {
                     return NextResponse.json(
                            { success: false, message: "Phone is required" },
                            { status: 400 }
                     );
              }

              await client.verify.v2
                     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
                     .verifications.create({
                            to: `+91${phone}`, 
                            channel: "sms",
                     });

              return NextResponse.json({
                     success: true,
                     message: "OTP sent successfully",
              });
       }
       catch (error) {
              return NextResponse.json(
                     {
                            success: false,
                            message: error.message,
                     },
                     { status: 500 }
              );
       }
}

