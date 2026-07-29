import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/utils/authOptions";

export const currentUser = async (req) => {
  if (req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token?.user) {
      return token.user;
    }
  }

  const session = await getServerSession(authOptions);
  return session?.user;
};
