import connectDb from "@/db/connectDb";
import User from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await connectDb();

              const { userId, location } = await req.json();

              if (!userId || !location) {
                     return NextResponse.json(
                            { success: false, message: "userId or location missing" },
                            { status: 400 }
                     );
              }

              const user = await User.findByIdAndUpdate(userId,{ location },{ new: true });
              
              if (!user) {
                     return NextResponse.json(
                            { success: false, message: "User not found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     {
                            success: true,
                            message: "Location updated successfully",
                            data:user,
                     },
                     { status: 200 }
              );

       } catch (error) {
              console.error("Error in update location:", error);

              return NextResponse.json(
                     {
                            success: false,
                            message: "Internal server error",
                     },
                     { status: 500 }
              );
       }
}