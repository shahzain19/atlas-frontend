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

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full h-16 bg-white/70 backdrop-blur-xl border-b border-black/[0.03] flex items-center justify-between px-8 z-50">
      <div className="flex-1 flex items-center overflow-x-auto no-scrollbar py-2 -my-2 mr-4">
        <div className="flex items-center gap-6 whitespace-nowrap px-4">
          <NavLink to="/money" label="Money" />
          <NavLink to="/business" label="Business" />
          <NavLink to="/intelligence" label="Intel" />
          <NavLink to="/technology" label="Tech" />
          <NavLink to="/health" label="Health" />
          <NavLink to="/politics" label="Politics" />
          <NavLink to="/logistics" label="Logistics" />
          <NavLink to="/security" label="Security" />
          <NavLink to="/energy" label="Energy" />
          <NavLink to="/science" label="Science" />
          <NavLink to="/history" label="History" />
          <NavLink to="/philosophy" label="Phil" />
          <NavLink to="/law" label="Law" />
          <NavLink to="/psychology" label="Psych" />
          <NavLink to="/environment" label="Env" />
          <NavLink to="/strategy" label="Strategy" />
          <NavLink to="/economics" label="Econ" />
          <NavLink to="/geopolitics" label="Geo" />
          <NavLink to="/engineering" label="Eng" />
          <NavLink to="/culture" label="Culture" />
        </div>
      </div>

      <Link to="/" className="text-black font-serif font-black text-2xl tracking-tighter hover:opacity-70 transition-opacity">
        ATLAS
      </Link>

      <div className="flex items-center justify-end gap-6 flex-1">
        <SearchBar className="max-w-[180px]" />

        <div className="h-4 w-px bg-black/5 mx-2"></div>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            {(user?.role === 'admin' || user?.role === 'contributor') && (
              <NavLink to="/dashboard" label="Write" />
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin/users" label="Users" />
            )}
            <button
              onClick={handleLogout}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <NavLink to="/login" label="Entry" />
            <Link
              to="/register"
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
            >
              Access
            </Link>
          </div>
        )}
      </div>
    </nav>
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
      <div className="pt-16 min-h-screen bg-[#fafafa]">
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
