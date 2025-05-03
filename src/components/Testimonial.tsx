import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  initials: string;
}

export function Testimonial({ quote, author, role, initials }: TestimonialProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="italic">"{quote}"</p>
    </Card>
  );
} 