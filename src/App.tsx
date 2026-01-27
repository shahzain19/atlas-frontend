import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Feed } from './Feed';
import { Article } from './Article';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { SearchResults } from './pages/SearchResults';
import { UserManagement } from './pages/UserManagement';
import { SearchBar } from './components/Search/SearchBar';
import { Onboarding } from './components/Onboarding/Onboarding';
import { useAuthStore } from './store/authStore';

const NavLink = ({ to, label }: { to: string, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'text-black' : 'text-neutral-400 hover:text-black hover:tracking-[0.3em]'
        }`}
    >
      {label}
    </Link>
  );
};

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const sectors = [
    { id: 'money', label: 'Money', path: '/money' },
    { id: 'business', label: 'Business', path: '/business' },
    { id: 'intelligence', label: 'Intelligence', path: '/intelligence' },
    { id: 'technology', label: 'Technology', path: '/technology' },
    { id: 'health', label: 'Health', path: '/health' },
    { id: 'politics', label: 'Politics', path: '/politics' },
    { id: 'logistics', label: 'Logistics', path: '/logistics' },
    { id: 'security', label: 'Security', path: '/security' },
    { id: 'energy', label: 'Energy', path: '/energy' },
    { id: 'science', label: 'Science', path: '/science' },
    { id: 'history', label: 'History', path: '/history' },
    { id: 'philosophy', label: 'Philosophy', path: '/philosophy' },
    { id: 'law', label: 'Law', path: '/law' },
    { id: 'psychology', label: 'Psychology', path: '/psychology' },
    { id: 'environment', label: 'Environment', path: '/environment' },
    { id: 'strategy', label: 'Strategy', path: '/strategy' },
    { id: 'economics', label: 'Economics', path: '/economics' },
    { id: 'geopolitics', label: 'Geopolitics', path: '/geopolitics' },
    { id: 'engineering', label: 'Engineering', path: '/engineering' },
    { id: 'agriculture', label: 'Agriculture', path: '/agriculture' },
    { id: 'architecture', label: 'Architecture', path: '/architecture' },
    { id: 'media', label: 'Media', path: '/media' },
    { id: 'education', label: 'Education', path: '/education' },
    { id: 'culture', label: 'Culture', path: '/culture' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full h-20 bg-white/80 backdrop-blur-2xl border-b border-black/[0.03] flex items-center justify-between px-10 z-[100]">
        <div className="flex items-center gap-6 flex-1">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group flex flex-col gap-1.5 p-2 -ml-2 hover:opacity-50 transition-all"
          >
            <div className="w-5 h-0.5 bg-black rounded-full"></div>
            <div className="w-3 h-0.5 bg-black rounded-full group-hover:w-5 transition-all"></div>
            <div className="w-5 h-0.5 bg-black rounded-full"></div>
          </button>
          <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Index</span>
        </div>

        <Link to="/" className="text-black font-serif font-black text-3xl tracking-tighter hover:scale-105 transition-all">
          ATLAS
        </Link>

        <div className="flex items-center justify-end gap-8 flex-1">
          <SearchBar className="max-w-[200px] hidden sm:block" />

          <div className="flex items-center gap-8">
            {isAuthenticated ? (
              <div className="flex items-center gap-8">
                {(user?.role === 'admin' || user?.role === 'contributor') && (
                  <NavLink to="/dashboard" label="Studio" />
                )}
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
                >
                  Exit
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <NavLink to="/login" label="Entry" />
                <Link
                  to="/register"
                  className="text-[10px] font-bold uppercase tracking-[0.3em] px-6 py-2.5 bg-black text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                  Access
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Slide-out Sector Drawer */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-700 ${isMenuOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-white/95 backdrop-blur-xl transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Content */}
        <div
          className={`absolute left-0 top-0 h-full w-full md:w-[600px] bg-white border-r border-black/[0.03] p-12 md:p-24 overflow-y-auto transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex justify-between items-start mb-20">
            <div>
              <h2 className="text-5xl font-serif font-black italic mb-4">Archive Index</h2>
              <p className="text-xs text-neutral-400 uppercase tracking-[0.3em] font-bold">24 Active Intelligence Sectors</p>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl hover:rotate-90 transition-transform p-4 -mr-8"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {sectors.map((sector) => (
              <Link
                key={sector.id}
                to={sector.path}
                className="group flex flex-col pt-4 border-t border-black/[0.03]"
              >
                <span className="text-[9px] font-mono text-neutral-300 uppercase mb-1">Sector_{sector.id.toUpperCase()}</span>
                <span className="text-xl font-serif font-bold group-hover:text-emerald-600 transition-colors flex justify-between items-center">
                  {sector.label}
                  <span className="text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-32 pt-12 border-t border-black/[0.03]">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-300 mb-8">System Status</p>
            <div className="flex flex-wrap gap-12 text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
              <div className="flex items-center gap-2 italic">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                Uptime: 99.98%
              </div>
              <div>Node: Atlas_Alpha</div>
              <div>Auth: Vercel_Edge</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const { user, updateUser } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding
    if (user && !user.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (user) {
      updateUser({ ...user, onboarding_completed: true });
    }
  };

  return (
    <BrowserRouter>
      <div className="pt-20 min-h-screen bg-[#fafafa]">
        <Navigation />

        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

        <Routes>
          <Route path="/" element={<Feed category="money" title="Sovereign Finance" subtitle="Understanding the flow of value and the mechanics of debt." />} />
          <Route path="/money" element={<Feed category="money" title="Sovereign Finance" subtitle="Understanding the flow of value and the mechanics of debt." />} />
          <Route path="/business" element={<Feed category="business" title="Systemic Leverage" subtitle="Building scalable operations and understanding incentives." />} />
          <Route path="/intelligence" element={<Feed category="intelligence" title="Strategic Foresight" subtitle="Gathering and analyzing data to build actionable intelligence." />} />
          <Route path="/technology" element={<Feed category="technology" title="Technological Sovereignty" subtitle="Navigating the stack: from base protocols to biological engineering." />} />
          <Route path="/health" element={<Feed category="health" title="Biological Resilience" subtitle="Optimizing the human hardware for longevity and performance." />} />
          <Route path="/politics" element={<Feed category="politics" title="Sovereign Governance" subtitle="Analyzing the structures of power, laws, and systemic control." />} />
          <Route path="/logistics" element={<Feed category="logistics" title="Physical Reality" subtitle="Understanding supply chains, energy, and the mechanics of movement." />} />
          <Route path="/security" element={<Feed category="security" title="Defensive Protocols" subtitle="Hardening the perimeter: physical security and digital encryption." />} />
          <Route path="/energy" element={<Feed category="energy" title="Systemic Power" subtitle="Analyzing energy production, thermodynamics, and resource sovereignty." />} />
          <Route path="/science" element={<Feed category="science" title="First Principles" subtitle="Exploring the fundamental laws of nature and the scientific method." />} />
          <Route path="/history" element={<Feed category="history" title="Pattern Recognition" subtitle="Decoding the past to identify recurring systemic cycles." />} />
          <Route path="/philosophy" element={<Feed category="philosophy" title="Axiomatic Logic" subtitle="Foundations of reasoning, ethical frameworks, and the search for truth." />} />
          <Route path="/law" element={<Feed category="law" title="Systemic Codes" subtitle="Navigating legal structures, contracts, and jurisdictional resilience." />} />
          <Route path="/psychology" element={<Feed category="psychology" title="Cognitive OS" subtitle="Understanding the human operating system and behavioral patterns." />} />
          <Route path="/environment" element={<Feed category="environment" title="Ecological Sovereignty" subtitle="Sustaining the habitat and managing natural assets for the long term." />} />
          <Route path="/strategy" element={<Feed category="strategy" title="Game Theory" subtitle="Analyzing incentives, competition, and optimal decision-making." />} />
          <Route path="/economics" element={<Feed category="economics" title="Universal Incentives" subtitle="Deciphering the allocation of scarce resources and human behavior." />} />
          <Route path="/geopolitics" element={<Feed category="geopolitics" title="Global Statics" subtitle="Mapping the intersection of geography, power, and statecraft." />} />
          <Route path="/engineering" element={<Feed category="engineering" title="Physical Syntax" subtitle="Building the systems and structures that command the physical world." />} />
          <Route path="/agriculture" element={<Feed category="agriculture" title="Basal Layer" subtitle="Securing the food supply and understanding biological production." />} />
          <Route path="/architecture" element={<Feed category="architecture" title="Physical Environment" subtitle="Designing the structures and spaces that shape human experience." />} />
          <Route path="/media" element={<Feed category="media" title="Signal Intelligence" subtitle="Navigating the ocean of information, propaganda, and truth." />} />
          <Route path="/education" element={<Feed category="education" title="Knowledge Transfer" subtitle="Optimizing the systems for acquiring and sharing systemic intelligence." />} />
          <Route path="/culture" element={<Feed category="culture" title="Narrative Control" subtitle="Analyzing the stories and signals that shape collective reality." />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="contributor">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/read/:id" element={<Article />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
