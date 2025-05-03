---
title: "Layout Sizes"
description: "Defines the sizes of the layout components"
tags: ["layout", "astro", "react", "shadcn-ui", "responsive", "performance"]
date: 2024-02-03
---

# Layout Sizes

## Architectural Principles

2. **Device-Specific Optimization**: 
   - Mobile: Full-width single column
   - Tablet: Adaptive sidebars
   - Desktop: Fluid three-column layout
3. **Performance First**:
   - Astro Islands architecture
   - React components hydrated only when visible
   - CSS containment for isolated rendering
4. **Synchronized Components**:
   - Shared state management via nanostores
   - Coordinated breakpoint handling
   - Unified animation timing

## Enhanced Component Sync

### Header-Sidebar Coordination
```typescript
// Header.tsx
<header className="...">
  {showLeft && <SidebarTrigger />} // Only renders when needed
  <img src="/logo.svg" className="mx-auto" /> // Perfectly centered
</header>

// Left.tsx
<SidebarProvider 
  defaultOpen={false}
  onOpenChange={updateNavState} // Syncs with global store
>
```

### Right Panel Adaptive Sizing
```typescript
// Right.tsx
const Right = () => {
  const currentSize = useStore(rightSize); // Shared across components
  // Maintains chat history during resizing
  return <MyThread config={chatConfig} /> 
}
```

## Performance Optimization Guide

### Astro Directives Usage
```astro
// Layout.astro
<Header client:load /> // Hydrate on load
<Footer client:visible /> // Hydrate when scrolled into view
```


## Responsive Whitespace System

| Breakpoint   | Padding | Gap     | Max Width |
|--------------|---------|---------|-----------|
| <768px (Mobile) | 1rem    | 1rem    | 100%      |
| 768-1024px (Tablet) | 1.5rem | 1.5rem  | 90%       |
| >1024px (Desktop) | 2rem   | 2rem    | 80ch      |

```css
.main-content {
  padding: var(--space);
  gap: var(--gap);
  max-width: var(--max-width);
}
```

## Component Sync Diagram

```
[Left Sidebar] ↔ [Layout Grid] ↔ [Right Panel]
      ↑                   ↑                ↑
   [Header]          [Main Content]     [Footer]
```

Key synchronization points:
1. Mobile menu state shared between Header/Left
2. Right panel size syncs with viewport breakpoints
3. Shared theme context across all components
4. Coordinated loading states

This layout system provides a highly configurable, mobile-first design for Astro pages that adapts beautifully across mobile, tablet, and desktop views.

## Core Structure

The layout consists of three main sections:
- Left Sidebar (Navigation)
- Center Content
- Right Panel (AI Assistant)

### Center Content Structure
The center section is organized into three rows:
1. Header - Contains navigation controls and breadcrumbs
2. Main Content - Your page content
3. Footer - Optional footer content

## Key Components

### Layout.astro
The main layout component that orchestrates all parts. Configurable through props:

```typescript
interface LayoutProps {
  title: string;
  description?: string;
  children: any;
  chatConfig?: any;
  header?: boolean;     // Show/hide header
  footer?: boolean;     // Show/hide footer
  left?: boolean;       // Show/hide left sidebar
  leftSize?: "expanded" | "collapsed";
  right?: boolean;      // Show/hide right panel
  rightSize?: "full" | "half" | "quarter" | "icon";
}
```

### Header Component
Features:
- Left sidebar toggle (hidden if sidebar is disabled)
- Logo (centered in the exact center of the page )
- Right panel toggle (hidden if panel is disabled)
- Responsive breadcrumb navigation
- Sticky positioning with backdrop blur

### Left Sidebar (Navigation)
Built with shadcn-ui sidebar:
- Collapsible navigation menu
- Floating variant on desktop
- Icon-only collapsed state
- Full-width on mobile
- Mouse hover expansion
- Click outside to close on mobile

### Right Panel (AI Assistant)
Features:
- Four size modes:
  - Full (100% width)
  - Half (50% width)
  - Quarter (25% width, min 320px)
  - Icon (48px floating button)
- Mobile optimizations:
  - Slides in from right
  - Full-width when open
  - Floating icon when collapsed
- Smooth transitions
- Backdrop blur effects
- Size controls in header

## Responsive Behavior

