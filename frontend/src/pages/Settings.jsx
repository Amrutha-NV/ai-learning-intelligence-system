import { useState } from "react";
import { Save, Shield, Bell, Sliders, HelpCircle, AlertTriangle, Download, Lock, Trash2, LogOut, ExternalLink, MessageSquare, FileQuestion } from "lucide-react";
import SettingsSection from "../components/Settings/SettingsSection";

export default function Settings() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState);
  };

  return (
    <div className="max-w-4xl p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* ================= Profile ================= */}

      <SettingsSection title="Profile">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              name="username"
              value={formState.username}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Bio
            </label>

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
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
          >
            <Save size={16} />
            Save Changes
          </button>
        </form>

      </SettingsSection>

      {/* ================= Notifications ================= */}

      <SettingsSection title="Notifications">

        <div className="space-y-6">

          <div className="flex justify-between items-center border-b border-gray-100 pb-5">
            <div>
              <h3 className="text-sm font-medium">
                Daily Reminders
              </h3>

              <p className="text-sm text-gray-500">
                Get reminded to study every day.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-red-600"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium">
                Weekly Reports
              </h3>

              <p className="text-sm text-gray-500">
                Receive weekly progress reports.
              </p>
            </div>

            <input
              type="checkbox"
              className="w-5 h-5 accent-red-600"
            />
          </div>

        </div>

      </SettingsSection>

      {/* ================= Preferences ================= */}

      <SettingsSection title="Preferences">

        <div className="space-y-6">

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Language
            </label>

            <select
              defaultValue="English"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Daily Study Goal
            </label>

            <select
              defaultValue="1 hour"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>3 hours</option>
              <option>4+ hours</option>
            </select>
          </div>

        </div>

      </SettingsSection>
      {/* ================= Danger Zone ================= */}

<div className="border border-red-200 bg-red-50 rounded-xl p-8">

  <div className="flex items-center gap-2 mb-3">
    <AlertTriangle
      size={18}
      className="text-red-600"
    />

    <h2 className="text-lg font-semibold text-red-600">
      Danger Zone
    </h2>
  </div>

  <p className="text-sm text-gray-600 mb-6">
    These actions are irreversible. Please proceed with caution.
  </p>

  <div className="flex flex-wrap gap-3">

    <button
      className="
      flex
      items-center
      gap-2
      px-5
      py-2.5
      rounded-lg
      border
      border-red-200
      bg-white
      text-red-600
      font-medium
      hover:bg-red-100
      transition-colors
      "
    >
      <LogOut size={16} />
      Sign Out
    </button>

    <button
      className="
      flex
      items-center
      gap-2
      px-5
      py-2.5
      rounded-lg
      bg-red-600
      text-white
      font-semibold
      hover:bg-red-700
      transition-colors
      "
    >
      <Trash2 size={16} />
      Delete Account
    </button>

  </div>

</div>

    </div>
  );
}