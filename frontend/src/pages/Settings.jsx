import { useState, useEffect } from "react";
import { Save, AlertTriangle, Trash2, LogOut, Globe, Copy, Check, CheckCircle2, Shield } from "lucide-react";
import toast from "react-hot-toast";
import SettingsSection from "../components/Settings/SettingsSection";
import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const {
    user,
    token,
    notificationSettings,
    preferences,
    updateUserProfile,
    updateNotifications,
    updateUserPreferences,
    logout,
    deleteUserAccount,
  } = useAuth();

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    bio: "",
  });

  const [notifState, setNotifState] = useState({
    studyReminder: true,
    weeklyReport: false,
    flashcardReminder: true,
  });

  const [prefState, setPrefState] = useState({
    preferredLanguage: "English",
    dailyStudyGoal: 60,
    timezone: "UTC+5:30",
  });

  const [extConnected, setExtConnected] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (user) {
      setFormState({
        username: user.fullName || user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (notificationSettings) {
      setNotifState({
        studyReminder: notificationSettings.studyReminder ?? true,
        weeklyReport: notificationSettings.weeklyReport ?? false,
        flashcardReminder: notificationSettings.flashcardReminder ?? true,
      });
    }
  }, [notificationSettings]);

  useEffect(() => {
    if (preferences) {
      setPrefState({
        preferredLanguage: preferences.preferredLanguage || "English",
        dailyStudyGoal: preferences.dailyStudyGoal || 60,
        timezone: preferences.timezone || "UTC+5:30",
      });
    }
  }, [preferences]);

  useEffect(() => {
    const savedStatus = localStorage.getItem("extension_connected");
    if (savedStatus === "true") {
      setExtConnected(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile({
      fullName: formState.username,
      bio: formState.bio,
    });
  };

  const handleNotifToggle = async (key, val) => {
    const updated = { ...notifState, [key]: val };
    setNotifState(updated);
    await updateNotifications(updated);
  };

  const handlePrefChange = async (key, val) => {
    const updated = { ...prefState, [key]: val };
    setPrefState(updated);
    await updateUserPreferences(updated);
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      toast.success("API token copied to clipboard!");
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const toggleExtensionConnection = () => {
    const newStatus = !extConnected;
    setExtConnected(newStatus);
    if (newStatus) {
      localStorage.setItem("extension_connected", "true");
      toast.success("Extension connected");
    } else {
      localStorage.removeItem("extension_connected");
      toast("Extension disconnected", { icon: "🔌" });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      await deleteUserAccount();
    }
  };

  return (
    <div className="max-w-4xl p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-500">
          Manage your account preferences, browser extension, and application settings.
        </p>
      </div>

      {/* Browser Extension & Integration */}
      <SettingsSection title="Chrome Extension Integration">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-red-600" />
                <h3 className="text-sm font-semibold text-gray-900">Extension Connection Status</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Syncs browsing activities and study sessions automatically.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                extConnected ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
              }`}>
                <span className={`h-2 w-2 rounded-full ${extConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                {extConnected ? "Connected & Tracking" : "Not Connected"}
              </span>

              <button
                onClick={toggleExtensionConnection}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                {extConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center justify-between">
              <span>Authentication Token</span>
              <span className="text-xs font-normal text-gray-500">Use to authorize browser extension</span>
            </label>

            <div className="flex gap-2">
              <input
                type="password"
                readOnly
                value={token || "Not Authenticated"}
                className="w-full rounded-lg border border-gray-200 bg-gray-100 font-mono text-xs text-gray-600 px-4 py-3 outline-none"
              />
              <button
                onClick={handleCopyToken}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {copiedToken ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copiedToken ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Profile */}
      <SettingsSection title="Profile">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="username"
              value={formState.username}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              disabled
              value={formState.email}
              placeholder="john@example.com"
              className="w-full rounded-lg border border-gray-200 bg-gray-100 text-gray-500 px-4 py-3 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Bio</label>
            <textarea
              rows={4}
              name="bio"
              value={formState.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 resize-none focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 shadow-sm"
          >
            <Save size={16} />
            Save Changes
          </button>
        </form>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-5">
            <div>
              <h3 className="text-sm font-medium">Daily Reminders</h3>
              <p className="text-sm text-gray-500">Get reminded to study every day.</p>
            </div>
            <input
              type="checkbox"
              checked={notifState.studyReminder}
              onChange={(e) => handleNotifToggle("studyReminder", e.target.checked)}
              className="w-5 h-5 accent-red-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-5">
            <div>
              <h3 className="text-sm font-medium">Flashcard Reminders</h3>
              <p className="text-sm text-gray-500">Receive spaced repetition flashcard practice alerts.</p>
            </div>
            <input
              type="checkbox"
              checked={notifState.flashcardReminder}
              onChange={(e) => handleNotifToggle("flashcardReminder", e.target.checked)}
              className="w-5 h-5 accent-red-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium">Weekly Reports</h3>
              <p className="text-sm text-gray-500">Receive weekly progress reports.</p>
            </div>
            <input
              type="checkbox"
              checked={notifState.weeklyReport}
              onChange={(e) => handleNotifToggle("weeklyReport", e.target.checked)}
              className="w-5 h-5 accent-red-600 cursor-pointer"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title="Preferences">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Language</label>
            <select
              value={prefState.preferredLanguage}
              onChange={(e) => handlePrefChange("preferredLanguage", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Daily Study Goal</label>
            <select
              value={prefState.dailyStudyGoal}
              onChange={(e) => handlePrefChange("dailyStudyGoal", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour (60 mins)</option>
              <option value={120}>2 hours (120 mins)</option>
              <option value={180}>3 hours (180 mins)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={prefState.timezone}
              onChange={(e) => handlePrefChange("timezone", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value="UTC+5:30">UTC+5:30 (IST)</option>
              <option value="UTC-5:00">UTC-5:00 (EST)</option>
              <option value="UTC+0:00">UTC+0:00 (GMT)</option>
              <option value="UTC+9:00">UTC+9:00 (JST)</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <div className="border border-red-200 bg-red-50 rounded-xl p-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-600" />
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 font-medium hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}