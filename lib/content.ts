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
  /* Set on two lines in the hero, the second carrying the emphasis.
     The split falls after "for" rather than anywhere else because that is
     where the phrase's meaning actually sits: "Technology" is the medium and
     every studio has it, "Purpose." is the claim. Muting the setup and lighting
     the payoff puts the contrast on the only word doing work. */
  headline: { lead: "Technology for", lit: "Purpose." },
  /* Kept as a single string for metadata/OG, where the line break is noise. */
  headlinePlain: "Technology for Purpose.",
  supporting:
    "Engineering purposeful technology that solves meaningful problems, creates tangible value, and improves how businesses work.",
  primaryCta: { label: "Start your project", href: "/contact" },
  secondaryCta: { label: "See how we work", href: "#process" },
  /* The hero's second beat, below the fold. This slot used to hold a row of
     five operational promises standing in for the client-logo strip the
     reference runs; it now states plainly what the studio builds, which is the
     question the headline above raises and does not answer.

     "DevSyndicate" is closed up here on purpose, and it is the only place in
     visible copy that it is. `seo.alternateNames` lists that spelling, and the
     note there is that variants have to appear in real page copy or Google
     discounts them — so this one occurrence earns its keep. Every other mention
     on the site, including the wordmark directly above it, stays "Dev
     Syndicate". */
  statement: {
    headline: { lead: "We build", lit: "what your business needs." },
    body: "DevSyndicate engineers software, AI, and automation that help businesses work better. From digital products and custom software to intelligent systems and connected workflows, we build technology around your needs — with purpose, precision, and permanence.",
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
  heading: "What we build.",
  intro: "Technology for every layer of your business.",

  /* The home page shows the six layers as a list and links here; this page
     carries the audience line, the body, and what each one includes. Nothing is
     printed twice across the two. */
  overview: {
    heading: "What we build.",
    intro: "Technology for every layer of your business.",
    cta: { label: "See what each involves", href: "/services" },
  },

  /* THE NUMBERS ARE NOT DECORATION, AND THIS IS THE ONE THING TO PRESERVE IF
     THIS LIST IS EVER EDITED.

     A numbered list is only honest when the order carries information, and here
     it does: the six run from the OUTSIDE IN. 01 is the surface anyone can see
     without asking permission; 02 is what people log in to; 03 is the
     operational core the business actually runs on; 04 is the connective tissue
     between systems; 05 is intelligence sitting on top of all of it; 06 is the
     work that happens with nobody watching. That is a depth ordering, which is
     exactly what the supporting line means by "every layer of your business" —
     so the numbers index strata, not menu items.

     Shuffle this array and the numbering stops meaning anything.

     Per-item fields:
       `slug`     — the fragment id of this service on /services. Public URL
                    (`/services#digital-products`), linked from the footer and
                    the home list: treat as permanent.
       `short`    — nav-length name, for the footer column.
       `name`     — the layer, e.g. "Digital Products".
       `title`    — what it actually consists of, in the client’s words.
       `audience` — who this layer is for. The fastest way for a visitor to
                    find themselves in a list of six.
       `body`     — one paragraph, no list.
       `includes` — the concrete scope. This is the part prospects actually
                    read, so it stays specific and unglamorous. */
  items: [
    {
      n: "01",
      slug: "digital-products",
      short: "Digital products",
      name: "Digital Products",
      title: "Websites, Mobile Apps & Digital Experiences",
      audience:
        "For businesses that need to be seen, understood, and connected.",
      body: "We build high-performance websites, landing pages, corporate sites, and mobile applications that represent your business, engage your audience, and turn digital interactions into meaningful outcomes.",
      includes: [
        "Landing pages",
        "Corporate & business websites",
        "Product / service websites",
        "Mobile applications",
        "SEO optimisation",
        "Forms & lead capture",
        "Email integrations",
        "Analytics & tracking",
        "CMS integration",
        "Performance & accessibility",
      ],
    },
    {
      n: "02",
      slug: "business-applications",
      short: "Business applications",
      name: "Business Applications",
      title: "Platforms & Web Applications",
      audience:
        "For businesses that need people to log in, work, manage, or interact.",
      body: "We build custom web platforms that turn business processes into software — from dashboards and customer portals to internal tools and workflow-based applications.",
      includes: [
        "Customer portals",
        "Admin dashboards",
        "Employee portals",
        "Booking / management systems",
        "Role-based access",
        "Authentication",
        "Data management",
        "Backend systems",
        "Business workflows",
      ],
    },
    {
      n: "03",
      slug: "business-systems",
      short: "Business systems",
      name: "Business Systems",
      title: "ERP, CRM & Operational Systems",
      audience:
        "For businesses that need their operations connected in one place.",
      body: "We engineer systems that bring customers, teams, data, processes, and day-to-day operations together — replacing disconnected tools and manual workflows with one coordinated system.",
      includes: [
        "ERP systems",
        "CRM systems",
        "Customer management",
        "Employee / team management",
        "Inventory & operations",
        "Workflow management",
        "Reporting & dashboards",
        "Role & permission systems",
        "Custom business logic",
      ],
    },
    {
      n: "04",
      slug: "integrations-apis",
      short: "Integrations & APIs",
      name: "Integrations & APIs",
      title: "Connected Systems",
      audience: "For businesses whose tools need to work together.",
      body: "We connect the software you already use so information moves between systems automatically, reliably, and without repetitive manual work.",
      includes: [
        "API development",
        "Third-party API integrations",
        "Payment gateways",
        "Email & communication services",
        "CRM / ERP integrations",
        "Google services",
        "Webhooks",
        "Data synchronisation",
        "Custom integrations",
      ],
    },
    {
      n: "05",
      slug: "ai-systems",
      short: "AI systems",
      name: "AI Systems",
      title: "AI & Intelligent Systems",
      audience:
        "For businesses looking to put AI to work — not just add an AI feature.",
      body: "We integrate AI into existing products and build standalone intelligent systems that can understand information, assist teams, automate decisions, and interact with customers.",
      includes: [
        "AI features in existing applications",
        "AI chatbots",
        "Customer support assistants",
        "Internal AI assistants",
        "Document / knowledge systems",
        "AI-powered search",
        "Recommendation systems",
        "LLM integrations",
        "Intelligent workflows",
        "Custom AI applications",
      ],
    },
    {
      n: "06",
      slug: "automation",
      short: "Automation",
      name: "Automation",
      title: "Automation & Workflow Engineering",
      audience:
        "For businesses spending time on work software should be doing.",
      body: "We automate repetitive processes, connect business workflows, and create systems that move work forward with less manual intervention.",
      includes: [
        "Workflow automation",
        "Process automation",
        "Notifications & alerts",
        "Automated reporting",
        "Lead routing",
        "Data processing",
        "Scheduled workflows",
        "Approval workflows",
        "AI-powered automation",
        "Cross-platform automation",
      ],
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
      "We choose technology around the problem — guided by what the solution actually requires. Our engineering covers the core layers needed to build, connect, and scale modern digital systems.",
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
    /* Split into setup and payoff, the same shape as `hero.statement.headline`
       — the display type sets the lead muted and the lit half at full
       contrast.

       This is a single short sentence, which the `whyUs` note below says
       should normally be set whole. It earns the split anyway because the
       break is not arbitrary: the muted half IS the problem and the lit half
       IS the purpose, so the colour carries the same move the words do. Split
       a short heading only when it does that much work. */
    heading: { lead: "From problem", lit: "to purpose." },
    intro:
      "A clear process for turning what your business needs into technology that works.",
    /* Read once, at the head of the pipeline, before the traverse starts — it
       states the shape of the whole process so the five stages arrive as parts
       of something rather than as a list. It fades out as the pipeline moves,
       so it never competes with the stages for attention. */
    lead: "We start by understanding the problem, define what the solution needs to achieve, then design, build, and verify it against those goals. Every stage has a purpose, a clear outcome, and a point of validation — so you always know what we’re building and why.",
    cta: { label: "What happens at each stage", href: "/services" },
    /* Closes the process block: what holds true at every stage, rather than
       another paragraph. It sits under the pipeline as a single quiet row, so
       each line has to survive being read in isolation and at a glance — which
       is why they are four short noun phrases and not four sentences.

       The heading lives here with the list rather than in the component: it
       names this list specifically, so the two have to be edited together or
       they drift apart. */
    promises: {
      heading: "What you get, every time",
      items: [
        "Clear visibility from day one",
        "Defined standards before we build",
        "Reviewed, maintainable code",
        "Support beyond launch",
      ],
    },
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
/* About — the studio's own position                                          */
/* -------------------------------------------------------------------------- */

export const about = {
  /* THE SPLIT IS INVERTED HERE, AND DELIBERATELY.
     Everywhere else on the site the display type runs muted setup → lit payoff,
     a crescendo. This headline is a statement of precedence — X before Y — so
     the word that comes first is also the word that matters most, and setting
     "product" as the bright half would argue the opposite of what the sentence
     says. `lit` is therefore the FIRST half here. See components/sections/
     about-hero.tsx, which is why About does not use the shared PageHeader. */
  hero: {
    eyebrow: "About",
    lit: "Purpose",
    lead: "before product.",
    intro:
      "We start with what a business actually needs, then decide what to build — and whether it needs building at all.",
  },

  /* Vision is the distant state, mission is the present act. The section
     renders them as a pair and encodes that difference in the light: the
     vision panel is lit from the far top corner, the mission panel from close
     underneath. Same device, opposite ends of the same idea. */
  vision: {
    label: "Our Vision",
    statement: "A world where technology is built with purpose.",
    body: [
      "We envision a future where technology is created because it is needed — not simply because it can be built.",
      "Where businesses use technology to solve meaningful problems, create lasting value, and improve the way people work, while avoiding unnecessary complexity and digital waste.",
    ],
  },

  mission: {
    label: "Our Mission",
    statement: "Build better technology that matters.",
    body: [
      "Our mission is to engineer purposeful software, AI, and automation that solve meaningful business problems and create lasting value.",
    ],
  },

  /* THESE ARE CONSTRAINTS, NOT STEPS. You do not do 01 and then 02 — all five
     are held at once on every project, which is what "don’t compromise on"
     means. The numbers are therefore an index and a count, not a sequence, and
     the section is built to read as one held set rather than five separate
     items. See components/sections/principles.tsx.

     01 is deliberately the same claim as the page’s own headline. The hero
     asserts "Purpose before product"; this is where it is actually defined, so
     the first row carries the lead treatment rather than being one of five
     equals. */
  principles: {
    heading: { lead: "Five decisions", lit: "we don’t compromise on." },
    intro:
      "The principles that guide what we build and how we build it.",
    items: [
      {
        title: "Purpose before product",
        body: "We start with the problem, not the technology. If something doesn’t solve a meaningful need or create enough value to justify itself, it doesn’t need to be built.",
      },
      {
        title: "The right technology",
        body: "We choose technology based on what the problem requires — balancing capability, complexity, cost, performance, and long-term maintainability rather than following trends for their own sake.",
      },
      {
        title: "Simplicity where it matters",
        body: "More features and more complexity don’t automatically create better solutions. We favour clear architectures, focused functionality, and systems that are easier to understand, use, and maintain.",
      },
      {
        title: "Built for longevity",
        body: "Technology shouldn’t become a liability the moment it launches. We build systems that can be maintained, adapted, and extended as the business and its needs evolve.",
      },
      {
        title: "Responsible by design",
        body: "We consider the broader cost of what we build — from infrastructure and digital resources to the use of AI. Technology should create meaningful value without unnecessary complexity or waste.",
      },
    ],
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Why Choose Us — derived from the trust points and PRD standards            */
/* -------------------------------------------------------------------------- */

export const whyUs = {
  /* One voice at full contrast rather than the two-part {lead, lit} split the
     hero and the statement band use. That split earns its keep on a long
     headline, where a muted setup can carry half a sentence and the payoff
     lands on the other half; on three words it would only cut the phrase in an
     arbitrary place. Section heads that are already short are set whole. */
  heading: "Deliberate by principle.",
  intro:
    "Four values guide how we think, build, and deliver — keeping every decision purposeful, practical, and built to last.",
  /* Order is load-bearing: the section renders these into a 2×2 whose cards are
     each lit from the corner facing the middle, so index 0 is top-left and
     index 3 is bottom-right. Reordering these reorders the grid, not the
     lighting — see FACING_CENTRE in components/sections/values.tsx. */
  reasons: [
    {
      icon: "gauge",
      title: "Outcomes first",
      body: "We start with what needs to change, not what needs to be built. Every technical decision is driven by the outcome your business needs.",
    },
    {
      /* Resilience rather than security. `layers` would read closer to
         "maintainable" but Yours to keep already holds it, and two cards in one
         grid should never share a glyph. */
      icon: "shield",
      title: "Built to last",
      body: "Simple, maintainable systems designed to stay useful beyond launch — easy to understand, adapt, and evolve as your business grows.",
    },
    {
      icon: "search",
      title: "Measured, not claimed",
      body: "Performance, accessibility, SEO and best practice audited with Lighthouse before launch — against numbers you can re-run yourself.",
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
