import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "./dbConnect";
import { signIn } from "next-auth/react";
import { NEXTAUTH_SECRET } from "@/config";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        dbConnect();
        const { email, password } = credentials;
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Invalid email or password");
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
          throw new Error("Invalid Email or Password");
        }
        return user;
      },
    }),
  ],
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
