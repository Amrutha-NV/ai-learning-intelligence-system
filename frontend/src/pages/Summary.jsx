import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Header from "../components/Summary/Header";
import Section from "../components/Summary/Section";
import Quiz from "../components/Summary/Quiz";

export default function Summary() {
  const { topic, subtopic } = useParams();

  const SUMMARY_SECTIONS = [
    {
      title: "What Is An Array",
      content:
        "An array is a linear data structure that stores elements of the same type in contiguous memory locations.",
    },
    {
      title: "Array Operations",
      content:
        "Arrays support Access, Search, Insertion and Deletion operations.",
    },
    {
      title: "Advantages",
      content:
        "Arrays provide O(1) indexing and cache-friendly memory layout.",
    },
    {
      title: "Disadvantages",
      content:
        "Insertion and deletion require shifting elements making them O(n).",
    },
    {
      title: "Complexity Analysis",
      content:
        "Access O(1), Search O(n), Insertion O(n), Deletion O(n).",
    },
    {
      title: "Key Takeaways",
      content:
        "Arrays are the building blocks of many advanced data structures.",
    },
  ];

  return (
    <div className="p-10">

      {/* Breadcrumb */}

      <div className="flex items-center gap-2 text-sm mb-8">

        <Link
          to="/dashboard"
          className="text-gray-500 hover:text-gray-700"
        >
          Dashboard
        </Link>

        <ChevronRight size={14} className="text-gray-400" />

        <Link
          to={`/topic/${topic}`}
          className="text-gray-500 hover:text-gray-700 capitalize"
        >
          {topic}
        </Link>

        <ChevronRight size={14} className="text-gray-400" />

        <Link
          to={`/${topic}/subtopic/${subtopic}`}
          className="text-gray-500 hover:text-gray-700 capitalize"
        >
          {subtopic}
        </Link>

        <ChevronRight size={14} className="text-gray-400" />

        <span className="font-medium text-gray-900">
          Summary
        </span>

      </div>

      <div className="max-w-5xl mx-auto">

        <Header topicName={subtopic} />

        <div className="space-y-4">

          {SUMMARY_SECTIONS.map((section) => (
            <Section
              key={section.title}
              title={section.title}
              content={section.content}
            />
          ))}

        </div>

        <Quiz 
        topic={topic}
        subtopic={subtopic}/>

      </div>

    </div>
  );
}