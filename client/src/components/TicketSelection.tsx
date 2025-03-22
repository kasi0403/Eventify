
import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Shield, Ticket } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentGateway from './PaymentGateway';
import { toast } from '@/hooks/use-toast';

interface TicketType {
  type: string;
  price: number;
  available: number;
  description?: string;
}

interface TicketSelectionProps {
  tickets: TicketType[];
  currency: string;
  eventTitle: string;
  eventDate: string;
  onBookingComplete: (ticketInfo: any) => void;
}

const TicketSelection = ({ tickets, currency, eventTitle, eventDate, onBookingComplete }: TicketSelectionProps) => {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= Math.min(10, selectedTicket.available)) {
      setQuantity(newQuantity);
    }
  };
  
  const calculateSubtotal = () => {
    return selectedTicket.price * quantity;
  };
  
  const calculateFees = () => {
    return calculateSubtotal() * 0.1; // 10% service fee
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateFees();
  };
  
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    
    // Show success toast - changed to use 'default' variant instead of 'success'
    toast({
      title: "Booking successful!",
      description: `Your tickets for ${eventTitle} have been booked.`,
      variant: "default", // Changed from 'success' to 'default'
    });
    
    // Generate QR code
    setShowQR(true);
    
    // Call parent callback with ticket info
    onBookingComplete({
      ticket: selectedTicket,
      quantity,
      total: calculateTotal(),
      date: new Date().toISOString(),
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkAQMAAAAjexcCAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUKM9jGAWDCQAAAGAAAYJK0xoAAAAASUVORK5CYII="
    });
  };

  return (
    <div className="w-full">
      {!showPayment && !showQR && (
        <Card>
          <CardHeader>
            <CardTitle>Select Tickets</CardTitle>
            <CardDescription>Choose your ticket type and quantity</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Ticket Types */}
            <div className="space-y-3">
              {tickets.map((ticket) => (
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
                      <div className="flex items-center">
                        <h3 className="font-medium">{ticket.type}</h3>
                        {selectedTicket && selectedTicket.type === ticket.type && (
                          <Check className="ml-2 h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ticket.description || `Standard ${ticket.type} ticket`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ticket.available} tickets left
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{currency} {ticket.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quantity Selector */}
            {selectedTicket && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= Math.min(10, selectedTicket.available)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    (Max. 10 per order)
                  </span>
                </div>
              </div>
            )}
            
            {/* Order Summary */}
            {selectedTicket && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {selectedTicket.type} × {quantity}
                    </span>
                    <span>{currency} {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      Service fee
                      <span className="inline-flex items-center justify-center rounded-full bg-muted w-4 h-4 text-xs ml-1 cursor-help" title="This fee helps us run our platform">?</span>
                    </span>
                    <span>{currency} {calculateFees().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-border mt-2">
                    <span>Total</span>
                    <span>{currency} {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4 rounded-lg bg-muted p-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>All tickets are protected by our Buyer Guarantee. If an event is cancelled, you'll receive a full refund.</p>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              className="w-full" 
              disabled={!selectedTicket}
              onClick={() => setShowPayment(true)}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Proceed to Payment
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      )}
      
      {showPayment && (
        <PaymentGateway 
          amount={calculateTotal()}
          currency={currency}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
      
      {showQR && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-green-100 p-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle>Booking Confirmed!</CardTitle>
            <CardDescription>
              Your tickets for {eventTitle} have been booked
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkAQMAAAAjexcCAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUKM9jGAWDCQAAAGAAAYJK0xoAAAAASUVORK5CYII=" 
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
            
            <div className="text-center space-y-1 mb-4 w-full">
              <h3 className="font-medium">{eventTitle}</h3>
              <p className="text-sm text-muted-foreground">{eventDate}</p>
              <p className="text-sm">{selectedTicket.type} × {quantity}</p>
              <p className="font-medium mt-2">{currency} {calculateTotal().toFixed(2)}</p>
            </div>
            
            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground w-full">
              <p>• An email with your tickets has been sent to your registered email address.</p>
              <p>• Please have this QR code ready for scanning at the event entrance.</p>
              <p>• For any assistance, contact support@eventmaster.com</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button variant="outline" className="w-full">
              Download Ticket
            </Button>
            <Button variant="ghost" onClick={() => setShowQR(false)} className="w-full">
              Close
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TicketSelection;
