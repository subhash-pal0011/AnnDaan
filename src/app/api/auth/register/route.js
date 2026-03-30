import connectDb from "@/db/connectDb";
import User from "@/model/user";
import { mailVerification } from "@/utils/mailVerification";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await connectDb();

              const { name, email, password } = await req.json();

              if (!name || !email || !password) {
                     return NextResponse.json(
                            { success: false, message: "All fields are required" },
                            { status: 400 }
                     );
              }

              const existingUser = await User.findOne({ email }).lean();
              if (existingUser) {
                     return NextResponse.json(
                            { success: false, message: "User already exists" },
                            { status: 409 }
                     );
              }

              const otp = Math.floor(1000 + Math.random() * 9000).toString();
              const otpExp = Date.now() + 5 * 60 * 1000;

              await mailVerification(email, otp)
              const hashedPassword = await bcrypt.hash(password, 10);

              const newUser = await User.create({
                     name,
                     email,
                     password: hashedPassword,
                     otp,
                     otpExp,
                     isVerified: false
              });

              const userResponse = {
                     _id: newUser._id,
                     name: newUser.name,
                     email: newUser.email,
                     isVerified: newUser.isVerified
              };

              return NextResponse.json(
                     { success: true, data: userResponse, message: "User registered successfully" },
                     { status: 201 }
              );

       } catch (error) {
              console.error("Register error:", error);
              return NextResponse.json(
                     { success: false, message: "Something went wrong" },
                     { status: 500 }
              );
       }
}



