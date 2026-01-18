import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Code, 
  Zap, 
  ArrowRight, 
  Layout, 
  Server, 
  Moon,
  Sun,
  X,
  Maximize2,
  GraduationCap,
  Phone,
  FileText,
  User,
  Lightbulb,
  Cpu,
  Globe,
  ShoppingBag,
  Brain
} from 'lucide-react';

// --- 1. DATA CONSTANTS ---

const PERSONAL_INFO = {
  name: "Paras Bansal",
  role: "System Architect & Engineer",
  tagline: "Building the digital nervous system of tomorrow.",
  email: "parasb736@gmail.com",
  phone: "+91 7889099620",
  socials: {
    github: "https://github.com/iparasbansal",
    linkedin: "https://linkedin.com/in/iparasbansal",
  }
};

const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/iparasbansal",
  github: "https://github.com/iparasbansal",
  codeforces: "https://codeforces.com/profile/parasbansal",
  codechef: "https://www.codechef.com/users/i_parasbansal",
  leetcode: "https://leetcode.com/u/iparasbansal/",
};

const STAT_LINKS = {
  cf: "https://codeforces.com/profile/parasbansal",
  cc: "https://www.codechef.com/users/i_parasbansal",
  jee: "https://drive.google.com/file/d/16IkiFU5WDgzbdmb2oUR-64noGpa6vkcg/view?usp=share_link",
  lc: "https://leetcode.com/u/iparasbansal/",
};

const HANDLES = {
  codeforces: "parasbansal", 
  codechef: "i_parasbansal",
  leetcode: "iparasbansal"
};

// Initial Stats
const INITIAL_STATS = [
 {
  id: 'cf',
  label: "Codeforces",
  logo: "/code-forces.svg",
  value: "1,510",
  sub: "Specialist",
  color: "text-cyan-400",
  bg: "bg-cyan-400/10",
},
  {
  id: 'cc',
  label: "CodeChef",
  logo: "/ccemoji2.webp",
  value: "1,751",
  sub: "3-Star",
  color: "text-cyan-400",
  bg: "bg-cyan-400/10",
},
{
  id: 'lc',
  label: "LeetCode",
  logo: "/LeetCode_logo_black.png",
  value: "1914",
  sub: "Knight",
  color: "text-amber-400",
  bg: "bg-cyan-400/10",
},
{
  id: 'jee',
  label: "JEE Main",
  logo: "/nta.png",
  value: "99.8%",
  sub: "Rank 3341 (Top 0.2%)",
  color: "text-amber-400",
  bg: "bg-cyan-400/10",
},

];

const PROJECTS = [
  {
  id: 1,
  title: "Samadhaan",
  category: "GovTech Architecture",
  shortDesc: "A scalable grievance management platform digitizing 12+ civic domains, built for high concurrency, low latency, and secure RBAC-based operations.",
  longDesc: "A digital governance powerhouse designed to bridge the gap between citizens and administration. Handles high-concurrency reporting via a custom Node.js event loop architecture. Features 3-tier JWT-based RBAC and Redis caching for sub-50ms query responses.",
  tech: ["React", "Node.js", "MongoDB", "Redis", "Docker"],
  stats: ["15+ REST APIs", "Real-time Socket.io", "RBAC Security"],
  color: "from-blue-600 to-cyan-500",
  icon: Server,
  image: "/samadhaan.png",
  github: "https://github.com/iparasbansal/Samadhaan",
},
  {
    id: 2,
    title: "Uni-Trade",
    category: "E-Commerce Platform",
    shortDesc: "A university-exclusive marketplace enabling secure peer-to-peer trading with verified users, category-based discovery, and keyword search.",
    longDesc: "Built a secure, closed-loop marketplace for 2,000+ university students. Optimized discovery with a 5-category filtering system and keyword-based search. Implemented institutional email verification to prevent spam and ensure a trusted community environment.",
    tech: ["Node.js", "EJS", "MySQL", "HTML/CSS"],
    stats: ["2,000+ Users", "300+ Items", "Secure Auth"],
    color: "from-purple-600 to-indigo-500",
    icon: ShoppingBag,
    image: "/unitrade.png",
    github: "https://github.com/iparasbansal/Uni-Trade",
  },
 {
  id: 3,
  title: "ACO Routing (WSN)",
  category: "Network Optimization",
  shortDesc: "An Ant Colony Optimization (ACO)-based routing algorithm for wireless sensor networks focused on energy efficiency.",
  longDesc: "A routing solution for Wireless Sensor Networks using Ant Colony Optimization principles to identify energy-efficient paths and improve network lifetime under resource constraints.",
  tech: ["Python", "NumPy", "Graph Theory", "ACO"],
  stats: ["Energy Efficient Routing", "WSN Simulation"],
  color: "from-rose-600 to-orange-500",
  icon: Brain,
  image: "/beamaco.png",
  github: "https://github.com/iparasbansal/beam-aco-energy-routing",
},
  {
    id: 4,
    title: "DineOut",
    category: "Desktop Engineering",
    shortDesc: "An OOPS-based desktop application for restaurant management, implementing modular design principles for efficient order and billing operations.",
    longDesc: "Engineered for speed. Unlike web apps, this Java Swing solution prioritizes O(1) interactions for busy restaurant staff. Built on strict SOLID principles with a custom MVC pattern that allows for hot-swappable database connectors without recompilation.",
    tech: ["Java Swing", "MVC", "MySQL", "Multi-threading"],
    stats: ["8% Rev Lift", "O(1) Lookup", "99.9% Uptime"],
    color: "from-emerald-600 to-teal-500",
    icon: Layout,
    image: "/dineout.png",
    github: "https://github.com/iparasbansal/OOPs-Project---DineOut-App",
  }
];

