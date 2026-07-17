import { useParams ,Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Card from "../components/Topic/Card.jsx";

export default function Topic() {
  const { id } = useParams();
  const maintopic=id;

  const TOPICS = [
    { id: "arrays", name: "Arrays", activities: 5, lastActive: "June 15, 2026" },
    { id: "linkedlists", name: "Linked Lists", activities: 3, lastActive: "June 14, 2026" },
    { id: "stacks", name: "Stacks", activities: 2, lastActive: "June 12, 2026" },
    { id: "queues", name: "Queues", activities: 2, lastActive: "June 11, 2026" },
    { id: "trees", name: "Trees", activities: 4, lastActive: "June 10, 2026" },
    { id: "graphs", name: "Graphs", activities: 3, lastActive: "June 8, 2026" },
    { id: "dp", name: "Dynamic Programming", activities: 6, lastActive: "June 6, 2026" },
  ];

  return (
    <div className="p-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-500 cursor-pointer">
          <Link to="/dashboard">Dashboard</Link>
        </span>

        <ChevronRight size={14} className="text-gray-400" />

        <span className="text-sm font-medium text-gray-900">
          {id}
        </span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {id}
        </h1>

        <p className="text-gray-500">
          {TOPICS.length} topics tracked in this learning path.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-5">
        {TOPICS.map((topic) => (
          <Card
            key={topic.id}
            id={topic.id}
            topic={maintopic}
            name={topic.name}
            activities={topic.activities}
            lastActive={topic.lastActive}
          />
        ))}
      </div>

    </div>
  );
}