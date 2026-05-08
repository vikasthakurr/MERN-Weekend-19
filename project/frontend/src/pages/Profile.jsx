import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Calendar, Pencil, Check, X, Camera, AlertCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

// ── Editable field row ───────────────────────────────────────────────────────
const EditableField = ({ icon: Icon, label, value, field, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    if (draft.trim() && draft.trim() !== value) onSave(field, draft.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-[20px] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-black opacity-60">
          <Icon size={18} />
          <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
        </div>
        {!editing && (
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="text-gray-400 hover:text-black transition-colors"
            aria-label={`Edit ${label}`}
          >
            <Pencil size={15} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2"
          >
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
              className="flex-grow bg-white border-2 border-black rounded-xl px-3 py-2 text-sm font-bold outline-none"
            />
            <button onClick={handleSave} className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
              <Check size={14} />
            </button>
            <button onClick={handleCancel} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold"
          >
            {value}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Avatar upload ────────────────────────────────────────────────────────────
const AvatarUpload = ({ avatar, username, onUpload }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(avatar ?? null);
  const [hovering, setHovering] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Read as base64 and store — no backend needed for now
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      onUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-28 h-28 mx-auto">
      <div
        className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-xl cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center text-white text-3xl font-black uppercase">
            {username?.[0] ?? <User size={32} />}
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1"
            >
              <Camera size={20} className="text-white" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera badge */}
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:bg-black/80 transition-colors"
        aria-label="Upload profile picture"
      >
        <Camera size={14} />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

// ── Profile page ─────────────────────────────────────────────────────────────
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState(null); // "saving" | "saved" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  if (!user) return <Navigate to="/login" />;

  // Called by EditableField when user confirms a text edit
  const handleSave = async (field, value) => {
    setStatus("saving");
    setErrorMsg("");
    try {
      const { data } = await api.put("/users/v1/update", { [field]: value });
      // Backend returns the updated user — sync context + localStorage
      updateUser(data.data);
      setStatus("saved");
    } catch (err) {
      setErrorMsg(err.response?.data?.message ?? "Update failed");
      setStatus("error");
    } finally {
      setTimeout(() => setStatus(null), 2500);
    }
  };

  // Avatar is stored as base64 locally (Cloudinary upload is a future step)
  const handleAvatarUpload = (dataUrl) => {
    updateUser({ avatar: dataUrl });
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm"
      >
        {/* Cover */}
        <div className="h-36 bg-gray-100 relative" />

        {/* Avatar — overlaps cover */}
        <div className="-mt-14 px-8 pb-8">
          <AvatarUpload
            avatar={user.avatar}
            username={user.username}
            onUpload={handleAvatarUpload}
          />

          {/* Status toast */}
          <AnimatePresence>
            {status === "saved" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 mx-auto w-fit bg-green-50 text-green-700 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5"
              >
                <Check size={13} />
                Saved to database
              </motion.div>
            )}
            {status === "saving" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 mx-auto w-fit bg-gray-100 text-gray-500 text-xs font-bold px-4 py-2 rounded-full"
              >
                Saving…
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 mx-auto w-fit bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5"
              >
                <AlertCircle size={13} />
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + role */}
          <div className="text-center mt-4 space-y-1">
            <h2 className="text-3xl font-black uppercase tracking-tighter">{user.username}</h2>
            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full capitalize">
              {user.role ?? "Customer"}
            </span>
          </div>

          {/* Editable fields */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField
              icon={User}
              label="Username"
              value={user.username}
              field="username"
              onSave={handleSave}
            />
            <EditableField
              icon={Mail}
              label="Email"
              value={user.email}
              field="email"
              onSave={handleSave}
            />

            {/* Read-only fields */}
            <div className="bg-gray-100 p-6 rounded-[20px] space-y-3">
              <div className="flex items-center space-x-2 text-black opacity-60">
                <Shield size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Role</span>
              </div>
              <p className="text-lg font-bold capitalize">{user.role ?? "Customer"}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-[20px] space-y-3">
              <div className="flex items-center space-x-2 text-black opacity-60">
                <Calendar size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Member Since</span>
              </div>
              <p className="text-lg font-bold">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                  : "May 2026"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
