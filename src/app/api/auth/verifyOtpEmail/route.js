import connectDb from "@/db/connectDb";
import User from "@/model/user";
import { NextResponse } from "next/server";


export async function POST(req) {
       try {
              await connectDb()

              const { email, otp } = await req.json();

              if (!email || !otp) {
                     return NextResponse.json(
                            { success: false, message: "Email & OTP required" },
                            { status: 400 }
                     );
              }

              const user = await User.findOne({ email });

              if (!user) {
                     return NextResponse.json(
                            { success: false, message: "User not found" },
                            { status: 404 }
                     );
              }

              if (user.isVerified) {
                     return NextResponse.json({
                            success: false,
                            message: "User already verified",
                     });
              }

              if (user.otp !== otp) {
                     return NextResponse.json(
                            { success: false, message: "Invalid OTP" },
                            { status: 400 }
                     );
              }

              if (user.otpExp < new Date()) {
                     return NextResponse.json(
                            { success: false, message: "OTP expired" },
                            { status: 400 }
                     );
              }


              user.otp = null;
              user.otpExp = null;
              user.isVerified = true;

              await user.save();

              return NextResponse.json({
                     success: true,
                     message: "OTP verified successfully 🎉",
              });

       } catch (error) {
              console.error("OTP VERIFY ERROR:", error);

              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}
