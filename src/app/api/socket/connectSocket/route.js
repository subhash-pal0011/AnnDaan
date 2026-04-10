import connectDb from "@/db/connectDb";
import User from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(req) {
       await connectDb();

       const { userId, socketId } = await req.json();

       await User.findByIdAndUpdate(userId, {
              socketId,
              isOnline: true,
              lastSeen: new Date(),
       });

       return NextResponse.json({ success: true });
}
