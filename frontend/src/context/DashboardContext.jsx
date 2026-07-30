import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getTracks, createTrack, getTopics, getTimeline } from '../api/dashboard.js';
import { getSummary, generateSummary } from '../api/summary.js';
import { getQuiz, generateQuiz, submitQuiz } from '../api/quiz.js';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  // Navigation & selection states
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  // Data states
  const [tracks, setTracks] = useState([]);
  const [topics, setTopics] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [summary, setSummary] = useState(null);
  const [quiz, setQuiz] = useState(null);

  // Loading states
  const [tracksLoading, setTracksLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  // Error states
  const [tracksError, setTracksError] = useState(null);
  const [topicsError, setTopicsError] = useState(null);
  const [timelineError, setTimelineError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [quizError, setQuizError] = useState(null);

  // Timers for polling
  const summaryPollTimer = useRef(null);
  const quizPollTimer = useRef(null);

  const clearSummaryPoll = () => {
    if (summaryPollTimer.current) {
      clearTimeout(summaryPollTimer.current);
      summaryPollTimer.current = null;
    }
  };

  const clearQuizPoll = () => {
    if (quizPollTimer.current) {
      clearTimeout(quizPollTimer.current);
      quizPollTimer.current = null;
    }
  };

  // --- Track Actions ---
  const fetchTracks = useCallback(async () => {
    setTracksLoading(true);
    setTracksError(null);
    try {
      const res = await getTracks();
      const tracksData = Array.isArray(res) ? res : res.tracks || res.data || [];
      setTracks(tracksData);
      return tracksData;
    } catch (err) {
      setTracksError(err.message || 'Failed to load tracks');
      toast.error('Failed to load learning tracks');
      return [];
    } finally {
      setTracksLoading(false);
    }
  }, []);

  const createNewTrack = async (name, topicId = null) => {
    try {
      const res = await createTrack(name, topicId);
      console.log(res);
      toast.success('New track created!');
      await fetchTracks();
      return res;
    } catch (err) {
      console.log(err);
      toast.error(err.message || 'Failed to create track');
      throw err;
    }
  };

  // --- Topic Actions ---
  const fetchTopics = useCallback(async (trackId) => {
    if (!trackId) return [];
    setSelectedTrackId(trackId);
    setTopicsLoading(true);
    setTopicsError(null);
    try {
      const res = await getTopics(trackId);
      const topicsData = Array.isArray(res) ? res : res.topics || res.data || [];
      setTopics(topicsData);
      return topicsData;
    } catch (err) {
      setTopicsError(err.message || 'Failed to load topics');
      toast.error('Failed to load topics');
      return [];
    } finally {
      setTopicsLoading(false);
    }
  }, []);

  // --- Timeline Actions ---
  const fetchTimeline = useCallback(async (topicId) => {
    if (!topicId) return null;
    setSelectedTopicId(topicId);
    setTimelineLoading(true);
    setTimelineError(null);
    try {
      const res = await getTimeline(topicId);
      const timelineData = res.timeline || res.data || res;
      setTimeline(timelineData);
      return timelineData;
    } catch (err) {
      setTimelineError(err.message || 'Failed to load timeline');
      toast.error('Failed to load timeline activities');
      return null;
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  // --- Summary & Async Polling Flow ---
  const fetchSummary = useCallback(async (activityId, retry = false) => {
    if (!activityId) return;
    setSelectedActivityId(activityId);
    clearSummaryPoll();
    setSummaryLoading(true);
    setSummaryError(null);

    const poll = async (attempts = 0) => {
      if (attempts > 40) { // Max ~100 seconds timeout
        setSummaryError('Summary generation timed out. Please try again.');
        setSummaryLoading(false);
        return;
      }
      try {
        const res = await getSummary(activityId);
        const summaryData = res.summary || res.data || res;
        setSummary(summaryData);

        if (summaryData?.status === 'COMPLETED') {
          setSummaryLoading(false);
          clearSummaryPoll();
        } else if (summaryData?.status === 'FAILED') {
          setSummaryError(summaryData?.error || 'Summary generation failed');
          setSummaryLoading(false);
          clearSummaryPoll();
        } else {
          // Status is PROCESSING or still pending
          summaryPollTimer.current = setTimeout(() => poll(attempts + 1), 2500);
        }
      } catch (err) {
        setSummaryError(err.message);
        setSummaryLoading(false);
        clearSummaryPoll();
      }
    };

    try {
      let initialRes = await getSummary(activityId);
      let summaryData = initialRes.summary || initialRes.data || initialRes;

      if (!summaryData || summaryData.status === 'NOT_STARTED' || retry) {
        // Trigger generation asynchronously
        await generateSummary(activityId);
        setSummary({ status: 'PROCESSING', keyPoints: [] });
        // Start polling
        summaryPollTimer.current = setTimeout(() => poll(0), 2500);
      } else if (summaryData.status === 'PROCESSING') {
        setSummary(summaryData);
        summaryPollTimer.current = setTimeout(() => poll(0), 2500);
      } else {
        setSummary(summaryData);
        setSummaryLoading(false);
      }
    } catch (err) {
      // If 404 or missing, attempt generate
      if (err.status === 404) {
        try {
          await generateSummary(activityId);
          setSummary({ status: 'PROCESSING', keyPoints: [] });
          summaryPollTimer.current = setTimeout(() => poll(0), 2500);
          return;
        } catch (genErr) {
          setSummaryError(genErr.message);
          setSummaryLoading(false);
          return;
        }
      }
      setSummaryError(err.message || 'Failed to fetch summary');
      setSummaryLoading(false);
    }
  }, []);

  // --- Quiz & Async Polling Flow ---
  const fetchQuiz = useCallback(async (activityId, retry = false) => {
    if (!activityId) return;
    setSelectedActivityId(activityId);
    clearQuizPoll();
    setQuizLoading(true);
    setQuizError(null);

    const poll = async (attempts = 0) => {
      if (attempts > 40) {
        setQuizError('Quiz generation timed out. Please try again.');
        setQuizLoading(false);
        return;
      }
      try {
        const res = await getQuiz(activityId);
        const quizData = res.quiz || res.data || res;
        setQuiz(quizData);

        if (quizData?.status === 'COMPLETED') {
          setQuizLoading(false);
          clearQuizPoll();
        } else if (quizData?.status === 'FAILED') {
          setQuizError(quizData?.error || 'Quiz generation failed');
          setQuizLoading(false);
          clearQuizPoll();
        } else {
          quizPollTimer.current = setTimeout(() => poll(attempts + 1), 2500);
        }
      } catch (err) {
        setQuizError(err.message);
        setQuizLoading(false);
        clearQuizPoll();
      }
    };

    try {
      let initialRes = await getQuiz(activityId);
      let quizData = initialRes.quiz || initialRes.data || initialRes;

      if (!quizData || quizData.status === 'NOT_STARTED' || retry) {
        await generateQuiz(activityId);
        setQuiz({ status: 'PROCESSING', questions: [] });
        quizPollTimer.current = setTimeout(() => poll(0), 2500);
      } else if (quizData.status === 'PROCESSING') {
        setQuiz(quizData);
        quizPollTimer.current = setTimeout(() => poll(0), 2500);
      } else {
        setQuiz(quizData);
        setQuizLoading(false);
      }
    } catch (err) {
      if (err.status === 404) {
        try {
          await generateQuiz(activityId);
          setQuiz({ status: 'PROCESSING', questions: [] });
          quizPollTimer.current = setTimeout(() => poll(0), 2500);
          return;
        } catch (genErr) {
          setQuizError(genErr.message);
          setQuizLoading(false);
          return;
        }
      }
      setQuizError(err.message || 'Failed to fetch quiz');
      setQuizLoading(false);
    }
  }, []);

  // --- Submit Quiz ---
  const submitQuizAttempt = async (activityId, submissionData) => {
    try {
      const res = await submitQuiz(activityId, submissionData);
      toast.success('Quiz attempt submitted successfully!');
      return res;
    } catch (err) {
      toast.error(err.message || 'Failed to submit quiz attempt');
      throw err;
    }
  };

  const value = {
    selectedTrackId,
    setSelectedTrackId,
    selectedTopicId,
    setSelectedTopicId,
    selectedActivityId,
    setSelectedActivityId,
    tracks,
    topics,
    timeline,
    summary,
    quiz,
    tracksLoading,
    topicsLoading,
    timelineLoading,
    summaryLoading,
    quizLoading,
    tracksError,
    topicsError,
    timelineError,
    summaryError,
    quizError,
    fetchTracks,
    createNewTrack,
    fetchTopics,
    fetchTimeline,
    fetchSummary,
    fetchQuiz,
    submitQuizAttempt,
    clearSummaryPoll,
    clearQuizPoll,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
