
import React from 'react';
import { ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full pb-12 pt-32 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <div className="absolute inset-0 overflow-hidden hero-pattern opacity-[0.015]"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary w-fit animate-fade-in">
              <Sparkles className="mr-1 h-3 w-3" />
              <span>Discover amazing events near you</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Find and book <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                incredible events
              </span>
            </h1>
            
            <p className="max-w-[600px] text-gray-500 md:text-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover and book the best events happening around you. From concerts to conferences, find your next experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link 
                to="/events"
                className="inline-flex h-11 items-center justify-center rounded-full px-8 text-sm font-medium transition-colors button-animation bg-primary text-primary-foreground shadow-md"
              >
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-11 items-center justify-center rounded-full px-8 text-sm font-medium transition-colors button-animation bg-secondary text-secondary-foreground"
              >
                Create Account
              </Link>
            </div>
            
            <div className="flex items-center pt-4 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span>100+ upcoming events</span>
              </div>
              <div className="mx-4 h-1 w-1 rounded-full bg-muted-foreground/30"></div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>Events in 20+ cities</span>
              </div>
            </div>
          </div>
          
          <div className="mx-auto lg:mx-0 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative aspect-video overflow-hidden rounded-2xl border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-black/0 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"
                alt="Event preview"
                className="object-cover w-full h-full transform transition-transform duration-[10000ms] hover:scale-110"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="px-2 py-1 bg-primary text-xs text-white rounded-sm mb-2 w-fit">FEATURED</div>
                <h3 className="text-white font-bold text-lg sm:text-xl">TechCon 2023</h3>
                <div className="flex items-center text-white/90 text-sm mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Nov 15, 2023</span>
                  <div className="mx-2 h-1 w-1 rounded-full bg-white/70"></div>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>San Francisco</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
