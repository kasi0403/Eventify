import React, { useState,useEffect } from 'react';
import { Calendar, MapPin, Heart, Users, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface EventCardProps {
  event: {
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
  };
  variant?: 'default' | 'featured' | 'compact';
}


const EventCard = ({ event, variant = 'default'}: EventCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") || "Attendee";
    setRole(storedRole);
  }, []);
  
  // Determine the correct route based on user role
  const getEventLink = () => {
    return role === "Event Organizer" ? `/org-dash/${event.id}` : `/events/${event.id}`;
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  if (variant === 'featured') {
    return (
      <div className="event-card group relative overflow-hidden rounded-xl shadow-lg h-[350px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
        <img 
          src={event.image} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
          {event.featured && (
            <Badge variant="default" className="bg-primary text-primary-foreground mb-2 w-fit">FEATURED</Badge>
          )}
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <div className="flex items-center text-white/90 text-sm mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(event.date)}</span>
            <div className="mx-2 h-1 w-1 rounded-full bg-white/70"></div>
            <MapPin className="h-4 w-4 mr-1" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span className="text-xs">{event.attendance || '0'} attending</span>
              </div>
              {event.rating && (
                <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
                  <Star className="h-3 w-3 mr-1 text-amber-400" />
                  <span className="text-xs">{event.rating}</span>
                </div>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium">
              {event.currency} {event.price}
            </div>
          </div>
          
          <Link 
            to={getEventLink()}
            className="absolute inset-0 z-30"
            aria-label={`View details for ${event.title}`}
          />
          
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 z-40 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className="event-card relative flex rounded-xl overflow-hidden shadow-md h-24 bg-white hover:shadow-lg transition-shadow duration-300">
        <div className="w-24 h-full relative">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.featured && (
            <div className="absolute top-1 left-1 px-1 py-0.5 bg-primary text-[10px] text-white rounded">
              HOT
            </div>
          )}
        </div>
        <div className="flex-1 p-3 overflow-hidden">
          <h3 className="font-medium text-sm mb-1 truncate">{event.title}</h3>
          <div className="flex items-center text-muted-foreground text-xs mb-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 inline mr-1" />
              {event.location}
            </div>
            <div className="text-xs font-medium text-primary">
              {event.currency} {event.price}
            </div>
          </div>
          <Link 
            to={getEventLink()}
            className="absolute inset-0"
            aria-label={`View details for ${event.title}`}
          />
        </div>
      </div>
    );
  }

  // Default card style
  return (
    <div className="event-card group relative bg-white rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute right-3 top-3 z-20">
          <button 
            className={`p-1.5 rounded-full ${isFavorite ? 'bg-red-50' : 'bg-white/80'} backdrop-blur-sm hover:bg-white transition-colors`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground/70 hover:text-primary'} transition-colors`} />
          </button>
        </div>
        {event.featured && (
          <Badge variant="default" className="absolute top-3 left-3 z-20">FEATURED</Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {event.category}
          </Badge>
          {event.rating && (
            <div className="flex items-center text-xs text-amber-500">
              <Star className="h-3 w-3 mr-0.5 fill-amber-500" />
              <span>{event.rating}</span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-sm font-medium">
            <span className="text-primary">{event.currency} {event.price}</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="hover:text-primary">
            <Link to={getEventLink()}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
