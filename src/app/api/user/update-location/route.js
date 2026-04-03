import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/model/user";
import { auth } from "@/auth";

export async function POST(req) {
       try {
              await connectDb();

              const session = await auth();

              if (!session?.user?.id) {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }

              const body = await req.json();
              const { location } = body;

              if (!location || location.type !== "Point" || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
                     return NextResponse.json(
                            { success: false, message: "Invalid location format" },
                            { status: 400 }
                     );
              }

              const [lng, lat] = location.coordinates;

              if (typeof lng !== "number" || typeof lat !== "number") {
                     return NextResponse.json(
                            { success: false, message: "Invalid coordinates" },
                            { status: 400 }
                     );
              }

              const updatedUser = await User.findByIdAndUpdate(session.user.id,
                     {
                            location: {
                                   type: "Point",
                                   coordinates: [lng, lat],
                            },
                     },
                     { new: true }
              );

              if (!updatedUser) {
                     return NextResponse.json(
                            { success: false, message: "User not found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json({
                     success: true,
                     message: "Location updated successfully",
                     data: updatedUser.location,
              });

       } catch (error) {
              console.error("Update Location Error:", error);

              return NextResponse.json(
                     { success: false, message: "Something went wrong" },
                     { status: 500 }
              );
       }
}