'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isBefore, startOfToday, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useTranslations } from 'next-intl';
import type { AvailabilitySlot } from '@/lib/types';
import 'react-day-picker/style.css';

interface Props {
  onSlotSelect: (slot: AvailabilitySlot) => void;
}

const SEASON_START = new Date(2026, 11, 1); // Dec 2026
const SEASON_END = new Date(2027, 1, 28);   // Feb 2027

export default function BookingCalendar({ onSlotSelect }: Props) {
  const t = useTranslations('booking');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [slotsForDate, setSlotsForDate] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<Date>(SEASON_START);

  // Fetch all available dates for the currently displayed month
  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const from = format(startOfMonth(month), 'yyyy-MM-dd');
        const to = format(endOfMonth(month), 'yyyy-MM-dd');
        const res = await fetch(`/api/availability?from=${from}&to=${to}`);
        if (res.ok) {
          const data: AvailabilitySlot[] = await res.json();
          setAvailableSlots(data);
        }
      } catch {
        // silently fail — calendar still renders
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [month]);

  // When date selected, filter slots
  useEffect(() => {
    if (!selectedDate) {
      setSlotsForDate([]);
      return;
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const slots = availableSlots.filter(
      (s) => s.date === dateStr && !s.is_booked
    );
    setSlotsForDate(slots);
  }, [selectedDate, availableSlots]);

  const availableDates = new Set(
    availableSlots.filter((s) => !s.is_booked).map((s) => s.date)
  );

  function isDateAvailable(date: Date) {
    return availableDates.has(format(date, 'yyyy-MM-dd'));
  }

  function isDisabled(date: Date) {
    return (
      isBefore(date, startOfToday()) ||
      !isWithinInterval(date, { start: SEASON_START, end: SEASON_END }) ||
      !isDateAvailable(date)
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Calendar */}
      <div className="flex-1">
        <div className="bg-brand-navy border border-brand-border p-6">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={month}
            onMonthChange={setMonth}
            disabled={isDisabled}
            startMonth={SEASON_START}
            endMonth={SEASON_END}
            modifiers={{
              available: (date) =>
                isWithinInterval(date, { start: SEASON_START, end: SEASON_END }) &&
                !isBefore(date, startOfToday()) &&
                isDateAvailable(date),
            }}
            modifiersClassNames={{
              available: 'rdp-day--available',
            }}
            classNames={{
              root: 'rdp-custom w-full',
              months: 'flex flex-col',
              month: 'w-full',
              month_caption: 'flex justify-between items-center mb-4 px-2',
              caption_label: 'text-white text-sm tracking-widest uppercase font-semibold',
              nav: 'flex gap-2',
              button_previous: 'text-brand-subtext hover:text-white transition-colors p-1',
              button_next: 'text-brand-subtext hover:text-white transition-colors p-1',
              chevron: 'fill-brand-ice',
              weeks: 'w-full',
              weekdays: 'grid grid-cols-7 mb-2',
              weekday: 'text-brand-subtext text-xs text-center py-2 tracking-widest uppercase',
              week: 'grid grid-cols-7',
              day: 'aspect-square flex items-center justify-center',
              day_button:
                'w-full h-full flex items-center justify-center text-sm rounded-none transition-all duration-150 text-brand-subtext disabled:opacity-25 disabled:cursor-not-allowed',
              selected:
                '!bg-brand-ice !text-brand-dark font-bold',
              today: 'text-white font-semibold',
              outside: 'opacity-20',
            }}
          />
          {loading && (
            <p className="text-center text-brand-subtext text-xs mt-2">Loading…</p>
          )}

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-brand-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-ice" />
              <span className="text-xs text-brand-subtext tracking-wider uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
                {t('available')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-border" />
              <span className="text-xs text-brand-subtext tracking-wider uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
                {t('unavailable')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time slots */}
      <div className="lg:w-72">
        <div className="bg-brand-navy border border-brand-border p-6 h-full">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <svg className="w-10 h-10 text-brand-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-brand-subtext text-sm">{t('selectDate')}</p>
            </div>
          ) : slotsForDate.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <svg className="w-10 h-10 text-brand-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-brand-subtext text-sm">{t('noSlots')}</p>
            </div>
          ) : (
            <div>
              <p
                className="text-white text-xs tracking-widest uppercase mb-4"
                style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
              >
                {format(selectedDate, 'MMMM d')}
              </p>
              <div className="flex flex-col gap-2">
                {slotsForDate.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => onSlotSelect(slot)}
                    className="flex items-center justify-between px-4 py-3 border border-brand-border hover:border-brand-ice hover:text-white text-brand-subtext transition-all duration-150 group"
                  >
                    <span className="text-sm">
                      {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                    </span>
                    <svg
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
