# Mobile Optimization Plan (shadcn Mail Example Inspired)

## 1. Responsive Layout
- Use `flex-col` for mobile and `flex-row` for desktop layouts.
- All main areas (sidebar, list, chat) use `w-full` and `h-full` on mobile.
- Avoid fixed widths; use responsive breakpoints (`sm:`, `md:`) for larger screens.

## 2. Sidebar as Drawer
- Hide sidebar on mobile; show as a drawer overlay, toggled by a hamburger menu.
- Drawer overlays content and is dismissible by tap or swipe.
- Sidebar navigation items are at least 48x48px for touch.
- Smooth transitions and ARIA labels for accessibility.

## 3. Middle Panel (List/Conversation)
- Stack vertically on mobile, horizontally on desktop.
- Use `overflow-y-auto` for scrollable lists.
- Sticky headers for search/navigation.

## 4. Chat/Detail Window
- Fills available space with `flex-1` and `overflow-y-auto`.
- Input area is sticky at the bottom, always visible above the keyboard.
- Responsive font sizes and padding for chat bubbles/messages.

## 5. General Best Practices
- All buttons and touch targets at least 48x48px.
- Responsive font sizes and spacing for readability.
- Add `<meta name="viewport" content="width=device-width, initial-scale=1" />` to `index.html`.
- Test on real devices and with Chrome DevTools' device mode.
- Ensure accessibility: color contrast, focus states, ARIA labels.

## 6. Next Steps
1. Refactor sidebar to use a drawer on mobile, with hamburger toggle.
2. Update layout to use `flex-col` on mobile, `flex-row` on desktop.
3. Make chat window and input sticky and fully responsive.
4. Test all areas together for a seamless mobile experience.

---
References:
- [shadcn/ui mail example (GitHub)](https://github.com/shadcn/ui/tree/main/apps/www/app/examples/mail)
- [shadcn/ui mail live demo](https://ui.shadcn.com/examples/mail)

