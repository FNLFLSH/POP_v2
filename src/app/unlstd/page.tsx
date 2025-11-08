'use client';

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Compass,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Users,
  X,
  CreditCard,
  Clock,
  Ticket,
  ChevronDown,
} from "lucide-react";
import GlobalThemeToggle from "@/components/common/GlobalThemeToggle";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import clsx from "clsx";

type EventCard = {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  start: string;
  location: string;
  city: string;
  timeframe: "tonight" | "this-week" | "next-week" | "this-month";
  vibe: "school" | "nightlife" | "wellness";
  attendees: number;
  spotsLeft: number;
  ageGate: string;
  badge?: string;
  coverGradient: string;
};

const FILTER_OPTIONS = {
  city: [
    { value: "all", label: "All Cities" },
    { value: "atlanta", label: "Atlanta" },
    { value: "brooklyn", label: "Brooklyn" },
    { value: "austin", label: "Austin" },
    { value: "chicago", label: "Chicago" },
    { value: "miami", label: "Miami" },
    { value: "los-angeles", label: "Los Angeles" },
    { value: "san-francisco", label: "San Francisco" },
    { value: "seattle", label: "Seattle" },
    { value: "denver", label: "Denver" },
    { value: "boston", label: "Boston" },
    { value: "philadelphia", label: "Philadelphia" },
    { value: "detroit", label: "Detroit" },
    { value: "nashville", label: "Nashville" },
    { value: "portland", label: "Portland" },
  ],
  timeframe: [
    { value: "all", label: "Any Time" },
    { value: "tonight", label: "Tonight" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "this-weekend", label: "This Weekend" },
    { value: "this-week", label: "This Week" },
    { value: "next-week", label: "Next Week" },
    { value: "this-month", label: "This Month" },
    { value: "next-month", label: "Next Month" },
    { value: "morning", label: "Morning (6AM-12PM)" },
    { value: "afternoon", label: "Afternoon (12PM-6PM)" },
    { value: "evening", label: "Evening (6PM-12AM)" },
    { value: "late-night", label: "Late Night (12AM-6AM)" },
  ],
  vibe: [
    { value: "all", label: "All Vibes" },
    { value: "nightlife", label: "Nightlife" },
    { value: "school", label: "Campus" },
    { value: "wellness", label: "Wellness" },
    { value: "art", label: "Art & Culture" },
    { value: "music", label: "Music" },
    { value: "sports", label: "Sports" },
    { value: "food", label: "Food & Drink" },
    { value: "tech", label: "Tech" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Fitness" },
    { value: "outdoor", label: "Outdoor" },
    { value: "comedy", label: "Comedy" },
    { value: "dance", label: "Dance" },
    { value: "networking", label: "Networking" },
  ],
};

const EVENTS: EventCard[] = [
  {
    id: "afterglow-atrium",
    name: "Afterglow Atrium",
    price: "$1",
    priceNote: "midnight launch",
    start: "2025-03-28T22:30:00-04:00",
    location: "Fulton Market, Brooklyn",
    city: "brooklyn",
    timeframe: "this-week",
    vibe: "nightlife",
    attendees: 6,
    spotsLeft: 94,
    ageGate: "18+",
    badge: "featured drop",
    coverGradient: "from-[#272c55] via-[#7659b8] to-[#e27a7a]",
  },
  {
    id: "phirst-down",
    name: "Phirst Down",
    price: "FREE",
    priceNote: "official afterparty",
    start: "2025-10-12T22:00:00-04:00",
    location: "Rodeo Athens, GA",
    city: "atlanta",
    timeframe: "this-month",
    vibe: "school",
    attendees: 2,
    spotsLeft: 898,
    ageGate: "18+",
    badge: "free event",
    coverGradient: "from-[#1e1f3f] via-[#3f2ca4] to-[#87ff47]",
  },
  {
    id: "motion-lab",
    name: "Motion Lab: Open Floor",
    price: "$12",
    priceNote: "immersive movement club",
    start: "2025-03-30T18:00:00-05:00",
    location: "Warehouse 09, Chicago",
    city: "chicago",
    timeframe: "this-week",
    vibe: "wellness",
    attendees: 11,
    spotsLeft: 54,
    ageGate: "21+",
    coverGradient: "from-[#101f29] via-[#246d7d] to-[#f0f8ff]",
  },
  {
    id: "campus-circuit",
    name: "Campus Circuit Pop-Up",
    price: "$5",
    priceNote: "student insiders",
    start: "2025-04-04T20:00:00-04:00",
    location: "Eastside Yards, Atlanta",
    city: "atlanta",
    timeframe: "next-week",
    vibe: "school",
    attendees: 8,
    spotsLeft: 140,
    ageGate: "18+",
    coverGradient: "from-[#231f20] via-[#5c1b6f] to-[#ff7b4a]",
  },
  {
    id: "echo-pool",
    name: "Echo Pool Sessions",
    price: "$18",
    priceNote: "immersive sound bath",
    start: "2025-03-27T19:00:00-05:00",
    location: "South Congress Loft, Austin",
    city: "austin",
    timeframe: "tonight",
    vibe: "wellness",
    attendees: 14,
    spotsLeft: 22,
    ageGate: "21+",
    coverGradient: "from-[#132833] via-[#247b8a] to-[#6ff2d9]",
  },
  {
    id: "neon-underground",
    name: "Neon Underground",
    price: "$25",
    priceNote: "cyberpunk rave",
    start: "2025-04-01T23:00:00-04:00",
    location: "Warehouse District, Brooklyn",
    city: "brooklyn",
    timeframe: "next-week",
    vibe: "nightlife",
    attendees: 23,
    spotsLeft: 77,
    ageGate: "21+",
    badge: "hot ticket",
    coverGradient: "from-[#1a0033] via-[#6600cc] to-[#ff00ff]",
  },
  {
    id: "zen-garden-sessions",
    name: "Zen Garden Sessions",
    price: "$15",
    priceNote: "meditation & music",
    start: "2025-03-29T10:00:00-05:00",
    location: "Botanical Gardens, Chicago",
    city: "chicago",
    timeframe: "this-week",
    vibe: "wellness",
    attendees: 7,
    spotsLeft: 43,
    ageGate: "18+",
    coverGradient: "from-[#0d2818] via-[#2d5016] to-[#7cb518]",
  },
  {
    id: "college-night-mix",
    name: "College Night Mix",
    price: "$8",
    priceNote: "student exclusive",
    start: "2025-04-05T21:00:00-04:00",
    location: "Campus Center, Austin",
    city: "austin",
    timeframe: "next-week",
    vibe: "school",
    attendees: 15,
    spotsLeft: 85,
    ageGate: "18+",
    badge: "student deal",
    coverGradient: "from-[#2c1810] via-[#8b4513] to-[#ffd700]",
  },
  {
    id: "midnight-basement",
    name: "Midnight Basement",
    price: "$20",
    priceNote: "underground beats",
    start: "2025-03-31T00:00:00-04:00",
    location: "Industrial Complex, Atlanta",
    city: "atlanta",
    timeframe: "this-week",
    vibe: "nightlife",
    attendees: 19,
    spotsLeft: 81,
    ageGate: "21+",
    coverGradient: "from-[#0a0a0a] via-[#333333] to-[#666666]",
  },
  {
    id: "sunset-sessions",
    name: "Sunset Sessions",
    price: "$15",
    priceNote: "rooftop vibes",
    start: "2025-04-02T18:00:00-05:00",
    location: "Sky Lounge, Miami",
    city: "miami",
    timeframe: "this-week",
    vibe: "music",
    attendees: 12,
    spotsLeft: 88,
    ageGate: "21+",
    badge: "sunset special",
    coverGradient: "from-[#ff6b35] via-[#f7931e] to-[#ffd23f]",
  },
  {
    id: "tech-meetup",
    name: "Tech Meetup: AI & Future",
    price: "FREE",
    priceNote: "networking event",
    start: "2025-04-03T19:00:00-08:00",
    location: "Innovation Hub, San Francisco",
    city: "san-francisco",
    timeframe: "this-week",
    vibe: "tech",
    attendees: 45,
    spotsLeft: 55,
    ageGate: "18+",
    badge: "free event",
    coverGradient: "from-[#667eea] via-[#764ba2] to-[#f093fb]",
  },
  {
    id: "art-gallery-night",
    name: "Art Gallery Night",
    price: "$25",
    priceNote: "exclusive opening",
    start: "2025-04-05T20:00:00-05:00",
    location: "Modern Art Space, Los Angeles",
    city: "los-angeles",
    timeframe: "next-week",
    vibe: "art",
    attendees: 8,
    spotsLeft: 42,
    ageGate: "21+",
    coverGradient: "from-[#ff9a9e] via-[#fecfef] to-[#fecfef]",
  },
  {
    id: "morning-yoga",
    name: "Morning Yoga Flow",
    price: "$12",
    priceNote: "outdoor session",
    start: "2025-04-06T08:00:00-07:00",
    location: "Central Park, Denver",
    city: "denver",
    timeframe: "morning",
    vibe: "fitness",
    attendees: 23,
    spotsLeft: 27,
    ageGate: "16+",
    coverGradient: "from-[#a8edea] via-[#fed6e3] to-[#d299c2]",
  },
];

const formatDate = (iso: string) => {
  // Parse the ISO string manually to avoid timezone issues
  const date = new Date(iso);
  
  // Force UTC to ensure consistency between server and client
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const month = months[utcDate.getMonth()];
  const day = utcDate.getDate();
  const year = utcDate.getFullYear();
  const hour = utcDate.getHours();
  const minute = utcDate.getMinutes();
  
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const minuteStr = minute.toString().padStart(2, '0');
  
  return `${month} ${day}, ${year} at ${hour12}:${minuteStr} ${ampm}`;
};

export default function DiscoverPage() {
  const { theme } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    city: "all",
    timeframe: "all",
    vibe: "all",
  });
  const [selectedEvent, setSelectedEvent] = useState<EventCard | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const isDarkTheme = theme === 'dark';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on dropdown buttons or dropdown content
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return EVENTS.filter((event) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        event.name.toLowerCase().includes(normalizedQuery) ||
        event.location.toLowerCase().includes(normalizedQuery) ||
        event.priceNote.toLowerCase().includes(normalizedQuery);

      const matchesCity =
        filters.city === "all" || event.city === filters.city;

      // Enhanced timeframe matching
      const matchesTimeframe = (() => {
        if (filters.timeframe === "all") return true;
        
        // Direct matches
        if (event.timeframe === filters.timeframe) return true;
        
        // Time-based matching
        const eventDate = new Date(event.start);
        const now = new Date();
        const eventHour = eventDate.getHours();
        
        switch (filters.timeframe) {
          case "morning":
            return eventHour >= 6 && eventHour < 12;
          case "afternoon":
            return eventHour >= 12 && eventHour < 18;
          case "evening":
            return eventHour >= 18 && eventHour < 24;
          case "late-night":
            return eventHour >= 0 && eventHour < 6;
          case "tomorrow":
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return eventDate.toDateString() === tomorrow.toDateString();
          case "this-weekend":
            const dayOfWeek = eventDate.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
          case "next-month":
            return eventDate.getMonth() === (now.getMonth() + 1) % 12;
          default:
            return false;
        }
      })();

      const matchesVibe =
        filters.vibe === "all" || event.vibe === filters.vibe;

      return matchesSearch && matchesCity && matchesTimeframe && matchesVibe;
    });
  }, [searchQuery, filters]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "all" : value,
    }));
  };

  return (
    <div 
      className={clsx(
        "transition-colors duration-500",
        isDarkTheme ? "bg-[#050505] text-[#f2f2f2]" : "bg-[#f5f5f5] text-[#1a1a1a]"
      )} 
      style={{ overflow: 'auto', height: '100vh' }}
    >
      <GlobalThemeToggle />
      
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 pb-24 pt-20 md:px-10 lg:px-16">
        <Header />

        <section className={clsx(
          "flex flex-col gap-4 rounded-[32px] p-6 backdrop-blur-sm lg:p-8",
          isDarkTheme 
            ? "border border-white/10 bg-white/[0.02]"
            : "border border-black/10 bg-black/[0.02]"
        )}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterControls
            activeFilters={filters}
            onSelect={updateFilter}
            openDropdown={openDropdown}
            onToggleDropdown={setOpenDropdown}
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={clsx(
              "text-2xl font-semibold tracking-tight sm:text-3xl",
              isDarkTheme ? "text-white" : "text-black"
            )}>
              Events
            </h2>
          </div>

          <EventGrid events={filteredEvents} onEventClick={setSelectedEvent} />
        </section>
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          ticketQuantity={ticketQuantity}
          onTicketQuantityChange={setTicketQuantity}
        />
      )}
    </div>
  );
}

