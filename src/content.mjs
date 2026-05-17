export const site = {
  name: "mehfooz",
  shortName: "mehfooz",
  tagline: "Pioneering responsible digital experiences",
  description:
    "mehfooz builds culturally aware digital literacy programs, ethical OSINT workflows, and threat intelligence reporting for safer online communities.",
  formAction: "https://formspree.io/f/xnngrpzb",
  contactPage: "https://www.mehfooz.me/contact/",
  copyrightYear: "2026"
};

export const nav = [
  { label: "Home", href: "" },
  { label: "About", href: "about/" },
  { label: "Services", href: "services/" },
  { label: "Threat Intelligence", href: "threat-intelligence/" },
  { label: "Blog", href: "blog/" },
  { label: "Contact", href: "contact/" }
];

export const metrics = [
  {
    value: "50K+",
    label: "potential learners in year one",
    detail: "Projected reach across awareness programs and partner briefings"
  },
  {
    value: "8",
    label: "learning and safety programs",
    detail: "Community, campus, Ulema, DigiSaheli, resource hub, and more"
  },
  {
    value: "12",
    label: "defensive OSINT techniques",
    detail: "Structured collection, enrichment, reporting, and risk scoring"
  },
  {
    value: "100%",
    label: "ethical-use guardrails",
    detail: "No exploit steps, credential collection, or unlawful surveillance"
  }
];

export const featured = [
  "Community Learning",
  "Digital Safety",
  "Misinformation Response",
  "OSINT Analysis",
  "Threat Intelligence",
  "Reporting"
];

export const programs = [
  {
    id: "community-engagement",
    title: "Community Engagement Program",
    eyebrow: "Grassroots literacy",
    summary:
      "Equips local leaders with practical digital safety lessons, misinformation response playbooks, and accessible workshop materials.",
    outcomes: ["Village-level workshops", "Local-language safety guides", "Trusted referral pathways"]
  },
  {
    id: "ulema-training",
    title: "Ulema Training",
    eyebrow: "Trusted messengers",
    summary:
      "Supports religious and community leaders with careful guidance for verifying information and reducing online rumor spread.",
    outcomes: ["Verification checklists", "Responsible sharing modules", "Community Q&A sessions"]
  },
  {
    id: "campus-program",
    title: "Campus Program",
    eyebrow: "Youth resilience",
    summary:
      "Helps students understand social media manipulation, digital footprints, privacy settings, and safe reporting practices.",
    outcomes: ["Student ambassador kits", "Scenario labs", "Peer mentoring"]
  },
  {
    id: "virtual-events",
    title: "Virtual Community Events",
    eyebrow: "Remote access",
    summary:
      "Runs live and recorded sessions for communities with limited access to in-person training or reliable connectivity.",
    outcomes: ["Recorded lessons", "Live office hours", "Offline follow-up packs"]
  },
  {
    id: "digisaheli",
    title: "DigiSaheli",
    eyebrow: "Women-led safety",
    summary:
      "Creates safer participation pathways for women through privacy education, harassment response, and practical confidence building.",
    outcomes: ["Privacy clinics", "Reporting support", "Mentor circles"]
  },
  {
    id: "learning-hub",
    title: "Digital Learning Hub",
    eyebrow: "Self-paced learning",
    summary:
      "A modular learning library for digital literacy, misinformation awareness, cyber hygiene, and ethical investigation basics.",
    outcomes: ["Mini courses", "Knowledge checks", "Downloadable resources"]
  },
  {
    id: "mehfoozbot",
    title: "Guided Safety Assistant",
    eyebrow: "Guided assistance",
    summary:
      "A planned assistant experience for quick digital safety guidance, source checking prompts, and local-language learning support.",
    outcomes: ["Safety prompts", "Urdu-ready UX", "Escalation guidance"]
  },
  {
    id: "osint-desk",
    title: "OSINT Analysis Desk",
    eyebrow: "Defensive intelligence",
    summary:
      "Turns public signals into structured context for risk awareness, incident timelines, and transparent reporting.",
    outcomes: ["Source reliability scoring", "Timeline reconstruction", "Executive reporting"]
  }
];

