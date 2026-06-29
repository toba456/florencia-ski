export type Locale = 'en' | 'es' | 'th';

export interface AvailabilitySlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
}

export interface BookingRequest {
  id: string;
  slot_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: 'private' | 'kids' | 'offPiste' | 'group';
  duration: '3h' | '4h' | 'halfDay' | 'fullDay';
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  slot?: AvailabilitySlot;
}

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  text: string;
  approved: boolean;
  created_at: string;
}
