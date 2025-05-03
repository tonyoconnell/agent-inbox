---
title: "Using Shadcn UI Components with Subcomponents in Astro"
description: "How to properly implement Shadcn UI interactive components with subcomponents in Astro using React component abstraction"
tags: ["astro", "shadcn-ui", "react", "components"]
date: 2024-02-03
---

# The Problem

When using Shadcn UI components that have subcomponents (like Carousel, Accordion, etc.) directly in Astro files, you might encounter errors such as:
- "useCarousel must be used within a <Carousel />"
- "Accordion must be used within Accordion"

This happens because Astro's partial hydration system (islands) doesn't maintain React's context when components are used directly in .astro files, even with client:load directive.

```astro
<!-- This won't work properly -->
<Carousel client:load>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

# The Solution

The solution is to abstract the entire component structure into a single React component. This ensures all subcomponents remain within React's context.

## Step 1: Create a React Component

Create a new React component that encapsulates all the related subcomponents. For example, create `components/InteractiveCarousel.tsx`:

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const InteractiveCarousel = () => {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default InteractiveCarousel;
```

## Step 2: Use in Astro File

Now you can use the component in your Astro file with the client:load directive:

```astro
---
import InteractiveCarousel from '@/components/InteractiveCarousel';
import Layout from '@/layouts/Layout.astro';
---

<Layout title="Interactive Components">
  <main>
    <InteractiveCarousel client:load />
  </main>
</Layout>
```

# Why This Works

1. **Context Preservation**: By moving all related components into a single React component, we ensure that React's context is maintained within the component tree.

2. **Hydration Boundary**: The client:load directive creates a clean hydration boundary around the entire component, ensuring all React-specific features work properly.

3. **Component Isolation**: This approach isolates all React-specific logic and state management within a single component, making it easier to manage and debug.

# When to Use This Pattern

Use this pattern when working with Shadcn UI components that:
- Have subcomponents (Carousel, Accordion, Tabs, etc.)
- Rely on React context for state management
- Need to maintain parent-child relationships between components

Simple components like Button or Card that don't rely on context or don't have subcomponents can be used directly in Astro files without abstraction.