export const solutions = [
  {
    title: "Digital Resilience Programs",
    summary:
      "Culturally tailored workshops and learning resources that help communities verify information, protect privacy, and make safer online decisions.",
    tags: ["Workshops", "Local context", "Education"],
    deliverables: ["Training curriculum", "Workshop facilitation", "Post-session resource packs"]
  },
  {
    title: "Ethical OSINT Investigations",
    summary:
      "Public-source collection and enrichment for defensive investigations, focused on transparency, proportionality, and documented confidence levels.",
    tags: ["OSINT", "Documentation", "Risk scoring"],
    deliverables: ["Collection plan", "Evidence register", "Analyst report"]
  },
  {
    title: "Threat Intelligence Reporting",
    summary:
      "Readable briefings that explain relevant online risks, source reliability, timeline context, and recommended defensive actions.",
    tags: ["Threat intel", "Briefings", "Visualization"],
    deliverables: ["Situation report", "Dashboard snapshot", "Decision brief"]
  },
  {
    title: "Misinformation Response",
    summary:
      "A practical workflow for identifying questionable narratives, checking public sources, and communicating corrections without amplifying harm.",
    tags: ["Misinformation", "Community comms", "Verification"],
    deliverables: ["Narrative map", "Verification matrix", "Response guidance"]
  }
];

export const osintTechniques = [
  {
    title: "Collection Planning",
    summary:
      "Define the question, scope, public sources, exclusions, privacy boundaries, and review checkpoints before any collection begins."
  },
  {
    title: "Social Media Intelligence",
    summary:
      "Observe public narratives, engagement patterns, and content provenance while avoiding invasive targeting or harassment."
  },
  {
    title: "Domain and Infrastructure Analysis",
    summary:
      "Review public DNS, hosting, certificates, and website metadata to understand ownership signals and infrastructure relationships."
  },
  {
    title: "Metadata Review",
    summary:
      "Inspect publicly available file and image metadata for context, with strict handling rules for sensitive personal information."
  },
  {
    title: "Digital Footprint Mapping",
    summary:
      "Map an organization or program's public online presence to identify exposed contact points, inconsistent branding, and trust gaps."
  },
  {
    title: "Source Reliability Scoring",
    summary:
      "Rate sources by transparency, corroboration, recency, independence, and known bias before drawing conclusions."
  },
  {
    title: "Threat Actor Profiling",
    summary:
      "Create defensive profiles based on public behavior patterns and intent indicators, not private identity speculation."
  },
  {
    title: "Timeline Reconstruction",
    summary:
      "Convert raw public signals into a chronological view that separates confirmed events, assessments, and open questions."
  },
  {
    title: "Data Enrichment",
    summary:
      "Add public context from reputable datasets and official sources so analysts can compare weak signals against stronger references."
  },
  {
    title: "Reporting and Visualization",
    summary:
      "Present findings with confidence levels, source notes, clear limitations, and recommended defensive next steps."
  }
];

export const ethics = [
  "Use public, lawful, proportionate sources only.",
  "Minimize personal data and avoid doxxing or harassment.",
  "Separate verified facts from analyst assessments.",
  "Document confidence, uncertainty, and source limitations.",
  "Focus on protection, education, and responsible response."
];

export const workflow = [
  {
    step: "01",
    title: "Frame the question",
    text: "Clarify the decision the investigation needs to support, the communities affected, and the boundaries of the work."
  },
  {
    step: "02",
    title: "Collect public signals",
    text: "Gather public posts, domains, official notices, web pages, and media references using a documented collection plan."
  },
  {
    step: "03",
    title: "Enrich and score",
    text: "Compare signals against corroborating sources, rate reliability, and flag sensitive information for minimization."
  },
  {
    step: "04",
    title: "Analyze patterns",
    text: "Build timelines, category breakdowns, and relationship maps that help teams understand risk without overclaiming."
  },
  {
    step: "05",
    title: "Report responsibly",
    text: "Deliver clear findings, confidence levels, recommended actions, and limitations so stakeholders can respond safely."
  }
];

