import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slot_id, name, email, phone, service, duration, message } = body;

    if (!slot_id || !name || !email || !service || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Check slot is still available
    const { data: slot, error: slotError } = await supabase
      .from('availability_slots')
      .select('id, is_booked')
      .eq('id', slot_id)
      .single();

    if (slotError || !slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    if (slot.is_booked) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
    }

    // Create booking request (pending status — Florencia confirms manually)
    const { error: bookingError } = await supabase.from('booking_requests').insert({
      slot_id,
      client_name: name,
      client_email: email,
      client_phone: phone ?? '',
      service_type: service,
      duration,
      message: message ?? '',
      status: 'pending',
    });

    if (bookingError) throw bookingError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('bookings POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
