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
     search snippet, OG/Twitter, schema, and footer. */
  promise:
    "Dev Syndicate is a software development company that solves complex problems with software, AI, and automation — from websites and web or mobile apps to API integrations and intelligent workflows.",
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
  /* Split for the word-stagger animation the PRD specifies. */
  headline: "Building Digital Experiences That Help Businesses Grow.",
  /* Words rendered in gradient within the headline stagger. */
  headlineAccentFrom: 5,
  supporting:
    "Your website is often the first impression customers have of your business. We create high-performance websites that combine thoughtful design, modern technology, and seamless user experiences to help you build trust, generate leads, and support long-term growth.",
  primaryCta: { label: "Start Your Project", href: "/contact" },
  secondaryCta: { label: "Explore Our Process", href: "#process" },
} as const;

/* -------------------------------------------------------------------------- */
/* Trust — PRD-COPY                                                           */
/* -------------------------------------------------------------------------- */

export const trust = {
  heading: "Built Around Business Outcomes",
  intro:
    "Every decision we make is driven by the impact it creates for your business.",
  points: [
    {
      icon: "gauge",
      title: "Faster websites",
      body: "Performance budgets and edge delivery keep pages fast, so visitors stay engaged instead of leaving while the page loads.",
    },
    {
      icon: "layers",
      title: "Scalable architecture",
      body: "Systems designed to grow with your company, so a good quarter never becomes an engineering emergency.",
    },
    {
      icon: "search",
      title: "SEO-ready foundations",
      body: "Semantic markup, structured data, and server rendering that improve discoverability from day one.",
    },
    {
      icon: "shield",
      title: "Secure and maintainable",
      body: "Typed, tested, reviewed codebases that the next developer — ours or yours — can pick up without friction.",
    },
    {
      icon: "smartphone",
      title: "Responsive everywhere",
      body: "Experiences that hold their shape across every device, from a 320px phone to an ultrawide display.",
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
    heading: "What We Build",
    /* Names the axis the items are ordered along, so the `where` labels on the
       cards read as one scale rather than five loose captions. */
    intro:
      "Five kinds of engagement, ordered from the surface everyone sees to the work that runs when nobody’s watching.",
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
        "Sites that balance aesthetics with performance, built to carry real business value.",
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
        "Dashboards, portals, and internal tools designed to be lived in every day.",
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
        "One Flutter codebase that ships to both the App Store and Play Store.",
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
        "Connecting the systems you already pay for, so data moves without anyone copying it.",
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
      summary: "Practical automation applied where it actually pays back.",
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
    heading: "Six areas, one standard",
    intro:
      "We pick per project rather than forcing one stack onto every problem.",
    cta: { label: "How we choose", href: "/services" },
  },

  groups: [
    {
      id: "frontend",
      icon: "monitor",
      title: "Modern Frontend",
      /* Short, on-message distillation of `impact` — used where a full
         paragraph won't fit (mobile cards). Not a new claim; a condensation. */
      outcome: "Fast, responsive interfaces that keep visitors engaged.",
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
      outcome: "One codebase ships to both app stores.",
      stack: ["Flutter", "Dart", "iOS", "Android"],
      impact:
        "A single Flutter codebase covers both app stores, so you fund one build instead of two and every release reaches iOS and Android at the same time.",
    },
    {
      id: "backend",
      icon: "server",
      title: "Backend Engineering",
      outcome: "Secure, scalable systems built to grow with you.",
      stack: ["Node.js", "Express", "Django", "FastAPI"],
      impact:
        "A reliable backend keeps your business running smoothly by handling data securely, supporting future expansion, and enabling advanced business functionality.",
    },
    {
      id: "databases",
      icon: "database",
      title: "Databases",
      outcome: "Reliable data foundations that scale.",
      stack: ["PostgreSQL", "MongoDB", "Firebase"],
      impact:
        "Choosing the right database ensures reliability, security, and the flexibility to support future business growth.",
    },
    {
      id: "cloud",
      icon: "cloud",
      title: "Cloud & Deployment",
      outcome: "Dependable delivery with minimal downtime.",
      stack: ["Docker", "Vercel", "Cloudflare", "GitHub Actions"],
      impact:
        "Reliable deployment pipelines and cloud infrastructure minimise downtime while ensuring your website remains available and performs consistently.",
    },
    {
      id: "ai",
      icon: "bot",
      title: "AI & Automation",
      outcome: "Automated workflows that free up your team.",
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
    heading: "How We Work",
    intro: "Five stages, each answering a question you shouldn’t have to guess the answer to.",
    cta: { label: "What happens at each stage", href: "/services" },
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
  heading: "Why Teams Choose Us",
  intro:
    "Four commitments that shape every decision on a project.",
  reasons: [
    {
      title: "Outcomes lead the conversation",
      body: "Every decision is driven by the impact it creates for your business. We explain technology through what it does for you, not through what it is called.",
    },
    {
      title: "Quality is measured, not asserted",
      body: "Performance, accessibility, SEO, and best practices are held to a fixed target and audited with Lighthouse before launch. Our claims come with numbers you can re-run yourself.",
    },
    {
      title: "Accessible to everyone, by default",
      body: "Keyboard navigation, visible focus states, semantic HTML, proper heading order, and WCAG AA contrast are part of the build — never a later phase.",
    },
    {
      title: "Built to be handed over",
      body: "Secure, maintainable, typed codebases with a clear component structure, so the next developer to open the project is never starting from scratch.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* FAQ — DRAFT-COPY (not in content doc Part 1)                               */
/* -------------------------------------------------------------------------- */

export const faq = {
  heading: "Questions, Answered",
  intro:
    "If yours isn’t here, ask us directly — we would rather answer it properly than have you guess.",
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
      q: "How do you make sure the site is fast?",
      a: "Performance is a target, not a hope. Every project is audited with Lighthouse before launch against a 95+ performance score, and modern frontend architecture keeps pages responsive and quick across devices.",
    },
    {
      q: "Will the site be accessible?",
      a: "Yes. Keyboard navigation, visible focus states, semantic HTML, proper heading hierarchy, and WCAG AA colour contrast are built in from the start, and audited to a score of 100 before we ship.",
    },
    {
      q: "Does it work properly on mobile?",
      a: "Every build is responsive across devices by default. Layouts are designed for the small screen as a first-class case, not adapted down from a desktop design at the end.",
    },
    {
      q: "How do we get started?",
      a: "Tell us what you are building and what it needs to achieve. We will come back with an honest view of scope and approach before anyone commits to anything.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Closing CTA — PRD-COPY                                                     */
/* -------------------------------------------------------------------------- */

export const closingCta = {
  /* PRD-COPY — the canonical close, used on the home page only. */
  heading: "Ready to Build Something Exceptional?",
  body: "Whether you’re launching a new business or elevating an existing brand, we’re here to build digital experiences that create lasting impact.",
  button: { label: "Let’s Talk", href: "/contact" },

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