const SKILLS = [
  "C++", "C", "Java", "JavaScript", "Python",
  "HTML5", "CSS", "Git", "React.js", "Node.js", "Express.js",
  "MongoDB", "NumPy", "GitHub", "Linux","MySQL", "Docker",
  "Data Structures", "Algorithms", "Object Oriented Programming", "Database Management", "Operating Systems", "Computer Networks", "Theory Of Computation",
];

// --- 2. UTILS & HOOKS ---

const useTheme = () => {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return { theme, toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark') };
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const update = e => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);
  return mousePosition;
};

// --- 3. PRO COMPONENTS ---

const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#020617] opacity-100"></div>
    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-30 animate-aurora bg-[conic-gradient(from_0deg,transparent_0deg,#10b981_100deg,transparent_180deg,#3b82f6_280deg,transparent_360deg)] blur-[100px]"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 mix-blend-overlay"></div>
  </div>
);

const GhostCursor = () => {
  const { x, y } = useMousePosition();
  return (
    <>
      <style>{`@media (hover: hover) { body { cursor: none; } }`}</style>
      <div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block" style={{ transform: `translate(${x}px, ${y}px)` }}>
        <div className="w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(255,255,255,0.8)]"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out delay-75"></div>
      </div>
    </>
  );
};

const Reveal = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [delay]);

  return (
    <div ref={ref} className={`transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'} ${className}`}>
      {children}
    </div>
  );
};

// --- 4. MAIN APPLICATION ---

