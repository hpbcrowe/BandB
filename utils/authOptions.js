import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "./dbConnect";
import { signIn } from "next-auth/react";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} from "@/config";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
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
  callbacks: {
    async signIn({ user }) {
      const { email, name, image } = user;
      dbConnect();
      let dbUser = await User.findOne({ email });
      if (!dbUser) {
        await User.create({
          email,
          name,
          image,
        });
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      const userByEmail = await User.findOne({ email: token.email });
      userByEmail.password = undefined;
      userByEmail.resetCode = undefined;
      token.user = userByEmail;
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
