---
title: "Layout Sizes"
description: "Core layout size configurations for main content and right panel"
tags: ["layout", "sizes", "responsive"]
date: 2024-02-03
---

# Layout Size Configurations

## Panel Modes

### Icon Mode
- Main Content: 100%
- Right Panel: Fixed 48px icon at bottom right
- Use Case: Maximum content space with quick chat access

### Floating Mode
- Main Content: 100%
- Right Panel: Floating window (320px × 480px)
- Use Case: Quick chat interactions while viewing content

### Quarter Mode
- Main Content: 75%
- Right Panel: 25% (minimum 320px)
- Use Case: Content-focused with persistent chat

### Half Mode
- Main Content: 50%
- Right Panel: 50%
- Use Case: Equal focus on content and chat

### Full Mode
- Main Content: 0%
- Right Panel: 100%
- Use Case: Dedicated chat experience

## Responsive Behavior

### Desktop (>1024px)
- Supports all modes
- Panel transitions are smooth slides
- Main content reflows with panel changes

### Tablet (768px - 1024px)
- Quarter has minimum width of 320px 
- Half and Full not available
- Icon and Floating remain unchanged

### Mobile (<768px)
- Icon triggers full screen mode

## Additional Considerations

### Z-Index Stacking
- Icon Mode: 100
- Floating Mode: 1000
- Overlay Modes: 2000
- Modal Dialogs: 3000

### Transition Timings
- Panel Expand/Collapse: 200ms
- Mode Transitions: 300ms
- Overlay Animations: 250ms

### Safe Areas
- Respects device safe areas on mobile
- Adjusts for notches and home indicators
- Bottom spacing accounts for keyboard

### Accessibility
- Maintains minimum touch target size (44px)
- Preserves readable line lengths when resizing
- Ensures sufficient contrast in collapsed states

### Performance
- Lazy loads panel content when collapsed
- Throttles resize calculations
- Uses CSS containment for layout isolation