export default function Portfolio() {
  const { theme, toggleTheme } = useTheme();
  const [activeProject, setActiveProject] = useState(null);
  const [stats, setStats] = useState(INITIAL_STATS);

  // Live Stats Fetching Logic
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${HANDLES.codeforces}`);
        const cfData = await cfResponse.json();
        
        let newStats = [...INITIAL_STATS];

        if (cfData.status === "OK") {
          const user = cfData.result[0];
          const rating = user.rating;
          const rank = user.rank; 
          
          newStats = newStats.map(stat => {
            if (stat.id === 'cf') {
              return { 
                ...stat, 
                value: rating.toString(), 
                sub: `${rank.charAt(0).toUpperCase() + rank.slice(1)}` 
              };
            }
            return stat;
          });
        }

        setStats(newStats);

      } catch (error) {
        console.error("Failed to fetch live stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes aurora {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-aurora { animation: aurora 60s linear infinite; }
        
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-rtl { animation: scroll-rtl 40s linear infinite; }
        .animate-marquee-rtl:hover { animation-play-state: paused; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .glass-panel:hover {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {theme === 'dark' ? <AuroraBackground /> : <div className="fixed inset-0 bg-slate-50 z-0"></div>}
      <GhostCursor />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 shrink-0">PB</div>
            <div className="hidden sm:block">
              <div className={`font-bold text-lg tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Paras Bansal</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">Competitive Programmer</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:px-3 md:py-2 rounded-full glass-panel border border-white/10">
              
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="p-1.5 md:p-2 rounded-full hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                <Linkedin size={16} className="md:w-[18px] md:h-[18px]" />
              </a>

              <a href={SOCIAL_LINKS.codeforces} target="_blank" rel="noreferrer" className="px-2 py-1 md:px-3 md:py-1 rounded-full font-mono text-[10px] md:text-xs tracking-wide bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all">
                CF
              </a>

              <a href={SOCIAL_LINKS.codechef} target="_blank" rel="noreferrer" className="px-2 py-1 md:px-3 md:py-1 rounded-full font-mono text-[10px] md:text-xs tracking-wide bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                CC
              </a>

              <a href={SOCIAL_LINKS.leetcode} target="_blank" rel="noreferrer" className="px-2 py-1 md:px-3 md:py-1 rounded-full font-mono text-[10px] md:text-xs tracking-wide bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-all">
                LC
              </a>

              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="p-1.5 md:p-2 rounded-full hover:bg-white/10 hover:text-white transition-all">
                <Github size={16} className="md:w-[18px] md:h-[18px]" />
              </a>

            </div>

            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all shrink-0 ${theme === 'dark' ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-200 text-slate-600'}`}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="#contact" className="px-5 py-2 bg-white text-black font-bold text-sm rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] hidden md:block">
              Hire Me
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 md:pt-40 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 md:mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                Available for Hire
              </div>
            </Reveal>
            
            <Reveal delay={100}>
              <h1 className={`text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 md:mb-8 leading-[1] md:leading-[0.9] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Code.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">Compile.</span><br/>
                Conquer.
              </h1>
            </Reveal>
            
            <Reveal delay={200}>
              <p className={`text-lg md:text-2xl max-w-xl leading-relaxed mb-8 md:mb-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                I engineer <span className="text-white font-semibold">high-performance systems</span>. 
                My code runs fast, scales effortlessly, and solves problems others give up on.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#work" className="group relative px-8 py-4 bg-emerald-500 text-slate-950 font-bold text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] text-center">
                  <span className="relative z-10 flex items-center justify-center gap-2">View Projects <ArrowRight className="group-hover:translate-x-1 transition-transform"/></span>
                </a>
                <a href={PERSONAL_INFO.socials.github} target="_blank" className={`px-8 py-4 font-bold text-lg rounded-2xl border transition-all hover:bg-white/5 flex items-center justify-center gap-3 ${theme === 'dark' ? 'border-white/20 text-white' : 'border-slate-300 text-slate-900'}`}>
                  <Github /> GitHub
                </a>
              </div>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-center justify-center relative mt-10 lg:mt-0">
            <Reveal delay={400} className="relative z-10 w-full max-w-[260px] sm:max-w-[320px]">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-900 aspect-square group">
                 <img 
                   src="/Paras_Bansal_Branding.jpg" 
                   alt="Profile" 
                   className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                   style={{ objectPosition: 'center 20%' }} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-20"></div>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      {/* Stats Bar */}
      <div className={`relative z-10 border-y ${theme === 'dark' ? 'bg-slate-950/50 border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <Reveal key={i} delay={i * 100} className="flex items-center gap-4 md:gap-5 group cursor-default">
              <a
                href={STAT_LINKS[stat.id]}
                target="_blank"
                rel="noreferrer"
                className={`p-3 md:p-4 rounded-2xl ${stat.bg}
                  glass-panel
                  border border-white/10
                  hover:scale-110 hover:border-white/20
                  transition-all duration-300
                  flex items-center justify-center shrink-0`}
              >
                <img
                  src={stat.logo}
                  alt={stat.label}
                  className={`w-6 h-6 md:w-8 md:h-8 object-contain transition-transform duration-300 origin-center
                    ${stat.id === 'cc' ? 'scale-125' : stat.id === 'jee' ? 'scale-150' : 'scale-100'}`}
                />
              </a>
              <div>
                <h3 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-500 mb-0.5">{stat.label}</p>
                <p className="text-xs text-slate-500 font-mono">{stat.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Infinite Tech Marquee (Right to Left) */}
      <div className="relative z-10 py-12 md:py-16 overflow-hidden bg-slate-950 border-b border-white/5">
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-slate-950 to-transparent z-20"></div>
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-slate-950 to-transparent z-20"></div>
        <div className="flex whitespace-nowrap animate-marquee-rtl w-max hover:[animation-play-state:paused]">
          {[...SKILLS, ...SKILLS, ...SKILLS, ...SKILLS].map((skill, i) => (
            <div key={i} className="mx-2 md:mx-4 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-xs md:text-sm font-semibold hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default flex items-center gap-2 md:gap-3">
              <Cpu size={14} className="md:w-4 md:h-4" /> {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Journey Section */}
      <section className="relative z-10 py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-32">
              <h2 className={`text-4xl md:text-6xl font-extrabold mb-6 md:mb-8 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Journey.</span>
              </h2>
              <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6 md:space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 mt-1"><GraduationCap /></div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-white">IIIT Allahabad</h4>
                    <p className="text-slate-400 text-sm mt-1">B.Tech IT (2024-28)</p>
                    <p className="text-emerald-400 text-sm font-mono mt-2">CGPA: 8.89</p>
                  </div>
                </div>
                <div className="w-full h-px bg-white/10"></div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 mt-1"><User /></div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-white">Head Boy</h4>
                    <p className="text-slate-400 text-sm mt-1">Golden Earth Global School</p>
                    <p className="text-slate-500 text-xs mt-2">Led 35-member student council.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-white/10"></div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 mt-1"><Lightbulb /></div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-white">E-Cell Executive</h4>
                    <p className="text-slate-400 text-sm mt-1">Innovation & Startup Culture</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            <Reveal delay={200}>
               <div className="prose prose-lg prose-invert">
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-300">
                    I am <span className="text-emerald-400 font-bold">Paras Bansal</span>, a passionate undergraduate at <span className="text-white font-bold">IIIT Allahabad</span>. 
                    with a primary focus on Data Structures & Algorithms and Competitive Programming. I’ve solved 500+ algorithmic problems, building strong problem-solving skills and a performance-driven mindset.

Alongside CP, I work on backend engineering and scalable system design, applying algorithmic thinking to real-world applications using modern web technologies. I’m currently focused on system architecture, backend scalability, and writing clean, efficient code that scales.
                  </p>
               </div>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Lightbulb size={18} className="text-blue-400"/> The Philosophy</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    I believe in execution over ideas. My goal is to build value through technology, documenting my growth from developer to innovator committed to impactful creation.
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Globe size={18} className="text-emerald-400"/> The Vision</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Currently driving innovation as an E-Cell Executive. I aim to merge technical excellence with entrepreneurial strategy.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={400}>
               <p className="text-lg text-slate-400 leading-relaxed border-l-4 border-emerald-500 pl-6 italic">
                 "I consistently aim to build solutions that are efficient, scalable, and user-centric. For me, code is the tool, but impact is the goal."
               </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="relative z-10 py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-20">
          <Reveal>
            <h2 className={`text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Works</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {PROJECTS.map((project, idx) => (
            <Reveal
              key={project.id}
              delay={idx * 200}
              className={`group relative rounded-[2.5rem] transition-transform duration-500
              ${idx % 2 === 1 ? 'md:mt-24' : ''}`}
            >
              {/* Glow Border */}
              <div
                className={`pointer-events-none absolute -inset-[2px] rounded-[2.6rem]
                bg-gradient-to-br ${project.color}
                opacity-20 blur-xl
                group-hover:opacity-60 transition-opacity duration-500`}
              />

              {/* Card */}
              <div
                className={`relative h-auto md:h-[560px] min-h-[500px] rounded-[2.45rem] overflow-hidden flex flex-col transform-gpu transition-transform duration-500
                group-hover:-translate-y-2
                ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}
              >
                {/* Project Header */}
                <div
                  className={`relative h-48 overflow-hidden bg-gradient-to-br ${project.color}
                  flex items-center justify-center shrink-0`}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="flex items-center justify-center h-full w-full text-white/50"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>`;
                      }}
                    />
                  ) : (
                    <project.icon
                      size={64}
                      className="text-white/70 transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Dark overlay for contrast */}
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">
                        {project.category}
                      </p>
                      <h3 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10
                                  border border-white/10 transition-all hover:scale-110"
                      >
                        <Github size={18} className={theme === 'dark' ? 'text-white' : 'text-black'} />
                      </a>

                      <button
                        onClick={() => setActiveProject(project)}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10
                                  border border-white/10 transition-colors"
                      >
                        <Maximize2 size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
                      </button>
                    </div>
                  </div>

                  <p className={`text-base md:text-lg mb-8 line-clamp-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {project.shortDesc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold
                        ${theme === 'dark'
                          ? 'bg-slate-900 text-slate-300 border border-slate-800'
                          : 'bg-slate-100 text-slate-700'}`}
                      >
                        {t}
                      </span>
                    ))}
                    <span className="px-3 py-1 rounded-lg text-xs font-mono text-slate-500">
                      +more
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Education Card */}
          <Reveal className="h-full">
            <div className={`h-full p-6 md:p-10 rounded-[2.5rem] border relative overflow-hidden group ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col h-full items-center text-center justify-center py-6 md:py-0">
                {/* College Logo Section */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center mb-6 md:mb-8 shadow-2xl border-4 border-emerald-500/20 overflow-hidden p-4">
                   <img src="/logo.jpeg" alt="IIIT Logo" className="w-full h-full object-contain" />
                </div>

                <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Education</h2>
                <p className="text-lg text-emerald-500 font-medium mb-4 md:mb-6">IIIT Allahabad</p>
                <div className="space-y-2 text-slate-400">
                  <p>B.Tech in Information Technology</p>
                  <p>2024 - 2028</p>
                </div>
                <div className="mt-8 px-6 py-2 rounded-full bg-slate-800 border border-slate-700 text-white font-mono text-sm">
                  CGPA: <span className="text-emerald-400 font-bold">8.89</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact Card */}
          <Reveal delay={200} className="h-full">
            <div className={`h-full p-6 md:p-10 rounded-[2.5rem] border relative overflow-hidden group ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col h-full items-center justify-center py-6 md:py-0">
                <h2 className={`text-3xl md:text-4xl font-bold mb-8 md:mb-12 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Get In Touch</h2>
                
                <div className="w-full space-y-4 mb-8 md:mb-10">
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group/link overflow-hidden">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover/link:scale-110 transition-transform shrink-0"><Mail size={20} /></div>
                    <span className={`text-sm md:text-lg truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{PERSONAL_INFO.email}</span>
                  </a>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0"><Phone size={20} /></div>
                    <span className={`text-sm md:text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{PERSONAL_INFO.phone}</span>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mt-8">
                    <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:scale-110 transition-all text-blue-400 flex justify-center"><Linkedin /></a>
                    <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all text-white flex justify-center"><Github /></a>
                    <a href={SOCIAL_LINKS.codeforces} target="_blank" rel="noreferrer" className="px-3 py-4 rounded-2xl font-mono text-xs md:text-sm bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all text-center flex items-center justify-center">Codeforces</a>
                    <a href={SOCIAL_LINKS.codechef} target="_blank" rel="noreferrer" className="px-3 py-4 rounded-2xl font-mono text-xs md:text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:scale-110 transition-all text-center flex items-center justify-center">CodeChef</a>
                    <a 
  href={SOCIAL_LINKS.leetcode} 
  target="_blank" 
  rel="noreferrer" 
  className="px-3 py-4 rounded-2xl font-mono text-xs md:text-sm bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 hover:scale-110 transition-all text-center flex items-center justify-center"
>
  LeetCode
</a>
                  </div>
                </div>

                <a 
                  href="/Paras-new.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all"
                >
                  <FileText size={20} /> Download Resume
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

{/* Footer */}
      <footer className={`relative z-10 py-12 text-center text-sm font-mono border-t ${theme === 'dark' ? 'border-white/5 text-slate-600 bg-slate-950' : 'border-slate-200 text-slate-400'}`}>
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span>All Systems Operational</span>
        </div>
        <p>© 2025 Paras Bansal. Engineered with Precision.</p>
      </footer>

      {/* Project Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setActiveProject(null)} />
          <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-[scale-in_0.2s_ease-out] ${theme === 'dark' ? 'bg-slate-900 border border-white/10' : 'bg-white'}`}>
            <div className={`h-32 md:h-40 bg-gradient-to-r ${activeProject.color} relative overflow-hidden flex items-center justify-center`}>
               {activeProject.image ? (
                  <img src={activeProject.image} alt={activeProject.title} className="w-full h-full object-cover opacity-50" />
               ) : (
                  <activeProject.icon size={80} className="text-white opacity-50" />
               )}
              <button onClick={() => setActiveProject(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 md:p-10">
               <h3 className={`text-2xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activeProject.title}</h3>
               <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">{activeProject.longDesc}</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                     <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Technology Stack</h4>
                     <div className="flex flex-wrap gap-2">
                        {activeProject.tech.map((t, i) => (
                           <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-emerald-400 text-xs font-mono border border-slate-700">{t}</span>
                        ))}
                     </div>
                  </div>
                  <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                     <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Key Metrics</h4>
                     <ul className="space-y-2">
                        {activeProject.stats.map((s, i) => (
                           <li key={i} className="flex items-center gap-2 text-slate-300">
                              <Zap size={14} className="text-amber-400" /> {s}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               <div className="flex justify-end">
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl
                                bg-slate-800 text-white font-bold
                                hover:bg-slate-700 transition-colors
                                flex items-center gap-2"
                    >
                      <Github size={18} /> GitHub Repo
                    </a>
                  </div>  
            </div>
          </div>
        </div>
      )}

    </div>
  );
}