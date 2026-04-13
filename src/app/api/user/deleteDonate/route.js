import connectDb from "@/db/connectDb";
import eventHandler from "@/lib/eventHandler";
import Donation from "@/model/donation";
import Notification from "@/model/notification";
import { NextResponse } from "next/server";

export async function DELETE(req) {
       try {
              await connectDb();

              const { foodId } = await req.json();

              if (!foodId) {
                     return NextResponse.json(
                            { success: false, message: "Food ID is required" },
                            { status: 400 }
                     );
              }

              const food = await Donation.findById(foodId);

              if (!food) {
                     return NextResponse.json(
                            { success: false, message: "Food not found" },
                            { status: 404 }
                     );
              }

              // NGO assigned ho gaya to delete na kro
              if (food.acceptedBy) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "Cannot delete. NGO already assigned",
                            },
                            { status: 400 }
                     );
              }

              if (food.status !== "Pending") {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "Only pending donations can be deleted",
                            },
                            { status: 400 }
                     );
              }

             //    DELETE DONATE FOOD ME SE BHIA
              await Donation.findByIdAndDelete(foodId);

              // DELETE NOTIFICATION MEA SE BHI >>  Delete all related notifications 
              await Notification.deleteMany({ foodId });

              await eventHandler({
                     eventName: "donation-deleted",
                     data: {
                            foodId,
                     },
              });

              return NextResponse.json({
                     success: true,
                     message: "🗑️ Donation & notifications deleted successfully",
              });

       } catch (error) {
              console.log("DELETE ERROR:", error);

              return NextResponse.json(
                     {
                            success: false,
                            message: error.message || "Something went wrong",
                     },
                     { status: 500 }
              );
       }
}