import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

import {
  Brain,
  Globe,
  Cpu,
  FileText,
  HelpCircle,
  Target
 
} from "lucide-react";


import FlowCard from "../components/Landing/FlowCard.jsx";
import TopicBadge from "../components/Landing/TopicBadge.jsx";
import InfoCard from "../components/Landing/InfoCard.jsx";

import "./Landing.css";

export default function Landing() {
  const topics = [
    "Arrays",
    "React Hooks",
    "Operating Systems",
    "Networking",
    "Database Management",
  ];

  return (
    <main className="landing-container">

      {/* Header */}
      <header className="landing-header">
       
            <Link to="/" className="brand-logo">
  <div className="brand-icon">
    <Brain size={21} color="white" />
  </div>

  <h2 class="text-4xl font-extrabold tracking-tight leading-tight text-slate-900">AI-STUDY-COPILOT</h2>
</Link>

        <nav className="header-nav">
          <Link to="/login">
            <button type="button">Login</button>
          </Link>

          <Link to="/signup">
            <button type="button">Signup</button>
          </Link>

           <Link to="/signup">
    <button
      type="button"
      className="nav-btn nav-btn-primary"
    >
      Get Started
    </button>
  </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">

        {/* Hero Content */}
        <article className="hero-content">

          <div className="hero-text">

            <Link to="/" className="brand-logo">
  <div className="brand-icon">
    <Brain size={18} color="white" />
  </div>

  <span>AI-STUDY-COPILOT</span>
</Link>

            <h1>
              Transform Your Study Sessions Into Smart Learning Resources
            </h1>

            <p>
              AI automatically tracks educational browsing activity,
              organizes learning topics, generates concise summaries,
              and creates revision quizzes.
            </p>

          </div>

          <div className="hero-buttons">
            <Link to="/signup">
              <button type="button">
                Get Started
              </button>
            </Link>

            <Link to="/login">
              <button type="button">
                Login
              </button>
            </Link>
          </div>

        </article>

        {/* Side Card + Animation */}
        <aside className="hero-illustration">

          <section className="flow-card-container">

            <FlowCard
              icon={<Globe size={16} color="white" />}
              label="Browser Activity"
              color="#6B7280"
            />

            <FlowCard
              icon={<Cpu size={16} color="white" />}
              label="Topic Detection"
              color="#06B6D4"
            />

            <FlowCard
              icon={<FileText size={16} color="white" />}
              label="AI Summary"
              color="#DC2626"
            />

            <FlowCard
              icon={<HelpCircle size={16} color="white" />}
              label="Quiz Generation"
              color="#22C55E"
            />

          </section>

          <section className="topic-badge-container">

            {topics.map((topic, index) => (
              <TopicBadge
                key={topic}
                name={topic}
                delay={index * 0.3}
              />
            ))}

          </section>

        </aside>

      </section>

      {/* Features Section */}
      <section className="features-section">

        <header className="features-heading">

          <h2>
            Everything You Need To Study Smarter
          </h2>

          <p>
            Three powerful features that transform how you learn.
          </p>

        </header>

        <section className="features-grid">

          <InfoCard
  icon={<Target size={22} color="red" />}
  heading1="Track Learning"
  heading2="Monitor study activity automatically using your browser extension. Every article, tutorial, and documentation page is captured and organized."
/>

<InfoCard
  icon={<FileText size={22} color="green" />}
  heading1="AI Summaries"
  heading2="Convert hours of study into concise, structured notes. Our AI distills complex topics into clear, readable summaries."
/>

<InfoCard
  icon={<HelpCircle size={22} color="pink" />}
  heading1="Smart Revision"
  heading2="Generate quizzes instantly from tracked topics. Test your knowledge and reinforce learning with auto-generated questions."
/>

        </section>

      </section>

      {/* CTA Section */}
      <section className="cta-section">

        <header className="cta-content">

          <h2>
            Ready To Study Smarter?
          </h2>

          <p>
            Join thousands of students who have transformed
            their learning journey.
          </p>

        </header>

        <div className="cta-buttons">

          <Link to="/signup">
            <button type="button">
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button type="button">
              Login
            </button>
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="landing-footer">

        <div className="footer-brand">
          <div className="footer-brand">

  <div className="brand-icon">
    <Brain size={16} color="white" />
  </div>

  <span>AI-STUDY-COPILOT</span>

</div>
        </div>

        <p className="footer-text">
          © 2026 AI-Study Copilot. All rights reserved.
        </p>

      </footer>

    </main>
  );
}