//export { default } from "next-auth/middleware";

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server.js";
export const config = {
  matcher: ["/dashboard/:path*", "/api/user/:path*", "/api/adminr/:path*"],
};
//Protect pages, Only logged in user can visit
export default withAuth(
  async function middleware(req) {
    //Get the URL
    const url = req.nextUrl.pathname;
    //Get the userrole from the URL
    const userRole = req?.nextauth?.token?.user?.role;

    //if url includes admin and the user is not equal to admin
    if (url?.includes("/admin") && userRole !== "admin") {
      //send user back to home page.
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        //If we get a user that isn't logged in, doesn't have a token return false.
        if (!token) {
          return false;
        }
      },
    },
  }
);
