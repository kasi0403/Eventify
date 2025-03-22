
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import EventGrid from '../components/EventGrid';
import RecommendedEvents from '../components/RecommendedEvents';
import FilterBar from '../components/FilterBar';
import { ScrollText, Trophy, MessagesSquare } from 'lucide-react';
import eventData from '../utils/eventData';
import Header from '../components/Header';

const Index = () => {
  const [filteredEvents, setFilteredEvents] = useState(eventData);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  
  // Extract unique categories and locations from data
  const categories = [...new Set(eventData.map(event => event.category))] as string[];
  const locations = [...new Set(eventData.map(event => event.location))] as string[];

  useEffect(() => {
    // Get featured events
    const featured = eventData.filter(event => event.featured);
    setFeaturedEvents(featured);
  }, []);

  const handleFilter = (filters) => {
    let filtered = [...eventData];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) || 
        event.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(event => event.location === filters.location);
    }
    
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }
    
    if (filters.price !== null) {
      filtered = filtered.filter(event => event.price <= filters.price);
    }
    
    setFilteredEvents(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        
        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 text-center shadow-sm border border-border transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <ScrollText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Easy Booking</h3>
              <p className="text-muted-foreground text-sm">
                Browse and book events with just a few clicks. Simple and hassle-free.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 text-center shadow-sm border border-border transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Earn Badges</h3>
              <p className="text-muted-foreground text-sm">
                Collect achievement badges as you attend different types of events.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 text-center shadow-sm border border-border transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <MessagesSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Event Assistant</h3>
              <p className="text-muted-foreground text-sm">
                Get personalized event recommendations with our AI assistant.
              </p>
            </div>
          </div>
        </section>
        
        {/* Featured Events Section */}
        <section className="container mx-auto px-4 py-8">
          <RecommendedEvents 
            title="Featured Events" 
            subtitle="Discover our most anticipated events"
            events={featuredEvents}
          />
        </section>
        
        {/* All Events Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <FilterBar 
              categories={categories} 
              locations={locations} 
              onFilter={handleFilter}
            />
          </div>
          
          <EventGrid events={filteredEvents} columns={3} />
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find events</p>
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">EventMaster</h3>
              <p className="text-muted-foreground text-sm">
                Discover and book amazing events happening around you.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary">Home</a></li>
                <li><a href="/events" className="hover:text-primary">Events</a></li>
                <li><a href="/bookings" className="hover:text-primary">My Bookings</a></li>
                <li><a href="/signin" className="hover:text-primary">Sign In</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                info@eventmaster.com<br />
                123 Event Street<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-4 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© 2023 EventMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
