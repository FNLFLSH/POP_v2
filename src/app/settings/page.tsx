'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Settings as SettingsIcon,
  BarChart3,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  ShoppingCart,
  MapPin,
  PieChart,
  Activity,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import GlobalThemeToggle from "@/components/common/GlobalThemeToggle";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import clsx from "clsx";

type MetricCard = {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
  color: string;
};

type ChartData = {
  id: string;
  title: string;
  type: "line" | "bar" | "pie";
  data: any[];
};

const OVERVIEW_METRICS: MetricCard[] = [
  {
    id: "total-revenue",
    title: "Total Revenue",
    value: "$47,250",
    change: "+12.5%",
    changeType: "up",
    icon: <DollarSign className="h-5 w-5" />,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "active-events",
    title: "Active Events",
    value: "23",
    change: "+3",
    changeType: "up",
    icon: <Calendar className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "tickets-sold",
    title: "Tickets Sold",
    value: "1,247",
    change: "+18.2%",
    changeType: "up",
    icon: <Users className="h-5 w-5" />,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "marketplace-sales",
    title: "Marketplace Sales",
    value: "$8,950",
    change: "+7.3%",
    changeType: "up",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "from-orange-500 to-red-600",
  },
];

const EVENT_METRICS: MetricCard[] = [
  {
    id: "events-this-month",
    title: "Events This Month",
    value: "23",
    change: "+3",
    changeType: "up",
    icon: <Calendar className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "avg-attendance",
    title: "Avg Attendance",
    value: "89%",
    change: "+5.2%",
    changeType: "up",
    icon: <Users className="h-5 w-5" />,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "top-city",
    title: "Top City",
    value: "Brooklyn",
    change: "NY",
    changeType: "up",
    icon: <MapPin className="h-5 w-5" />,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "avg-rating",
    title: "Avg Rating",
    value: "4.7",
    change: "+0.2",
    changeType: "up",
    icon: <Star className="h-5 w-5" />,
    color: "from-yellow-500 to-orange-600",
  },
];

const SALES_METRICS: MetricCard[] = [
  {
    id: "ticket-revenue",
    title: "Ticket Revenue",
    value: "$38,300",
    change: "+15.8%",
    changeType: "up",
    icon: <DollarSign className="h-5 w-5" />,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "avg-ticket-price",
    title: "Avg Ticket Price",
    value: "$30.70",
    change: "+$2.10",
    changeType: "up",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "conversion-rate",
    title: "Conversion Rate",
    value: "12.4%",
    change: "+1.8%",
    changeType: "up",
    icon: <Activity className="h-5 w-5" />,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "refund-rate",
    title: "Refund Rate",
    value: "2.1%",
    change: "-0.3%",
    changeType: "down",
    icon: <TrendingDown className="h-5 w-5" />,
    color: "from-red-500 to-pink-600",
  },
];

const MARKETPLACE_METRICS: MetricCard[] = [
  {
    id: "total-listings",
    title: "Total Listings",
    value: "156",
    change: "+12",
    changeType: "up",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "active-sellers",
    title: "Active Sellers",
    value: "89",
    change: "+7",
    changeType: "up",
    icon: <Users className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "avg-listing-price",
    title: "Avg Listing Price",
    value: "$1,250",
    change: "+$45",
    changeType: "up",
    icon: <DollarSign className="h-5 w-5" />,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "marketplace-fee",
    title: "Platform Fee Revenue",
    value: "$895",
    change: "+23.1%",
    changeType: "up",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "from-purple-500 to-pink-600",
  },
];

const CHART_DATA: ChartData[] = [
  {
    id: "revenue-trend",
    title: "Revenue Trend (30 Days)",
    type: "line",
    data: [
      { date: "Jan 1", revenue: 1200 },
      { date: "Jan 7", revenue: 1800 },
      { date: "Jan 14", revenue: 2200 },
      { date: "Jan 21", revenue: 2800 },
      { date: "Jan 28", revenue: 3200 },
    ],
  },
  {
    id: "event-categories",
    title: "Events by Category",
    type: "pie",
    data: [
      { category: "Nightlife", value: 45 },
      { category: "Campus", value: 30 },
      { category: "Wellness", value: 25 },
    ],
  },
  {
    id: "sales-by-city",
    title: "Sales by City",
    type: "bar",
    data: [
      { city: "Brooklyn", sales: 8500 },
      { city: "Miami", sales: 6200 },
      { city: "LA", sales: 4800 },
      { city: "Chicago", sales: 3200 },
    ],
  },
];

