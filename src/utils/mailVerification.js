import nodemailer from "nodemailer";

export async function mailVerification(email, otp) {
       try {
              const transporter = nodemailer.createTransport({
                     service: "gmail",
                     auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASS
                     }
              });

              const mailOptions = {
                     from: `"AnnDaan" <${process.env.EMAIL}>`,
                     to: email,
                     subject: "Your OTP for Registration - AnnDaan",
                     html: `
                     <div style="font-family: Arial, sans-serif; padding: 20px;">
                         <h2 style="color: #2c3e50;">Welcome to AnnDaan 🙏</h2>
                         <p>Your OTP for registration is:</p>
                    
                          <h1 style="color: #27ae60; letter-spacing: 2px;">
                            ${otp}
                          </h1>

                         <p>This OTP is valid for <b>5 minutes</b>.</p>
                    
                         <p>If you did not request this, please ignore this email.</p>

                         <br/>
                         <p>Thanks,<br/>AnnDaan Team</p>
                     </div> `
              };
              await transporter.sendMail(mailOptions);
              return { success: true };

       } catch (error) {
              console.error("Mail error:", error);
              return { success: false, error: error.message };
       }
}