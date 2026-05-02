import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      {/* <Navbar />
      <div className="flex">
        <Sidebar className="bg-red-300" />
        <main className="flex items-center justify-center ">{children}</main>
      </div> */}

      <Navbar />
<div className="flex">
  {/* Sidebar */}
  <Sidebar className="fixed top-16 left-0 h-full" />

  {/* Main Content */}
  <main className="ml-64 mt-16 w-full min-h-screen flex items-center justify-center">
    {children}
  </main>
</div>
    </>
  );
}