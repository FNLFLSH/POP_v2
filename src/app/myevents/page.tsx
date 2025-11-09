'use client';

import { useState } from "react";
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Edit,
  Trash2,
  X,
  Check,
} from "lucide-react";
import GlobalThemeToggle from "@/components/common/GlobalThemeToggle";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import clsx from "clsx";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  capacity: number;
  price: string;
  status: "upcoming" | "past" | "draft";
  image?: string;
};

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Summer Night Market",
    description: "Outdoor market with local vendors, food trucks, and live music",
    location: "Brooklyn Waterfront Park",
    date: "2024-07-15",
    time: "6:00 PM",
    attendees: 247,
    capacity: 500,
    price: "$25",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Tech Meetup Series",
    description: "Monthly networking event for tech professionals",
    location: "Soho Workspace",
    date: "2024-06-20",
    time: "7:00 PM",
    attendees: 89,
    capacity: 150,
    price: "Free",
    status: "past",
  },
  {
    id: "3",
    title: "Rooftop DJ Night",
    description: "Electronic music night with top local DJs",
    location: "Miami Rooftop Venue",
    date: "2024-08-10",
    time: "9:00 PM",
    attendees: 0,
    capacity: 200,
    price: "$40",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Wellness Workshop",
    description: "Yoga and meditation session in the park",
    location: "Central Park",
    date: "2024-05-12",
    time: "10:00 AM",
    attendees: 45,
    capacity: 60,
    price: "$15",
    status: "past",
  },
];

export default function MyEventsPage() {
  const { theme } = useThemeContext();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const isDarkTheme = theme === 'dark';

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true;
    return event.status === activeTab;
  });

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleCreateEvent = (eventData: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
  };

  return (
    <div 
      className={clsx(
        "transition-colors duration-500",
        isDarkTheme ? "bg-[#050505] text-[#f2f2f2]" : "bg-[#f5f5f5] text-[#1a1a1a]"
      )} 
      style={{ overflow: 'auto', height: '100vh', paddingBottom: '80px' }}
    >
      <GlobalThemeToggle />
      
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 pb-24 pt-20 md:px-10 lg:px-16">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-col items-start gap-2 text-left">
            <div className={clsx(
              "text-xs uppercase tracking-[0.32em]",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )}>
              my events
            </div>
            <div className="flex items-center gap-3">
              <Calendar className={clsx(
                "h-8 w-8",
                isDarkTheme ? "text-white" : "text-black"
              )} />
              <h1 className={clsx(
                "text-3xl font-black tracking-tight sm:text-4xl",
                isDarkTheme ? "text-white" : "text-black"
              )}>
                My Events
              </h1>
            </div>
            <p className={clsx(
              isDarkTheme ? "text-white/70" : "text-black/70"
            )}>
              Host new events and manage your event history
            </p>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all" as const, label: "All Events" },
              { id: "upcoming" as const, label: "Upcoming" },
              { id: "past" as const, label: "Past" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition",
                  activeTab === tab.id
                    ? isDarkTheme 
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-black/30 bg-black/10 text-black"
                    : isDarkTheme
                      ? "border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:text-white"
                      : "border-black/10 bg-white/40 text-black/70 hover:border-black/20 hover:text-black"
                )}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Host New Event Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:scale-105 transition-transform",
              isDarkTheme
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border-black/20 bg-black/10 text-black hover:bg-black/20"
            )}
          >
            <Plus className="h-5 w-5" />
            <span>Host New Event</span>
          </button>
        </div>

        {/* Events Grid */}
        <section className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className={clsx(
              "rounded-3xl px-6 py-16 text-center",
              isDarkTheme 
                ? "border border-white/10 bg-black/30 text-white/60"
                : "border border-black/10 bg-white/30 text-black/60"
            )}>
              <Calendar className={clsx(
                "h-12 w-12 mx-auto mb-4",
                isDarkTheme ? "text-white/40" : "text-black/40"
              )} />
              <p className="text-sm">
                {activeTab === "upcoming" 
                  ? "No upcoming events. Host your first event!"
                  : activeTab === "past"
                  ? "No past events yet."
                  : "No events yet. Host your first event!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isDarkTheme={isDarkTheme}
                  onDelete={handleDeleteEvent}
                  onEdit={setEditingEvent}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create/Edit Event Modal */}
      {(showCreateModal || editingEvent) && (
        <EventModal
          isOpen={showCreateModal || !!editingEvent}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
          }}
          onSubmit={handleCreateEvent}
          editingEvent={editingEvent}
          isDarkTheme={isDarkTheme}
        />
      )}
    </div>
  );
}