### Mobile (<768px)
- Left sidebar: Full-width overlay when open
- Right panel: Full-width overlay or floating icon
- Single column layout
- Hamburger menu for navigation
- Touch-friendly interactions

### Tablet (768px - 1024px)
- Left sidebar: Icon mode or expanded
- Right panel: Adjustable width
- Fluid transitions
- Optional collapsing of panels

### Desktop (>1024px)
- Full three-column layout capability
- Hover interactions for sidebars
- Maximum content width constraints
- Optimal reading experience

## Usage Example

```astro
---
import Layout from "../layouts/Layout.astro";

const chatConfig = {
  // Your AI chat configuration
};
---

<Layout 
  title="My Page"
  description="Page description"
  header={true}
  footer={true}
  left={true}
  leftSize="expanded"
  right={true}
  rightSize="quarter"
  chatConfig={chatConfig}
>
  <main>
    Your content here
  </main>
</Layout>
```

## CSS Variables

The layout system uses CSS variables for consistent sizing:

```css
:root {
  --right-panel-width: var(--right-width-full);
  --right-width-full: 100vw;
  --right-width-half: 50%;
  --right-width-quarter: 25%;
  --right-width-icon: 48px;
  --left-sidebar-width: 240px;
  --header-height: 60px;
}
```

## Accessibility Features

- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly structure
- High contrast mode support
- Reduced motion preferences respected

## Performance Considerations

- Lazy-loaded components where appropriate
- Smooth transitions and animations
- Efficient re-renders
- Optimized mobile performance
- Minimal layout shifts


## Component Loading Strategy

### Dynamic Imports
For optimal performance, components are loaded based on their priority:

```astro
---
// Critical path components - load immediately
import Header from "../components/Header";
import Footer from "../components/Footer";

// Async components - load when needed
const Chart = await import("../components/Chart").then(mod => mod.Chart);
---

<Layout>
  <Header client:load /> <!-- Critical UI -->
  <Chart client:visible /> <!-- Load when visible -->
  <Footer client:idle /> <!-- Load during idle time -->
</Layout>
```

## Simple Rules

### Main Content Width Rules
- Mobile (<768px): 100% width, 1rem padding
- Tablet (768-1024px): 90% width, 1.5rem padding
- Desktop (>1024px): 
  - Without right panel: 80ch max-width
  - With right panel: 65ch max-width
  - Always centered in available space

### Right Panel Width Rules
- Mobile (<768px):
  - Collapsed: 48px floating button
  - Expanded: 100% width overlay
- Tablet (768-1024px):
  - Quarter: 320px fixed width
  - Half: 50% of viewport
  - Full: 100% of content area
- Desktop (>1024px):
  - Quarter: 25% of viewport (min 320px)
  - Half: 40% of viewport
  - Full: 50% of viewport
  - Icon: 48px floating button

### Content Area Spacing
- Vertical spacing between sections: 2rem
- Content padding:
  - Mobile: 1rem
  - Tablet: 1.5rem
  - Desktop: 2rem
- Maximum content width: 1920px

### Layout Size Configurations

#### Desktop (>1024px)
| Layout Mode | Main Content | Right Panel | Description |
|------------|--------------|-------------|-------------|
| Full Screen | 100% - 320px | Hidden | Main content maximized |
| With Quarter Panel | 75% | 25% (320px min) | Balanced with small panel |
| With Half Panel | 60% | 40% | Equal emphasis |
| With Full Panel | 50% | 50% | Split screen |
| Icon Mode | 100% - 48px | 48px | Maximum content with quick access |

#### Tablet (768px - 1024px)
| Layout Mode | Main Content | Right Panel | Description |
|------------|--------------|-------------|-------------|
| Full Screen | 100% | Hidden | Full content view |
| With Quarter Panel | 100% - 320px | 320px | Fixed panel width |
| With Half Panel | 50% | 50% | Equal split |
| With Full Panel | 0% | 100% | Panel overlay |
| Icon Mode | 100% - 48px | 48px | Content with access button |

#### Mobile (<768px)
| Layout Mode | Main Content | Right Panel | Description |
|------------|--------------|-------------|-------------|
| Full Screen | 100% | Hidden | Full content view |
| With Panel Open | 0% | 100% | Full overlay panel |
| Icon Mode | 100% - 48px | 48px | Content with floating button |




