import { Badge } from "./ui/badge";
import { Megaphone, Code2, GraduationCap } from "lucide-react";

interface PricingItem {
  name: string;
  price: string;
}

interface Props {
  items: PricingItem[];
}

export function PricingAccordionItems({ items }: Props) {
  return [
    {
      value: "marketing",
      trigger: (
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          Marketing & Content
        </div>
      ),
      content: (
        <ul className="space-y-2">
          {items.slice(0, 4).map((item) => (
            <li key={item.name} className="flex justify-between items-center">
              <span>{item.name}</span>
              <Badge variant="outline">{item.price}</Badge>
            </li>
          ))}
        </ul>
      )
    },
    {
      value: "website",
      trigger: (
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          Website & Landing Pages
        </div>
      ),
      content: (
        <ul className="space-y-2">
          {items.slice(4, 7).map((item) => (
            <li key={item.name} className="flex justify-between items-center">
              <span>{item.name}</span>
              <Badge variant="outline">{item.price}</Badge>
            </li>
          ))}
        </ul>
      )
    },
    {
      value: "training",
      trigger: (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Training & Setup
        </div>
      ),
      content: (
        <ul className="space-y-2">
          {items.slice(7).map((item) => (
            <li key={item.name} className="flex justify-between items-center">
              <span>{item.name}</span>
              <Badge variant="outline">{item.price}</Badge>
            </li>
          ))}
        </ul>
      )
    }
  ];
} 