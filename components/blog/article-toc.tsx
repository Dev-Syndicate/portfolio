"use client";

import { useEffect, useState } from "react";

/**
 * Table of contents for the article sidebar. Takes the H2 headings (with the
 * ids rehype-slug generated), renders anchor links, and highlights the section
 * currently in view via an IntersectionObserver scroll-spy. Click scrolls to
 * the section (native smooth-scroll; heading scroll-margin handles the offset).
 */
export type TocItem = { id: string; text: string };

export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        // The topmost heading currently intersecting the upper part of the
        // viewport is the active one.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase">
        On this page
      </span>
      <ul className="flex flex-col gap-1 border-l border-border">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={
                  "-ml-px block border-l-2 py-1 pl-3.5 text-sm leading-snug transition-colors " +
                  (isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground")
                }
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