function EventCard({
  event,
  isDarkTheme,
  onDelete,
  onEdit,
}: {
  event: Event;
  isDarkTheme: boolean;
  onDelete: (id: string) => void;
  onEdit: (event: Event) => void;
}) {
  const isPast = event.status === "past";
  const isUpcoming = event.status === "upcoming";
  const attendanceRate = (event.attendees / event.capacity) * 100;

  return (
    <div className={clsx(
      "group flex flex-col overflow-hidden rounded-2xl border transition-all hover:scale-[1.02]",
      isDarkTheme 
        ? "border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60"
        : "border-black/10 bg-white/40 hover:border-black/20 hover:bg-white/60"
    )}>
      {/* Event Header */}
      <div className={clsx(
        "relative p-6",
        isUpcoming 
          ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          : "bg-gradient-to-br from-gray-500/20 to-gray-600/20"
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={clsx(
              "text-xl font-bold mb-2",
              isDarkTheme ? "text-white" : "text-black"
            )}>
              {event.title}
            </h3>
            <p className={clsx(
              "text-sm line-clamp-2",
              isDarkTheme ? "text-white/70" : "text-black/70"
            )}>
              {event.description}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(event)}
              className={clsx(
                "p-2 rounded-lg transition",
                isDarkTheme 
                  ? "hover:bg-white/10 text-white/60 hover:text-white"
                  : "hover:bg-black/10 text-black/60 hover:text-black"
              )}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className={clsx(
                "p-2 rounded-lg transition",
                isDarkTheme 
                  ? "hover:bg-red-500/20 text-red-400/60 hover:text-red-400"
                  : "hover:bg-red-500/20 text-red-600/60 hover:text-red-700"
              )}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={clsx(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]",
          isUpcoming
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
        )}>
          {isUpcoming ? (
            <>
              <Clock className="h-3 w-3" />
              <span>Upcoming</span>
            </>
          ) : (
            <>
              <Check className="h-3 w-3" />
              <span>Past</span>
            </>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="flex flex-col gap-4 p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className={clsx(
              "h-4 w-4 flex-shrink-0",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )} />
            <span className={clsx(
              isDarkTheme ? "text-white/80" : "text-black/80"
            )}>
              {event.location}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Clock className={clsx(
              "h-4 w-4 flex-shrink-0",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )} />
            <span className={clsx(
              isDarkTheme ? "text-white/80" : "text-black/80"
            )}>
              {new Date(event.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })} at {event.time}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Users className={clsx(
              "h-4 w-4 flex-shrink-0",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )} />
            <span className={clsx(
              isDarkTheme ? "text-white/80" : "text-black/80"
            )}>
              {event.attendees} / {event.capacity} attendees
            </span>
            {isUpcoming && (
              <div className={clsx(
                "ml-auto text-xs font-medium",
                attendanceRate >= 80 ? "text-green-400" : attendanceRate >= 50 ? "text-yellow-400" : "text-gray-400"
              )}>
                {attendanceRate.toFixed(0)}% full
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <DollarSign className={clsx(
              "h-4 w-4 flex-shrink-0",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )} />
            <span className={clsx(
              "font-semibold",
              isDarkTheme ? "text-white" : "text-black"
            )}>
              {event.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventModal({
  isOpen,
  onClose,
  onSubmit,
  editingEvent,
  isDarkTheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<Event, "id">) => void;
  editingEvent: Event | null;
  isDarkTheme: boolean;
}) {
  const [formData, setFormData] = useState({
    title: editingEvent?.title || "",
    description: editingEvent?.description || "",
    location: editingEvent?.location || "",
    date: editingEvent?.date || "",
    time: editingEvent?.time || "",
    capacity: editingEvent?.capacity || 100,
    price: editingEvent?.price || "$0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      attendees: editingEvent?.attendees || 0,
      status: editingEvent?.status || "upcoming",
    });
    setFormData({
      title: "",
      description: "",
      location: "",
      date: "",
      time: "",
      capacity: 100,
      price: "$0",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={clsx(
          "relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl",
          isDarkTheme
            ? "border-white/20 bg-[#0a0a0a] text-white"
            : "border-black/20 bg-white text-black"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={clsx(
            "absolute right-4 top-4 p-2 rounded-lg transition",
            isDarkTheme
              ? "hover:bg-white/10 text-white/60 hover:text-white"
              : "hover:bg-black/10 text-black/60 hover:text-black"
          )}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className={clsx(
          "text-2xl font-bold mb-6",
          isDarkTheme ? "text-white" : "text-black"
        )}>
          {editingEvent ? "Edit Event" : "Host New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={clsx(
              "block text-sm font-medium mb-2",
              isDarkTheme ? "text-white/80" : "text-black/80"
            )}>
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={clsx(
                "w-full rounded-lg border px-4 py-2 text-sm",
                isDarkTheme
                  ? "border-white/20 bg-black/40 text-white placeholder:text-white/40"
                  : "border-black/20 bg-white text-black placeholder:text-black/40"
              )}
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className={clsx(
              "block text-sm font-medium mb-2",
              isDarkTheme ? "text-white/80" : "text-black/80"
            )}>
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={clsx(
                "w-full rounded-lg border px-4 py-2 text-sm resize-none",
                isDarkTheme
                  ? "border-white/20 bg-black/40 text-white placeholder:text-white/40"
                  : "border-black/20 bg-white text-black placeholder:text-black/40"
              )}
              placeholder="Describe your event"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={clsx(
                "block text-sm font-medium mb-2",
                isDarkTheme ? "text-white/80" : "text-black/80"
              )}>
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={clsx(
                  "w-full rounded-lg border px-4 py-2 text-sm",
                  isDarkTheme
                    ? "border-white/20 bg-black/40 text-white placeholder:text-white/40"
                    : "border-black/20 bg-white text-black placeholder:text-black/40"
                )}
                placeholder="Venue address"
              />
            </div>

            <div>
              <label className={clsx(
                "block text-sm font-medium mb-2",
                isDarkTheme ? "text-white/80" : "text-black/80"
              )}>
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={clsx(
                  "w-full rounded-lg border px-4 py-2 text-sm",
                  isDarkTheme
                    ? "border-white/20 bg-black/40 text-white"
                    : "border-black/20 bg-white text-black"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={clsx(
                "block text-sm font-medium mb-2",
                isDarkTheme ? "text-white/80" : "text-black/80"
              )}>
                Time
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={clsx(
                  "w-full rounded-lg border px-4 py-2 text-sm",
                  isDarkTheme
                    ? "border-white/20 bg-black/40 text-white"
                    : "border-black/20 bg-white text-black"
                )}
              />
            </div>

            <div>
              <label className={clsx(
                "block text-sm font-medium mb-2",
                isDarkTheme ? "text-white/80" : "text-black/80"
              )}>
                Capacity
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className={clsx(
                  "w-full rounded-lg border px-4 py-2 text-sm",
                  isDarkTheme
                    ? "border-white/20 bg-black/40 text-white"
                    : "border-black/20 bg-white text-black"
                )}
                placeholder="Max attendees"
              />
            </div>
          </div>

          <div>
            <label className={clsx(
              "block text-sm font-medium mb-2",
              isDarkTheme ? "text-white/80" : "text-black/80"
            )}>
              Ticket Price
            </label>
            <input
              type="text"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={clsx(
                "w-full rounded-lg border px-4 py-2 text-sm",
                isDarkTheme
                  ? "border-white/20 bg-black/40 text-white placeholder:text-white/40"
                  : "border-black/20 bg-white text-black placeholder:text-black/40"
              )}
              placeholder="$25 or Free"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={clsx(
                "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition",
                isDarkTheme
                  ? "border-white/20 bg-black/40 text-white/70 hover:bg-black/60"
                  : "border-black/20 bg-white text-black/70 hover:bg-gray-100"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-purple-700 hover:to-pink-700"
            >
              {editingEvent ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
