import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import EditProfile from '../components/profile/EditProfile';
import ChangePassword from '../components/profile/ChangePassword';
import NotificationSettings from '../components/profile/NotificationSettings';
import ApplicationHistory from '../components/profile/ApplicationHistory';
import AlertHistory from '../components/profile/AlertHistory';
import { User, Lock, Bell, FileText, History } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream-100 py-8">
      <div className="container mx-auto p-4 max-w-5xl">
        {/* Profile header - split feel: dark green accent + cream */}
        <div className="mb-8 rounded-agri-lg overflow-hidden shadow-agri-lg animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white border border-primary-100">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-gold-200 text-3xl font-bold shadow-agri ring-4 ring-gold-200/50 ring-offset-2">
                {user?.fullName?.charAt(0) || 'F'}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-soil mb-1">
                {user?.fullName || 'Farmer'}
              </h1>
              <p className="text-soil-light text-lg">
                {user?.village}, {user?.state}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs - cream content area */}
        <div className="rounded-agri-lg bg-white shadow-agri border border-primary-100 overflow-hidden animate-fade-in-up">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-0 bg-primary-800 p-2 m-0 rounded-none border-b border-primary-700">
              <TabsTrigger
                value="edit"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg py-2.5 transition-all font-medium"
              >
                <User size={18} />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg py-2.5 transition-all font-medium"
              >
                <Lock size={18} />
                <span className="hidden md:inline">Password</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg py-2.5 transition-all font-medium"
              >
                <Bell size={18} />
                <span className="hidden md:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg py-2.5 transition-all font-medium"
              >
                <FileText size={18} />
                <span className="hidden md:inline">Apps</span>
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary-800 data-[state=inactive]:text-gold-100 rounded-lg py-2.5 transition-all font-medium"
              >
                <History size={18} />
                <span className="hidden md:inline">History</span>
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
