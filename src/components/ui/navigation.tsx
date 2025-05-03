import * as React from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, children, className, ...props }: LinkProps) {
  return (
    <a 
      href={href}
      className={cn(
        "inline-flex items-center no-underline",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function useLocation() {
  const [pathname, setPathname] = React.useState("/");

  React.useEffect(() => {
    setPathname(window.location.pathname);

    const handleRouteChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    document.addEventListener('astro:page-load', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('astro:page-load', handleRouteChange);
    };
  }, []);

  return { pathname };
} 