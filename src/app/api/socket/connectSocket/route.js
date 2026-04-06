import connectDb from "@/db/connectDb";
import User from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await connectDb();

              const { userId, socketId } = await req.json();

              if (!userId) {
                     return NextResponse.json(
                            { success: false, message: "UserId missing" },
                            { status: 400 }
                     );
              }

              const user = await User.findByIdAndUpdate(
                     userId,
                     {
                            socketId,
                            isOnline: true,
                     },
                     { new: true }
              );

              if (!user) {
                     return NextResponse.json(
                            { success: false, message: "User not exist" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     {
                            success: true,
                            message: "User online updated",
                            data:user,
                     },
                     { status: 200 }
              );

       } catch (error) {
              console.error("Socket update error:", error);

              return NextResponse.json(
                     {
                            success: false,
                            message: "Internal Server Error",
                     },
                     { status: 500 }
              );
       }
}