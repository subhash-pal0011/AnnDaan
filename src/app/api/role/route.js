import { NextResponse } from "next/server";
import User from "@/model/user";
import connectDb from "@/db/connectDb";
import { auth } from "@/auth";

export async function POST(req) {
       try {
              await connectDb();

              const session = await auth();
              // console.log("SESSION:", session);

              if (!session || !session.user?.email) {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }

              const body = await req.json();
              const { phone, role } = body;

              if (!phone || !role) {
                     return NextResponse.json(
                            { success: false, message: "Phone and role are required" },
                            { status: 400 }
                     );
              }

              const user = await User.findOne({ email: session.user.email });

              if (!user) {
                     return NextResponse.json(
                            { success: false, message: "User not found" },
                            { status: 404 }
                     );
              }

              user.phone = phone;
              user.role = role;
              await user.save();
              return NextResponse.json({
                     success: true,
                     message: "Profile updated successfully 🎉",
              });

       } catch (error) {
              console.log("EDIT PROFILE ERROR:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}