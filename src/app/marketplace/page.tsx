'use client';

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  Package,
  MapPin,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Star,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import GlobalThemeToggle from "@/components/common/GlobalThemeToggle";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import clsx from "clsx";

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: "venue" | "equipment" | "store";
  location: string;
  rating: number;
  reviews: number;
  seller: string;
  featured?: boolean;
};

const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "warehouse-brooklyn",
    title: "Industrial Warehouse Space",
    description: "Massive 5,000 sq ft industrial space perfect for large events, raves, and installations. Includes sound system and lighting rig.",
    price: "$2,500/night",
    image: "warehouse-gradient",
    category: "venue",
    location: "Brooklyn, NY",
    rating: 4.8,
    reviews: 24,
    seller: "Brooklyn Venues Co.",
    featured: true,
  },
  {
    id: "sound-system-pro",
    title: "Professional Sound System",
    description: "Complete DJ setup with Pioneer CDJs, mixer, and premium speakers. Perfect for events up to 500 people.",
    price: "$800/weekend",
    image: "sound-gradient",
    category: "equipment",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 18,
    seller: "Audio Pro Rentals",
  },
  {
    id: "pop-store-template",
    title: "POP! Store Template",
    description: "Complete storefront template for hosting your own marketplace. Includes payment processing, inventory management, and analytics.",
    price: "$99/month",
    image: "store-gradient",
    category: "store",
    location: "Digital",
    rating: 4.7,
    reviews: 156,
    seller: "POP! Platform",
    featured: true,
  },
  {
    id: "rooftop-miami",
    title: "Oceanview Rooftop",
    description: "Stunning rooftop venue with 360° ocean views. Capacity for 200 guests with full bar and catering options.",
    price: "$3,200/night",
    image: "rooftop-gradient",
    category: "venue",
    location: "Miami, FL",
    rating: 4.6,
    reviews: 31,
    seller: "Miami Events",
  },
  {
    id: "lighting-rig",
    title: "LED Lighting Rig",
    description: "Professional LED lighting system with DMX control. Perfect for clubs, events, and installations.",
    price: "$450/weekend",
    image: "lighting-gradient",
    category: "equipment",
    location: "Chicago, IL",
    rating: 4.5,
    reviews: 12,
    seller: "Lighting Solutions",
  },
  {
    id: "custom-store-builder",
    title: "Custom Store Builder",
    description: "Build your own marketplace store with drag-and-drop interface. No coding required.",
    price: "$199/month",
    image: "builder-gradient",
    category: "store",
    location: "Digital",
    rating: 4.8,
    reviews: 89,
    seller: "POP! Platform",
  },
];

const TABS = [
  { id: "venues", label: "Venues", icon: <MapPin className="h-4 w-4" /> },
  { id: "equipment", label: "Equipment", icon: <Package className="h-4 w-4" /> },
  { id: "stores", label: "Stores", icon: <Store className="h-4 w-4" /> },
];

