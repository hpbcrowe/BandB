import "@/app/globals.css";
import ClientProviders from "@/components/ClientProviders";

// Server layout: keep HTML deterministic on the server and mount client-only
// providers/ui inside a client boundary (ClientProviders). This reduces
// hydration mismatches caused by client-only mutations or extensions.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-material-design@4.1.3/dist/css/bootstrap-material-design.min.css"
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
