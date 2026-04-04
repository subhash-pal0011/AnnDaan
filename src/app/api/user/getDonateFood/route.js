import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Donation from "@/model/donation";
import { auth } from "@/auth";

export async function GET() {
       try {
              await connectDb();

              const session = await auth();
              if (!session?.user) {
                     return NextResponse.json(
                            { success: false, message: "Not authenticated" },
                            { status: 401 }
                     );
              }

              const userId = session.user.id;

              const donations = await Donation.find({ user: userId }).populate("user")
                     .sort({ createdAt: -1 });

              return NextResponse.json({
                     success: true,
                     count: donations.length,
                     data: donations,
              });

       } catch (error) {
              console.log("GET Donations Error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}