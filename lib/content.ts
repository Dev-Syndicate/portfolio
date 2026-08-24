/**
 * Single source of truth for site copy.
 *
 * Everything here is grounded in one of the two source documents:
 *   - `docs/website-content-part1.md` (brand, hero, trust, services, tech)
 *   - `docs/website-prd-part1.md` (design principles, performance targets,
 *     accessibility standards, information architecture)
 *
 * Deliberately absent: client names, testimonials, case-study results,
 * project counts, delivery timelines, and prices. None of those exist in the
 * source documents, and inventing them would put unverifiable claims in front
 * of prospects. Sections that would normally carry social proof instead lean
 * on commitments the studio can be held to and the visitor can verify.
 *
 * Typography: copy uses curly apostrophes (’) and spaced em dashes ( — ), the
 * same as the JSX literals elsewhere. Spelling is en-GB throughout.
 */

export const site = {
  name: "Dev Syndicate",
  /* Brand promise / default meta description — general, no filler. Feeds the
     search snippet, OG/Twitter, schema, and footer. Leads with the operational
     positioning so the snippet matches the hero. */
  promise:
    "Dev Syndicate is a software development company that builds software systems to solve operational problems for organisations — using software, AI, and automation to remove manual work, connect disconnected tools, and streamline how a business runs.",
  email: "contact@devsyndicate.in",
  /* Canonical domain. Everything SEO (canonicals, sitemap, robots, OG)
     resolves from this one value. It must match where the live host actually
     serves the site: the server 308-redirects devsyndicate.in → the www host,
     so www is the canonical. Both URLs stay reachable for visitors; the
     non-www one simply redirects here, consolidating all ranking signals. */
  url: "https://www.devsyndicate.in",
} as const;

/* -------------------------------------------------------------------------- */
/* SEO / brand entity — the single source of truth for search.                */
/* -------------------------------------------------------------------------- */

