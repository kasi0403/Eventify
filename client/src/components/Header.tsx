
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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            EventMaster
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.includes('/events') ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Events
          </Link>
          <Link 
            to="/bookings" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/bookings' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            My Bookings
          </Link>
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
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/90 backdrop-blur-md z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            <Link 
              to="/" 
              className={`text-lg font-medium transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className={`text-lg font-medium transition-colors ${
                location.pathname.includes('/events') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Events
            </Link>
            <Link 
              to="/bookings" 
              className={`text-lg font-medium transition-colors ${
                location.pathname === '/bookings' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              My Bookings
            </Link>
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
