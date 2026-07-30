import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import AuthPage from './pages/AuthPage.jsx';
import NotFound from './pages/NotFound.jsx';
import { Sidebar } from './components/Sidebar/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';
import Topic from './pages/Topic.jsx';
import SubTopic from './pages/SubTopic.jsx';
import Summary from './pages/Summary.jsx';
import Quiz from './pages/Quiz.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Sidebar currentPage="dashboard">
              <Dashboard />
            </Sidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Sidebar currentPage="analytics">
              <Analytics />
            </Sidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Sidebar currentPage="settings">
              <Settings />
            </Sidebar>
          </ProtectedRoute>
        }
      />

      <Route
        path="/topic/:trackId"
        element={
          <ProtectedRoute>
            <Sidebar currentPage="topic">
              <Topic />
            </Sidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/track/:trackId/topic/:topicId"
        element={
          <ProtectedRoute>
            <Sidebar currentPage="subtopic">
              <SubTopic />
            </Sidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity/:activityId/summary"
        element={
          <ProtectedRoute>
            <Sidebar currentPage="summary">
              <Summary />
            </Sidebar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity/:activityId/quiz"
        element={
          <ProtectedRoute>
            <Sidebar currentPage="quiz">
              <Quiz />
            </Sidebar>
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 handler */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}