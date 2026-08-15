import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { StickyBarProvider } from "./context/StickyBarContext";
import { Toaster } from "./components/ui/sonner";
import { PublicLayout } from "./components/layout/PublicLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";

import Home from "./pages/Home";
import RoomCategory from "./pages/RoomCategory";
import TileDetail from "./pages/TileDetail";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import TilesList from "./pages/admin/TilesList";
import TileForm from "./pages/admin/TileForm";
import FeaturedPicks from "./pages/admin/FeaturedPicks";
import DemoPhotosList from "./pages/admin/DemoPhotosList";
import DemoPhotoForm from "./pages/admin/DemoPhotoForm";
import AdminSettings from "./pages/admin/AdminSettings";
import BlogList from "./pages/admin/BlogList";
import BlogForm from "./pages/admin/BlogForm";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <StickyBarProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="/tiles/:room" element={<RoomCategory />} />
                  <Route path="/tile/:slug" element={<TileDetail />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="tiles" element={<TilesList />} />
                  <Route path="tiles/new" element={<TileForm />} />
                  <Route path="tiles/:id/edit" element={<TileForm />} />
                  <Route path="featured-picks" element={<FeaturedPicks />} />
                  <Route path="demo-photos" element={<DemoPhotosList />} />
                  <Route path="demo-photos/new" element={<DemoPhotoForm />} />
                  <Route path="demo-photos/:id/edit" element={<DemoPhotoForm />} />
                  <Route path="blog" element={<BlogList />} />
                  <Route path="blog/new" element={<BlogForm />} />
                  <Route path="blog/:id/edit" element={<BlogForm />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Toaster />
          </StickyBarProvider>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
