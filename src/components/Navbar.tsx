
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Bug, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if user is authenticated (would connect to real auth in production)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Check if the current path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "py-2 bg-background/90 backdrop-blur-md shadow-sm" 
          : "py-4 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl"
          onClick={closeMenu}
        >
          <Bug className="h-6 w-6 text-primary animate-bounce" />
          <span className="text-foreground">Bug Battle</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/') ? "text-primary" : "text-foreground/70"
            )}
          >
            Home
          </Link>
          {isLoggedIn && (
            <Link 
              to="/dashboard" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/dashboard') ? "text-primary" : "text-foreground/70"
              )}
            >
              Dashboard
            </Link>
          )}
          <Link 
            to="/contact" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive('/contact') ? "text-primary" : "text-foreground/70"
            )}
          >
            Contact
          </Link>
          
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                window.location.href = '/';
              }}
            >
              Sign Out
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" onClick={closeMenu}>
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[60px] z-50 w-full overflow-hidden bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container py-6 space-y-6">
          <Link 
            to="/" 
            onClick={closeMenu}
            className={cn(
              "block text-base font-medium transition-colors hover:text-primary",
              isActive('/') ? "text-primary" : "text-foreground/70"
            )}
          >
            Home
          </Link>
          {isLoggedIn && (
            <Link 
              to="/dashboard" 
              onClick={closeMenu}
              className={cn(
                "block text-base font-medium transition-colors hover:text-primary",
                isActive('/dashboard') ? "text-primary" : "text-foreground/70"
              )}
            >
              Dashboard
            </Link>
          )}
          <Link 
            to="/contact" 
            onClick={closeMenu}
            className={cn(
              "block text-base font-medium transition-colors hover:text-primary",
              isActive('/contact') ? "text-primary" : "text-foreground/70"
            )}
          >
            Contact
          </Link>
          
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                window.location.href = '/';
                closeMenu();
              }}
            >
              Sign Out
            </Button>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