export const seo = {
  /* A short, keyword-bearing tagline used after the brand name in titles. */
  tagline: "Software Development Company",

  /* Every way people spell or shorten the brand. Google uses Organization
     `alternateName` to understand these all refer to one entity, which is what
     lets the site rank for each variant. Keep these ALSO present in real page
     copy (footer/About) — schema-only claims are discounted. */
  alternateNames: [
    "DS",
    "Dev Syndicate",
    "DevSyndicate",
    "Developer Syndicate",
    "Developers Syndicate",
    "D Syndicate",
    "Dev Syndicate Studio",
  ],

  /* Broad keyword set surfaced site-wide; pages add their own on top. */
  keywords: [
    "Dev Syndicate",
    "DevSyndicate",
    "Developer Syndicate",
    "D Syndicate",
    "software development company",
    "software company",
    "web development company",
    "website development",
    "web application development",
    "Next.js development",
    "React development studio",
    "Flutter app development",
    "API integration",
    "custom software development",
  ],

  /* Profile URLs that tie the brand entity together via schema `sameAs`.
     These tell Google the website and these profiles are one and the same
     organisation — the fix for the "Dev Syndicate is a shared name" ambiguity.
     Add more (LinkedIn, X) here as they exist — one place, flows everywhere. */
  sameAs: [
    "https://github.com/Dev-Syndicate",
    "https://www.instagram.com/dev.syndicate/",
    "https://www.linkedin.com/in/devsyndicate/",
    "https://www.google.com/maps?cid=2237191391923509099",
  ] as string[],
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

/* -------------------------------------------------------------------------- */
/* Hero — PRD-COPY                                                            */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: "Software development company",
  /* Set on two lines in the hero, the second carrying the emphasis — the
     reference opens with a short declarative pair rather than one long
     sentence, and the shorter line lands harder. Same claim as before:
     software systems, aimed at operations rather than at websites. */
  headline: { lead: "Software that fixes", lit: "how you actually work." },
  /* Kept as a single string for metadata/OG, where the line break is noise. */
  headlinePlain: "Software that fixes how you actually work.",
  supporting:
    "The manual work. The tools that don’t talk to each other. The process that quietly breaks the moment you grow. We build the software, AI, and automation that take those off your team’s plate — so the business moves instead of firefighting.",
  primaryCta: { label: "Start your project", href: "/contact" },
  secondaryCta: { label: "See how we work", href: "#process" },
  /* The strip beneath the hero. The reference runs client logos here; we have
     none to name — and content.ts has always refused to invent them — so the
     row carries the five operational promises instead. Same visual rhythm,
     nothing unverifiable in it. */
  proof: {
    lead: "Every system we build is judged on one thing:",
    emphasis: "does the work actually get easier?",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Trust — PRD-COPY                                                           */
/* -------------------------------------------------------------------------- */

export const trust = {
  heading: "Built around how you operate",
  intro:
    "Every system we build is judged on one thing: whether it makes the day-to-day work of your organisation measurably easier.",
  points: [
    {
      icon: "plug",
      title: "Less manual work",
      /* Same claim, tightened: the old line explained the mechanism first and
         the payoff last. This one leads with the hours. */
      body: "The hours your team loses to copy-paste, re-keying, and chasing updates. We wire those steps together and hand the time back.",
    },
    {
      icon: "layers",
      title: "Scales with you",
      body: "Built to absorb more volume, more users, more process — without a rebuild. A good quarter should never turn into an engineering emergency.",
    },
    {
      icon: "database",
      title: "One source of truth",
      body: "Scattered tools and rival spreadsheets pulled into one place, so your team stops reconciling numbers and starts trusting them.",
    },
    {
      icon: "shield",
      title: "Quietly reliable",
      body: "Typed, tested, reviewed code that just keeps running — and that the next developer, ours or yours, can open without wincing.",
    },
    {
      icon: "gauge",
      title: "Faster to act",
      body: "We close the gap between deciding something and it actually happening across the business.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Services — PRD-COPY (Website Development) + DRAFT-COPY (remaining)         */
/* -------------------------------------------------------------------------- */

export const services = {
  heading: "What We Build",
  intro:
    "Focused engagements that turn a business goal into shipped, measurable software.",

  /* The home page shows `summary` only and links here for `body` plus the
     benefits. Each summary is a condensation of the body below it, not a new
     claim — so the two pages never print the same paragraph twice. */
  overview: {
    eyebrow: "What we build",
    heading: "Five ways in.",
    /* Names the axis the items are ordered along, so the `where` labels on the
       cards read as one scale rather than five loose captions. */
    intro:
      "Ordered from the surface everyone sees to the work that runs at 3am when nobody’s watching.",
    cta: { label: "See what each involves", href: "/services" },
  },

  /* Per-item fields beyond the copy:

     `slug`  — the fragment id of this service's card on /services. It is a
               public URL (`/services#web-applications`), so treat it as
               permanent: changing one breaks every inbound link and the
               footer/home deep links that resolve through it.
     `short` — the nav-length name, for the footer's "What we build" column.
               Lives here so that column is generated from the real service
               list and can never drift out of step with it again.
     `where` — the place in the customer's world the engagement occupies, i.e.
               how close it sits to the people who use it. The home-page
               overview orders the items along that axis (most visible →
               least) and prints the label on each card, so the ordering
               carries information a visitor can use to find themselves rather
               than being decoration. Keep the array in that order; the labels
               stop being a scale if it is shuffled. */
  items: [
    {
      /* PRD-COPY */
      icon: "globe",
      slug: "website-development",
      short: "Websites",
      where: "Public surface",
      title: "Website Development",
      summary:
        "A site that looks like you mean it — and loads like it too.",
      body: "We design and develop websites that balance aesthetics with performance. Every project is crafted to represent your brand while delivering measurable business value.",
      benefits: [
        "Strong first impressions",
        "Better customer engagement",
        "Higher conversion potential",
        "Long-term scalability",
        "Faster loading times",
      ],
      featured: true,
    },
    {
      /* DRAFT-COPY */
      icon: "app-window",
      slug: "web-applications",
      short: "Web apps",
      where: "Behind the login",
      title: "Web Applications",
      summary:
        "Dashboards, portals and internal tools your team will actually live in.",
      body: "Dashboards, portals, and internal tools built on the same foundations as our marketing work — typed, tested, and designed to be lived in every day.",
      benefits: [
        "Workflows tailored to your team",
        "Role-aware access control",
        "Reporting you can act on",
      ],
      featured: false,
    },
    {
      /* DRAFT-COPY */
      icon: "tablet-smartphone",
      slug: "mobile-applications",
      short: "Mobile apps",
      where: "In the pocket",
      title: "Mobile Applications",
      summary:
        "One Flutter codebase. Both app stores. Half the bill.",
      body: "Cross-platform apps built in Flutter, so iOS and Android come from a single codebase rather than two separate builds — and stay in step with each other as the product changes.",
      benefits: [
        "One codebase, both platforms",
        "Native performance and feel",
        "Offline use and push notifications",
        "Store submission handled for you",
      ],
      featured: false,
    },
    {
      /* DRAFT-COPY */
      icon: "plug",
      slug: "api-integrations",
      short: "APIs & integrations",
      where: "Between systems",
      title: "APIs & Integrations",
      summary:
        "Make the tools you already pay for finally talk to each other.",
      body: "We connect the systems you already pay for — CRMs, payment providers, ERPs — so data moves without anyone copying it between tabs.",
      benefits: [
        "Fewer manual handoffs",
        "One reliable source of truth",
        "Documented, versioned contracts",
      ],
      featured: false,
    },
    {
      /* DRAFT-COPY */
      icon: "sparkles",
      slug: "ai-automation",
      short: "AI & automation",
      where: "Runs unattended",
      title: "AI & Automation",
      summary: "Point automation at the work that’s quietly eating your week.",
      body: "Practical automation applied where it pays back: support triage, content pipelines, and the repetitive work quietly consuming your team’s week.",
      benefits: [
        "Faster response times",
        "Lower operational cost",
        "Humans kept in the loop",
      ],
      featured: false,
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Technology — PRD-COPY                                                      */
/* -------------------------------------------------------------------------- */

export const technology = {
  heading: "Technology, Explained as Business Impact",
  intro:
    "We choose tools for what they do for your business, not for what looks impressive on a slide.",

  /* Home names the six areas; the approach behind the choices is on /services.
     (The old technology-explainer page was folded away when Insights became
     the Blog.) */
  strip: {
    eyebrow: "The stack",
    heading: "Six areas. One standard.",
    intro:
      "We pick the tool per problem rather than bending every problem to one stack. Here's the ground we cover.",
    cta: { label: "How we choose", href: "/services" },
  },

  groups: [
    {
      id: "frontend",
      icon: "monitor",
      title: "Modern Frontend",
      /* Short, on-message distillation of `impact` — used where a full
         paragraph won't fit (mobile cards). Not a new claim; a condensation. */
      outcome: "Interfaces quick enough that nobody thinks about them.",
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "shadcn/ui",
      ],
      impact:
        "Modern frontend technologies allow us to create websites that feel responsive, load quickly, and deliver a smooth experience across devices. This helps visitors stay engaged and improves overall perception of your brand.",
    },
    {
      id: "mobile",
      icon: "tablet-smartphone",
      title: "Mobile Development",
      outcome: "Write once. Ship to both stores.",
      stack: ["Flutter", "Dart", "iOS", "Android"],
      impact:
        "A single Flutter codebase covers both app stores, so you fund one build instead of two and every release reaches iOS and Android at the same time.",
    },
    {
      id: "backend",
      icon: "server",
      title: "Backend Engineering",
      outcome: "The engine room — secure, and built to grow.",
      stack: ["Node.js", "Express", "Django", "FastAPI"],
      impact:
        "A reliable backend keeps your business running smoothly by handling data securely, supporting future expansion, and enabling advanced business functionality.",
    },
    {
      id: "databases",
      icon: "database",
      title: "Databases",
      outcome: "Data you can trust at three in the morning.",
      stack: ["PostgreSQL", "MongoDB", "Firebase"],
      impact:
        "Choosing the right database ensures reliability, security, and the flexibility to support future business growth.",
    },
    {
      id: "cloud",
      icon: "cloud",
      title: "Cloud & Deployment",
      outcome: "Ships on demand. Stays up after.",
      stack: ["Docker", "Vercel", "Cloudflare", "GitHub Actions"],
      impact:
        "Reliable deployment pipelines and cloud infrastructure minimise downtime while ensuring your website remains available and performs consistently.",
    },
    {
      id: "ai",
      icon: "bot",
      title: "AI & Automation",
      outcome: "The repetitive work, quietly handled.",
      stack: ["OpenAI", "LangChain", "Workflow Automation"],
      impact:
        "Automating repetitive workflows helps your business operate more efficiently, respond faster to customers, and focus on higher-value work.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Process — derived from the PRD's design principles                         */
/* -------------------------------------------------------------------------- */

export const process = {
  heading: "How We Work",
  intro:
    "Five stages, each answering a question you should not have to guess the answer to.",

  /* Home shows the stage names and their questions; /services carries the
     full description of each. */
  strip: {
    eyebrow: "The process",
    heading: "Five stages. No surprises.",
    intro:
      "Each one answers a question you shouldn’t have to guess the answer to — and you'll know where we are at every point.",
    cta: { label: "What happens at each stage", href: "/services" },
    /* The right-hand panel of the process block. Concrete commitments rather
       than another paragraph — the reference sets a checklist here and the
       specificity is what makes it land. Every line is already promised
       elsewhere on the site; none of it is new. */
    promises: [
      "A live preview URL from week one",
      "Lighthouse targets agreed before we build",
      "Typed, reviewed code at every merge",
      "Support that doesn't stop at launch",
    ],
  },

  steps: [
    {
      title: "Discover",
      /* PRD principle 5: technology presented through business outcomes */
      question: "What does this site have to achieve?",
      body: "We start with the business, not the sitemap. Who you are selling to, what a visitor is worth, and what the site has to do before it can be called a success.",
    },
    {
      title: "Design",
      /* Applies PRD principle 1 without restating it — the About page lists
         the principles by name, and the two pages used to print the same
         phrase. */
      question: "What is each page actually saying?",
      body: "We agree on the narrative each page tells and the question every section answers, then design against real content rather than filler, so nothing breaks when the placeholder text goes away.",
    },
    {
      title: "Build",
      question: "Is it holding up as it grows?",
      body: "Typed, reviewed, component-driven development on a live preview URL, so progress is something you look at rather than something you are told about.",
    },
    {
      title: "Verify",
      /* PRD: Lighthouse 95+, Accessibility 100, SEO 100, Best Practices 100 */
      question: "Does it meet the standard?",
      body: "Performance, accessibility, SEO, and best-practice audits run before launch, against a Lighthouse target we agree with you up front — not after the site is already live.",
    },
    {
      title: "Support",
      question: "What happens next?",
      body: "The work does not end at launch. Dependencies stay current, the codebase stays maintainable, and the site keeps pace as the business changes.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Why Choose Us — derived from the trust points and PRD standards            */
/* -------------------------------------------------------------------------- */

export const whyUs = {
  /* Set as a two-line display headline in the values section, mirroring the
     reference's left column. `lit` is the half that steps up to full white. */
  heading: { lead: "The deliberate", lit: "choice." },
  headingPlain: "The deliberate choice",
  eyebrow: "Our values",
  intro:
    "Four commitments we hold on every project — and every one of them is something you can check rather than take our word for.",
  reasons: [
    {
      icon: "gauge",
      title: "Outcomes first",
      body: "We talk about what technology does for you, not what it’s called. Every decision traces back to a result you asked for.",
    },
    {
      icon: "search",
      title: "Measured, not claimed",
      body: "Performance, accessibility, SEO and best practice audited with Lighthouse before launch — against numbers you can re-run yourself.",
    },
    {
      icon: "shield",
      title: "Accessible by default",
      body: "Keyboard paths, visible focus, semantic HTML and WCAG AA contrast are in the build from day one. Never a phase-two promise.",
    },
    {
      icon: "layers",
      title: "Yours to keep",
      body: "Typed, documented, cleanly structured code. If you walk away tomorrow, the next developer picks it up without a handover call.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* FAQ — DRAFT-COPY (not in content doc Part 1)                               */
/* -------------------------------------------------------------------------- */

export const faq = {
  eyebrow: "FAQ",
  heading: "Straight answers.",
  intro:
    "If yours isn’t here, just ask. We’d rather answer it properly than let you guess.",
  items: [
    {
      /* Points at /services rather than restating its copy — the two used to
         print the same sentence. */
      q: "What exactly do you build?",
      a: "Five things: websites, web applications, mobile apps, API integrations, and workflow automation. The Services page breaks down what each one involves and the kind of business it suits.",
    },
    {
      /* Deliberately does not restate the stack — that lives on /insights,
         and repeating it here would put the same list on two pages. */
      q: "Which technologies do you use?",
      a: "We work across modern frontend, mobile, backend, database, cloud, and automation tooling, and we pick per project rather than forcing one stack onto every problem. Our Insights page explains what each area is for and why it would matter to your business.",
    },
    {
      /* The native-vs-cross-platform question is the one every app enquiry
         opens with, and the honest answer sometimes talks the client out of
         an app entirely — which is the point. */
      q: "Do you build native iOS and Android apps?",
      a: "We build in Flutter, which compiles to genuinely native iOS and Android from one codebase — so you fund one build rather than two, and both stores stay in step. If what you actually need is your website working offline on a phone, we will say so rather than sell you an app you do not need.",
    },
    {
      q: "How do you know it will be fast?",
      a: "Because speed is a target we agree up front, not a hope. Every project is audited with Lighthouse before launch against a 95+ performance score, and the frontend architecture is built to hold it across devices.",
    },
    {
      q: "Will it work for everyone?",
      a: "Yes. Keyboard navigation, visible focus states, semantic HTML, proper heading hierarchy, and WCAG AA colour contrast are built in from the start, and audited to a score of 100 before we ship.",
    },
    {
      q: "And on a phone?",
      a: "Properly, yes. The small screen is designed first as a case in its own right — never squeezed down from a desktop layout once the real work is finished.",
    },
    {
      q: "So how do we start?",
      a: "Tell us what you are building and what it has to achieve. You get an honest read on scope and approach before anyone signs anything or commits a rupee.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Closing CTA — PRD-COPY                                                     */
/* -------------------------------------------------------------------------- */

export const closingCta = {
  /* PRD-COPY — the canonical close, used on the home page only. */
  heading: { lead: "Let's fix the part", lit: "that keeps breaking." },
  headingPlain: "Let's fix the part that keeps breaking.",
  body: "Tell us where the work gets stuck. We’ll come back with an honest read on what it takes to unstick it — including the parts you can skip.",
  button: { label: "Start the conversation", href: "/contact" },

  /* Per-page closes. The same two sentences repeated at the foot of every
     page reads as a template; each variant picks up the thread of the page
     it ends. */
  variants: {
    services: {
      heading: "Not sure which of these you need?",
      body: "Tell us the outcome you are after and we will tell you what it actually takes — including the parts you can skip.",
    },
    about: {
      heading: "Think we would be a good fit?",
      body: "The fastest way to find out is to tell us what you are building and see whether our answer sounds like someone who has done it before.",
    },
  },
} as const;
