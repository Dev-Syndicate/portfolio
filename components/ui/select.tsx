"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A themed dropdown that replaces the native <select>.
 *
 * Why this exists: `color-scheme: dark` and `option { }` get the popup onto a
 * dark panel, but the SELECTED row is painted by the browser with the system
 * accent — bright blue on our void canvas — and no CSS reaches it. The only
 * way to own that pixel is to stop being a <select>, so this renders the
 * listbox ourselves.
 *
 * What that costs, stated plainly: on a phone this is a normal popup rather
 * than the OS wheel picker, and the control needs JavaScript to open. Both
 * forms using it are already client components, and the value still submits
 * through a hidden input, so a server action reads it exactly as before —
 * `formData.get(name)` is unchanged.
 *
 * Accessibility follows the ARIA select-only combobox pattern: focus stays on
 * the trigger the whole time and the active option is tracked with
 * `aria-activedescendant`, so there is no focus juggling to get wrong. Full
 * keyboard support — arrows, Home/End, Enter/Space, Escape, and type-ahead.
 */

export type SelectOption = { value: string; label: string };

/** How long a type-ahead buffer stays alive between keystrokes. */
const TYPEAHEAD_MS = 700;

export function Select({
  id,
  name,
  options,
  defaultValue = "",
  placeholder = "Select…",
  labelledBy,
  describedBy,
  invalid,
  className,
}: {
  /** Must match the `htmlFor` of the visible label — <button> is labelable. */
  id: string;
  /** Form field name; submitted via a hidden input. */
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  /** Id of the visible <label>, so the popup carries the same name. */
  labelledBy?: string;
  describedBy?: string;
  invalid?: boolean;
  /** Trigger classes — each form passes its own field styling. */
  className?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ buffer: "", at: 0 });
  const reduceMotion = useReducedMotion();

  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex === -1 ? undefined : options[selectedIndex];

  function openList(index = selectedIndex === -1 ? 0 : selectedIndex) {
    setActiveIndex(index);
    setOpen(true);
  }

  function commit(index: number) {
    const option = options[index];
    if (option) setValue(option.value);
    setOpen(false);
    // Focus never left the trigger, but restate it for the click path where
    // the pointer moved focus to the <li>.
    triggerRef.current?.focus();
  }

  /** Jump to the next option whose label starts with the typed buffer. */
  function typeAhead(key: string) {
    const now = Date.now();
    const state = typeahead.current;
    state.buffer = now - state.at > TYPEAHEAD_MS ? key : state.buffer + key;
    state.at = now;

    const query = state.buffer.toLowerCase();
    const from = open ? activeIndex : Math.max(selectedIndex, 0);
    // A single repeated letter cycles to the NEXT match; a longer buffer is
    // still narrowing the current one, so it may match where it already is.
    const offset = state.buffer.length === 1 ? 1 : 0;

    for (let step = 0; step < options.length; step++) {
      const index = (from + offset + step) % options.length;
      if (options[index].label.toLowerCase().startsWith(query)) {
        if (open) setActiveIndex(index);
        else setValue(options[index].value);
        return;
      }
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;

    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        openList();
        return;
      }
      if (key === "Home") {
        event.preventDefault();
        openList(0);
        return;
      }
      if (key === "End") {
        event.preventDefault();
        openList(options.length - 1);
        return;
      }
    } else {
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((i) => Math.min(options.length - 1, i + 1));
          return;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((i) => Math.max(0, i - 1));
          return;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          return;
        case "End":
          event.preventDefault();
          setActiveIndex(options.length - 1);
          return;
        case "Enter":
        case " ":
          event.preventDefault();
          commit(activeIndex);
          return;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          return;
        case "Tab":
          // Let focus move on, but never leave an orphaned popup behind.
          setOpen(false);
          return;
      }
    }

    // Printable characters fall through to type-ahead. Space is handled above
    // in both states, so it never lands here.
    if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      typeAhead(key);
    }
  }

  // Close on any press outside the control. `pointerdown` rather than `click`
  // so the popup is gone before the next element reacts to the same gesture.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the active option inside the scroll area during keyboard traversal.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  return (
    <div ref={rootRef} className="relative">
      {/* The actual form value. Server actions read this exactly as they read
          the native <select> before it. */}
      <input type="hidden" name={name} value={value} />

      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        aria-labelledby={labelledBy ? `${labelledBy} ${id}` : undefined}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-3 text-left",
          className,
        )}
      >
        <span
          className={cn("truncate", !selected && "text-muted-foreground/70")}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            "transition-transform duration-[var(--duration-fast)] ease-out-soft",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelledBy}
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -6, scale: 0.98 }
            }
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 origin-top",
              "max-h-64 overflow-auto rounded-xl border border-border",
              "bg-popover/95 p-1.5 text-popover-foreground backdrop-blur-xl",
              "shadow-[var(--elevation-3)]",
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => commit(index)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3",
                    "rounded-lg px-3 py-2.5 text-[0.9375rem]",
                    "transition-colors duration-[var(--duration-fast)]",
                    index === activeIndex
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <Check
                      aria-hidden
                      className="size-4 shrink-0 text-primary"
                    />
                  ) : null}
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
