
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Star, 
  Share2, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  TicketIcon
} from 'lucide-react';
import eventData from '../utils/eventData';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Find the event by ID
    const foundEvent = eventData.find(e => e.id === parseInt(id));
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setEvent(foundEvent);
      setLoading(false);
      
      // Set first ticket type as default
      if (foundEvent && foundEvent.tickets && foundEvent.tickets.length > 0) {
        setSelectedTicket(foundEvent.tickets[0]);
      }
      
      // Get related events (same category)
      if (foundEvent) {
        const related = eventData
          .filter(e => e.category === foundEvent.category && e.id !== foundEvent.id)
          .slice(0, 4);
        setRelatedEvents(related);
      }
    }, 800);
  }, [id]);
  
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long' as const, 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  const calculateTotal = () => {
    if (!selectedTicket) return 0;
    return selectedTicket.price * quantity;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-4">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
              <p className="text-muted-foreground">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/events"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation bg-primary text-primary-foreground shadow h-10 px-4"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="mb-4">
              <Link 
                to="/events"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                &larr; Back to Events
              </Link>
            </div>
            
            {/* Event Header */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{event.venue}, {event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{event.attendance || 0} attending</span>
                </div>
                {event.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-amber-500" />
                    <span>{event.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Event Image */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Event Description */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">About this event</h2>
                <button 
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center text-sm text-muted-foreground"
                >
                  {showDescription ? (
                    <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Show more <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </button>
              </div>
              
              <div className={`text-muted-foreground relative overflow-hidden transition-all duration-300 ${
                showDescription ? 'max-h-screen' : 'max-h-32'
              }`}>
                <p className="mb-4">{event.description}</p>
                <p>Join us for this amazing event organized by {event.organizer}. Don't miss out on this opportunity to connect with like-minded individuals and experience something extraordinary.</p>
                
                {!showDescription && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
                )}
              </div>
            </div>
            
            {/* Event Details */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-secondary rounded-xl p-5">
                <h3 className="text-sm font-medium mb-2">Date and Time</h3>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1">{formatDate(event.date)}</p>
                  <p>{event.time}</p>
                </div>
              </div>
              
              <div className="bg-secondary rounded-xl p-5">
                <h3 className="text-sm font-medium mb-2">Location</h3>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1">{event.venue}</p>
                  <p>{event.location}</p>
                </div>
              </div>
              
              <div className="bg-secondary rounded-xl p-5">
                <h3 className="text-sm font-medium mb-2">Organizer</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{event.organizer}</p>
                </div>
              </div>
            </div>
            
            {/* Social Actions */}
            <div className="flex space-x-3 mb-8">
              <button className="flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation border border-input bg-background text-foreground h-10 px-4">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </button>
              <button className="flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation border border-input bg-background text-foreground h-10 px-4">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
            
            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6">Similar Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedEvents.map(relatedEvent => (
                    <EventCard 
                      key={relatedEvent.id} 
                      event={relatedEvent} 
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Ticket Selection */}
          <div className="lg:sticky lg:top-24 h-fit animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-xl shadow-md border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Get Tickets</h2>
              
              {/* Ticket Types */}
              <div className="mb-6 space-y-3">
                {event.tickets.map(ticket => (
                  <div 
                    key={ticket.type}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTicket && selectedTicket.type === ticket.type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ticket.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {ticket.available} tickets left
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{event.currency} {ticket.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quantity Selector */}
              {selectedTicket && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Quantity</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-1 rounded-md border border-border"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    <span className="w-10 text-center">{quantity}</span>
                    <button 
                      className="p-1 rounded-md border border-border"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Order Summary */}
              {selectedTicket && (
                <div className="mb-6 border-t border-border pt-4">
                  <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {selectedTicket.type} × {quantity}
                      </span>
                      <span>{event.currency} {selectedTicket.price * quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>{event.currency} {(selectedTicket.price * quantity * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-border">
                      <span>Total</span>
                      <span>{event.currency} {(selectedTicket.price * quantity * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Checkout Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation bg-primary text-primary-foreground shadow h-11 px-4"
                >
                  <TicketIcon className="mr-2 h-4 w-4" />
                  Checkout
                </button>
                <Link
                  to="/signin"
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation border border-input bg-background text-foreground h-11 px-4"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Sign In to Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