export const chartData = {
  threatCategories: [
    { label: "Misinformation", value: 34, color: "#111111" },
    { label: "Impersonation", value: 18, color: "#4b4842" },
    { label: "Phishing", value: 21, color: "#77736a" },
    { label: "Harassment", value: 14, color: "#a39b8f" },
    { label: "Data exposure", value: 13, color: "#d8d1c4" }
  ],
  riskTrend: [
    { label: "Week 1", value: 42 },
    { label: "Week 2", value: 48 },
    { label: "Week 3", value: 46 },
    { label: "Week 4", value: 57 },
    { label: "Week 5", value: 53 },
    { label: "Week 6", value: 61 },
    { label: "Week 7", value: 58 },
    { label: "Week 8", value: 51 }
  ],
  reliability: [
    { label: "Official", value: 28, color: "#111111" },
    { label: "Corroborated media", value: 24, color: "#4b4842" },
    { label: "Community reports", value: 19, color: "#77736a" },
    { label: "Unverified posts", value: 17, color: "#a39b8f" },
    { label: "Archived material", value: 12, color: "#d8d1c4" }
  ],
  regionBreakdown: [
    { label: "Gilgit", value: 31 },
    { label: "Skardu", value: 24 },
    { label: "Hunza", value: 16 },
    { label: "Ghizer", value: 12 },
    { label: "Diamer", value: 10 },
    { label: "Other", value: 7 }
  ],
  caseStatus: [
    { label: "Triage", value: 16, color: "#111111" },
    { label: "In analysis", value: 11, color: "#5c5850" },
    { label: "Ready for review", value: 7, color: "#8d867a" },
    { label: "Closed", value: 23, color: "#c9c1b4" }
  ],
  workflowFunnel: [
    { label: "Signals", value: 420 },
    { label: "Scoped", value: 260 },
    { label: "Enriched", value: 150 },
    { label: "Corroborated", value: 92 },
    { label: "Reported", value: 38 }
  ],
  severity: [
    { label: "Low", value: 29, color: "#c9c1b4" },
    { label: "Medium", value: 41, color: "#8d867a" },
    { label: "High", value: 22, color: "#4b4842" },
    { label: "Critical", value: 8, color: "#111111" }
  ],
  investigationTimeline: [
    { label: "Signal detected", value: 10 },
    { label: "Source review", value: 28 },
    { label: "Cross-check", value: 49 },
    { label: "Risk scored", value: 67 },
    { label: "Report issued", value: 88 }
  ]
};

export const faqs = [
  {
    question: "How does the program combat misinformation?",
    answer:
      "mehfooz combines community education, source verification workflows, and carefully explained public-source analysis so people can pause, verify, and respond without amplifying false claims."
  },
  {
    question: "Is the OSINT work ethical?",
    answer:
      "Yes. The site presents defensive, public-source methods only. It avoids exploit steps, evasion tactics, credential collection, private surveillance, or identifying private people without a legitimate protective purpose."
  },
  {
    question: "Can programs work in remote areas?",
    answer:
      "The program model supports offline resource packs, community learning hubs, and low-bandwidth delivery so training can continue where connectivity is inconsistent."
  },
  {
    question: "Who can use the services?",
    answer:
      "Community organizations, schools, civic groups, newsrooms, and small teams that need practical digital safety education or defensive public-source intelligence support."
  }
];

export const testimonials = [
  {
    quote:
      "The strongest part of mehfooz is that it explains digital safety in language our community already understands.",
    name: "Shujaat Ali",
    role: "Master's Student"
  },
  {
    quote:
      "The investigation workflow makes it easier to separate rumor, weak signals, and confirmed facts before sharing anything.",
    name: "Zuhaib Khan",
    role: "Project Manager"
  },
  {
    quote:
      "A practical resource hub for people who want online safety to feel less abstract and more doable.",
    name: "Tehreem Batool",
    role: "Teacher"
  }
];