export default function MarketplacePage() {
  const { theme } = useThemeContext();
  const [activeTab, setActiveTab] = useState("venues");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const isDarkTheme = theme === 'dark';

  const filteredItems = MARKETPLACE_ITEMS.filter((item) => {
    const matchesTab = item.category === activeTab.slice(0, -1); // Remove 's' from tab id
    const matchesSearch = 
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getGradientClass = (image: string) => {
    const gradients: Record<string, string> = {
      "warehouse-gradient": "from-[#1a1a1a] via-[#333333] to-[#666666]",
      "sound-gradient": "from-[#667eea] via-[#764ba2] to-[#f093fb]",
      "store-gradient": "from-[#ff6b35] via-[#f7931e] to-[#ffd23f]",
      "rooftop-gradient": "from-[#00c6ff] via-[#0072ff] to-[#0052cc]",
      "lighting-gradient": "from-[#ff9a9e] via-[#fecfef] to-[#fecfef]",
      "builder-gradient": "from-[#a8edea] via-[#fed6e3] to-[#d299c2]",
    };
    return gradients[image] || "from-[#667eea] via-[#764ba2] to-[#f093fb]";
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
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-col items-start gap-2 text-left">
            <div className={clsx(
              "text-xs uppercase tracking-[0.32em]",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )}>
              marketplace
            </div>
            <div className="flex items-center gap-3">
              <Store className={clsx(
                "h-8 w-8",
                isDarkTheme ? "text-white" : "text-black"
              )} />
              <h1 className={clsx(
                "text-3xl font-black tracking-tight sm:text-4xl",
                isDarkTheme ? "text-white" : "text-black"
              )}>
                Buy, Sell, Host
              </h1>
            </div>
            <p className={clsx(
              isDarkTheme ? "text-white/70" : "text-black/70"
            )}>
              Venues, equipment, and store hosting all in one place
            </p>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <section className={clsx(
          "flex flex-col gap-4 rounded-[32px] p-6 backdrop-blur-sm lg:p-8",
          isDarkTheme 
            ? "border border-white/10 bg-white/[0.02]"
            : "border border-black/10 bg-black/[0.02]"
        )}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search venues, equipment, stores..."
                  className={clsx(
                    "w-full bg-transparent text-sm focus:outline-none",
                    isDarkTheme 
                      ? "text-white placeholder:text-white/40"
                      : "text-black placeholder:text-black/40"
                  )}
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="relative" data-dropdown>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === "filter" ? null : "filter");
                }}
                className={clsx(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] transition",
                  isDarkTheme 
                    ? "border border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:text-white"
                    : "border border-black/10 bg-white/40 text-black/70 hover:border-black/20 hover:text-black"
                )}
              >
                <Filter className="h-2.5 w-2.5" />
                <span>Filter</span>
                <ChevronDown className={`h-2.5 w-2.5 transition-transform ${openDropdown === "filter" ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === "filter" && (
                <div className={clsx(
                  "absolute top-full left-0 mt-1.5 min-w-[140px] max-h-[200px] rounded-lg backdrop-blur-sm shadow-xl z-50 overflow-hidden",
                  isDarkTheme 
                    ? "border border-white/10 bg-black/60"
                    : "border border-black/10 bg-white/60"
                )}>
                  <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    <button className={clsx(
                      "w-full px-3 py-2 text-left text-[10px] uppercase tracking-[0.3em] rounded-t-lg transition",
                      isDarkTheme 
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-black/70 hover:text-black hover:bg-black/10"
                    )}>
                      Price: Low to High
                    </button>
                    <button className={clsx(
                      "w-full px-3 py-2 text-left text-[10px] uppercase tracking-[0.3em] transition",
                      isDarkTheme 
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-black/70 hover:text-black hover:bg-black/10"
                    )}>
                      Price: High to Low
                    </button>
                    <button className={clsx(
                      "w-full px-3 py-2 text-left text-[10px] uppercase tracking-[0.3em] transition",
                      isDarkTheme 
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-black/70 hover:text-black hover:bg-black/10"
                    )}>
                      Rating: Highest
                    </button>
                    <button className={clsx(
                      "w-full px-3 py-2 text-left text-[10px] uppercase tracking-[0.3em] transition",
                      isDarkTheme 
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-black/70 hover:text-black hover:bg-black/10"
                    )}>
                      Most Reviews
                    </button>
                    <button className={clsx(
                      "w-full px-3 py-2 text-left text-[10px] uppercase tracking-[0.3em] rounded-b-lg transition",
                      isDarkTheme 
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-black/70 hover:text-black hover:bg-black/10"
                    )}>
                      Featured
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
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
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Marketplace Items Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={clsx(
              "text-2xl font-semibold tracking-tight sm:text-3xl",
              isDarkTheme ? "text-white" : "text-black"
            )}>
              {TABS.find(tab => tab.id === activeTab)?.label}
            </h2>
            <button className={clsx(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.3em] transition",
              isDarkTheme 
                ? "border border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
                : "border border-black/15 bg-black/5 text-black/70 hover:border-black/30 hover:bg-black/10 hover:text-black"
            )}>
              <Plus className="h-3 w-3" />
              <span>List Item</span>
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className={clsx(
              "rounded-3xl px-6 py-16 text-center text-sm",
              isDarkTheme 
                ? "border border-white/10 bg-black/30 text-white/60"
                : "border border-black/10 bg-white/30 text-black/60"
            )}>
              No items found. Try adjusting your search or filters.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className={clsx(
                    "group flex h-full flex-col overflow-hidden rounded-[28px] transition cursor-pointer",
                    isDarkTheme 
                      ? "border border-white/10 bg-black/40 shadow-[0_0_45px_rgba(0,0,0,0.35)] hover:border-white/20 hover:bg-black/60"
                      : "border border-black/10 bg-white/40 shadow-[0_0_45px_rgba(0,0,0,0.15)] hover:border-black/20 hover:bg-white/60"
                  )}
                >
                  {/* Item Image */}
                  <div className={`relative flex h-48 items-end justify-between overflow-hidden bg-gradient-to-br ${getGradientClass(item.image)} p-5 sm:h-56`}>
                    <div className="flex flex-col gap-2 text-white drop-shadow">
                      <span className="text-base font-semibold tracking-tight">{item.price}</span>
                      <span className="text-xs uppercase tracking-[0.28em] opacity-80">{item.location}</span>
                    </div>
                    {item.featured && (
                      <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
                        featured
                      </span>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="space-y-1">
                      <h3 className={clsx(
                        "text-lg font-semibold",
                        isDarkTheme ? "text-white" : "text-black"
                      )}>{item.title}</h3>
                      <p className={clsx(
                        "text-sm line-clamp-2",
                        isDarkTheme ? "text-white/70" : "text-black/70"
                      )}>{item.description}</p>
                    </div>

                    {/* Rating and Reviews */}
                    <div className={clsx(
                      "flex items-center gap-2 text-[12px]",
                      isDarkTheme ? "text-white/55" : "text-black/55"
                    )}>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{item.reviews} reviews</span>
                      <span>•</span>
                      <span>{item.seller}</span>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-white font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}