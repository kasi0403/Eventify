
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode,
  Download,
  CheckCircle2,
  ExternalLink,
  Award
} from 'lucide-react';
import Header from '../components/Header';
import eventData from '../utils/eventData';

// Mock booking data
const bookings = [
  {
    id: 'b001',
    eventId: 1,
    date: '2023-09-15',
    ticketType: 'VIP',
    quantity: 2,
    totalAmount: 1198,
    status: 'upcoming',
    qrCode: true
  },
  {
    id: 'b002',
    eventId: 5,
    date: '2023-08-10',
    ticketType: 'General Entry',
    quantity: 3,
    totalAmount: 225,
    status: 'past',
    qrCode: true,
    attended: true
  },
  {
    id: 'b003',
    eventId: 2,
    date: '2023-06-22',
    ticketType: 'General Admission',
    quantity: 1,
    totalAmount: 149,
    status: 'past',
    qrCode: true,
    attended: true
  }
];

// Mock badges
const badges = [
  {
    id: 'b001',
    name: 'Tech Enthusiast',
    description: 'Attended 2 tech conferences',
    icon: '🖥️',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'b002',
    name: 'Food Lover',
    description: 'Attended food festival events',
    icon: '🍽️',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'b003',
    name: 'Music Fan',
    description: 'Attended music concerts',
    icon: '🎵',
    color: 'bg-purple-100 text-purple-800'
  }
];

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const getEventDetails = (eventId) => {
    return eventData.find(event => event.id === eventId);
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const filteredBookings = bookings.filter(booking => 
    activeTab === 'all' || booking.status === activeTab
  );

  return (
    <div className="min-h-screen bg-background">   
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your event tickets and view your attendance history</p>
        </div>
        
        {/* Badges */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Your Achievement Badges
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id}
                className="p-4 rounded-xl border border-border shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
              >
                <div className={`h-12 w-12 flex items-center justify-center text-xl rounded-full ${badge.color}`}>
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-medium">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-border animate-fade-in">
          <div className="flex space-x-4">
            <button
              className={`pb-2 px-1 text-sm transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-primary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`pb-2 px-1 text-sm transition-colors ${
                activeTab === 'past'
                  ? 'border-b-2 border-primary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
            <button
              className={`pb-2 px-1 text-sm transition-colors ${
                activeTab === 'all'
                  ? 'border-b-2 border-primary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Bookings
            </button>
          </div>
        </div>
        
        {/* Bookings List */}
        <div className="space-y-6 animate-fade-in">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-6">You don't have any {activeTab} bookings</p>
              <Link 
                to="/events"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation bg-primary text-primary-foreground shadow h-10 px-4"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            filteredBookings.map(booking => {
              const event = getEventDetails(booking.eventId);
              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-xl border border-border shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="md:flex">
                    <div className="md:w-1/4 h-40 md:h-auto relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {booking.status === 'upcoming' && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-sm text-xs font-medium bg-primary text-primary-foreground">
                          UPCOMING
                        </div>
                      )}
                      {booking.status === 'past' && booking.attended && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-sm text-xs font-medium bg-green-500 text-white">
                          ATTENDED
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 md:flex-1">
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
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
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Ticket Type</p>
                          <p className="text-sm font-medium">{booking.ticketType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="text-sm font-medium">{booking.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Order Date</p>
                          <p className="text-sm font-medium">{formatDate(booking.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Price</p>
                          <p className="text-sm font-medium">{event.currency} {booking.totalAmount}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {booking.qrCode && (
                          <button className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors button-animation border border-input bg-background text-foreground h-8 px-3">
                            <QrCode className="h-3 w-3 mr-1" />
                            Show QR Code
                          </button>
                        )}
                        <button className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors button-animation border border-input bg-background text-foreground h-8 px-3">
                          <Download className="h-3 w-3 mr-1" />
                          Download Ticket
                        </button>
                        <Link 
                          to={`/events/${event.id}`}
                          className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors button-animation border border-input bg-background text-foreground h-8 px-3"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Event
                        </Link>
                        
                        {booking.status === 'past' && booking.attended && (
                          <div className="inline-flex items-center justify-center rounded-md text-xs font-medium text-green-600 bg-green-50 h-8 px-3">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Attended
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
