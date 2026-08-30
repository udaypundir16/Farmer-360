import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import EditProfile from '../components/profile/EditProfile';
import ChangePassword from '../components/profile/ChangePassword';
import NotificationSettings from '../components/profile/NotificationSettings';
import ApplicationHistory from '../components/profile/ApplicationHistory';
import AlertHistory from '../components/profile/AlertHistory';
import ProfileCompletion, { useProfileCompletion } from '../components/profile/ProfileCompletion';
import { User, Lock, Bell, FileText, History } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { percentage } = useProfileCompletion(user);
  const [activeTab, setActiveTab] = useState('edit');
  const tabsRef = useRef(null);

  // Handler: scroll to tabs section & switch to edit tab
  const handleEditClick = () => {
    setActiveTab('edit');
    // Small timeout so the tab value updates before scroll
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Progress ring colors
  const ringColor =
    percentage >= 100 ? '#16a34a' :
      percentage >= 75 ? '#65a30d' :
        percentage >= 50 ? '#d97706' :
          '#dc2626';

  return (
    <div className="min-h-screen bg-transparent py-8">
      <style>{`
        .profile-header-ring {
          position: relative;
        }
        .profile-header-ring svg {
          position: absolute;
          inset: -6px;
          z-index: 2;
        }
        .profile-pct-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          z-index: 3;
          background: ${ringColor};
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          line-height: 1.3;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
          transition: background 0.4s ease;
        }
      `}</style>

      <div className="container mx-auto p-4 max-w-5xl">
        {/* Profile header */}
        <div className="mb-6 rounded-agri-lg overflow-hidden shadow-agri-lg animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white border border-primary-100">
            {/* Avatar with progress ring overlay */}
            <div className="relative flex-shrink-0 profile-header-ring" style={{ width: 96, height: 96 }}>
              {/* Outer SVG ring */}
              <svg width={108} height={108} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={54} cy={54} r={48} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={5} />
                <circle
                  cx={54} cy={54} r={48}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 - (percentage / 100) * 2 * Math.PI * 48}
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
                />
              </svg>
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-gold-200 text-3xl font-bold shadow-agri" style={{ position: 'relative', zIndex: 1 }}>
                {user?.fullName?.charAt(0) || 'F'}
              </div>
              {/* Percentage badge */}
              <span className="profile-pct-badge">{percentage}%</span>
            </div>

            <div className="flex-1">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-soil mb-1">
                {user?.fullName || 'Farmer'}
              </h1>
              <p className="text-soil-light text-lg">
                {user?.village && user?.state
                  ? `${user.village}, ${user.state}`
                  : user?.village || user?.state || 'Location not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile completion banner */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ProfileCompletion user={user} onEditClick={handleEditClick} />
        </div>

        {/* Tabs - cream content area */}
        <div ref={tabsRef} className="rounded-agri-lg bg-white shadow-agri border border-primary-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full overflow-x-auto gap-1.5 bg-primary-800 p-2 m-0 rounded-none border-b border-primary-700 no-scrollbar">
              <TabsTrigger
                value="edit"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg px-3 py-2.5 transition-all font-medium flex-1 min-w-[100px] justify-center"
              >
                <User size={18} />
                <span className="text-xs sm:text-sm whitespace-nowrap">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg px-3 py-2.5 transition-all font-medium flex-1 min-w-[100px] justify-center"
              >
                <Lock size={18} />
                <span className="text-xs sm:text-sm whitespace-nowrap">Password</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg px-3 py-2.5 transition-all font-medium flex-1 min-w-[100px] justify-center"
              >
                <Bell size={18} />
                <span className="text-xs sm:text-sm whitespace-nowrap">Alerts</span>
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg px-3 py-2.5 transition-all font-medium flex-1 min-w-[100px] justify-center"
              >
                <FileText size={18} />
                <span className="text-xs sm:text-sm whitespace-nowrap">Apps</span>
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg px-3 py-2.5 transition-all font-medium flex-1 min-w-[100px] justify-center"
              >
                <History size={18} />
                <span className="text-xs sm:text-sm whitespace-nowrap">History</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6 md:p-8 bg-cream-50/50">
              <TabsContent value="edit" className="animate-in fade-in duration-300 mt-0">
                <EditProfile user={user} />
              </TabsContent>
              <TabsContent value="password" className="animate-in fade-in duration-300 mt-0">
                <ChangePassword />
              </TabsContent>
              <TabsContent value="notifications" className="animate-in fade-in duration-300 mt-0">
                <NotificationSettings />
              </TabsContent>
              <TabsContent value="applications" className="animate-in fade-in duration-300 mt-0">
                <ApplicationHistory />
              </TabsContent>
              <TabsContent value="alerts" className="animate-in fade-in duration-300 mt-0">
                <AlertHistory />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
