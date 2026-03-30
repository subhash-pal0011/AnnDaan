import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDb from "./db/connectDb";
import User from "./model/user";

export const { handlers } = NextAuth({
       providers: [
              Credentials({
                     name: "Credentials",
                     credentials: {
                            email: { label: "Email", type: "email" },
                            password: { label: "Password", type: "password" },
                     },
                     async authorize(credentials) {
                            await connectDb()

                            const { email, password } = credentials;

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
       ],

       callbacks: {
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