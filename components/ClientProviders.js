"use client";

import TopNav from "@/components/nav/TopNav";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { CategoryProvider } from "@/context/category";
import { TagProvider } from "@/context/tag";
import { ProductProvider } from "@/context/product";
import { CartProvider } from "@/context/cart";

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <CategoryProvider>
        <TagProvider>
          <ProductProvider>
            <CartProvider>
              <TopNav />
              <Toaster
                toastOptions={{
                  style: {
                    whiteSpace: "nowrap",
                    maxWidth: "none",
                    width: "fit-content",
                  },
                }}
              />
              {children}
            </CartProvider>
          </ProductProvider>
        </TagProvider>
      </CategoryProvider>
    </SessionProvider>
  );
}
