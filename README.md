# POP! Event Layout Manager

A Figma-like event layout and workflow manager built with Next.js 14+, TypeScript, and modern UI components.

## 🚀 Features

### Canvas Foundation
- **Interactive Canvas**: Ready for Konva.js integration with smooth drag-and-drop
- **Grid System**: Professional grid background for precise alignment
- **Pan & Zoom**: Smooth canvas navigation controls

### Theme System
- **Dark/Light Mode Toggle**: Dual-circle toggle design with instant switching
- **SSR-Safe**: No hydration mismatches or flash of unstyled content
- **Persistent Storage**: Remembers theme preference across sessions

### Full-Screen Interface
- **Clean Homepage**: Centered search and layout controls
- **Collapsible Sidebar**: Hidden by default, expands when needed
- **Professional Navigation**: Working links to all sections

### Navigation Pages
- **Design Labs** (`/designlabs`)
- **My Events** (`/myevents`)
- **Marketplace** (`/marketplace`)
- **Metrics** (`/metrics`)
- **Settings** (`/settings`)

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Theme Management**: Custom ThemeProvider Context
- **Icons**: Lucide React

## 🏃‍♂️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Theme Toggle
- Click the dual-circle toggle in the top-right corner
- Watch the background switch between light (`#D9D9D9`) and dark (`black`)
- Theme preference is automatically saved

### Navigation
- Click the hamburger menu to reveal the sidebar
- Navigate to any section: Design Labs, My Events, Marketplace, Metrics, Settings
- Each page shows a "Coming Soon" message with professional layout

### Canvas Preparation
- The homepage includes search input for venue addresses
- "Start Layout" button prepared for canvas integration
- Grid background ready for future Konva.js implementation

## 🏗 Project Structure

```
src/
├── app/
│   ├── designlabs/page.tsx      # Design Labs section
│   ├── myevents/page.tsx        # My Events section  
│   ├── marketplace/page.tsx     # Marketplace section
│   ├── metrics/page.tsx         # Metrics section
│   ├── settings/page.tsx        # Settings section
│   ├── page.tsx                 # Homepage
│   └── layout.tsx               # Root layout with theme provider
├── components/
│   ├── common/
│   │   ├── ComingSoonPage.tsx   # Reusable coming soon page
│   │   └── ThemeToggle.tsx      # Dual-circle theme toggle
│   ├── home/
│   │   └── PopHomeWithTheme.tsx # Main homepage component
│   ├── providers/
│   │   └── ThemeProvider.tsx    # Theme context provider
│   └── ui/                      # shadcn/ui components
└── lib/
    └── utils.ts                 # Utility functions
```

## 🔮 Next Steps

This MVP provides the foundation for the full Event Layout Manager:

- **Canvas Integration**: Add Konva.js for drag-and-drop event elements
- **Workflow Management**: Assign roles and tasks to elements
- **Vendor Integration**: Vendor-specific views and management
- **Sales Tracking**: POS-style tracking tied to elements
- **Real-time Collaboration**: Multi-user editing capabilities

## 📝 License

MIT License - see [GitHub Repository](https://github.com/FNLFLSH/POP_v2) for details.