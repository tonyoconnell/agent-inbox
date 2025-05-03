import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface TabItem {
  value: string;
  label: string;
  items: Array<{
    title: string;
    tasks: string[];
  }>;
}

interface TabsWrapperProps {
  data: TabItem[];
}

export function TabsWrapper({ data }: TabsWrapperProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <Accordion type="single" collapsible className="w-full">
        {data.map((tab) => (
          <AccordionItem key={tab.value} value={tab.value}>
            <AccordionTrigger className="text-lg font-semibold py-4">
              {tab.label}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {tab.items.map((section, idx) => (
                  <div key={idx} className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.tasks.map((task, taskIdx) => (
                        <li key={taskIdx} className="flex items-center gap-2 text-sm">
                          <span className="text-primary">✓</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <Tabs defaultValue={data[0]?.value} className="w-full">
      <TabsList className="w-full flex-wrap justify-start mb-6 h-auto p-2 bg-muted/50">
        {data.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-1 min-w-[120px] py-2 data-[state=active]:bg-background"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {data.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="grid sm:grid-cols-2 gap-6">
            {tab.items.map((section, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-6">
                <h4 className="font-medium mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.tasks.map((task, taskIdx) => (
                    <li key={taskIdx} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
} 