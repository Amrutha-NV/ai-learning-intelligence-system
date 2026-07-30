import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import Section from "../components/SubTopic/Section";
import { useDashboard } from "../context/DashboardContext.jsx";

export default function SubTopic() {
  const { trackId, topicId } = useParams();
  const { timeline, timelineLoading, timelineError, fetchTimeline, topics, tracks } = useDashboard();

  useEffect(() => {
    if (topicId) {
      fetchTimeline(topicId);
    }
  }, [topicId, fetchTimeline]);

  const currentTrack = tracks.find((t) => (t._id || t.id) === trackId);
  const currentTopic = topics.find((tp) => (tp._id || tp.id) === topicId);

  const trackName = currentTrack?.name || "Track";
  const topicName = currentTopic?.name || currentTopic?.topic || "Topic";

  const activitiesList = timeline?.activities || (Array.isArray(timeline) ? timeline : []);

  return (
    <div className="p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-400" />

        <Link to={`/topic/${trackId}`} className="text-gray-500 hover:text-gray-700">
          {trackName}
        </Link>
        <ChevronRight size={14} className="text-gray-400" />

        <span className="font-medium text-gray-900 capitalize">{topicName}</span>
      </div>

      {/* Heading */}
      <div className="mb-9">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{topicName}</h1>
        <p className="text-gray-500">
          {activitiesList.length} study activit{activitiesList.length === 1 ? "y" : "ies"} tracked.
        </p>
      </div>

      {/* Loading State */}
      {timelineLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      )}

      {/* Error State */}
      {timelineError && !timelineLoading && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 mb-6">{timelineError}</div>
      )}

      {/* Activities */}
      {!timelineLoading && (
        <div className="space-y-5">
          {activitiesList.length === 0 ? (
            <div className="py-12 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">
              No study activities recorded for this topic yet.
            </div>
          ) : (
            activitiesList.map((activity, index) => {
              const actId = activity._id || activity.id;
              const formattedTime = activity.timestamp || activity.createdAt
                ? new Date(activity.createdAt || Date.now()).toLocaleString()
                : "Recently";

              return (
                <Section
                  key={actId}
                  activityId={actId}
                  title={activity.title || activity.url || "Study Session"}
                  timestamp={formattedTime}
                  description={
                    activity.description || activity.summarySnippet || "Activity tracked via AI Learning Assistant."
                  }
                  isLast={index === activitiesList.length - 1}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}