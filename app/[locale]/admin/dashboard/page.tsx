'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import type { AvailabilitySlot, BookingRequest } from '@/lib/types';
import Logo from '@/components/Logo';
import 'react-day-picker/style.css';

const SEASON_START = new Date(2026, 11, 1);
const SEASON_END = new Date(2027, 1, 28);

export default function AdminDashboardPage() {
  const router = useRouter();
  const locale = useLocale();

  const [tab, setTab] = useState<'availability' | 'bookings'>('availability');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('16:00');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push(`/${locale}/admin/login`);
  }, [router, locale]);

  const fetchSlots = useCallback(async () => {
    const { data } = await supabase
      .from('availability_slots')
      .select('*')
      .gte('date', '2026-12-01')
      .lte('date', '2027-02-28')
      .order('date', { ascending: true });
    setSlots(data ?? []);
  }, []);

  const fetchBookings = useCallback(async () => {
    const { data } = await supabase
      .from('booking_requests')
      .select('*, slot:availability_slots(*)')
      .order('created_at', { ascending: false });
    setBookings(data ?? []);
  }, []);

  useEffect(() => {
    checkAuth().then(async () => {
      await Promise.all([fetchSlots(), fetchBookings()]);
      setLoading(false);
    });
  }, [checkAuth, fetchSlots, fetchBookings]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
  }

  async function addSlots() {
    if (selectedDays.length === 0) return;
    setSaving(true);
    setMessage('');

    const startParsed = parse(startTime, 'HH:mm', new Date());
    const endParsed = parse(endTime, 'HH:mm', new Date());

    if (!isValid(startParsed) || !isValid(endParsed)) {
      setMessage('Invalid time format.');
      setSaving(false);
      return;
    }

    const rows = selectedDays.map((day) => ({
      date: format(day, 'yyyy-MM-dd'),
      start_time: startTime + ':00',
      end_time: endTime + ':00',
      is_booked: false,
    }));

    const { error } = await supabase.from('availability_slots').upsert(rows, {
      onConflict: 'date,start_time',
      ignoreDuplicates: false,
    });

    if (error) {
      setMessage('Error saving slots: ' + error.message);
    } else {
      setMessage(`✓ ${rows.length} slot(s) saved.`);
      setSelectedDays([]);
      await fetchSlots();
    }
    setSaving(false);
  }

  async function deleteSlot(id: string) {
    await supabase.from('availability_slots').delete().eq('id', id);
    await fetchSlots();
  }

  async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
    await supabase.from('booking_requests').update({ status }).eq('id', id);
    // If confirming, mark the slot as booked
    if (status === 'confirmed') {
      const booking = bookings.find((b) => b.id === id);
      if (booking) {
        await supabase.from('availability_slots').update({ is_booked: true }).eq('id', booking.slot_id);
      }
    }
    await fetchBookings();
  }

  const availableDates = new Set(slots.map((s) => s.date));

  const statusColor = {
    pending: 'text-yellow-400',
    confirmed: 'text-green-400',
    cancelled: 'text-red-400',
  } as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-brand-subtext">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Top bar */}
      <header className="bg-brand-navy border-b border-brand-border px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-6">
          <a
            href={`/${locale}`}
            className="text-xs text-brand-subtext hover:text-white tracking-widest uppercase transition-colors"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            ← View Site
          </a>
          <button
            onClick={handleSignOut}
            className="text-xs text-brand-subtext hover:text-white tracking-widest uppercase transition-colors"
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1
          className="text-white text-3xl mb-8"
          style={{ fontFamily: 'var(--font-barlow)', fontWeight: 900, textTransform: 'uppercase' }}
        >
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-px mb-8 bg-brand-border w-fit">
          {(['availability', 'bookings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 text-xs tracking-widest uppercase font-semibold transition-colors ${
                tab === t ? 'bg-brand-ice text-brand-dark' : 'bg-brand-navy text-brand-subtext hover:text-white'
              }`}
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
            >
              {t === 'availability' ? `Availability (${slots.length})` : `Bookings (${bookings.filter(b => b.status === 'pending').length} pending)`}
            </button>
          ))}
        </div>

        {/* Availability tab */}
        {tab === 'availability' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add slots */}
            <div className="bg-brand-navy border border-brand-border p-6">
              <h2
                className="text-white text-lg mb-6"
                style={{ fontFamily: 'var(--font-barlow)', fontWeight: 800, textTransform: 'uppercase' }}
              >
                Add Available Days
              </h2>

              <DayPicker
                mode="multiple"
                selected={selectedDays}
                onSelect={(days) => setSelectedDays(days ?? [])}
                startMonth={SEASON_START}
                endMonth={SEASON_END}
                modifiers={{
                  already: (date) => availableDates.has(format(date, 'yyyy-MM-dd')),
                }}
                modifiersClassNames={{
                  already: '!text-brand-ice !font-bold',
                }}
                classNames={{
                  root: 'w-full',
                  month_caption: 'flex justify-between items-center mb-4',
                  caption_label: 'text-white text-sm tracking-widest uppercase font-semibold',
                  nav: 'flex gap-2',
                  button_previous: 'text-brand-subtext hover:text-white p-1',
                  button_next: 'text-brand-subtext hover:text-white p-1',
                  weekday: 'text-brand-subtext text-xs text-center py-2',
                  day_button: 'w-full h-full flex items-center justify-center text-sm rounded-none text-white disabled:opacity-25',
                  selected: '!bg-brand-ice !text-brand-dark font-bold',
                  today: 'underline',
                }}
              />

              <div className="mt-6 flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs text-brand-subtext uppercase tracking-widest" style={{ fontFamily: 'var(--font-barlow)' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-brand-dark border border-brand-border px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-ice"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs text-brand-subtext uppercase tracking-widest" style={{ fontFamily: 'var(--font-barlow)' }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-brand-dark border border-brand-border px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-ice"
                  />
                </div>
              </div>

              {message && (
                <p className="mt-3 text-sm text-brand-ice">{message}</p>
              )}

              <button
                onClick={addSlots}
                disabled={saving || selectedDays.length === 0}
                className="mt-4 w-full py-3 bg-brand-ice text-brand-dark text-sm tracking-widest uppercase font-bold hover:bg-white disabled:opacity-50 transition-all"
                style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
              >
                {saving ? 'Saving…' : `Save ${selectedDays.length} Day${selectedDays.length !== 1 ? 's' : ''}`}
              </button>
            </div>

            {/* Existing slots list */}
            <div className="bg-brand-navy border border-brand-border p-6">
              <h2
                className="text-white text-lg mb-6"
                style={{ fontFamily: 'var(--font-barlow)', fontWeight: 800, textTransform: 'uppercase' }}
              >
                Current Availability
              </h2>

              {slots.length === 0 ? (
                <p className="text-brand-subtext text-sm">No slots added yet.</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between px-4 py-2.5 border ${
                        slot.is_booked ? 'border-brand-border opacity-50' : 'border-brand-border hover:border-brand-ice'
                      }`}
                    >
                      <div>
                        <p className="text-white text-sm font-medium">{slot.date}</p>
                        <p className="text-brand-subtext text-xs">
                          {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                          {slot.is_booked && <span className="ml-2 text-yellow-400">· Booked</span>}
                        </p>
                      </div>
                      {!slot.is_booked && (
                        <button
                          onClick={() => deleteSlot(slot.id)}
                          className="text-brand-muted hover:text-red-400 transition-colors p-1"
                          aria-label="Delete slot"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div className="bg-brand-navy border border-brand-border">
            {bookings.length === 0 ? (
              <div className="p-10 text-center text-brand-subtext">No booking requests yet.</div>
            ) : (
              <div className="divide-y divide-brand-border">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-semibold">{booking.client_name}</h3>
                          <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-brand-subtext text-sm">{booking.client_email}</p>
                        {booking.client_phone && (
                          <p className="text-brand-subtext text-sm">{booking.client_phone}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-brand-subtext">
                          <span className="px-2 py-1 bg-brand-dark border border-brand-border">
                            {booking.service_type}
                          </span>
                          <span className="px-2 py-1 bg-brand-dark border border-brand-border">
                            {booking.duration}
                          </span>
                          {booking.slot && (
                            <span className="px-2 py-1 bg-brand-dark border border-brand-border">
                              {booking.slot.date} · {booking.slot.start_time.slice(0, 5)}
                            </span>
                          )}
                        </div>
                        {booking.message && (
                          <p className="mt-2 text-sm text-brand-subtext italic">&ldquo;{booking.message}&rdquo;</p>
                        )}
                      </div>

                      {booking.status === 'pending' && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs tracking-widest uppercase font-semibold hover:bg-green-500/20 transition-colors"
                            style={{ fontFamily: 'var(--font-barlow)' }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-widest uppercase font-semibold hover:bg-red-500/20 transition-colors"
                            style={{ fontFamily: 'var(--font-barlow)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
