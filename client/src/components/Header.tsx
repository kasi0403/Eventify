import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Search, 
  Menu, 
  X,
  LogIn
} from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setRole(sessionStorage.getItem("role") || ""); // Get role from sessionStorage
    setIsMobileMenuOpen(false);
  }, [location]);

  const renderNavLinks = () => {
    if (role === "Admin") {
      return (
        <>
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/admin-dashboard" className={navLinkClass("/admin-dashboard")}>Admin Dashboard</Link>
        </>
      );
    } else if (role === "Event Organizer") {
      return (
        <>
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/org-Events" className={navLinkClass("/org-Events")}>Events</Link>
          <Link to="/List" className={navLinkClass("/List")}>List Event</Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/events" className={navLinkClass("/events")}>Events</Link>
          <Link to="/bookings" className={navLinkClass("/bookings")}>My Bookings</Link>
          <Link to="/find-group" className={navLinkClass("/find-group")}>Find a group</Link>
        </>
      );
    }
  };

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname.includes(path) ? 'text-primary' : 'text-foreground/80'
    }`;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            EventMaster
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {renderNavLinks()}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="inline-flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/signin" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation bg-primary text-primary-foreground shadow h-10 px-4"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/90 backdrop-blur-md z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            {renderNavLinks()}
            <div className="pt-4 border-t border-border">
              <Link 
                to="/signin" 
                className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow h-10 px-4"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