function Header() {
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';
  
  return (
    <header className="space-y-4">
      <div className="flex flex-col items-start gap-2 text-left">
        <div className={clsx(
          "text-xs uppercase tracking-[0.32em]",
          isDarkTheme ? "text-white/60" : "text-black/60"
        )}>
          discover
        </div>
        <div className="flex items-center gap-3">
          <Compass className={clsx(
            "h-8 w-8",
            isDarkTheme ? "text-white" : "text-black"
          )} />
          <h1 className={clsx(
            "text-3xl font-black tracking-tight sm:text-4xl",
            isDarkTheme ? "text-white" : "text-black"
          )}>
            Find your next night
          </h1>
        </div>
      </div>
    </header>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';
  
  return (
    <div className={clsx(
      "relative flex items-center overflow-hidden rounded-2xl px-4 py-3 text-sm transition focus-within:ring-2",
      isDarkTheme 
        ? "border border-white/10 bg-black/40 text-white/80 ring-white/10 focus-within:border-white/20"
        : "border border-black/10 bg-white/40 text-black/80 ring-black/10 focus-within:border-black/20"
    )}>
      <Search className={clsx(
        "mr-3 h-4 w-4",
        isDarkTheme ? "text-white/40" : "text-black/40"
      )} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for venues, vibes, or price"
        className={clsx(
          "w-full bg-transparent text-sm focus:outline-none",
          isDarkTheme 
            ? "text-white placeholder:text-white/40"
            : "text-black placeholder:text-black/40"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={clsx(
            "rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.32em] transition",
            isDarkTheme 
              ? "border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
              : "border border-black/10 text-black/50 hover:border-black/20 hover:text-black"
          )}
        >
          clear
        </button>
      )}
    </div>
  );
}

function FilterControls({
  activeFilters,
  onSelect,
  openDropdown,
  onToggleDropdown,
}: {
  activeFilters: { city: string; timeframe: string; vibe: string };
  onSelect: (key: "city" | "timeframe" | "vibe", value: string) => void;
  openDropdown: string | null;
  onToggleDropdown: (key: string | null) => void;
}) {
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';
  
  const filterConfigs = [
    { key: "city", options: FILTER_OPTIONS.city, label: "City" },
    { key: "timeframe", options: FILTER_OPTIONS.timeframe, label: "When" },
    { key: "vibe", options: FILTER_OPTIONS.vibe, label: "Vibe" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs uppercase tracking-[0.32em]",
        isDarkTheme 
          ? "border border-white/10 bg-white/5 text-white/60"
          : "border border-black/10 bg-black/5 text-black/60"
      )}>
        <Filter className="h-3.5 w-3.5" />
        filters
      </span>
      
      {filterConfigs.map(({ key, options, label }) => {
        const isOpen = openDropdown === key;
        const selectedOption = options.find(opt => opt.value === activeFilters[key]);
        
        return (
          <div key={key} className="relative" data-dropdown>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDropdown(isOpen ? null : key);
              }}
              className={clsx(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] transition",
                isDarkTheme 
                  ? "border border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:text-white"
                  : "border border-black/10 bg-white/40 text-black/70 hover:border-black/20 hover:text-black"
              )}
            >
              <span>{selectedOption?.label || label}</span>
              <ChevronDown className={`h-2.5 w-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className={clsx(
                "absolute top-full left-0 mt-1.5 min-w-[140px] max-h-[200px] rounded-lg backdrop-blur-sm shadow-xl z-50 overflow-hidden",
                isDarkTheme 
                  ? "border border-white/10 bg-black/60"
                  : "border border-black/10 bg-white/60"
              )}>
                <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {options.map((option) => {
                    const isActive = activeFilters[key] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onSelect(key, option.value);
                          onToggleDropdown(null);
                        }}
                        className={clsx(
                          "w-full px-3 py-2 text-left text-[10px] uppercase tracking-[0.3em] transition",
                          isActive
                            ? isDarkTheme 
                              ? "text-white bg-white/5"
                              : "text-black bg-black/5"
                            : isDarkTheme
                              ? "text-white/70 hover:text-white hover:bg-white/10"
                              : "text-black/70 hover:text-black hover:bg-black/10",
                          option === options[0] ? "rounded-t-lg" : "",
                          option === options[options.length - 1] ? "rounded-b-lg" : ""
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EventGrid({ events, onEventClick }: { events: EventCard[]; onEventClick: (event: EventCard) => void }) {
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';
  
  if (events.length === 0) {
    return (
      <div className={clsx(
        "rounded-3xl px-6 py-16 text-center text-sm",
        isDarkTheme 
          ? "border border-white/10 bg-black/30 text-white/60"
          : "border border-black/10 bg-white/30 text-black/60"
      )}>
        No drops match those filters yet. Reset filters or check back after our next release window.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {events.map((event) => {
        const vibeLabel = event.vibe.replace(/-/g, " ");
        return (
          <article
            key={event.id}
            onClick={() => onEventClick(event)}
            className={clsx(
              "group flex h-full flex-col overflow-hidden rounded-[28px] transition cursor-pointer",
              isDarkTheme 
                ? "border border-white/10 bg-black/40 shadow-[0_0_45px_rgba(0,0,0,0.35)] hover:border-white/20 hover:bg-black/60"
                : "border border-black/10 bg-white/40 shadow-[0_0_45px_rgba(0,0,0,0.15)] hover:border-black/20 hover:bg-white/60"
            )}
          >
          <div
            className={`relative flex h-48 items-end justify-between overflow-hidden bg-gradient-to-br ${event.coverGradient} p-5 sm:h-56`}
          >
            <div className="flex flex-col gap-2 text-white drop-shadow">
              <span className="text-base font-semibold tracking-tight">{event.price}</span>
              <span className="text-xs uppercase tracking-[0.28em] opacity-80">{event.priceNote}</span>
            </div>
            {event.badge && (
              <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
                {event.badge}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="space-y-1">
              <h3 className={clsx(
                "text-lg font-semibold",
                isDarkTheme ? "text-white" : "text-black"
              )}>{event.name}</h3>
              <div className={clsx(
                "flex items-center gap-2 text-[13px]",
                isDarkTheme ? "text-white/70" : "text-black/70"
              )}>
                <Calendar className={clsx("h-4 w-4", isDarkTheme ? "text-white/40" : "text-black/40")} />
                <span>{formatDate(event.start)}</span>
              </div>
              <div className={clsx(
                "flex items-center gap-2 text-[13px]",
                isDarkTheme ? "text-white/70" : "text-black/70"
              )}>
                <MapPin className={clsx("h-4 w-4", isDarkTheme ? "text-white/40" : "text-black/40")} />
                <span>{event.location}</span>
              </div>
            </div>

            <div className={clsx(
              "grid gap-2 text-[12px] uppercase tracking-[0.32em]",
              isDarkTheme ? "text-white/55" : "text-black/55"
            )}>
              <div className="flex items-center gap-2">
                <Users className={clsx("h-4 w-4", isDarkTheme ? "text-white/35" : "text-black/35")} />
                <span>{event.attendees} going · {event.spotsLeft} left</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className={clsx("h-4 w-4", isDarkTheme ? "text-white/35" : "text-black/35")} />
                <span>{vibeLabel}</span>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <span className={clsx(
                "rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.32em]",
                isDarkTheme 
                  ? "border border-white/10 text-white/60"
                  : "border border-black/10 text-black/60"
              )}>
                {event.ageGate}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.3em] transition",
                  isDarkTheme 
                    ? "border border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
                    : "border border-black/15 bg-black/5 text-black/70 hover:border-black/30 hover:bg-black/10 hover:text-black"
                )}
              >
                get tickets
              </button>
            </div>
          </div>
        </article>
        );
      })}
    </div>
  );
}

function EventModal({
  event,
  onClose,
  ticketQuantity,
  onTicketQuantityChange,
}: {
  event: EventCard;
  onClose: () => void;
  ticketQuantity: number;
  onTicketQuantityChange: (quantity: number) => void;
}) {
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';
  
  const vibeLabel = event.vibe.replace(/-/g, " ");
  const totalPrice = event.price === "FREE" ? 0 : parseInt(event.price.replace("$", "")) * ticketQuantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={clsx(
        "mx-4 flex max-w-6xl max-h-[90vh] w-full overflow-hidden rounded-3xl shadow-2xl",
        isDarkTheme 
          ? "border border-white/10 bg-black/60"
          : "border border-black/10 bg-white/60"
      )}>
        {/* Event Flyer - Left Side */}
        <div className="flex-1 p-8">
          <div className={`relative h-full min-h-[500px] rounded-2xl bg-gradient-to-br ${event.coverGradient} p-8 flex flex-col justify-between`}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className={clsx(
                "absolute top-4 right-4 rounded-full p-2 transition",
                isDarkTheme 
                  ? "border border-white/20 bg-black/30 text-white/70 hover:bg-black/50 hover:text-white"
                  : "border border-black/20 bg-white/30 text-black/70 hover:bg-white/50 hover:text-black"
              )}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Event Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm uppercase tracking-[0.32em] text-white/80">pop! event</span>
                <h1 className="text-3xl font-black text-white">{event.name}</h1>
                <p className="text-lg text-white/90">{event.priceNote}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                  <Calendar className="h-5 w-5 text-white/60" />
                  <span>{formatDate(event.start)}</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <MapPin className="h-5 w-5 text-white/60" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Users className="h-5 w-5 text-white/60" />
                  <span>{event.attendees} going · {event.spotsLeft} spots left</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Sparkles className="h-5 w-5 text-white/60" />
                  <span className="capitalize">{vibeLabel}</span>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="space-y-2">
              <div className="text-4xl font-black text-white">{event.price}</div>
              {event.badge && (
                <span className="inline-block rounded-full border border-white/30 bg-white/20 px-3 py-1 text-sm uppercase tracking-[0.3em] text-white">
                  {event.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Purchase - Right Side */}
        <div className="w-96 p-8 flex flex-col">
          <div className="space-y-6">
            <div>
              <h2 className={clsx(
                "text-2xl font-bold mb-2",
                isDarkTheme ? "text-white" : "text-black"
              )}>Get Your Tickets</h2>
              <p className={clsx(
                isDarkTheme ? "text-white/70" : "text-black/70"
              )}>Secure your spot for this exclusive event</p>
            </div>

            {/* Ticket Quantity */}
            <div className="space-y-3">
              <label className={clsx(
                "text-sm font-medium",
                isDarkTheme ? "text-white/90" : "text-black/90"
              )}>Number of Tickets</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onTicketQuantityChange(Math.max(1, ticketQuantity - 1))}
                  className={clsx(
                    "rounded-full p-2 transition",
                    isDarkTheme 
                      ? "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      : "border border-black/20 bg-black/5 text-black/70 hover:bg-black/10 hover:text-black"
                  )}
                >
                  -
                </button>
                <span className={clsx(
                  "text-xl font-semibold w-8 text-center",
                  isDarkTheme ? "text-white" : "text-black"
                )}>{ticketQuantity}</span>
                <button
                  onClick={() => onTicketQuantityChange(Math.min(10, ticketQuantity + 1))}
                  className={clsx(
                    "rounded-full p-2 transition",
                    isDarkTheme 
                      ? "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      : "border border-black/20 bg-black/5 text-black/70 hover:bg-black/10 hover:text-black"
                  )}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className={clsx(
              "space-y-3 p-4 rounded-xl",
              isDarkTheme 
                ? "border border-white/10 bg-white/5"
                : "border border-black/10 bg-black/5"
            )}>
              <div className={clsx(
                "flex justify-between",
                isDarkTheme ? "text-white/90" : "text-black/90"
              )}>
                <span>Tickets ({ticketQuantity}x)</span>
                <span>{event.price === "FREE" ? "FREE" : `$${parseInt(event.price.replace("$", "")) * ticketQuantity}`}</span>
              </div>
              <div className={clsx(
                "flex justify-between",
                isDarkTheme ? "text-white/90" : "text-black/90"
              )}>
                <span>Service Fee</span>
                <span>{event.price === "FREE" ? "FREE" : "$2.50"}</span>
              </div>
              <div className={clsx(
                "border-t pt-3",
                isDarkTheme ? "border-white/10" : "border-black/10"
              )}>
                <div className={clsx(
                  "flex justify-between text-lg font-semibold",
                  isDarkTheme ? "text-white" : "text-black"
                )}>
                  <span>Total</span>
                  <span>{event.price === "FREE" ? "FREE" : `$${totalPrice + 2.50}`}</span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 text-white font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Purchase Tickets
            </button>

            {/* Additional Info */}
            <div className={clsx(
              "space-y-2 text-sm",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Tickets are non-refundable</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span>Digital tickets sent via email</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}