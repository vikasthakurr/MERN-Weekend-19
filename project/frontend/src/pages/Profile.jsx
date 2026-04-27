import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Settings } from "lucide-react";
import { Navigate } from "react-router-dom";

const Profile = ({ user }) => {
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm"
      >
        <div className="h-48 bg-gray-100 flex items-center justify-center">
           <div className="bg-white p-6 rounded-full shadow-lg translate-y-12">
              <User size={64} className="text-black" />
           </div>
        </div>
        
        <div className="px-8 pt-20 pb-12 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black uppercase">{user.username}</h2>
            <p className="text-gray-500 font-medium">Verified Customer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-8 rounded-[20px] space-y-4">
              <div className="flex items-center space-x-3 text-black opacity-60">
                <Mail size={20} />
                <span className="font-bold text-sm uppercase tracking-wider">Email</span>
              </div>
              <p className="text-xl font-bold">{user.email}</p>
            </div>

            <div className="bg-gray-100 p-8 rounded-[20px] space-y-4">
              <div className="flex items-center space-x-3 text-black opacity-60">
                <Shield size={20} />
                <span className="font-bold text-sm uppercase tracking-wider">Role</span>
              </div>
              <p className="text-xl font-bold capitalize">{user.role}</p>
            </div>

            <div className="bg-gray-100 p-8 rounded-[20px] space-y-4 md:col-span-2">
              <div className="flex items-center space-x-3 text-black opacity-60">
                <Calendar size={20} />
                <span className="font-bold text-sm uppercase tracking-wider">Member Since</span>
              </div>
              <p className="text-xl font-bold">April 2026</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button className="btn-black flex-grow flex items-center justify-center space-x-2">
              <Settings size={20} />
              <span>EDIT PROFILE</span>
            </button>
            <button className="border-2 border-black text-black px-12 py-4 rounded-full font-bold hover:bg-gray-50 transition-all flex-grow md:flex-grow-0">
              ACCOUNT SETTINGS
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
