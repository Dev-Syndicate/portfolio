import {
  AppWindow,
  Bot,
  Cloud,
  Database,
  Gauge,
  Globe,
  Layers,
  Monitor,
  Plug,
  Search,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Name → component map so `lib/content.ts` can stay a plain data module
 * without importing React components.
 */
const icons = {
  "app-window": AppWindow,
  bot: Bot,
  cloud: Cloud,
  database: Database,
  gauge: Gauge,
  globe: Globe,
  layers: Layers,
  monitor: Monitor,
  plug: Plug,
  search: Search,
  server: Server,
  shield: Shield,
  smartphone: Smartphone,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

/** Decorative icon in a tinted rounded tile. Hidden from assistive tech. */
export function IconTile({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Glyph = icons[name];

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
        "bg-primary/10 text-primary",
        "transition-colors duration-[var(--duration-base)] ease-out-soft",
        "group-hover:bg-primary group-hover:text-primary-foreground",
        className,
      )}
    >
      <Glyph className="size-5" strokeWidth={1.75} />
    </span>
  );
}
