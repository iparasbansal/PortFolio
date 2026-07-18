import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  ArrowRight, 
  ExternalLink,
  Code,
  Volume2,
  VolumeX,
  Server,
  Cpu,
  Brain,
  ShoppingBag,
  Info,
  ChevronDown,
  Mail,
  GraduationCap,
  User,
  Zap,
  Award,
  BookOpen
} from 'lucide-react';
import synth from './audio';
import ScrollConstellation from './ScrollConstellation';
import TiltCard from './TiltCard';
import ScrollMarquee from './ScrollMarquee';
import AcoSimulation from './AcoSimulation';
import PhysicsSandbox from './PhysicsSandbox';
import Reveal from './Reveal';

interface Project {
  id: number;
  title: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  tech: string[];
  stats: string[];
  color: string;
  icon: any;
  image?: string;
  github: string;
  vercel?: string;
}

interface Stat {
  id: string;
  label: string;
  logo: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

interface MainframePortfolioProps {
  personalInfo: {
    name: string;
    role: string;
    tagline: string;
    email: string;
    phone: string;
    socials: Record<string, string>;
  };
  projects: Project[];
  stats: Stat[];
  skills: string[];
  socials: Record<string, string>;
  theme: string;
  toggleTheme: () => void;
}

// Custom typewriter hook
export function useTypewriter(text: string, speed: number = 38, startDelay: number = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    let intervalId: ReturnType<typeof setInterval>;
    
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < text.length) {
          const char = text.charAt(index);
          setDisplayed((prev) => prev + char);
          index++;
        } else {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function MainframePortfolio({ 
  personalInfo, 
  projects, 
  stats, 
  skills, 
  socials,
  theme,
  toggleTheme
}: MainframePortfolioProps) {
  const [audioMuted, setAudioMuted] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [bootingProject, setBootingProject] = useState<Project | null>(null);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [showBento, setShowBento] = useState(false);

  // Hover state to trigger physics node impulse fountaining
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Link destinations for platform ratings
  const STAT_LINKS: Record<string, string> = {
    cf: "https://codeforces.com/profile/parasbansal",
    cc: "https://www.codechef.com/users/iparasbansal",
    lc: "https://leetcode.com/u/iparasbansal/",
    jee: "https://nta.ac.in",
  };

  const { displayed, done } = useTypewriter(
    "Synthesizing credentials... Paras Bansal is loaded. Systems operating normally. Ready to compile your requirements.",
    30,
    800
  );

  useEffect(() => {
    setShowBento(true);
  }, []);

  const handleSoundToggle = () => {
    const nextState = !audioMuted;
    setAudioMuted(nextState);
    synth.setMute(nextState);
    if (!nextState) {
      synth.playClick();
      showToast("Audio feedback initialized");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyEmail = () => {
    synth.playClick();
    navigator.clipboard.writeText(personalInfo.email)
      .then(() => {
        showToast("Email copied to clipboard!");
      })
      .catch(() => {
        showToast("Could not copy email");
      });
  };

  const scrollToSection = (id: string) => {
    synth.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProjectClick = (project: Project) => {
    synth.playClick();
    setBootingProject(project);
    setBootLogs([]);
    
    // Custom simulated compile steps
    const logs = [
      `[SYS_BOOT] INITIALIZING SECURE COMPILER CONSOLE...`,
      `[SYS_PARSE] TARGETING PACKAGE: ${project.title.toUpperCase()}`,
      `[SYS_RESOLVE] LOADED ARCHITECTURE: ${project.category}`,
      `[SYS_LINK] BUNDLING ELEMENTS: ${project.tech.slice(0, 3).join(', ').toUpperCase()}`,
      `[SYS_COMPILE] COMPILING IN 60FPS VECTOR MATRIX...`,
      `[SYS_SUCCESS] PIPELINE STABLE. DISPATCHING GRAPHICAL DETAILS.`
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setBootLogs(prev => [...prev, log]);
        synth.playHover();
        
        if (idx === logs.length - 1) {
          setTimeout(() => {
            setBootingProject(null);
            setActiveProject(project);
          }, 400);
        }
      }, (idx + 1) * 220);
    });
  };

  return (
    <div 
      className={`relative w-full min-h-screen overflow-x-hidden p-4 sm:p-6 md:p-8 flex flex-col justify-between transition-colors duration-500 select-none ${
        theme === 'dark' ? 'text-white bg-[#020617]' : 'text-slate-900 bg-slate-50'
      }`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* 3D scroll-parallax vector background */}
      <ScrollConstellation />
      
      {/* Film grain noise filter */}
      <div className="noise-overlay" />

      {/* HEADER NAVBAR (fixed, z-index: 40 - sits behind overlay panels) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center backdrop-blur-md border-b transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#020617]/40 border-white/5' : 'bg-slate-50/40 border-slate-200/50'
      }`}>
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-[16px] shadow-lg shadow-emerald-500/20">
            PB
          </div>
          <div className="flex flex-col">
            <span 
              className="text-[17px] sm:text-[20px] tracking-tight leading-none text-current"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Paras Bansal®
            </span>
            <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-500 mt-1">
              SYSTEMS ARCHITECT
            </span>
          </div>
          <span className="text-[20px] text-current select-none leading-none group-hover:rotate-45 transition-transform duration-300">
            ✳︎
          </span>
        </div>

        {/* Navigation links capsule */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono">
          <span onClick={() => scrollToSection('stats')} className="hover:text-emerald-400 transition-colors cursor-pointer">STATS</span>
          <span onClick={() => scrollToSection('journey')} className="hover:text-emerald-400 transition-colors cursor-pointer">JOURNEY</span>
          <span onClick={() => scrollToSection('achievements')} className="hover:text-emerald-400 transition-colors cursor-pointer">ACHIEVEMENTS</span>
          <span onClick={() => scrollToSection('projects')} className="hover:text-emerald-400 transition-colors cursor-pointer">PROJECTS</span>
          <span onClick={() => scrollToSection('skills')} className="hover:text-emerald-400 transition-colors cursor-pointer">SKILLS</span>
          <span onClick={() => scrollToSection('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">CONTACT</span>
        </div>

        {/* Action controls capsule */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${
          theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white/70 border-slate-200'
        }`}>
          {/* Sound Synthesizer toggle */}
          <button 
            onClick={handleSoundToggle}
            onMouseEnter={() => synth.playHover()}
            className={`p-1.5 rounded-full transition-colors cursor-pointer focus:outline-none ${
              audioMuted ? 'text-slate-400 hover:text-white' : 'text-emerald-400 bg-emerald-500/10'
            }`}
            title={audioMuted ? 'Unmute Synthetic Sounds' : 'Mute Sounds'}
          >
            {audioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <span className="w-[1px] h-4 bg-current/10 mx-1" />

          {/* Theme toggles */}
          <button 
            onClick={() => {
              synth.playClick();
              toggleTheme();
            }}
            onMouseEnter={() => synth.playHover()}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              theme === 'dark' ? 'text-yellow-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6.36 6.36 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            )}
          </button>

          <span className="w-[1px] h-4 bg-current/10 mx-1" />

          {/* Quick social links */}
          <a 
            href={socials.linkedin} 
            target="_blank" 
            rel="noreferrer" 
            onMouseEnter={() => synth.playHover()}
            className="p-1.5 rounded-full hover:text-blue-400 transition-colors"
          >
            <Linkedin size={15} />
          </a>
          <a 
            href={socials.github} 
            target="_blank" 
            rel="noreferrer" 
            onMouseEnter={() => synth.playHover()}
            className="p-1.5 rounded-full hover:text-emerald-400 transition-colors"
          >
            <Github size={15} />
          </a>
        </div>
      </nav>

      {/* LONG SCROLLING LAYOUT */}
      <div className="relative z-20 w-full max-w-7xl mx-auto space-y-32 mt-28 mb-16">
        
        {/* SECTION 1: HERO CONTAINER */}
        <header className="min-h-[80vh] flex flex-col justify-center py-6">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Typography & Action Buttons */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                AVAILABLE_FOR_HIRE // DEPLOY_STABLE
              </div>

              {/* Kinetic typography heading */}
              <h1 
                className="text-[52px] sm:text-[72px] md:text-[92px] leading-[0.9] tracking-tighter text-current"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                CODE.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                  COMPILE.
                </span><br />
                CONQUER.
              </h1>

              {/* Typewriter text output */}
              <p 
                className="text-current/90 font-light max-w-xl font-mono leading-relaxed"
                style={{
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  minHeight: '66px'
                }}
              >
                {displayed}
                {!done && (
                  <span className="inline-block w-[2px] h-[1.1em] bg-current align-middle ml-[2px] animate-blink" />
                )}
              </p>

              {/* Action Jumps */}
              <div 
                className={`flex flex-wrap gap-2 transition-all duration-500 ease-out transform ${
                  showBento ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="px-4 py-2 border border-current/15 rounded-full text-xs font-semibold hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm focus:outline-none"
                >
                  View Labs / Projects <ArrowRight size={12} />
                </button>
                <button 
                  onClick={() => scrollToSection('stats')}
                  className="px-4 py-2 border border-current/15 rounded-full text-xs font-semibold hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer focus:outline-none"
                >
                  Competitive Coding
                </button>
                <button 
                  onClick={() => scrollToSection('skills')}
                  className="px-4 py-2 border border-current/15 rounded-full text-xs font-semibold hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer focus:outline-none"
                >
                  Technical Stack
                </button>
                <button 
                  onClick={copyEmail}
                  className="px-4 py-2 bg-white text-slate-950 border border-black/10 rounded-full text-xs font-semibold hover:bg-slate-950 hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                  Send a Hello
                </button>
              </div>
            </div>

            {/* Right Column: 3D Tilting Brand Mockup */}
            <div className="hidden lg:flex lg:col-span-4 justify-center relative">
              <TiltCard className="w-80 h-80 rounded-[2.5rem] overflow-hidden border-2 shadow-2xl relative bg-slate-950">
                <img 
                  src="/Paras_Bansal_Branding.jpg" 
                  alt="Paras Bansal Portrait" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  style={{ objectPosition: 'center 20%' }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-40" />
              </TiltCard>
            </div>

          </div>

          <div className="flex justify-center mt-12 animate-bounce">
            <button onClick={() => scrollToSection('stats')} className="p-2 rounded-full border border-current/10 opacity-50 hover:opacity-100 transition-opacity focus:outline-none">
              <ChevronDown size={20} />
            </button>
          </div>
        </header>

        {/* SECTION 2: COMPETITIVE PROGRAMMING STATS */}
        <section id="stats" className="scroll-mt-24 space-y-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Live API Feeds</span>
                <h2 className="text-[28px] sm:text-[34px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Competitive Coding Metrics
                </h2>
              </div>
              <p className="text-xs max-w-xs font-light opacity-60">
                Dynamic statistics gathered from platform profiles, global scores, and exam percentiles. Click cards to view profiles.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const badgeText = 
                stat.id === 'cf' ? '[SPECIALIST]' : 
                stat.id === 'lc' ? '[KNIGHT]' : 
                stat.id === 'cc' ? '[4-STAR]' : 
                '[AIR_3341]';

              return (
                <Reveal key={stat.id} delay={idx * 100}>
                  <a 
                    href={STAT_LINKS[stat.id]} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => synth.playClick()}
                    onMouseEnter={() => synth.playHover()}
                    className="block group"
                  >
                    <TiltCard className="p-6 h-[200px] flex flex-col justify-between rounded-3xl hover:border-emerald-500/50 hover:shadow-emerald-500/5 transition-all">
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200/50'} border border-current/10 flex items-center justify-center`}>
                          <img 
                            src={stat.logo} 
                            alt={stat.label} 
                            className={`w-6 h-6 object-contain ${
                              stat.id === 'cc' ? 'scale-125' : stat.id === 'jee' ? 'scale-150' : 'scale-100'
                            }`}
                          />
                        </div>
                        <span className="text-[8px] font-mono opacity-40">0{idx+1} // STAT</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-emerald-500 block">
                          {stat.label}
                        </span>
                        
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-current" style={{ fontFamily: 'var(--font-heading)' }}>
                            {stat.value}
                          </h3>
                          <span className="text-[8px] sm:text-[9px] font-mono border border-current/10 px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/5">
                            {badgeText}
                          </span>
                        </div>
                        
                        <p className="text-[10px] opacity-50 truncate leading-none mt-1 font-mono">{stat.sub}</p>
                      </div>
                    </TiltCard>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: THE JOURNEY (Enriched with 4 cards and logos) */}
        <section id="journey" className="scroll-mt-24 space-y-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Academic Path</span>
                <h2 className="text-[28px] sm:text-[34px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  The Journey
                </h2>
              </div>
              <p className="text-xs max-w-xs font-light opacity-60">
                Detailed timeline mapping university degree, schooling milestones, and student leadership records.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: IIIT Allahabad (with logo) */}
            <Reveal delay={100}>
              <TiltCard className="p-6 h-[220px] flex flex-col justify-between rounded-3xl relative overflow-hidden">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono opacity-40 flex items-center gap-1"><GraduationCap size={10} /> 01 // UNIVERSITY</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">CGPA: 9.00</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-md p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                      <img src="/logo.jpeg" alt="IIIT Allahabad Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>IIIT Allahabad</h3>
                      <p className="text-xs opacity-70 font-mono">B.Tech in Information Technology</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs opacity-50 mt-2 font-mono">
                  <span>2024 - 2028 // SESSION</span>
                  <span>ALLAHABAD, IN</span>
                </div>
              </TiltCard>
            </Reveal>

            {/* Card 2: XII CBSE Board school details */}
            <Reveal delay={200}>
              <TiltCard className="p-6 h-[220px] flex flex-col justify-between rounded-3xl">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono opacity-40 flex items-center gap-1"><BookOpen size={10} /> 02 // HIGHER SECONDARY</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded">CBSE XII: 94.6%</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-5" style={{ fontFamily: 'var(--font-heading)' }}>Golden Earth Global School</h3>
                  <p className="text-xs opacity-75 mt-1 font-mono">Non-Medical Sciences (Physics, Chemistry, Maths)</p>
                </div>
                <div className="flex justify-between items-center text-xs opacity-50 mt-2 font-mono">
                  <span>2022 - 2024 // SESSION</span>
                  <span>CBSE AFFILIATED</span>
                </div>
              </TiltCard>
            </Reveal>

            {/* Card 3: X CBSE Board details */}
            <Reveal delay={300}>
              <TiltCard className="p-6 h-[220px] flex flex-col justify-between rounded-3xl">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono opacity-40 flex items-center gap-1"><BookOpen size={10} /> 03 // MATRICULATION</span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded">CBSE X: 97.0%</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-5" style={{ fontFamily: 'var(--font-heading)' }}>Golden Earth Global School</h3>
                  <p className="text-xs opacity-75 mt-1 font-mono">General Sciences & Mathematics</p>
                </div>
                <div className="flex justify-between items-center text-xs opacity-50 mt-2 font-mono">
                  <span>2020 - 2022 // SESSION</span>
                  <span>CBSE ACADEMIC</span>
                </div>
              </TiltCard>
            </Reveal>

            {/* Card 4: Leadership Node */}
            <Reveal delay={400}>
              <TiltCard className="p-6 h-[220px] flex flex-col justify-between rounded-3xl">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono opacity-40 flex items-center gap-1"><User size={10} /> 04 // LEADERSHIP</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded">COUNCIL HEAD</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-5" style={{ fontFamily: 'var(--font-heading)' }}>Head Boy / President</h3>
                  <p className="text-xs opacity-75 mt-1 font-mono">Golden Earth Global School</p>
                </div>
                <p className="text-xs opacity-60 font-light leading-relaxed">
                  Elected to lead a 35-member student council body, organizing inter-school sports meets and coordinating student welfare.
                </p>
              </TiltCard>
            </Reveal>
          </div>

          {/* Philosophy and Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Reveal delay={500}>
              <div className={`p-6 rounded-3xl border glowing-panel flex flex-col justify-between h-[160px] ${
                theme === 'dark' ? 'border-white/5 bg-[#020617]/40' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h4 className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-2">
                    ✳︎ THE PHILOSOPHY
                  </h4>
                  <p className="text-xs opacity-75 mt-3 leading-relaxed font-light">
                    My engineering philosophy is simple: write code that is clean, highly optimized, and structurally sound. Every algorithm solved and system compiled is an opportunity to scale.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={600}>
              <div className={`p-6 rounded-3xl border glowing-panel flex flex-col justify-between h-[160px] ${
                theme === 'dark' ? 'border-white/5 bg-[#020617]/40' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h4 className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-2">
                    ✳︎ THE VISION
                  </h4>
                  <p className="text-xs opacity-75 mt-3 leading-relaxed font-light">
                    Turn technical capacity and complex database operations into secure, stable systems that address core user experiences and handle enterprise-grade request loads.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 4: ACHIEVEMENTS MATRIX */}
        <section id="achievements" className="scroll-mt-24 space-y-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Milestones</span>
                <h2 className="text-[28px] sm:text-[34px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Key Achievements
                </h2>
              </div>
              <p className="text-xs max-w-xs font-light opacity-60">
                A structured overview of platform contest ratings, exam percentiles, and academic statistics.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Reveal delay={100}>
              <TiltCard className="p-6 h-[180px] flex flex-col justify-between rounded-3xl">
                <span className="text-[8px] font-mono opacity-40">01 // CODEFORCES</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Expert Rating: 1710</h4>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    Codeforces Expert (Top 5% globally). Ranked <span className="text-emerald-400 font-semibold font-mono">830 / 91,904+</span> programmers in India. Best contest rank 451 in Round 1066.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={200}>
              <TiltCard className="p-6 h-[180px] flex flex-col justify-between rounded-3xl">
                <span className="text-[8px] font-mono opacity-40">02 // CODECHEF</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Global Rank 93</h4>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    Achieved <span className="text-white font-semibold font-mono">Global Rank 93</span> in CodeChef Starters 224 contest against thousands of concurrent participants.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={300}>
              <TiltCard className="p-6 h-[180px] flex flex-col justify-between rounded-3xl">
                <span className="text-[8px] font-mono opacity-40">03 // LEETCODE</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Global Rank 38</h4>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    Secured <span className="text-white font-semibold font-mono">Global Rank 38</span> in Weekly Contest 484. Solved <span className="text-emerald-400 font-semibold font-mono">1100+</span> complex structures.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={400}>
              <TiltCard className="p-6 h-[180px] flex flex-col justify-between rounded-3xl">
                <span className="text-[8px] font-mono opacity-40">04 // JES ENTRANCE</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>AIR 3341 (JEE Main)</h4>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    JEE Main 2024: <span className="text-cyan-400 font-semibold font-mono">99.8 Percentile</span> (Rank 3341 out of 1.4M candidates). JEE Advanced 2024: All India Rank 9232.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={500}>
              <TiltCard className="p-6 h-[180px] flex flex-col justify-between rounded-3xl">
                <span className="text-[8px] font-mono opacity-40">05 // BOARD EXAMS</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>CBSE: 97% & 94.6%</h4>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    CBSE Class X: <span className="text-white font-semibold font-mono">97%</span> overall score. CBSE Class XII: <span className="text-white font-semibold font-mono">94.6%</span> overall score.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={600}>
              <TiltCard className="p-6 h-[180px] flex flex-col justify-between rounded-3xl">
                <span className="text-[8px] font-mono opacity-40">06 // PROBLEM SOLVING</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>1100+ Algorithms</h4>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    Demonstrated fluency across Graphs, Dynamic Programming, Segment Trees, and Greedy heuristics under extreme time constraints.
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </section>

        {/* SECTION 5: KINETIC VELOCITY MARQUEE */}
        <section className="py-4 border-y border-current/5">
          <ScrollMarquee items={skills} />
        </section>

        {/* SECTION 6: PROJECTS / LABS BOARD (3D Tilts, compile simulator triggers, visual screenshot mock overlays) */}
        <section id="projects" className="scroll-mt-24 space-y-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Deployments</span>
                <h2 className="text-[28px] sm:text-[34px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Interactive Labs Console
                </h2>
              </div>
              <p className="text-xs max-w-xs font-light opacity-60">
                Functional systems showing code-typings, simulated pheromone paths, and storefront showcase mockups. Click cards to compile.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <Reveal key={project.id} delay={idx * 150}>
                <div onClick={() => handleProjectClick(project)} className="group cursor-pointer">
                  <TiltCard className="p-6 h-[260px] flex flex-row gap-4 items-stretch justify-between rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all">
                    
                    {/* Left detailed panel (65% width) */}
                    <div className="flex flex-col justify-between flex-1 pr-2 max-w-[65%]">
                      <div>
                        <span className="text-[8px] font-mono uppercase tracking-wider opacity-50 block mb-1">
                          {project.category}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold leading-tight truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                          {project.title}
                        </h3>
                        <p className="text-xs opacity-70 mt-2 font-light line-clamp-3 leading-relaxed">
                          {project.shortDesc}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tech.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-[8px] font-mono bg-current/5 border border-current/5 rounded px-2 py-0.5">
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="text-[8px] font-mono opacity-50 px-1 py-0.5">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right screenshot panel (35% width, 3D perspective skewed) */}
                    <div className="w-[35%] flex items-center justify-center relative select-none pointer-events-none">
                      <div 
                        className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:rotate-y-0 transform"
                        style={{
                          perspective: '600px',
                          transform: 'rotateY(-18deg) rotateX(10deg) scale(1.02)'
                        }}
                      >
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-current/30 text-[9px] font-mono">
                            <Code size={16} />
                            <span>NO_IMG</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SECTION 7: TECHNICAL INVENTORY GRID (Interactive colliders linked to grid hovers) */}
        <section id="skills" className="scroll-mt-24 space-y-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Core Inventory</span>
                <h2 className="text-[28px] sm:text-[34px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Studio Technologies
                </h2>
              </div>
              <p className="text-xs max-w-xs font-light opacity-60">
                Hover over the skill badges on the right to shoot their corresponding rigid-body balls inside the physics sandbox on the left!
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left box: Physics sandbox badge container */}
            <div className="lg:col-span-5 h-[340px] rounded-3xl glowing-panel border overflow-hidden relative">
              <PhysicsSandbox skills={skills} hoveredSkill={hoveredSkill} />
            </div>

            {/* Right box: Grid layout of skill capsules */}
            <div className={`lg:col-span-7 p-6 rounded-3xl border glowing-panel flex flex-col justify-between ${
              theme === 'dark' ? 'border-white/5' : 'border-slate-200'
            }`}>
              <div className="flex flex-wrap gap-2 text-xs">
                {skills.map((skill, index) => (
                  <span 
                    key={index}
                    onMouseEnter={() => {
                      setHoveredSkill(skill);
                    }}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`px-3 py-1.5 border rounded-lg cursor-default transition-all ${
                      hoveredSkill === skill
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 scale-[1.02]'
                        : theme === 'dark' 
                          ? 'border-white/5 bg-white/[0.01] hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-400' 
                          : 'border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-950'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: CONTACT TRANSMISSION FORM */}
        <section id="contact" className="scroll-mt-24 space-y-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Transmission</span>
                <h2 className="text-[28px] sm:text-[34px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Secure Connection
                </h2>
              </div>
              <p className="text-xs max-w-xs font-light opacity-60">
                Submit requirements directly to my node coordinates or copy links to compile contact.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Details panel */}
            <div className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border glowing-panel flex flex-col justify-between ${
              theme === 'dark' ? 'border-white/5 bg-[#020617]/50' : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Paras Bansal
                  </h4>
                  <p className="text-xs text-emerald-500 font-mono mt-0.5">heyparasbansal@gmail.com</p>
                  <p className="text-xs opacity-60 mt-1 font-mono">{personalInfo.phone}</p>
                </div>

                <div className="space-y-2 text-xs font-light opacity-80 leading-relaxed font-mono">
                  <p>SYSTEM_COORD: 32.72° N, 74.85° E</p>
                  <p>STATUS: ACTIVE_FOR_COLLEAGUE_LINKING</p>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={copyEmail}
                  className="w-full py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 focus:outline-none"
                >
                  <Mail size={14} /> Copy Connection Email
                </button>
              </div>
            </div>

            {/* Form grid */}
            <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border glowing-panel ${
              theme === 'dark' ? 'border-white/5 bg-[#020617]/50' : 'bg-white border-slate-200'
            }`}>
              <form onSubmit={(e) => { e.preventDefault(); showToast("Transmission simulation sent!"); }} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="opacity-50 text-[10px]">NAME</label>
                    <input 
                      type="text" 
                      placeholder="Ident Name" 
                      required
                      className="w-full bg-black/10 dark:bg-white/5 border border-current/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="opacity-50 text-[10px]">EMAIL</label>
                    <input 
                      type="email" 
                      placeholder="Ident Coordinates" 
                      required
                      className="w-full bg-black/10 dark:bg-white/5 border border-current/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="opacity-50 text-[10px]">MESSAGE</label>
                  <textarea 
                    rows={4} 
                    placeholder="Payload details..." 
                    required
                    className="w-full bg-black/10 dark:bg-white/5 border border-current/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-6 py-3 border border-current/10 hover:bg-current hover:text-slate-950 transition-all rounded-xl cursor-pointer font-bold focus:outline-none"
                >
                  Compile & Transmit Message
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono opacity-40 border-t border-current/5 pt-4 mt-16">
        <span>© 2026 Paras Bansal. Redesigned under NEURAL-OS.</span>
        <span>SYS_COORD // HASH_004fA829 // LOCAL_NODE // STABLE</span>
      </footer>

      {/* COMPILER TERMINAL OVERLAY (z-100: Frontmost Layer) */}
      {bootingProject && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black border border-emerald-500/20 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-3">
              <span className="text-emerald-400 font-bold">ALGORITHMIC COMPILER // v1.0.4</span>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>
            <div className="space-y-2 text-emerald-500/80 min-h-[140px] flex flex-col justify-end">
              {bootLogs.map((log, idx) => (
                <div key={idx} className="animate-fade-in">{log}</div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-500/40">
              <span className="w-1.5 h-3 bg-emerald-500 animate-pulse" />
              <span>WAITING FOR PIPELINE RESOLVER...</span>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT DETAILS DRAWER SLIDE OVER (Backdrop z-80, Drawer z-90: Frontmost layered) */}
      <div 
        onClick={() => setActiveProject(null)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 z-[80] ${
          activeProject ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div 
        className={`fixed inset-y-0 right-0 z-[90] w-full sm:w-[480px] md:w-[620px] bg-slate-900 text-white border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-in-out transform ${
          activeProject ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {activeProject && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-500 tracking-wider">
                  {activeProject.category}
                </span>
                <h4 className="text-[20px] font-medium mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                  {activeProject.title}
                </h4>
              </div>
              <button 
                onClick={() => {
                  synth.playClick();
                  setActiveProject(null);
                }}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-colors duration-200 cursor-pointer focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* If ACO simulation, show interactive visualizer */}
              {activeProject.id === 3 ? (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Info size={12} /> Live Mathematical Optimization Running
                  </h5>
                  <AcoSimulation />
                </div>
              ) : (
                <div className="relative rounded-2xl aspect-video overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center">
                  {activeProject.image ? (
                    <img 
                      src={activeProject.image} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-35 text-xs font-mono">
                      <Code size={24} />
                      <span>Graphics Renderer Loaded</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-[#020617]/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[9px] font-mono tracking-wide">
                    STABLE // SECURE
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-white/40">Overview</h5>
                <p className="text-sm font-light text-white/80 leading-relaxed">
                  {activeProject.longDesc || activeProject.shortDesc}
                </p>
              </div>

              <hr className="border-white/5" />

              {/* Metrics */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-white/40">Core Metrics</h5>
                <div className="grid grid-cols-3 gap-3">
                  {activeProject.stats.map((statVal, idx) => (
                    <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                      <span className="text-[9px] font-mono uppercase text-emerald-400 block mb-1">0{idx+1} // PARAM</span>
                      <span className="text-[11px] font-medium leading-none block truncate">{statVal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-white/5" />

              {/* Tech tags */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-white/40">Architectural Elements</h5>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.tech.map((t, i) => (
                    <span key={i} className="text-xs font-mono px-3 py-1 bg-white/5 border border-white/5 rounded-full text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-white/5 bg-slate-950 flex gap-4">
              <a 
                href={activeProject.github} 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={() => synth.playHover()}
                onClick={() => synth.playClick()}
                className="flex-1 flex justify-center items-center gap-2 py-3 border border-white/10 rounded-xl text-xs font-medium hover:bg-white hover:text-slate-950 transition-all cursor-pointer"
              >
                <Github size={14} /> Source Code
              </a>
              {activeProject.vercel && activeProject.vercel !== '#/mainframe' && (
                <a 
                  href={activeProject.vercel} 
                  target="_blank" 
                  rel="noreferrer"
                  onMouseEnter={() => synth.playHover()}
                  onClick={() => synth.playClick()}
                  className="flex-1 flex justify-center items-center gap-2 py-3 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:scale-[1.02] transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  <ExternalLink size={14} /> Deploy View
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating toast (z-110: top level) */}
      <div 
        className={`fixed bottom-5 right-5 z-[110] bg-black text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 transition-all duration-300 transform ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>{toastMessage}</span>
      </div>

      {/* Floating fallback route button to load original portfolio */}
      <div className="fixed bottom-4 left-4 z-30 pointer-events-auto">
        <button 
          onClick={() => {
            synth.playClick();
            window.location.hash = '#/portfolio';
          }}
          onMouseEnter={() => synth.playHover()}
          className="flex items-center gap-2 bg-black/80 hover:bg-black text-white px-3 py-2 rounded-full text-xs font-medium border border-white/10 backdrop-blur-sm transition-all duration-200 shadow-md cursor-pointer hover:scale-105 focus:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
          </svg>
          Original Layout
        </button>
      </div>
    </div>
  );
}
