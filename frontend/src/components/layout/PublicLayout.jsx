import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StickyWhatsAppBar } from "./StickyWhatsAppBar";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bone">
      <Navbar />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <Footer />
      <StickyWhatsAppBar />
    </div>
  );
}
