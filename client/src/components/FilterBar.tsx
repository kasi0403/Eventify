
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Tag, DollarSign, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  locations: string[];
  initialCategory?: string;  // Make initialCategory optional
  initialLocation?: string;  // Make initialLocation optional
  onFilter: (filters: {
    search: string;
    location: string;
    category: string;
    price: number | null;
  }) => void;
}

const FilterBar = ({ 
  categories, 
  locations, 
  initialCategory = '', 
  initialLocation = '', 
  onFilter 
}: FilterBarProps) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState(initialLocation || '');
  const [category, setCategory] = useState(initialCategory || '');
  const [price, setPrice] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Apply initial filters when component mounts or initialCategory/initialLocation changes
  useEffect(() => {
    if (initialCategory || initialLocation) {
      setCategory(initialCategory || '');
      setLocation(initialLocation || '');
      onFilter({ search, location: initialLocation || '', category: initialCategory || '', price });
    }
  }, [initialCategory, initialLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search, location, category, price });
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setCategory('');
    setPrice(null);
    onFilter({ search: '', location: '', category: '', price: null });
  };

  return (
    <div className="w-full bg-white border border-border rounded-xl p-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full h-10 pl-9 pr-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
            />
          </div>
          
          <button 
            type="button"
            className="md:hidden inline-flex items-center justify-center gap-2 h-10 px-4 py-2 border border-input rounded-md bg-background text-sm text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className={`flex-col gap-3 ${isExpanded ? 'flex' : 'hidden'} md:flex md:flex-row`}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 pl-9 pr-8 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input appearance-none bg-transparent"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 pl-9 pr-8 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input appearance-none bg-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={price === null ? '' : price.toString()}
                onChange={(e) => setPrice(e.target.value ? parseInt(e.target.value) : null)}
                className="h-10 pl-9 pr-8 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input appearance-none bg-transparent"
              >
                <option value="">Any Price</option>
                <option value="100">Under $100</option>
                <option value="200">Under $200</option>
                <option value="500">Under $500</option>
                <option value="1000">Under $1000</option>
              </select>
            </div>
          </div>
          
          <div className={`flex gap-2 ${isExpanded ? 'flex' : 'hidden'} md:flex`}>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 border border-input rounded-md hover:bg-accent text-sm"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center justify-center h-10 px-6 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm button-animation"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;
