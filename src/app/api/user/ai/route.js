import { NextResponse } from "next/server";
import OpenAI from "openai";

const openrouter = new OpenAI({
       apiKey: process.env.OPENAI_API_KEY,
       baseURL: "https://openrouter.ai/api/v1",
});


function convertTo24Hour(time, period) {
       let [hours, minutes] = time.split(":").map(Number);
       if (period === "PM" && hours !== 12) hours += 12;
       if (period === "AM" && hours === 12) hours = 0;
       return {hours, minutes};
}


function getSafeLimit(foodType, storedInFridge, food) {
       const lowerFood = food.toLowerCase();

       if (lowerFood.includes("rice") || lowerFood.includes("chawal")) {
              return storedInFridge ? 18 : 6;
       }

       if (storedInFridge) {
              return foodType === "non-veg" ? 18 : 24;
       } else {
              return foodType === "non-veg" ? 4 : 6;
       }
}


function getSafetyStatus(hoursPassed, safeLimit) {
       if (hoursPassed > safeLimit) {
              return { status: "Unsafe", color: "red" };
       } else if (hoursPassed > safeLimit - 2) {
              return { status: "Donate Immediately", color: "yellow" };
       } else {
              return { status: "Safe", color: "green" };
       }
}

export async function POST(req) {
       try {
              const {food,date, period,time,foodType,storedInFridge = false} = await req.json();

              if (!food || !date || !time || !foodType || !period) {
                     return NextResponse.json({ error: "Missing fields" }, { status: 400 });
              }

              const { hours, minutes } = convertTo24Hour(time, period);
              const [year, month, day] = date.split("-");

              const cookedDateTime = new Date(year, month - 1, day, hours, minutes);
              const currentDate = new Date();

              if (cookedDateTime > currentDate) {
                     return NextResponse.json({ error: "Future time not allowed" });
              }

              const hoursPassed = (currentDate - cookedDateTime) / (1000 * 60 * 60);
                     

              const safeLimit = getSafeLimit(foodType, storedInFridge, food);

              const expiryDate = new Date(
                     cookedDateTime.getTime() + safeLimit * 60 * 60 * 1000
              );

              const safety = getSafetyStatus(hoursPassed, safeLimit);

              //  HARD BLOCK (no AI)
              if (hoursPassed > safeLimit + 2) {
                     return NextResponse.json({
                            expiry: expiryDate.toLocaleString(),
                            note: "Do not donate or consume",
                            status: "Rejected ❌",
                            color: "red",
                            safetyScore: 0,
                     });
              }

              // 🤖 AI NOTE (ONLY when needed)
              let aiNote = "";
              try {
                     const completion = await openrouter.chat.completions.create({
                            model: "openai/gpt-4o-mini",
                            messages: [
                                   {
                                          role: "system",
                                          content:
                                                 "You are a professional food donation assistant. Generate one polite, impactful sentence encouraging NGOs to act quickly. Highlight that the food can help people or animals. Follow status strictly. Max 12 words. No emojis."
                                   },
                                   {
                                          role: "user",
                                          content: `Food: ${food} Status: ${safety.status}
                                            Rules:
                                           - Safe → say suitable and can help others
                                           - Donate Immediately → request urgent pickup, can help someone
                                           - Unsafe → clearly say not suitable
                                          `
                                   },
                            ],
                            temperature: 0.2,
                            max_tokens: 25,
                     });
                     aiNote =completion.choices?.[0]?.message?.content?.trim() || "Suitable for donation, may help those in need.";

              } catch {
                     aiNote = "Suitable for donation, may help those in need.";
              }

              const safetyScore = Math.max(0,Math.min(100, 100 - (hoursPassed / safeLimit) * 100));

              return NextResponse.json({
                     expiry: expiryDate.toLocaleString(),
                     note: aiNote,
                     status: safety.status,
                     color: safety.color,
                     safetyScore: Math.round(safetyScore),
              });
       } catch (err) {
              console.log(err);
              return NextResponse.json({
                     expiry: "Unknown",
                     note: "Error occurred",
                     status: "Error",
              });
       }
}