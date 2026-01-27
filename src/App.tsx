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
      className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-black' : 'text-neutral-400 hover:text-black'
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
    <nav className="fixed top-0 w-full h-16 bg-white/90 backdrop-blur-sm border-b border-black/5 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-12">
        <NavLink to="/money" label="Money" />
        <NavLink to="/business" label="Business" />
        <span className="text-black font-black text-xl px-4">ATLAS</span>
        {(user?.role === 'admin' || user?.role === 'contributor') && (
          <NavLink to="/dashboard" label="Create" />
        )}
        {user?.role === 'admin' && (
          <NavLink to="/admin/users" label="Users" />
        )}
      </div>

      <div className="flex items-center gap-4">
        <SearchBar className="w-64" />

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500">
              {user?.username} <span className="text-neutral-300">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/login" label="Login" />
            <Link
              to="/register"
              className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800"
            >
              Register
            </Link>
          </>
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
