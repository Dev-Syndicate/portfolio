"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { site } from "@/lib/content";

/**
 * Contact — the conversation the page is asking for.
 *
 * Shows the shape of a first exchange rather than a mailbox icon: a real
 * question, a considered answer. It sets the expectation that a reply is a
 * conversation, not a quote sent to an address.
 *
 * The copy is generic on purpose — it promises nothing about response time or
 * price, neither of which we publish.
 */

type Message = {
  from: "them" | "us";
  body: string;
};

const thread: Message[] = [
  {
    from: "them",
    body: "We're launching in the spring and our current site won't carry it. Where do we start?",
  },
  {
    from: "us",
    body: "With what the site has to achieve, not the page count. Tell us who you're selling to and we'll map the rest.",
  },
  { from: "them", body: "That's a better first question than we've had." },
];

export function Conversation() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[24rem] select-none"
    >
      <div
        className="absolute inset-6 rounded-full blur-[70px]"
        style={{ background: "var(--glow-a)" }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative flex flex-col gap-4 rounded-2xl p-4 sm:p-5"
      >
        <div className="flex items-center gap-2.5 border-b border-border/70 pb-3.5">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-4" fill="none">
              <path
                d="M4 7 9 12l-5 5M12 17h8"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-semibold">{site.name}</span>
            <span className="flex items-center gap-1.5 text-[0.625rem] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              New enquiry
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {thread.map((message, i) => (
            <motion.div
              key={message.body}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 14, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                // Staggered like a real exchange — each reply lands after the
                // one it answers.
                delay: 0.5 + i * 0.55,
                ease: [0.34, 1.4, 0.64, 1],
              }}
              className={cn(
                "flex",
                message.from === "us" ? "justify-end" : "justify-start",
              )}
            >
              <p
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.75rem] leading-[1.55]",
                  message.from === "us"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-secondary text-secondary-foreground",
                )}
              >
                {message.body}
              </p>
            </motion.div>
          ))}

          {/* Typing indicator — implies the exchange keeps going. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.3 }}
            className="flex justify-end"
          >
            <span className="flex items-center gap-1 rounded-2xl rounded-br-sm bg-secondary px-3 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full bg-muted-foreground motion-safe:animate-float"
                  style={{
                    animationDuration: "1.4s",
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
