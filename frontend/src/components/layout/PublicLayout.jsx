import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StickyWhatsAppBar } from "./StickyWhatsAppBar";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <StickyWhatsAppBar />
    </div>
  );
}
