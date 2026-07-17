export default function SettingsSection({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-100">
        {title}
      </h2>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}