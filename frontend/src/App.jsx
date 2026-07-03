import{useState,useEffect} from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
export default function App(){
  

    return(
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/dashboard" element={<Sidebar currentPage={"dashboard"} children={<Dashboard></Dashboard>}/>} />
        <Route path="/analytics" element={<Sidebar currentPage={"analytics"} children={<Analytics></Analytics>}/>} />
        <Route path="/settings" element={<Sidebar currentPage={"settings"} children={<Settings></Settings>}/>} />
         <Route path="/topic/:id" element={<Sidebar currentPage={"topic"} children={<Topic />}/>} />
        <Route path="/:topic/subtopic/:id" element={<Sidebar currentPage={"subtopic"} children={<SubTopic />}/>} />
        <Route path="/:topic/:subtopic/summary" element={<Sidebar currentPage={"summary"} children={<Summary />}/>} />
        <Route path="/:topic/:subtopic/quiz" element={<Sidebar currentPage={"quiz"} children={<Quiz />}/>} />
        {/* Fallback 404 handler if no route matches */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      

    )
};