import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Section from "../components/SubTopic/Section";

export default function SubTopic() {
  const { id } = useParams();
  const subtopic=id;

  const ACTIVITIES = [
    {
      id: "a1",
      title: "Array Traversal Concepts",
      timestamp: "June 15, 2026 · 7:45 PM",
      description:
        "Explored different methods for traversing arrays including linear scan, two-pointer technique, and sliding window approaches.",
    },
    {
      id: "a2",
      title: "Big O Analysis of Array Operations",
      timestamp: "June 15, 2026 · 5:20 PM",
      description:
        "Studied time complexity of common array operations: access O(1), search O(n), insertion O(n), and deletion O(n).",
    },
    {
      id: "a3",
      title: "Multi-dimensional Arrays",
      timestamp: "June 14, 2026 · 9:00 PM",
      description:
        "Deep dive into 2D arrays, matrix representation, and row vs column major ordering in memory.",
    },
    {
      id: "a4",
      title: "Dynamic Arrays vs Static Arrays",
      timestamp: "June 14, 2026 · 3:15 PM",
      description:
        "Comparison between static arrays (fixed size) and dynamic arrays (resizable), focusing on amortized complexity.",
    },
    {
      id: "a5",
      title: "Array Sorting Algorithms",
      timestamp: "June 13, 2026 · 11:30 AM",
      description:
        "Reviewed in-place sorting on arrays including bubble sort, selection sort, insertion sort, and quick sort.",
    },
  ];
  const{topic}=useParams();
  return (
    <div className="p-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">

        <Link
          to="/dashboard"
          className="text-gray-500 hover:text-gray-700"
        >
          Dashboard
        </Link>

        <ChevronRight size={14} className="text-gray-400" />

        <Link
          to={`/topic/${topic}`}
          className="text-gray-500 hover:text-gray-700"
        >
          {topic}
        </Link>

        <ChevronRight size={14} className="text-gray-400" />

        <span className="font-medium text-gray-900 capitalize">
          {id}
        </span>

      </div>

      {/* Heading */}

      <div className="mb-9">

        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
          {id}
        </h1>

        <p className="text-gray-500">
          {ACTIVITIES.length} study activities tracked.
        </p>

      </div>

      {/* Activities */}

      <div className="space-y-5">

        {ACTIVITIES.map((activity) => (
          <Section
            key={activity.id}
            topic={topic}
            subtopic={subtopic}
            title={activity.title}
            timestamp={activity.timestamp}
            description={activity.description}
          />
        ))}

      </div>

    </div>
  );
}