function SettingsContent() {
  const { theme } = useThemeContext();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("settings");
  const isDarkTheme = theme === 'dark';

  // Check URL params for tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'metrics') {
      setActiveTab('metrics');
    }
  }, [searchParams]);

  const tabs = [
    { id: "settings", label: "Settings", icon: <SettingsIcon className="h-4 w-4" /> },
    { id: "metrics", label: "Metrics", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const metricsTabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "events", label: "Events", icon: <Calendar className="h-4 w-4" /> },
    { id: "sales", label: "Sales", icon: <DollarSign className="h-4 w-4" /> },
    { id: "marketplace", label: "Marketplace", icon: <ShoppingCart className="h-4 w-4" /> },
  ];

  const [activeMetricsTab, setActiveMetricsTab] = useState("overview");

  const getMetricsForTab = (tab: string) => {
    switch (tab) {
      case "overview":
        return OVERVIEW_METRICS;
      case "events":
        return EVENT_METRICS;
      case "sales":
        return SALES_METRICS;
      case "marketplace":
        return MARKETPLACE_METRICS;
      default:
        return OVERVIEW_METRICS;
    }
  };

  const MetricCard = ({ metric }: { metric: MetricCard }) => (
    <div className={clsx(
      "rounded-2xl p-6 backdrop-blur-sm",
      isDarkTheme 
        ? "border border-white/10 bg-black/40"
        : "border border-black/10 bg-white/40"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={`rounded-lg bg-gradient-to-r ${metric.color} p-3`}>
          {metric.icon}
        </div>
        <div className="flex items-center gap-1 text-sm">
          {metric.changeType === "up" ? (
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-400" />
          )}
          <span className={metric.changeType === "up" ? "text-green-400" : "text-red-400"}>
            {metric.change}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className={clsx(
          "text-sm font-medium",
          isDarkTheme ? "text-white/70" : "text-black/70"
        )}>{metric.title}</h3>
        <p className={clsx(
          "text-2xl font-bold",
          isDarkTheme ? "text-white" : "text-black"
        )}>{metric.value}</p>
      </div>
    </div>
  );

  const ChartPlaceholder = ({ chart }: { chart: ChartData }) => (
    <div className={clsx(
      "rounded-2xl p-6 backdrop-blur-sm",
      isDarkTheme 
        ? "border border-white/10 bg-black/40"
        : "border border-black/10 bg-white/40"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={clsx(
          "text-lg font-semibold",
          isDarkTheme ? "text-white" : "text-black"
        )}>{chart.title}</h3>
        <div className="flex items-center gap-2">
          {chart.type === "line" && <TrendingUp className={clsx("h-4 w-4", isDarkTheme ? "text-white/40" : "text-black/40")} />}
          {chart.type === "bar" && <BarChart3 className={clsx("h-4 w-4", isDarkTheme ? "text-white/40" : "text-black/40")} />}
          {chart.type === "pie" && <PieChart className={clsx("h-4 w-4", isDarkTheme ? "text-white/40" : "text-black/40")} />}
        </div>
      </div>
      <div className={clsx(
        "h-48 flex items-center justify-center rounded-lg",
        isDarkTheme 
          ? "border border-white/10 bg-white/5"
          : "border border-black/10 bg-black/5"
      )}>
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className={clsx(
            "text-sm",
            isDarkTheme ? "text-white/60" : "text-black/60"
          )}>Chart visualization</p>
          <p className={clsx(
            "text-xs",
            isDarkTheme ? "text-white/40" : "text-black/40"
          )}>Data: {chart.data.length} points</p>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className={clsx(
        "transition-colors duration-500",
        isDarkTheme ? "bg-[#050505] text-[#f2f2f2]" : "bg-[#f5f5f5] text-[#1a1a1a]"
      )} 
      style={{ overflow: 'auto', height: '100vh', paddingBottom: '80px' }}
    >
      <GlobalThemeToggle />
      
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 pb-24 pt-20 md:px-10 lg:px-16">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-col items-start gap-2 text-left">
            <div className={clsx(
              "text-xs uppercase tracking-[0.32em]",
              isDarkTheme ? "text-white/60" : "text-black/60"
            )}>
              {activeTab === 'settings' ? 'settings' : 'metrics dashboard'}
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'settings' ? (
                <SettingsIcon className={clsx(
                  "h-8 w-8",
                  isDarkTheme ? "text-white" : "text-black"
                )} />
              ) : (
                <BarChart3 className={clsx(
                  "h-8 w-8",
                  isDarkTheme ? "text-white" : "text-black"
                )} />
              )}
              <h1 className={clsx(
                "text-3xl font-black tracking-tight sm:text-4xl",
                isDarkTheme ? "text-white" : "text-black"
              )}>
                {activeTab === 'settings' ? 'Account Settings' : 'Platform Analytics'}
              </h1>
            </div>
            <p className={clsx(
              isDarkTheme ? "text-white/70" : "text-black/70"
            )}>
              {activeTab === 'settings' 
                ? 'Manage your account preferences and settings'
                : 'Track events, sales, and marketplace performance'}
            </p>
          </div>
        </header>

        {/* Main Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
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

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <section className="space-y-6">
            {/* Account Settings */}
            <div className={clsx(
              "rounded-2xl p-6 backdrop-blur-sm",
              isDarkTheme 
                ? "border border-white/10 bg-black/40"
                : "border border-black/10 bg-white/40"
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className={clsx(
                  "rounded-lg p-3",
                  isDarkTheme ? "bg-white/10" : "bg-black/10"
                )}>
                  <User className={clsx("h-5 w-5", isDarkTheme ? "text-white" : "text-black")} />
                </div>
                <div>
                  <h3 className={clsx(
                    "text-lg font-semibold",
                    isDarkTheme ? "text-white" : "text-black"
                  )}>Account</h3>
                  <p className={clsx(
                    "text-sm",
                    isDarkTheme ? "text-white/60" : "text-black/60"
                  )}>Manage your account information</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className={clsx(
                  "p-4 rounded-lg",
                  isDarkTheme ? "bg-white/5" : "bg-black/5"
                )}>
                  <p className={clsx(
                    "text-sm font-medium mb-2",
                    isDarkTheme ? "text-white" : "text-black"
                  )}>Profile Settings</p>
                  <p className={clsx(
                    "text-xs",
                    isDarkTheme ? "text-white/60" : "text-black/60"
                  )}>Coming soon - Profile customization options</p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className={clsx(
              "rounded-2xl p-6 backdrop-blur-sm",
              isDarkTheme 
                ? "border border-white/10 bg-black/40"
                : "border border-black/10 bg-white/40"
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className={clsx(
                  "rounded-lg p-3",
                  isDarkTheme ? "bg-white/10" : "bg-black/10"
                )}>
                  <Bell className={clsx("h-5 w-5", isDarkTheme ? "text-white" : "text-black")} />
                </div>
                <div>
                  <h3 className={clsx(
                    "text-lg font-semibold",
                    isDarkTheme ? "text-white" : "text-black"
                  )}>Notifications</h3>
                  <p className={clsx(
                    "text-sm",
                    isDarkTheme ? "text-white/60" : "text-black/60"
                  )}>Control how you receive notifications</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className={clsx(
                  "p-4 rounded-lg",
                  isDarkTheme ? "bg-white/5" : "bg-black/5"
                )}>
                  <p className={clsx(
                    "text-sm font-medium mb-2",
                    isDarkTheme ? "text-white" : "text-black"
                  )}>Notification Preferences</p>
                  <p className={clsx(
                    "text-xs",
                    isDarkTheme ? "text-white/60" : "text-black/60"
                  )}>Coming soon - Configure notification settings</p>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className={clsx(
              "rounded-2xl p-6 backdrop-blur-sm",
              isDarkTheme 
                ? "border border-white/10 bg-black/40"
                : "border border-black/10 bg-white/40"
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className={clsx(
                  "rounded-lg p-3",
                  isDarkTheme ? "bg-white/10" : "bg-black/10"
                )}>
                  <Shield className={clsx("h-5 w-5", isDarkTheme ? "text-white" : "text-black")} />
                </div>
                <div>
                  <h3 className={clsx(
                    "text-lg font-semibold",
                    isDarkTheme ? "text-white" : "text-black"
                  )}>Privacy & Security</h3>
                  <p className={clsx(
                    "text-sm",
                    isDarkTheme ? "text-white/60" : "text-black/60"
                  )}>Manage your privacy and security settings</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className={clsx(
                  "p-4 rounded-lg",
                  isDarkTheme ? "bg-white/5" : "bg-black/5"
                )}>
                  <p className={clsx(
                    "text-sm font-medium mb-2",
                    isDarkTheme ? "text-white" : "text-black"
                  )}>Security Settings</p>
                  <p className={clsx(
                    "text-xs",
                    isDarkTheme ? "text-white/60" : "text-black/60"
                  )}>Coming soon - Password, 2FA, and security options</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Metrics Tab Content */}
        {activeTab === 'metrics' && (
          <section className="space-y-6">
            {/* Metrics Sub-tabs */}
            <div className="flex flex-wrap gap-2">
              {metricsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMetricsTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition",
                    activeMetricsTab === tab.id
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

            {/* Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {getMetricsForTab(activeMetricsTab).map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {CHART_DATA.map((chart) => (
                <ChartPlaceholder key={chart.id} chart={chart} />
              ))}
            </div>

            {/* Additional Data Tables */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Activity */}
              <div className={clsx(
                "rounded-2xl p-6 backdrop-blur-sm",
                isDarkTheme 
                  ? "border border-white/10 bg-black/40"
                  : "border border-black/10 bg-white/40"
              )}>
                <h3 className={clsx(
                  "text-lg font-semibold mb-4",
                  isDarkTheme ? "text-white" : "text-black"
                )}>Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: "New event created", time: "2 hours ago", type: "event" },
                    { action: "Ticket sale completed", time: "4 hours ago", type: "sale" },
                    { action: "Marketplace listing added", time: "6 hours ago", type: "marketplace" },
                    { action: "Event ended successfully", time: "8 hours ago", type: "event" },
                  ].map((activity, index) => (
                    <div key={index} className={clsx(
                      "flex items-center gap-3 p-3 rounded-lg",
                      isDarkTheme ? "bg-white/5" : "bg-black/5"
                    )}>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <div className="flex-1">
                        <p className={clsx(
                          "text-sm",
                          isDarkTheme ? "text-white" : "text-black"
                        )}>{activity.action}</p>
                        <p className={clsx(
                          "text-xs",
                          isDarkTheme ? "text-white/60" : "text-black/60"
                        )}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className={clsx(
                "rounded-2xl p-6 backdrop-blur-sm",
                isDarkTheme 
                  ? "border border-white/10 bg-black/40"
                  : "border border-black/10 bg-white/40"
              )}>
                <h3 className={clsx(
                  "text-lg font-semibold mb-4",
                  isDarkTheme ? "text-white" : "text-black"
                )}>Top Performers</h3>
                <div className="space-y-3">
                  {[
                    { name: "Afterglow Atrium", metric: "1,247 tickets", type: "event" },
                    { name: "Brooklyn Venues Co.", metric: "$8,500 revenue", type: "seller" },
                    { name: "Tech Meetup Series", metric: "4.9 rating", type: "event" },
                    { name: "Audio Pro Rentals", metric: "156 rentals", type: "equipment" },
                  ].map((performer, index) => (
                    <div key={index} className={clsx(
                      "flex items-center justify-between p-3 rounded-lg",
                      isDarkTheme ? "bg-white/5" : "bg-black/5"
                    )}>
                      <div>
                        <p className={clsx(
                          "text-sm font-medium",
                          isDarkTheme ? "text-white" : "text-black"
                        )}>{performer.name}</p>
                        <p className={clsx(
                          "text-xs",
                          isDarkTheme ? "text-white/60" : "text-black/60"
                        )}>{performer.type}</p>
                      </div>
                      <p className={clsx(
                        "text-sm font-semibold",
                        isDarkTheme ? "text-white" : "text-black"
                      )}>{performer.metric}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-sm uppercase tracking-[0.35em] mb-2">Loading...</div>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
