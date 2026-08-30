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
      className={`flex flex-col min-h-screen w-full overflow-x-hidden ${
        isDashboard ? '' : 'bg-fixed bg-center bg-no-repeat bg-cover'
      }`}
      style={isDashboard ? {} : { backgroundImage: "url('/images/page_bg.jpg')" }}
    >
      <Navbar />
      <FeaturesBar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}