export const team = [
  {
    name: "Syed Hasnain Akber",
    role: "Founder",
    initials: "HA",
    bio:
      "Founder of mehfooz, focused on digital literacy, community development, and safer public participation online across Gilgit Baltistan."
  },
  {
    name: "Raunaq Jain",
    role: "Advisory and Strategy",
    initials: "RJ",
    bio:
      "Advises on strategy, growth, and sustainable program design for education-first digital resilience initiatives."
  },
  {
    name: "Community Fellows",
    role: "Research and Outreach",
    initials: "CF",
    bio:
      "A rotating group of educators, facilitators, and analysts who help localize training materials and review public-source findings."
  }
];

export const blogPosts = [
  {
    slug: "how-osint-supports-modern-threat-intelligence",
    title: "How OSINT Supports Modern Threat Intelligence",
    summary:
      "A practical look at how public-source context helps teams understand risk without overreaching or turning analysis into surveillance.",
    date: "2026-05-12",
    displayDate: "May 12, 2026",
    category: "Threat Intelligence",
    author: "Research desk",
    readTime: "6 min read",
    image: "assets/framer-workshop.jpg",
    content: [
      {
        heading: "Public context changes the quality of the brief",
        paragraphs: [
          "Threat intelligence is most useful when it helps a team make a better decision. Open-source intelligence supports that goal by adding public context: what is being said, where a claim appeared first, which sources agree, and where confidence is still low.",
          "For mehfooz, OSINT is not about collecting everything. It is about collecting enough public information to understand a risk, protect people, and explain the limits of the finding."
        ]
      },
      {
        heading: "From signals to assessments",
        paragraphs: [
          "A public post, a suspicious domain, or a repeated rumor is only a signal. Analysts need to enrich that signal with timestamps, source quality, corroboration, and impact. That process turns scattered observations into a careful assessment.",
          "The most important discipline is separating facts from interpretation. A report should make it obvious what was directly observed, what was inferred, and what still needs review."
        ]
      },
      {
        heading: "Responsible intelligence is defensible",
        paragraphs: [
          "Ethical OSINT uses public sources, minimizes personal data, and avoids private targeting. It also makes room for uncertainty. Confidence levels, source notes, and clear limitations make a report more trustworthy than overconfident language.",
          "The final output should help people act safely: verify before sharing, tighten account security, correct misleading information, or escalate a concern to the right support channel."
        ]
      }
    ]
  },
  {
    slug: "digital-footprint-mapping-for-organizations",
    title: "Digital Footprint Mapping for Organizations",
    summary:
      "How small teams can review their public presence, reduce confusion, and close trust gaps before attackers or rumor networks exploit them.",
    date: "2026-04-28",
    displayDate: "Apr 28, 2026",
    category: "Digital Safety",
    author: "Field team",
    readTime: "5 min read",
    image: "assets/framer-about-visual.png",
    content: [
      {
        heading: "Your public presence is part of your security posture",
        paragraphs: [
          "A digital footprint map lists the public channels, domains, contact points, and documents connected to an organization. It helps teams see what a community member, journalist, or adversary can already find.",
          "This review is especially useful for programs that serve the public. Inconsistent names, outdated phone numbers, or abandoned social accounts can create confusion and make impersonation easier."
        ]
      },
      {
        heading: "What to map",
        paragraphs: [
          "Start with official websites, social profiles, public email addresses, press mentions, shared documents, and registration records that are meant to be public. Record the source, date checked, owner, and any action needed.",
          "The goal is not to expose private details. The goal is to reduce avoidable public risk and make trustworthy channels easier to recognize."
        ]
      },
      {
        heading: "Turn findings into maintenance",
        paragraphs: [
          "A useful footprint review ends with small operational fixes: update bios, remove dead links, align branding, pin official contact details, and document who owns each channel.",
          "Repeat the review quarterly or after major campaigns. Public trust is easier to maintain when the official surface stays clean and consistent."
        ]
      }
    ]
  },
  {
    slug: "building-an-ethical-investigation-workflow",
    title: "Building an Ethical Investigation Workflow",
    summary:
      "A defensive investigation workflow that keeps public-source work scoped, documented, and respectful of the people affected.",
    date: "2026-04-15",
    displayDate: "Apr 15, 2026",
    category: "Ethics",
    author: "Analysis desk",
    readTime: "7 min read",
    image: "assets/framer-community.jpg",
    content: [
      {
        heading: "Start with boundaries",
        paragraphs: [
          "Good investigations begin before collection. Define the question, who needs the answer, what public sources are appropriate, and what information should be excluded. This keeps the work proportionate.",
          "For community safety work, boundaries are not bureaucracy. They are the difference between protective analysis and harmful attention."
        ]
      },
      {
        heading: "Document every step",
        paragraphs: [
          "A collection log should capture source URLs, timestamps, analyst notes, confidence levels, and review status. This makes the final report easier to audit and easier to correct when new information appears.",
          "Documentation also helps teams avoid repeating weak assumptions. When uncertainty is visible, reviewers can challenge it before it becomes a conclusion."
        ]
      },
      {
        heading: "Report for action, not spectacle",
        paragraphs: [
          "The best investigation reports are clear, calm, and practical. They explain what happened, why it matters, what evidence supports the assessment, and what the reader can do next.",
          "Avoid sensational language. Avoid unnecessary personal details. Keep the focus on reducing harm."
        ]
      }
    ]
  },
  {
    slug: "understanding-risk-scores-in-cyber-intelligence",
    title: "Understanding Risk Scores in Cyber Intelligence",
    summary:
      "Risk scores are useful only when the ingredients are visible. Here is how to make scoring understandable and reviewable.",
    date: "2026-03-31",
    displayDate: "Mar 31, 2026",
    category: "Analysis",
    author: "Research desk",
    readTime: "5 min read",
    image: "assets/framer-program-card.png",
    content: [
      {
        heading: "A score is not the finding",
        paragraphs: [
          "Risk scores help teams compare cases, but they should never replace an analyst explanation. A number without context can hide uncertainty and encourage rushed decisions.",
          "mehfooz treats scoring as a summary layer. The report still needs source notes, impact context, confidence levels, and recommended next steps."
        ]
      },
      {
        heading: "Make the ingredients visible",
        paragraphs: [
          "A practical scoring model might consider source reliability, potential impact, evidence quality, recency, and exposure. Each factor should be easy to review and update.",
          "When a score changes, the reason should be visible. Did a source become corroborated? Did the impact decrease? Did the claim become stale?"
        ]
      },
      {
        heading: "Use scores to prioritize care",
        paragraphs: [
          "The purpose of scoring is triage. High scores may deserve faster review, leadership attention, or clearer public communication. Low scores may simply need monitoring.",
          "Responsible teams use scores to allocate attention, not to create fear."
        ]
      }
    ]
  },
  {
    slug: "from-raw-signals-to-actionable-intelligence",
    title: "From Raw Signals to Actionable Intelligence",
    summary:
      "How collection, enrichment, analysis, and reporting turn scattered public information into decisions people can actually use.",
    date: "2026-03-14",
    displayDate: "Mar 14, 2026",
    category: "Workflow",
    author: "Analysis desk",
    readTime: "6 min read",
    image: "assets/framer-about-photo.jpg",
    content: [
      {
        heading: "Raw signals are messy",
        paragraphs: [
          "Screenshots, links, posts, and community reports often arrive without structure. Some are useful, some are outdated, and some are misleading. The first task is to organize them without assuming they are true.",
          "A simple intake model can capture the source, timestamp, topic, affected community, and initial concern."
        ]
      },
      {
        heading: "Enrichment creates perspective",
        paragraphs: [
          "Enrichment adds public context from official sources, archived pages, domain records, reputable media, or prior cases. This helps analysts compare a weak signal against stronger references.",
          "The goal is not to prove a preferred story. The goal is to understand what the public evidence can and cannot support."
        ]
      },
      {
        heading: "Actionable means clear next steps",
        paragraphs: [
          "A useful intelligence product explains what changed, who is affected, how confident the team is, and what can be done now. It should be readable by non-specialists.",
          "Action might mean publishing a correction, updating account security, contacting a platform, or simply continuing to monitor with a defined review date."
        ]
      }
    ]
  }
];
