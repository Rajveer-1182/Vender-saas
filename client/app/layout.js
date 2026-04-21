import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";

export const metadata = {
  title: "Vendor SaaS - Wedding Vendors Management",
  description: "Manage your wedding vendor business efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        <div className="flex flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 w-full bg-gray-50 min-h-screen">
            <div className="p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
