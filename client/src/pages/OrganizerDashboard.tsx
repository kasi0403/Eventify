import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { useParams } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

const badges = [
  { id: 'b001', name: 'Total Tickets', description: '700', icon: '🎟️', color: 'bg-blue-100 text-blue-800' },
  { id: 'b002', name: 'Sold Tickets', description: '200', icon: '📈', color: 'bg-orange-100 text-orange-800' },
  { id: 'b003', name: 'Unsold Tickets', description: '500', icon: '📉', color: 'bg-purple-100 text-purple-800' }
];

const initialEntries = [];
const crowdData = { 'Main Stage': 50, 'VIP Area': 20, 'Food Court': 80 };

const OrganizerDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Scan QR');
  const [entries, setEntries] = useState(initialEntries);
  const [crowd, setCrowd] = useState(crowdData);

  useEffect(() => {
    // Here you could fetch event-specific data based on the ID
    console.log(`Loading dashboard for event ID: ${id}`);
  }, [id]);

  const handleScan = (data: any) => {
    if (data) {
      setEntries([...entries, { id: entries.length + 1, name: data.text }]);
    }
  };

  const handleError = (err: Error) => console.error(err);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-3xl font-bold mb-2">Event Dashboard #{id}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map(badge => (
            <div key={badge.id} className="p-4 rounded-xl border shadow-sm flex items-center gap-4">
              <div className={`h-12 w-12 flex items-center justify-center text-xl rounded-full ${badge.color}`}>{badge.icon}</div>
              <div>
                <h3 className="font-medium">{badge.name}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-6 border-b border-border flex space-x-4 mt-6">
          {['Scan QR', 'Entry List', 'Crowd Management'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm transition-colors ${activeTab === tab ? 'border-b-2 border-primary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Scan QR' && (
          <div className="flex justify-center">
            <QrScanner delay={300} onScan={handleScan} onError={handleError} style={{ width: '100%' }} />
          </div>
        )}

        {activeTab === 'Entry List' && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Checked-in Attendees</h2>
            <ul className="mt-2 border rounded-lg p-4">
              {entries.length > 0 ? entries.map(entry => (
                <li key={entry.id} className="py-2 border-b last:border-0">{entry.name}</li>
              )) : <p>No attendees checked in yet.</p>}
            </ul>
          </div>
        )}

        {activeTab === 'Crowd Management' && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Crowd Management</h2>
            <ul className="mt-2 border rounded-lg p-4">
              {Object.keys(crowd).map(area => (
                <li key={area} className="py-2 border-b last:border-0 flex justify-between">
                  <span>{area}</span>
                  <span className="font-bold">{crowd[area]} people</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerDashboard;