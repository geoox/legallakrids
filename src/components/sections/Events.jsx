import { useState } from 'react';
import { events } from '../../data/events.js';
import { Icon } from '../ui/Icon.jsx';

export const Events = () => {
  const [eventFilter, setEventFilter] = useState('upcoming');
  const [showAllEvents, setShowAllEvents] = useState(false);


  const today = new Date();
  const sortedEvents = events
    .map((event) => {
      const eventDate = new Date(`${event.date}T23:59:59`);
      const eventEnd = event.endAt ? new Date(event.endAt) : eventDate;
      return { ...event, isPast: eventEnd < today, eventDate };
    })
    .sort((a, b) => {
      if (a.isPast !== b.isPast) {
        return a.isPast ? 1 : -1;
      }
      return a.isPast ? b.eventDate - a.eventDate : a.eventDate - b.eventDate;
    });
  const upcomingEvents = sortedEvents.filter((event) => !event.isPast);
  const pastEvents = sortedEvents.filter((event) => event.isPast);
  const filteredEvents = eventFilter === 'upcoming' ? upcomingEvents : pastEvents;
  const visibleEvents = showAllEvents ? filteredEvents : filteredEvents.slice(0, 4);

  const changeEventFilter = (filter) => {
    setEventFilter(filter);
    setShowAllEvents(false);
  };

  return (
    <section id="events" className="section-shell scroll-mt-20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">Meet and exchange</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Events</h2>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Connect with peers and gain valuable insights at legal events across Scandinavia.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-max rounded-full border border-stone-200 bg-stone-100 p-1" role="group" aria-label="Filter events">
          {[
            { id: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
            { id: 'past', label: 'Past', count: pastEvents.length }
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => changeEventFilter(filter.id)}
              aria-pressed={eventFilter === filter.id}
              className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-all duration-300 ${
                eventFilter === filter.id
                  ? 'bg-stone-950 text-white shadow-md'
                  : 'text-stone-600 hover:bg-white hover:text-stone-950'
              }`}
            >
              {filter.label}
              <span className={`ml-2 text-xs ${eventFilter === filter.id ? 'text-white/60' : 'text-stone-400'}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-5xl space-y-5">
          {visibleEvents.map((event) => {
            const month = new Intl.DateTimeFormat('en', { month: 'short' })
              .format(event.eventDate)
              .toUpperCase();
            const day = new Intl.DateTimeFormat('en', { day: '2-digit' })
              .format(event.eventDate);
            const endDay = event.endDate
              ? new Intl.DateTimeFormat('en', { day: '2-digit' })
                  .format(new Date(`${event.endDate}T23:59:59`))
              : null;
            const year = event.eventDate.getFullYear();

            return (
              <article
                key={event.title}
                className={`premium-card overflow-hidden ${event.isPast ? 'opacity-75 hover:opacity-100' : ''}`}
              >
                <div className="grid gap-6 p-6 sm:grid-cols-[5rem_1fr] md:grid-cols-[5rem_1fr_auto] md:items-center md:p-7">
                  <time
                    dateTime={event.date}
                    className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-stone-950 text-white shadow-lg"
                  >
                    <span className="text-[0.65rem] font-bold tracking-[0.18em] text-white/65">{month}</span>
                    <span className={`${endDay ? 'text-xl' : 'text-3xl'} font-serif font-semibold leading-none`}>
                      {endDay ? `${day}–${endDay}` : day}
                    </span>
                    <span className="mt-1 text-[0.65rem] text-white/65">{year}</span>
                  </time>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${
                        event.isPast
                          ? 'bg-stone-200 text-stone-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {event.isPast ? 'Past event' : 'Upcoming'}
                      </span>
                      {event.time && <span className="text-xs font-semibold text-stone-600">{event.time}</span>}
                      {event.location && <span className="text-xs text-stone-500">{event.location}</span>}
                    </div>
                    <div className="mt-3 flex items-start gap-3">
                      <span className="mt-1 hidden text-[#9a7441] sm:block">
                        <Icon path={event.iconPath} />
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-stone-950">{event.title}</h3>
                        {event.description && (
                          <p className="mt-2 text-sm leading-6 text-stone-600">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {event.hrefLink && (
                    <a
                      href={event.hrefLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button w-full gap-2 md:w-auto"
                      aria-label={`Read more about ${event.title} (opens in a new tab)`}
                    >
                      Read more
                      <Icon path="M13.5 4.5H19.5V10.5M19 5L10 14M6.75 6.75H5.25A2.25 2.25 0 003 9V18.75A2.25 2.25 0 005.25 21H15A2.25 2.25 0 0017.25 18.75V17.25" className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {filteredEvents.length > 4 && (
          <div className="mt-9 text-center">
            <button
              type="button"
              onClick={() => setShowAllEvents((isShowingAll) => !isShowingAll)}
              className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md"
              aria-expanded={showAllEvents}
            >
              {showAllEvents
                ? 'Show fewer events'
                : `Show all ${filteredEvents.length} ${eventFilter} events`}
              <Icon
                path={showAllEvents ? 'M19.5 15l-7.5-7.5L4.5 15' : 'M4.5 9l7.5 7.5L19.5 9'}
                className="ml-2 h-4 w-4"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
