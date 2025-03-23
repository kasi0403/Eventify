import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Banknote, MapPin, Clock, Tag, Users, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "Event date is required.",
  }),
  time: z.string().min(1, {
    message: "Event time is required.",
  }),
  location: z.string().min(3, {
    message: "Location is required.",
  }),
  venue: z.string().min(3, {
    message: "Venue is required.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  image: z.string().min(1, {
    message: "Event image is required.",
  }),
  organization: z.string().min(2, {
    message: "Organization name is required.",
  }),
  tags: z.string(),
  tickets: z.array(
    z.object({
      type: z.string().min(1),
      price: z.number().min(0),
      available: z.number().min(1)
    })
  ).min(1, {
    message: "At least one ticket type is required.",
  }),
  commissionPaid: z.boolean().default(false),
});

type TicketType = {
  type: string;
  price: number;
  available: number;
};

const ListEvent = () => {
  const [tickets, setTickets] = useState<TicketType[]>([
    { type: 'General', price: 0, available: 100 }
  ]);
  
  const [newTicket, setNewTicket] = useState<TicketType>({
    type: '',
    price: 0,
    available: 0
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      time: '',
      location: '',
      venue: '',
      category: '',
      image: '',
      organization: '',
      tags: '',
      tickets: tickets,
      commissionPaid: false,
    },
  });

  const handleAddTicket = () => {
    if (newTicket.type && newTicket.available > 0) {
      const updatedTickets = [...tickets, { ...newTicket }];
      setTickets(updatedTickets);
      form.setValue('tickets', updatedTickets);
      setNewTicket({ type: '', price: 0, available: 0 });
    }
  };

  const handleRemoveTicket = (index: number) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
    form.setValue('tickets', updatedTickets);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically make an API call to create the event
    console.log(values);
    
    if (values.commissionPaid) {
      toast({
        title: "Event Created with Promotion!",
        description: "Your event has been created and will be promoted. Commission payment will be processed.",
      });
    } else {
      toast({
        title: "Event Created!",
        description: "Your event has been created successfully.",
      });
    }
  }

  return (
    <div className="container py-10 max-w-4xl">
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">List Your Event</CardTitle>
          <CardDescription>
            Create and publish your event details. Enable promotion for featured placement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual Tech Conference 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your event, what attendees can expect, and any other important details."
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal flex justify-between items-center"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Time */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="6:00 PM - 9:00 PM" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="City, State" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Venue */}
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Convention Center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Organization */}
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Your organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Tag className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Tech, Music, Education, etc." {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="conference, workshop, networking (comma separated)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Event Image URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="https://example.com/your-event-image.jpg" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tickets Section */}
                <div className="col-span-full">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" /> Ticket Information
                  </h3>
                  
                  <div className="border rounded-md p-4 mb-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <FormLabel>Type</FormLabel>
                        <Input 
                          value={newTicket.type}
                          onChange={(e) => setNewTicket({...newTicket, type: e.target.value})}
                          placeholder="VIP, Standard, etc."
                        />
                      </div>
                      <div>
                        <FormLabel>Price ($)</FormLabel>
                        <Input 
                          type="number"
                          value={newTicket.price}
                          onChange={(e) => setNewTicket({...newTicket, price: parseFloat(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <FormLabel>Quantity</FormLabel>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            value={newTicket.available}
                            onChange={(e) => setNewTicket({...newTicket, available: parseInt(e.target.value) || 0})}
                            placeholder="100"
                          />
                          <Button type="button" onClick={handleAddTicket}>
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    {tickets.length > 0 && (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-2 font-medium">Type</th>
                              <th className="text-left p-2 font-medium">Price</th>
                              <th className="text-left p-2 font-medium">Quantity</th>
                              <th className="text-right p-2 font-medium">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tickets.map((ticket, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2">{ticket.type}</td>
                                <td className="p-2">${ticket.price.toFixed(2)}</td>
                                <td className="p-2">{ticket.available}</td>
                                <td className="text-right p-2">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveTicket(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Promotion Option */}
                <div className="col-span-full border-t pt-6 mt-2">
                  <FormField
                    control={form.control}
                    name="commissionPaid"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border bg-secondary/20">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Promote Your Event</FormLabel>
                          <FormDescription>
                            Pay a commission fee to feature your event on our homepage and promotional channels.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Banknote className={field.value ? "text-primary" : "text-muted-foreground"} />
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <CardFooter className="flex justify-end px-0">
                <Button type="submit" className="w-full md:w-auto">
                  Create Event
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListEvent;