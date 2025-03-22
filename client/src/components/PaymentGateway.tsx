
import React, { useState } from 'react';
import { Check, CreditCard, Smartphone, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface PaymentGatewayProps {
  amount: number;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentGateway = ({ amount, currency, onSuccess, onCancel }: PaymentGatewayProps) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiry = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add slash after first 2 digits
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    
    return digits;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow up to 3 digits
    const cvv = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(cvv);
  };
  
  const validateUpi = (upi: string) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upi);
  };
  
  const validateCard = () => {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardName.length > 3 &&
      cardExpiry.length === 5 &&
      cardCvv.length === 3
    );
  };
  
  const handlePayment = () => {
    // Simulate payment processing
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };
  
  const isPaymentValid = paymentMethod === 'upi' 
    ? validateUpi(upiId) 
    : validateCard();

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Payment</span>
          <span className="text-lg font-bold">{currency} {amount.toFixed(2)}</span>
        </CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
        <TabsList className="grid grid-cols-2 mx-6">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Card</span>
          </TabsTrigger>
          <TabsTrigger value="upi" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span>UPI</span>
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="p-6">
          <TabsContent value="card" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiry Date</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardCvv">CVV</Label>
                <Input
                  id="cardCvv"
                  type="password"
                  placeholder="123"
                  value={cardCvv}
                  onChange={handleCvvChange}
                  className="font-mono"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upi" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your UPI ID (e.g., name@okicici, name@paytm, etc.)
              </p>
            </div>
            
            <div className="mt-6 bg-muted p-4 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0 bg-primary/10 rounded-full p-1">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Secure UPI Payment</p>
                <p className="text-xs text-muted-foreground">
                  You'll receive a payment request on your UPI app to complete the transaction.
                </p>
              </div>
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 pt-0">
          <Button 
            className="w-full"
            onClick={handlePayment}
            disabled={!isPaymentValid || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner mr-2"></div>
                Processing...
              </>
            ) : (
              `Pay ${currency} ${amount.toFixed(2)}`
            )}
          </Button>
          
          <Button 
            variant="ghost"
            className="w-full"
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <div className="w-full text-center mt-4">
            <p className="text-xs text-muted-foreground flex items-center justify-center">
              <span className="inline-block w-5 h-5 bg-muted rounded-full mr-1 flex items-center justify-center">
                <Lock className="h-3 w-3" />
              </span>
              Secure payment powered by EventMaster
            </p>
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

const Lock = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default PaymentGateway;
