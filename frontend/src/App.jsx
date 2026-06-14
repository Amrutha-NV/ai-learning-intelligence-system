import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import NotFound from './pages/NotFound.jsx';
export default function App(){
    return(
        <Routes>
        <Route path="/" element={<Landing />} />
        {/* Fallback 404 handler if no route matches */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      

    )
};