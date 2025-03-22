
import React from 'react';
import EventCard from './EventCard';

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

interface EventGridProps {
  events: Event[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  limit?: number;
}

const EventGrid = ({ 
  events, 
  title, 
  subtitle, 
  columns = 3,
  limit
}: EventGridProps) => {
  // Limit the number of events if specified
  const displayEvents = limit ? events.slice(0, limit) : events;
  
  // Determine grid columns class based on prop
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns];

  return (
    <div className="w-full animate-fade-in">
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
      )}
      
      <div className={`grid ${gridClass} gap-6`}>
        {displayEvents.map((event) => (
          <div key={event.id} className="animate-scale-in" style={{ animationDelay: `${(event.id % 10) * 0.05}s` }}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
