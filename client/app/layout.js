
import "./globals.css";

export const metadata = {
  title: "Vendor SaaS",
  description: "Manage your business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

