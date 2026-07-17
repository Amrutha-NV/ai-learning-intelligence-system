import { Clock, BookOpen, Brain, Flame } from "lucide-react";

import Heading from "../components/Analytics/Heading";
import Insights from "../components/Analytics/Insights";
import Graph from "../components/Analytics/Graph";
import QuizInsights from "../components/Analytics/QuizInsights";

export default function Analytics() {
  const insights = [
    {
      icon: Clock,
      title: "Total Study Time",
      value: "127 hrs",
      description: "+12 hours this week",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      icon: BookOpen,
      title: "Topics Studied",
      value: "34",
      description: "Across all tracks",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      icon: Brain,
      title: "Quiz Accuracy",
      value: "84%",
      description: "Average score",
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-500",
      accentBar: "bg-cyan-500",
    },
    {
      icon: Flame,
      title: "Study Streak",
      value: "12 Days",
      description: "Current streak",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      accentBar: "bg-red-600",
    },
  ];

  const graphData = [
    {
      name: "DSA",
      value: 40,
      color: "#DC2626",
    },
    {
      name: "Web Development",
      value: 35,
      color: "#06B6D4",
    },
    {
      name: "DBMS",
      value: 15,
      color: "#FCA5A5",
    },
    {
      name: "Operating Systems",
      value: 10,
      color: "#A5F3FC",
    },
  ];

  const quizInsights = [
    {
      label: "Most Studied Track",
      value: "DSA",
      icon: "TrendingUp",
      color: "text-red-600",
    },
    {
      label: "Highest Quiz Accuracy",
      value: "Arrays",
      icon: "Brain",
      color: "text-cyan-500",
    },
    {
      label: "Active Days This Month",
      value: "22 Days",
      icon: "CheckCircle2",
      color: "text-green-500",
    },
    {
      label: "Last Study Session",
      value: "Today",
      icon: "Clock",
      color: "text-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-10">

      <Heading
        title="Analytics"
        subtitle="Track your learning progress and performance."
      />

      <div className="mt-8">
        <Insights insights={insights} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <Graph
          title="Study Distribution"
          subtitle="Hours spent across learning tracks."
          data={graphData}
        />

        <QuizInsights
          title="Quick Insights"
          subtitle="Highlights from your learning journey."
          insights={quizInsights}
        />

      </div>

    </div>
  );
}