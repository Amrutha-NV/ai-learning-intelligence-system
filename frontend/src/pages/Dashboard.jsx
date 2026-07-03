import { Plus, Code2, Globe, Cpu, Database, Server } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card/Card";
import AddTrackModal from "../components/dashboard/AddTrackModal";

const TRACKS = [
  {
    id: "dsa",
    name: "DSA",
    icon: Code2,
    topics: 7,
    lastActive: "2 hours ago",
    progress: 65,
  },
  {
    id: "webdev",
    name: "Web Development",
    icon: Globe,
    topics: 12,
    lastActive: "Yesterday",
    progress: 48,
  },
  {
    id: "ml",
    name: "Machine Learning",
    icon: Cpu,
    topics: 5,
    lastActive: "3 days ago",
    progress: 30,
  },
  {
    id: "db",
    name: "Database Systems",
    icon: Database,
    topics: 8,
    lastActive: "1 week ago",
    progress: 75,
  },
  {
    id: "os",
    name: "Operating Systems",
    icon: Server,
    topics: 6,
    lastActive: "4 days ago",
    progress: 55,
  },
];

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-10">
      {/* Header */}
      <nav className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <p className="mt-2 text-gray-500">
            Track and organize your learning topics.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200"
        >
          <Plus size={18} />
          Add Track
        </button>
      </nav>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {TRACKS.map((track) => (
          <Card
            key={track.id}
            id={track.id}
            name={track.name}
            icon={track.icon}
            topics={track.topics}
            lastActive={track.lastActive}
            progress={track.progress}
          />
        ))}
      </section>

      {/* Modal */}
      {showModal && (
        <AddTrackModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}