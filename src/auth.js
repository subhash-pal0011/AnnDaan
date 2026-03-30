import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDb from "./db/connectDb";
import User from "./model/user";
import Google from "next-auth/providers/google";


export const { handlers, auth, signIn, signOut } = NextAuth({
       providers: [
              Credentials({
                     name: "Credentials",
                     credentials: {
                            email: { label: "Email", type: "email" },
                            password: { label: "Password", type: "password" },
                     },
                     async authorize(credentials) {
                            await connectDb()

                            const email = credentials?.email;
                            const password = credentials?.password;

                            console.log("email :", email)
                            if (!email || !password) {
                                   throw new Error("Email and password are required");
                            }

                            const user = await User.findOne({ email });
                            if (!user) {
                                   throw new Error("No user found with this email");
                            }

                            if (!user.isVerified) {
                                   throw new Error("Please verify your email first");
                            }

                            const isMatchPass = await bcrypt.compare(password, user.password);
                            if (!isMatchPass) {
                                   throw new Error("Invalid password");
                            }

                            return {
                                   id: user._id.toString(),
                                   name: user.name,
                                   email: user.email,
                                   role: user.role,
                            };
                     },
              }),
              Google({
                     clientId: process.env.GOOGLE_CLIENT_ID,
                     clientSecret: process.env.GOOGLE_CLIENT_SECRET
              })
       ],

       callbacks: {
              async signIn({ user, account }) {
                     if (account?.provider === "google") {
                            try {
                                   await connectDb();
                                   let existingUser = await User.findOne({ email: user.email });

                                   if (!existingUser) {
                                          existingUser = await User.create({
                                                 name: user.name,
                                                 email: user.email,
                                                 isVerified: true,
                                                 provider: "google",
                                                 role: "organizer",
                                          });
                                   }
                                   user.id = existingUser._id.toString();
                                   user.role = existingUser.role;
                                   return true;
                            } catch (error) {
                                   console.error("Google SignIn Error:", error);
                                   return false;
                            }
                     }

                     return true;
              },
              async jwt({ token, user }) {
                     if (user) {
                            token.id = user.id;
                            token.name = user.name;
                            token.email = user.email;
                            token.role = user.role;
                     }
                     return token;
              },
              async session({ session, token }) {
                     if (token) {
                            session.user.id = token.id;
                            session.user.name = token.name;
                            session.user.email = token.email;
                            session.user.role = token.role;
                     }
                     return session;
              },
       },

       pages: {
              signIn: "/login",
       },

       session: {
              strategy: "jwt",
              maxAge: 10 * 24 * 60 * 60,
       },

       secret: process.env.AUTH_SECRET,
});