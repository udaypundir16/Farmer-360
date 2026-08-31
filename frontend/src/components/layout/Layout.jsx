import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FeaturesBar from './FeaturesBar';
import VoiceAssistant from '../voice/VoiceAssistant';

export default function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <div
      className={`flex flex-col min-h-screen w-full overflow-x-hidden relative ${
        isDashboard ? '' : 'bg-fixed bg-center bg-no-repeat bg-cover'
      }`}
      style={isDashboard ? {} : { backgroundImage: "url('/images/page_bg.jpg')" }}
    >
      {/* Background Soft Overlay to decrease background image opacity */}
      {!isDashboard && (
        <div className="fixed inset-0 bg-cream-50/80 backdrop-blur-[1px] pointer-events-none z-0" />
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <FeaturesBar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <VoiceAssistant />
      </div>
    </div>
  );
}

