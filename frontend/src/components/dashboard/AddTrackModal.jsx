export default function AddTrackModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] rounded-2xl bg-white p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-gray-900">
          Add Track
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Create a new learning track to organize your study topics.
        </p>

        {/* Track Name */}
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Track Name
          </label>

          <input
            type="text"
            placeholder="e.g. Computer Networks"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Description */}
        <div className="mt-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
            <span className="ml-1 font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <textarea
            rows={3}
            placeholder="Briefly describe what this track covers..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
          >
            Create Track
          </button>
        </div>
      </div>
    </div>
  );
}