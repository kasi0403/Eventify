
import React, { useState, useRef, useEffect } from 'react';
import EventCard from './EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  price: number;
  currency: string;
  category: string;
  featured?: boolean;
  attendance?: number;
  rating?: number;
}

interface RecommendedEventsProps {
  title: string;
  subtitle?: string;
  events: Event[];
  variant?: 'default' | 'featured' | 'compact';
}

const RecommendedEvents = ({ title, subtitle, events, variant = 'featured' }: RecommendedEventsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [events]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Check scrollability after animation
      setTimeout(checkScrollability, 500);
    }
  };

  const handleScroll = () => {
    checkScrollability();
  };

  return (
    <div className="w-full py-8 relative animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border ${
              canScrollLeft 
                ? 'border-border bg-background hover:bg-accent text-foreground' 
                : 'border-border/50 bg-background/50 text-foreground/30'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border ${
              canScrollRight 
                ? 'border-border bg-background hover:bg-accent text-foreground' 
                : 'border-border/50 bg-background/50 text-foreground/30'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="flex-shrink-0 transition-opacity duration-500"
            style={{ 
              width: variant === 'featured' ? 'min(100%, 400px)' : 'min(100%, 300px)',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <EventCard event={event} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedEvents;
