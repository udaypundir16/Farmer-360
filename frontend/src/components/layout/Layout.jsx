import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FeaturesBar from './FeaturesBar';
import VoiceAssistant from '../voice/VoiceAssistant';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100 page-bg-pattern w-full overflow-x-hidden">
      <Navbar />
      <FeaturesBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}
