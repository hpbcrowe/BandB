"use client";

import "@/app/globals.css";
// Load bootstrap-material-design from a CDN to avoid Turbopack/PostCSS parsing errors
// that can occur when importing certain prebuilt/minified CSS from node_modules.
// Using a CDN link keeps the CSS available without triggering the local CSS parser.
import TopNav from "@/components/nav/TopNav";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { CategoryProvider } from "@/context/category";
import { TagProvider } from "@/context/tag";
import { ProductProvider } from "@/context/product";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-material-design@4.1.3/dist/css/bootstrap-material-design.min.css"
        />
      </head>
      <SessionProvider>
        <CategoryProvider>
          <TagProvider>
            <ProductProvider>
              <body>
                <TopNav />
                <Toaster />
                {children}
              </body>
            </ProductProvider>
          </TagProvider>
        </CategoryProvider>
      </SessionProvider>
    </html>
  );
}
