
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, Filter, MapPin, Tags, Ticket } from 'lucide-react';
import Header from '../components/Header';
import EventGrid from '../components/EventGrid';
import FilterBar from '../components/FilterBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import eventData from '../utils/eventData';

const OrgEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredEvents, setFilteredEvents] = useState(eventData);
  const [sortBy, setSortBy] = useState('date');
  const [view, setView] = useState('grid');
  
  // Get URL parameters
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const locationParam = queryParams.get('location');
  
  // Extract unique categories and locations from data
  const categories = [...new Set(eventData.map(event => event.category))] as string[];
  const locations = [...new Set(eventData.map(event => event.location))] as string[];

  useEffect(() => {
    // Apply initial filters based on URL params
    let filtered = [...eventData];
    
    if (categoryParam) {
      filtered = filtered.filter(event => event.category === categoryParam);
    }
    
    if (locationParam) {
      filtered = filtered.filter(event => event.location === locationParam);
    }
    
    setFilteredEvents(filtered);
  }, [categoryParam, locationParam]);

  const handleFilter = (filters: any) => {
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
      // Update URL params
      queryParams.set('location', filters.location);
    } else {
      queryParams.delete('location');
    }
    
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
      // Update URL params
      queryParams.set('category', filters.category);
    } else {
      queryParams.delete('category');
    }
    
    if (filters.price !== null) {
      filtered = filtered.filter(event => event.price <= filters.price);
    }
    
    // Update URL without reloading the page
    navigate({ search: queryParams.toString() }, { replace: true });
    
    setFilteredEvents(filtered);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    let sorted = [...filteredEvents];
    
    switch(value) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.attendance || 0) - (a.attendance || 0));
        break;
      case 'date':
      default:
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }
    
    setFilteredEvents(sorted);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Browse Events | EventMaster</title>
      </Helmet>

      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Next Experience</h1>
          <p className="text-muted-foreground">Discover amazing events happening near you</p>
        </div>
        
        {/* Filter and Sort Section */}
        <div className="mb-8">
          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-6">
              <FilterBar 
                categories={categories} 
                locations={locations} 
                onFilter={handleFilter}
                initialCategory={categoryParam || ''}
                initialLocation={locationParam || ''}
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t border-border">
                <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                  <span className="text-sm text-muted-foreground">View:</span>
                  <div className="flex space-x-1">
                    <Button 
                      variant={view === 'grid' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setView('grid')}
                      className="h-8 w-8 p-0"
                    >
                      <i className="grid text-xs">☰</i>
                    </Button>
                    <Button 
                      variant={view === 'list' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setView('list')}
                      className="h-8 w-8 p-0"
                    >
                      <i className="list text-xs">≡</i>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date (Soonest)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Events Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredEvents.length}</span> events
          </p>
          
          {(categoryParam || locationParam) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                navigate('/events');
                setFilteredEvents(eventData);
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
        
        {/* Events Display */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-muted inline-flex mx-auto rounded-full p-4 mb-4">
              <Ticket className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any events matching your criteria. Try adjusting your filters or check back later.
            </p>
            <Button 
              onClick={() => {
                navigate('/events');
                setFilteredEvents(eventData);
              }}
            >
              View All Events
            </Button>
          </div>
        ) : (
          <EventGrid 
            events={filteredEvents} 
            columns={view === 'list' ? 2 : 3}
          />
        )}
      </main>
      
      {/* Quick Filter Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-3 px-4 md:hidden">
        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="flex items-center gap-1 flex-1 mr-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 flex-1 mr-2">
            <Tags className="h-4 w-4" />
            <span>Category</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 flex-1 mr-2">
            <MapPin className="h-4 w-4" />
            <span>Location</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 flex-1">
            <CalendarDays className="h-4 w-4" />
            <span>Date</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrgEvents;
