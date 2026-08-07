/**
 * Insights articles — real, grounded editorial content.
 *
 * These exist so /insights is a genuine content hub rather than a thin page:
 * each article is an indexable page targeting real search queries the studio
 * can honestly speak to. No fabricated clients, metrics, or results — the copy
 * is the studio's actual point of view on decisions it makes on every project.
 *
 * Dates are ISO strings (absolute, not relative). Update `updated` when the
 * body changes so the sitemap and Article schema reflect real freshness.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  /** Short dek shown on the index and under the title. */
  excerpt: string;
  keywords: string[];
  published: string; // ISO date
  updated: string; // ISO date
  readingMinutes: number;
  body: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "how-to-choose-a-web-stack",
    title: "How to Choose a Web Stack (Without the Hype)",
    description:
      "A practical framework for choosing the technology behind a website or web app — judged by business outcomes, not by what looks impressive on a slide.",
    excerpt:
      "Frameworks are a means, not a goal. Here is how we pick the technology for a project by starting from what the business needs it to do.",
    keywords: [
      "how to choose a web stack",
      "web technology stack",
      "Next.js vs React",
      "choosing a web framework",
      "web development studio",
    ],
    published: "2025-01-15",
    updated: "2025-01-15",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "Every technology choice on a project is a decision with a business consequence. A stack that is perfect for one product is the wrong call for another, and the difference rarely comes down to which framework is most talked about this quarter. We choose per project, working backward from the outcome the site or application has to deliver.",
      },
      {
        type: "h2",
        text: "Start with the outcome, not the framework",
      },
      {
        type: "p",
        text: "Before naming a single tool, we answer three questions: who is this for, what does a visitor or user need to accomplish, and what does the business need to be true for the project to be a success. A marketing site that has to rank and convert has different constraints than an internal dashboard that a team lives in every day. The answers narrow the field far more than any benchmark.",
      },
      {
        type: "h2",
        text: "What we actually weigh",
      },
      {
        type: "ul",
        items: [
          "Performance ceiling — how fast the finished product can realistically be, since speed is a feature users feel before they can name it.",
          "Rendering model — whether the content needs server rendering for SEO and first paint, or is a private tool where a client app is fine.",
          "Maintenance cost — how easily the next developer, ours or yours, can pick the codebase up a year from now.",
          "Ecosystem maturity — whether the libraries the project depends on are stable and well supported, not just new.",
          "Hiring reality — whether the skills to maintain it are common enough that you are not locked to one contractor.",
        ],
      },
      {
        type: "h2",
        text: "Where modern frontend earns its place",
      },
      {
        type: "p",
        text: "For most public-facing sites we reach for a server-rendered React stack such as Next.js, because it gives us fast first paint, semantic HTML, and SEO-ready output without giving up the component model that keeps a growing codebase sane. But that is a default, not a dogma — a brochure site with five pages does not need the same machinery as a product with authenticated dashboards, and we say so.",
      },
      {
        type: "h2",
        text: "The honest answer sometimes talks you out of it",
      },
      {
        type: "p",
        text: "If what you actually need is your existing site working offline on a phone, we will tell you that before we quote an app. If a static export would serve your content faster and cheaper than a framework, we will recommend it. Choosing technology framed as business outcomes means occasionally recommending less, and that is the point.",
      },
    ],
  },
  {
    slug: "why-website-performance-is-a-business-metric",
    title: "Why Website Performance Is a Business Metric",
    description:
      "Page speed and Core Web Vitals are not vanity numbers — they change whether visitors stay, convert, and find you. How we treat performance as a target, not a hope.",
    excerpt:
      "Speed is something your visitors feel before they can name it. Here is why we hold every page to a performance budget and audit it before launch.",
    keywords: [
      "website performance",
      "Core Web Vitals",
      "page speed SEO",
      "Lighthouse performance",
      "fast website development",
    ],
    published: "2025-02-10",
    updated: "2025-02-10",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "A slow site loses people quietly. Visitors do not file a complaint about a page that took four seconds to become usable — they simply leave, and you never see them. That is why we treat performance as a first-class business metric rather than a technical nicety, and why we hold every project to a performance budget agreed up front.",
      },
      {
        type: "h2",
        text: "What Core Web Vitals actually measure",
      },
      {
        type: "ul",
        items: [
          "Largest Contentful Paint (LCP) — how quickly the main content becomes visible. This is the number most tied to whether a visitor feels the page is fast.",
          "Interaction to Next Paint (INP) — how responsive the page is to taps and clicks, so it never feels laggy under the finger.",
          "Cumulative Layout Shift (CLS) — how much the layout jumps around while loading, which is what makes people tap the wrong thing.",
        ],
      },
      {
        type: "p",
        text: "Google uses these as ranking signals, so performance is not only a UX concern — it directly affects how discoverable you are. A fast, stable page is both easier to find and more likely to convert once found.",
      },
      {
        type: "h2",
        text: "How we hold the line",
      },
      {
        type: "p",
        text: "Performance is a target, not a hope. We set a budget at the start of a project, build against it with modern frontend architecture and edge delivery, and audit every build with Lighthouse before launch — not after the site is already live and the regression has already cost you traffic. When something threatens the budget, we catch it in review rather than in production.",
      },
      {
        type: "h2",
        text: "It compounds",
      },
      {
        type: "p",
        text: "Faster pages keep visitors engaged, improve search visibility, and lift conversion — and those effects reinforce each other. Performance is one of the highest-leverage investments a business can make in its website, precisely because it touches the whole funnel at once.",
      },
    ],
  },
  {
    slug: "native-vs-cross-platform-mobile-apps",
    title: "Native vs Cross-Platform: Do You Even Need an App?",
    description:
      "Before choosing between native and cross-platform mobile development, it is worth asking whether an app is the right answer at all. An honest guide.",
    excerpt:
      "The native-versus-cross-platform debate skips the more important question: do you need an app, or a website that works well on a phone?",
    keywords: [
      "native vs cross-platform",
      "Flutter app development",
      "cross-platform mobile app",
      "do I need a mobile app",
      "mobile app development studio",
    ],
    published: "2025-03-05",
    updated: "2025-03-05",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "The native-versus-cross-platform question is the one nearly every app enquiry opens with. It is a good question — but it is the second question. The first is whether you need an app at all, and the honest answer sometimes talks a client out of one entirely. That is a feature of how we work, not a bug.",
      },
      {
        type: "h2",
        text: "When you do not need an app",
      },
      {
        type: "p",
        text: "If what you actually need is your website working well on a phone — fast, responsive, installable to the home screen, usable offline for the essentials — a progressive web experience can deliver that without the cost of building and maintaining a separate app, and without the friction of an app-store download standing between you and a new user.",
      },
      {
        type: "h2",
        text: "When an app is the right call",
      },
      {
        type: "ul",
        items: [
          "You need deep device integration — camera, sensors, background processing, or push notifications that a browser cannot match.",
          "The experience is something people return to daily and expect to feel native under the thumb.",
          "You are building for offline-first use where the network is unreliable and the app has to stand on its own.",
        ],
      },
      {
        type: "h2",
        text: "Why we build cross-platform in Flutter",
      },
      {
        type: "p",
        text: "When an app is genuinely the answer, we build in Flutter, which compiles to genuinely native iOS and Android from a single codebase. That means you fund one build rather than two, both app stores stay in step as the product changes, and you are not paying two teams to keep two codebases from drifting apart. For most businesses, one codebase reaching both platforms is the difference between an app that stays maintained and one that quietly rots.",
      },
      {
        type: "h2",
        text: "The through-line",
      },
      {
        type: "p",
        text: "Whether the answer is a responsive website, a progressive web experience, or a cross-platform app, the decision starts from what the business needs the product to do — not from a platform preference. We would rather recommend the smaller, cheaper thing that actually fits than sell you the larger one.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
