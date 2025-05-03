import { useEffect, useState, type ReactElement } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

interface Heading {
  depth: number;
  text: string;
  slug: string;
}

interface HeadingNode extends Heading {
  children: HeadingNode[];
}

interface Props {
  headings?: Heading[];
  onVisibilityChange?: (isVisible: boolean) => void;
  "client:load"?: boolean;
  "client:visible"?: boolean;
  "client:media"?: string;
  "client:only"?: boolean;
  "client:idle"?: boolean;
}

export default function TableOfContents({ headings = [], onVisibilityChange }: Props): ReactElement | null {
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    onVisibilityChange?.(newVisibility);
    (window as any).handleTocVisibility?.(newVisibility);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.slug);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const buildToc = (headings: Heading[]): HeadingNode[] => {
    const toc: HeadingNode[] = [];
    const parentHeadings = new Map<number, HeadingNode>();

    headings.forEach((heading) => {
      const node: HeadingNode = { ...heading, children: [] };

      if (heading.depth === 2) {
        toc.push(node);
        parentHeadings.set(heading.depth, node);
      } else {
        const parentDepth = heading.depth - 1;
        const parent = parentHeadings.get(parentDepth);
        if (parent) {
          parent.children.push(node);
          parentHeadings.set(heading.depth, node);
        }
      }
    });

    return toc;
  };

  const renderTocItem = ({ text, slug, children }: HeadingNode): ReactElement => {
    const isActive = activeId === slug;

    return (
      <li key={slug} className="my-2">
        <a
          href={`#${slug}`}
          className={`block py-1.5 px-4 text-sm rounded-md transition-all duration-200 ${
            isActive
              ? "bg-primary/10 text-primary font-medium shadow-sm"
              : "text-muted-foreground hover:text-primary hover:bg-muted/50"
          }`}
        >
          {text}
        </a>
        {children.length > 0 && (
          <ul className="pl-4 mt-2 border-l border-white/10">
            {children.map((child) => renderTocItem(child))}
          </ul>
        )}
      </li>
    );
  };

  const toc = buildToc(headings);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of Contents" className="relative">
      <button
        onClick={toggleVisibility}
        className="absolute -left-6 top-0 p-1.5 rounded-md bg-muted/50 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
        aria-label={isVisible ? "Hide table of contents" : "Show table of contents"}
        title={isVisible ? "Hide sidebar" : "Show sidebar"}
      >
        {isVisible ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelRightOpen className="h-4 w-4" />
        )}
      </button>
     <div className={`transition-all duration-200 overflow-hidden ${isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
       <div className={`${isVisible ? 'visible' : 'invisible'}`}>
         <div className="font-medium mb-4 text-sm px-4">On This Page</div>
         <ul className="space-y-2">
           {toc.map((heading) => renderTocItem(heading))}
         </ul>
       </div>
     </div>
    </nav>
  );
}