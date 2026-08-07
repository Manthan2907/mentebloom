import * as React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  id: number | string;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
}

export interface FaqAccordionProps {
  data: FAQItem[];
  className?: string;
  timestamp?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export function FaqAccordion({
  data,
  className,
  timestamp = "Every day, 9:01 AM",
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn("p-2", className)}>
      {timestamp && (
        <div className="mb-4 text-xs font-mono uppercase tracking-widest text-[#1a1a1a]/40 font-bold">
          {timestamp}
        </div>
      )}

      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
      >
        {data.map((item) => (
          <Accordion.Item
            value={item.id.toString()}
            key={item.id}
            className="mb-3"
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-x-3 cursor-pointer group">
                <div
                  className={cn(
                    "relative flex items-center space-x-2 rounded-xl px-4 py-3 transition-all text-left font-display font-bold text-sm flex-1",
                    openItem === item.id.toString()
                      ? "bg-[#1a1a1a] text-white shadow-sm"
                      : "bg-[#faf8f5] text-[#1a1a1a] border border-[#e8e4df] hover:bg-[#f0ece7]",
                    questionClassName
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(
                        "absolute -top-2.5 text-base z-10 pointer-events-none",
                        item.iconPosition === "right" ? "right-3" : "left-3"
                      )}
                      style={{
                        transform:
                          item.iconPosition === "right"
                            ? "rotate(7deg)"
                            : "rotate(-4deg)",
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{item.question}</span>
                </div>

                <span
                  className={cn(
                    "p-2 rounded-full border transition-all shrink-0 flex items-center justify-center",
                    openItem === item.id.toString()
                      ? "bg-[#c8f54e] border-[#c8f54e] text-[#1a1a1a]"
                      : "bg-white border-[#e8e4df] text-[#1a1a1a]/40 group-hover:border-[#1a1a1a]/30 group-hover:text-[#1a1a1a]"
                  )}
                >
                  {openItem === item.id.toString() ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount>
              <motion.div
                initial="collapsed"
                animate={openItem === item.id.toString() ? "open" : "collapsed"}
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-2 md:ml-6 pr-8">
                  <div
                    className={cn(
                      "relative rounded-2xl bg-[#1a1a1a] px-4 py-3 text-xs font-sans text-white/95 leading-relaxed shadow-sm border border-white/10",
                      answerClassName
                    )}
                  >
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
