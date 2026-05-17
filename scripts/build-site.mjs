import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  blogPosts,
  chartData,
  ethics,
  faqs,
  featured,
  gbDistricts,
  metrics,
  nav,
  osintTechniques,
  programs,
  site,
  solutions,
  team,
  testimonials,
  workflow
} from "../src/content.mjs";

const root = process.cwd();

const pageDirs = [
  "about",
  "services",
  "osint-techniques",
  "threat-intelligence",
  "blog",
  "contact",
  "team",
  "privacy"
];

const assetFiles = [
  "assets/brand-mark.svg",
  "assets/og-card.svg",
  "assets/blog-youth-peace.svg",
  "assets/blog-maternal-care.svg",
  "assets/blog-digital-propaganda.svg",
  "assets/avatar-ha.svg",
  "assets/avatar-zk.svg",
  "assets/avatar-sa.svg"
];

const staleAssetFiles = [
  "assets/blog-osint-threat-intelligence.svg",
  "assets/blog-digital-footprint.svg",
  "assets/blog-ethical-workflow.svg",
  "assets/blog-risk-scores.svg",
  "assets/blog-actionable-intelligence.svg"
];

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function strip(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function prefix(depth) {
  return "../".repeat(depth);
}

function href(target = "", depth = 0) {
  if (/^(https?:|mailto:|tel:|#)/.test(target)) return target;
  const base = prefix(depth);
  const url = `${base}${target}`;
  return url || "./";
}

function asset(target, depth = 0) {
  return `${prefix(depth)}${target}`;
}

function navMarkup(active, depth) {
  return nav
    .map((item) => {
      const isActive = item.href === active;
      return `<a class="nav-link${isActive ? " is-active" : ""}" href="${href(item.href, depth)}"${isActive ? ' aria-current="page"' : ""}>${esc(item.label)}</a>`;
    })
    .join("");
}

function layout({ title, description, active, depth, body, pageClass = "" }) {
  const pageTitle = active === "" ? `${site.name} | ${site.tagline}` : `${title} | ${site.name}`;
  const desc = description || site.description;
  const chartsJson = JSON.stringify(chartData).replaceAll("</", "<\\/");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#0a0a0a">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${asset("assets/og-card.svg", depth)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${asset("assets/framer-logo.png", depth)}" type="image/png">
  <link rel="stylesheet" href="${asset("style.css", depth)}">
  <script>window.mehfoozCharts = ${chartsJson};</script>
  <script src="${asset("script.js", depth)}" defer></script>
</head>
<body class="cinematic-site ${esc(pageClass)}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="container header-inner">
      <a class="brand" href="${href("", depth)}" aria-label="${esc(site.name)} home">
        <img src="${asset("assets/framer-logo.png", depth)}" alt="" width="46" height="46">
        <span><strong>mehfooz</strong></span>
      </a>
      <nav class="desktop-nav" aria-label="Main navigation">
        ${navMarkup(active, depth)}
      </nav>
      <a class="header-cta" href="${href("contact/", depth)}">Start here</a>
      <button class="mobile-toggle" type="button" data-mobile-toggle aria-label="Open navigation" aria-expanded="false">
        <span></span>
        <span></span>
      </button>
    </div>
    <div class="mobile-panel" data-mobile-panel aria-hidden="true">
      <nav class="mobile-nav" aria-label="Mobile navigation">
        ${navMarkup(active, depth)}
        <a class="button button-primary" href="${href("contact/", depth)}">Start here</a>
      </nav>
    </div>
  </header>
  <main id="main">
    ${body}
  </main>
  ${botWidget(depth)}
  ${footer(depth)}
</body>
</html>
`;
}

function botWidget(depth) {
  return `<div class="bot-shell" data-chat-shell>
  <button class="bot-launcher" type="button" data-chat-open aria-haspopup="dialog" aria-controls="chatModal">
    <span class="bot-launcher-orb" aria-hidden="true"></span>
    <span>mehfoozbot</span>
  </button>
  <div id="chatModal" class="chat-modal hidden" role="dialog" aria-modal="true" aria-label="mehfoozbot">
    <div class="chat-backdrop" data-chat-close></div>
    <section class="chat-panel" aria-label="mehfoozbot conversation">
      <header class="chat-panel-header">
        <div>
          <span class="chat-status"><i aria-hidden="true"></i> online guidance</span>
          <h2>mehfoozbot</h2>
        </div>
        <button class="chat-close-btn" type="button" data-chat-close aria-label="Close mehfoozbot">x</button>
      </header>
      <div class="chat-log" data-chat-log aria-live="polite" aria-relevant="additions"></div>
      <form class="chat-input-area" data-chat-form>
        <label class="sr-only" for="chat-input">Ask mehfoozbot</label>
        <input id="chat-input" class="chat-input" name="message" type="text" autocomplete="off" aria-label="Ask about verification or digital safety">
        <button class="chat-send-btn" type="submit">Send</button>
      </form>
    </section>
  </div>
</div>`;
}

function footer(depth) {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="brand footer-brand" href="${href("", depth)}">
        <img src="${asset("assets/framer-logo.png", depth)}" alt="" width="42" height="42">
        <span><strong>mehfooz</strong></span>
      </a>
      <p>${esc(site.description)}</p>
      <div class="footer-badges">
        <span>Ethical OSINT</span>
        <span>Digital Literacy</span>
        <span>Threat Intelligence</span>
      </div>
    </div>
    <div>
      <h2>Explore</h2>
      <div class="footer-links">
        ${nav.map((item) => `<a href="${href(item.href, depth)}">${esc(item.label)}</a>`).join("")}
        <a href="${href("team/", depth)}">Team</a>
        <a href="${href("privacy/", depth)}">Privacy</a>
      </div>
    </div>
    <div>
      <h2>Focus</h2>
      <div class="footer-links">
        <span>Ethical OSINT</span>
        <span>Digital resilience</span>
        <span>Threat intelligence</span>
      </div>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>&copy; ${site.copyrightYear} ${esc(site.name)}. All rights reserved.</span>
    <a href="#main" data-back-top>Back to top</a>
  </div>
</footer>`;
}

function sectionIntro(kicker, title, text, align = "") {
  const textMarkup = text ? `\n    <p>${esc(text)}</p>` : "";
  return `<div class="section-intro ${align}">
    <span class="kicker">${esc(kicker)}</span>
    <h2>${title}</h2>${textMarkup}
  </div>`;
}

function actionIcon(type) {
  const icons = {
    verify: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg>`,
    educate: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5c2.8-.8 5.4-.3 8 1.5 2.6-1.8 5.2-2.3 8-1.5v11c-2.8-.8-5.4-.3-8 1.5-2.6-1.8-5.2-2.3-8-1.5v-11Z"></path><path d="M12 8v11"></path></svg>`,
    report: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 18 1.2-4.5L15.7 3a2.1 2.1 0 0 1 3 3L8.2 16.5 4 18Z"></path><path d="m14 4.7 5.3 5.3"></path></svg>`
  };
  return icons[type];
}

function heroMedia(depth) {
  const actions = [
    {
      href: "threat-intelligence/",
      icon: "verify",
      title: "Verify",
      text: "Check information from trusted sources"
    },
    {
      href: "services/",
      icon: "educate",
      title: "Educate",
      text: "Build digital literacy together"
    },
    {
      href: "contact/",
      icon: "report",
      title: "Report",
      text: "Share what matters safely and responsibly"
    }
  ];

  return `<div class="hero-signal-composition" data-tilt-scene aria-label="Gilgit Baltistan community signal network">
    <img class="hero-reference-scene" src="${asset("assets/hero-gb-community-signal.png", depth)}" alt="Monochrome community education scene with a Gilgit Baltistan signal map" loading="eager">
    <div class="signal-depth signal-depth-a" aria-hidden="true"></div>
    <div class="signal-depth signal-depth-b" aria-hidden="true"></div>
    <div class="signal-particles" aria-hidden="true">
      ${Array.from({ length: 34 }, (_, index) => `<span style="--x:${8 + ((index * 29) % 86)}%;--y:${5 + ((index * 47) % 82)}%;--s:${1 + (index % 4)}px;--d:${(index % 7) * 0.35}s"></span>`).join("")}
    </div>

    <div class="hero-radar-rings" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>

    <span class="signal-node point-ghizer" aria-hidden="true"></span>
    <span class="signal-node point-hunza" aria-hidden="true"></span>
    <span class="signal-node point-skardu" aria-hidden="true"></span>
    <span class="signal-node point-astore" aria-hidden="true"></span>
    <span class="signal-node point-khaplu" aria-hidden="true"></span>

    <div class="district-layer" aria-label="Gilgit-Baltistan district coverage">
      <span>GB district layer</span>
      <div>
        ${gbDistricts.map((district, index) => `<i style="--chip-delay:${index * 60}ms">${esc(district)}</i>`).join("")}
      </div>
    </div>

    <svg class="action-connectors" viewBox="0 0 320 320" aria-hidden="true">
      <path d="M18 110C66 110 91 78 136 78H172"></path>
      <path d="M18 160C66 160 91 160 136 160H172"></path>
      <path d="M18 210C66 210 91 242 136 242H172"></path>
      <circle cx="18" cy="110" r="3"></circle>
      <circle cx="18" cy="160" r="3"></circle>
      <circle cx="18" cy="210" r="3"></circle>
    </svg>

    <div class="signal-action-stack" aria-label="Core actions">
      ${actions
        .map(
          (item, index) => `<a class="signal-action-card" href="${href(item.href, depth)}" style="--card-delay:${index * 120}ms">
        <span class="signal-action-icon">${actionIcon(item.icon)}</span>
        <span class="signal-action-copy"><strong>${esc(item.title)}</strong><small>${esc(item.text)}</small></span>
        <i aria-hidden="true">-></i>
      </a>`
        )
        .join("")}
    </div>
  </div>`;
}

function partnerRail(depth) {
  return `<div class="container partner-rail" aria-label="Featured in and supported by">
    <span>Featured in and supported by</span>
    <div>
      <img src="${asset("assets/framer-dawn.png", depth)}" alt="Dawn" loading="lazy">
      <img src="${asset("assets/framer-partner.svg", depth)}" alt="Partner logo" loading="lazy">
      <strong>Community-first digital safety</strong>
    </div>
  </div>`;
}

function imageStory(depth) {
  return `<div class="image-story">
    <figure class="story-photo story-photo-large reveal">
      <img src="${asset("assets/framer-about-visual.png", depth)}" alt="Digital literacy workshop participants using laptops" loading="lazy">
    </figure>
    <div class="story-panel reveal">
      <span class="kicker">Community-first safety</span>
      <h2>Premium learning, practical protection, locally grounded intelligence.</h2>
      <p>mehfooz combines digital safety training, public-source analysis, and clear reporting so partners and communities can make better decisions online with confidence.</p>
      <a class="text-link" href="${href("about/", depth)}">Read the mission</a>
    </div>
    <figure class="story-photo story-photo-small reveal">
      <img src="${asset("assets/framer-about-photo.jpg", depth)}" alt="Small group working together in a training session" loading="lazy">
    </figure>
  </div>`;
}

function impactLens(depth) {
  return `<div class="impact-lens">
    <figure class="impact-visual reveal" data-tilt-scene>
      <img src="${asset("assets/framer-workshop.jpg", depth)}" alt="Abstract Gilgit Baltistan digital signal artwork" loading="lazy">
      <figcaption>
        <span>operational reach</span>
        <strong>public literacy, analysis, and trust infrastructure</strong>
      </figcaption>
    </figure>
    <div class="impact-metrics">
      ${metrics
        .map(
          (metric, index) => `<article class="metric-card reveal" data-magnetic style="--delay:${index}">
            <strong>${esc(metric.value)}</strong>
            <span>${esc(metric.label)}</span>
            <p>${esc(metric.detail)}</p>
          </article>`
        )
        .join("")}
    </div>
  </div>`;
}

function metricGrid() {
  return `<div class="metric-grid">
    ${metrics
      .map(
        (metric) => `<article class="metric-card reveal">
          <strong>${esc(metric.value)}</strong>
          <span>${esc(metric.label)}</span>
          <p>${esc(metric.detail)}</p>
        </article>`
      )
      .join("")}
  </div>`;
}

function programCards(limit = programs.length) {
  return `<div class="program-grid">
    ${programs
      .slice(0, limit)
      .map(
        (program) => `<article class="program-card reveal" id="${esc(program.id)}">
          <span>${esc(program.eyebrow)}</span>
          <h3>${esc(program.title)}</h3>
          <p>${esc(program.summary)}</p>
          <ul>
            ${program.outcomes.map((item) => `<li>${esc(item)}</li>`).join("")}
          </ul>
        </article>`
      )
      .join("")}
  </div>`;
}

function programAtlas(depth, limit = programs.length) {
  const imageMap = {
    "community-engagement": "assets/framer-community.jpg",
    "ulema-training": "assets/framer-about-photo.jpg",
    "campus-program": "assets/framer-about-visual.png",
    "virtual-events": "assets/framer-program-card.png",
    digisaheli: "assets/framer-avatar-1.jpg",
    "learning-hub": "assets/framer-workshop.jpg",
    mehfoozbot: "assets/framer-program-card.png",
    "osint-desk": "assets/framer-workshop.jpg"
  };
  const selected = programs[0];
  const selectedImage = imageMap[selected.id];
  return `<div class="program-atlas">
    <aside class="program-preview reveal" data-program-preview data-tilt-scene>
      <img src="${asset(selectedImage, depth)}" alt="" loading="lazy" data-program-preview-image>
      <div>
        <span data-program-preview-kicker>${esc(selected.eyebrow)}</span>
        <h3 data-program-preview-title>${esc(selected.title)}</h3>
        <p data-program-preview-text>${esc(selected.summary)}</p>
      </div>
    </aside>
    <div class="program-list">
      ${programs
        .slice(0, limit)
        .map((program, index) => {
          const image = imageMap[program.id] || "assets/framer-workshop.jpg";
          return `<article class="program-card reveal${index === 0 ? " is-active" : ""}" id="${esc(program.id)}" data-program-card data-image="${asset(image, depth)}" data-kicker="${esc(program.eyebrow)}" data-title="${esc(program.title)}" data-text="${esc(program.summary)}">
            <span>${esc(program.eyebrow)}</span>
            <h3>${esc(program.title)}</h3>
            <p>${esc(program.summary)}</p>
            <ul>
              ${program.outcomes.map((item) => `<li>${esc(item)}</li>`).join("")}
            </ul>
          </article>`;
        })
        .join("")}
    </div>
  </div>`;
}

function chartCard(title, text, chart) {
  return `<article class="chart-card reveal">
    <div class="chart-copy">
      <h3>${esc(title)}</h3>
      <p>${esc(text)}</p>
    </div>
    <canvas data-chart="${esc(chart)}" aria-label="${esc(title)} chart"></canvas>
  </article>`;
}

function analysisStudio(depth) {
  return `<div class="analysis-studio">
    <div class="analysis-stage reveal" data-tilt-scene>
      <canvas class="orbit-canvas compact" data-orbit-scene data-orbit-variant="compact" aria-hidden="true"></canvas>
      <div class="analysis-panel">
        <span>signal model</span>
        <strong>signals become decisions</strong>
        <p>Public-source signals are triaged, corroborated, scored, and translated into calm, actionable briefs.</p>
      </div>
      <figure>
        <img src="${asset("assets/framer-program-card.png", depth)}" alt="A digital learning program interface card" loading="lazy">
      </figure>
    </div>
    <div class="chart-stack">
      ${chartCard("Threat category distribution", "A quick view of common issue types in a monitoring queue.", "threatCategories")}
      ${chartCard("Source reliability breakdown", "Shows why claims need context before they become recommendations.", "reliability")}
    </div>
  </div>`;
}

function blogCards(depth, limit = blogPosts.length) {
  return `<div class="blog-grid">
    ${blogPosts
      .slice(0, limit)
      .map(
        (post) => `<article class="blog-card reveal" data-category="${esc(post.category)}">
          <a class="blog-image" href="${href(`blog/${post.slug}/`, depth)}">
            <img src="${asset(post.image, depth)}" alt="" loading="lazy">
          </a>
          <div class="blog-body">
            <div class="blog-meta"><span>${esc(post.category)}</span><span>${esc(post.displayDate)}</span><span>${esc(post.readTime)}</span></div>
            <h3><a href="${href(`blog/${post.slug}/`, depth)}">${esc(post.title)}</a></h3>
            <p>${esc(post.summary)}</p>
            <a class="text-link" href="${href(`blog/${post.slug}/`, depth)}">Read article</a>
          </div>
        </article>`
      )
      .join("")}
  </div>`;
}

function renderHome(depth) {
  return `<section class="hero section-dark premium-hero">
    <div class="container hero-grid">
      <div class="hero-copy reveal">
        <span class="kicker">Responsible digital practice</span>
        <h1>Pioneering responsible digital experiences</h1>
        <p>mehfooz brings culturally tailored digital literacy, misinformation resilience, and ethical public-source intelligence workflows to communities and organizations that need clarity online.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${href("services/", depth)}">Explore our work</a>
          <a class="button button-secondary" href="${href("about/", depth)}">Learn more</a>
        </div>
        <a class="scroll-cue" href="#impact">Scroll</a>
      </div>
      <div class="reveal">${heroMedia(depth)}</div>
    </div>
    ${partnerRail(depth)}
    <div class="container featured-strip" aria-label="Focus areas">
      <span>Featured focus</span>
      ${featured.map((item) => `<strong>${esc(item)}</strong>`).join("")}
    </div>
  </section>
  <section class="section" id="impact">
    <div class="container">
      ${impactLens(depth)}
    </div>
  </section>
  <section class="section premium-story-section">
    <div class="container">
      ${imageStory(depth)}
    </div>
  </section>
  <section class="section section-dark program-showcase">
    <div class="container">
      ${sectionIntro("Our programs", "Built with a focus on learning, engagement, and innovation", "Each pathway is designed for real community learning, responsible online behavior, and partner-ready reporting.", "center")}
      ${programAtlas(depth, 6)}
      <div class="section-actions">
        <a class="button button-secondary" href="${href("services/", depth)}">View all services</a>
      </div>
    </div>
  </section>
  <section class="section analysis-section">
    <div class="container analysis-narrative">
      <div class="analysis-copy">
        ${sectionIntro("OSINT analysis", "From public signals to responsible decisions", "mehfooz uses defensive public-source analysis to help teams understand misinformation, impersonation, digital exposure, and community risk.")}
        <ul class="check-list">
          ${ethics.map((item) => `<li>${esc(item)}</li>`).join("")}
        </ul>
        <a class="text-link" href="${href("threat-intelligence/", depth)}">See the analysis dashboard</a>
      </div>
      ${analysisStudio(depth)}
    </div>
  </section>
  <section class="section soft-band">
    <div class="container">
      ${sectionIntro("Investigation workflow", "A careful path from question to report", "Every step is built around public sources, clear documentation, and defensive outcomes.", "center")}
      ${workflowMarkup()}
    </div>
  </section>
  <section class="section">
    <div class="container two-column">
      <div>
        ${sectionIntro("FAQ", "Insights and clarifications", "Straight answers for partners, communities, and teams evaluating mehfooz.")}
        ${faqMarkup()}
      </div>
      <div>
        ${sectionIntro("User stories", "How people feel safer online", "")}
        ${testimonialMarkup()}
      </div>
    </div>
  </section>
  <section class="section section-dark">
    <div class="container">
      ${sectionIntro("Blog", "Explore digital resilience insights", "Professional notes on ethical OSINT, digital footprint mapping, risk scoring, and community safety.", "center")}
      ${blogCards(depth, 3)}
      <div class="section-actions">
        <a class="button button-secondary" href="${href("blog/", depth)}">Explore more</a>
      </div>
    </div>
  </section>
  ${cta(depth)}`;
}

function workflowMarkup() {
  return `<ol class="workflow">
    ${workflow
      .map(
        (item) => `<li class="workflow-item reveal" data-flow-step>
          <span>${esc(item.step)}</span>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.text)}</p>
        </li>`
      )
      .join("")}
  </ol>`;
}

function faqMarkup() {
  return `<div class="faq-list">
    ${faqs
      .map(
        (item, index) => `<article class="faq-item reveal">
          <button class="faq-question" type="button" data-faq aria-expanded="${index === 0 ? "true" : "false"}">
            <span>${esc(item.question)}</span>
            <span aria-hidden="true">+</span>
          </button>
          <div class="faq-answer"${index === 0 ? "" : " hidden"}>
            <p>${esc(item.answer)}</p>
          </div>
        </article>`
      )
      .join("")}
  </div>`;
}

function testimonialMarkup() {
  return `<div class="testimonial-list">
    ${testimonials
      .map(
        (item) => `<figure class="testimonial-card reveal">
          <blockquote>${esc(item.quote)}</blockquote>
          <figcaption>
            <strong>${esc(item.name)}</strong>
            <span>${esc(item.role)}</span>
          </figcaption>
        </figure>`
      )
      .join("")}
  </div>`;
}

function renderAbout(depth) {
  return `${pageHero("About us", "Redefining the digital landscape", "mehfooz began with a simple belief: safer digital participation depends on local trust, clear education, and practical tools that respect the people they serve.", depth, "assets/framer-about-visual.png")}
  <section class="section">
    <div class="container">
      ${metricGrid()}
    </div>
  </section>
  <section class="section soft-band">
    <div class="container split">
      <div class="story-card reveal">
        <span class="kicker">Our vision</span>
        <h2>A digitally empowered Gilgit Baltistan</h2>
        <p>We want communities across Gilgit Baltistan to navigate online spaces confidently, question unreliable information, and access safety resources without feeling excluded by language, geography, or technical complexity.</p>
      </div>
      <div class="story-card reveal">
        <span class="kicker">Our mission</span>
        <h2>Cultivating digital wisdom</h2>
        <p>mehfooz creates trustworthy learning opportunities, ethical analysis workflows, and public reporting practices that help people make safer decisions in an increasingly connected world.</p>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container founder-grid">
      <div class="founder-note reveal">
        <span class="kicker">Meet our founder</span>
        <h2>A simple yet powerful vision</h2>
        <p>mehfooz was founded to help people in Gilgit Baltistan navigate the digital world safely and responsibly. The initiative is designed to be accessible, culturally relevant, and practical, with a focus on online safety, critical thinking, and responsible public participation.</p>
        <p>Today, the work extends into ethical OSINT and threat intelligence because communities need more than awareness. They need ways to understand public signals, respond to misinformation, and communicate risk without creating more harm.</p>
        <strong>Hasnain Akber</strong>
      </div>
      <div class="team-preview reveal">
        <figure class="founder-portrait">
          <img src="${asset("assets/framer-founder.jpg", depth)}" alt="Hasnain Akber, founder of mehfooz" loading="lazy">
          <figcaption>Founder</figcaption>
        </figure>
        ${teamCards(depth)}
      </div>
    </div>
  </section>
  ${cta(depth)}`;
}

function teamCards(depth) {
  const avatarMap = {
    HA: "assets/framer-founder.jpg",
    ZK: "assets/framer-avatar-2.png",
    SA: "assets/framer-avatar-1.jpg"
  };
  return `<div class="team-grid compact">
    ${team
      .map(
        (person) => `<article class="team-card">
          <img src="${asset(avatarMap[person.initials], depth)}" alt="" loading="lazy">
          <h3>${esc(person.name)}</h3>
          <span>${esc(person.role)}</span>
          <p>${esc(person.bio)}</p>
        </article>`
      )
      .join("")}
  </div>`;
}

function renderServices(depth) {
  return `${pageHero("Services and solutions", "Programs, OSINT, and threat intelligence support", "A complete view of mehfooz service pathways, from community workshops to defensive public-source investigation and reporting.", depth, "assets/framer-community.jpg")}
  <section class="section">
    <div class="container solution-grid">
      ${solutions
        .map(
          (solution) => `<article class="solution-card reveal">
            <div class="tag-row">${solution.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
            <h2>${esc(solution.title)}</h2>
            <p>${esc(solution.summary)}</p>
            <h3>Deliverables</h3>
            <ul>${solution.deliverables.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
          </article>`
        )
        .join("")}
    </div>
  </section>
  <section class="section section-dark">
    <div class="container">
      ${sectionIntro("Program catalog", "Learning pathways built for clarity", "Each service has a clear purpose, audience, and outcome.", "center")}
      ${programCards()}
    </div>
  </section>
  <section class="section">
    <div class="container split">
      <div>
        ${sectionIntro("Operating model", "How an engagement works", "mehfooz keeps delivery lightweight, transparent, and designed around the people who will actually use the output.")}
        ${workflowMarkup()}
      </div>
      <div class="callout-panel reveal">
        <h3>Good fit for</h3>
        <ul class="check-list">
          <li>Schools and university societies</li>
          <li>Community organizations</li>
          <li>Small teams facing misinformation risk</li>
          <li>Newsrooms and civic initiatives</li>
          <li>Digital safety and outreach programs</li>
        </ul>
      </div>
    </div>
  </section>
  ${cta(depth)}`;
}

function renderOsint(depth) {
  return `${pageHero("OSINT techniques", "Ethical public-source analysis for defensive work", "A professional, non-harmful overview of how mehfooz structures open-source intelligence collection, enrichment, analysis, and reporting.", depth, "assets/framer-workshop.jpg")}
  <section class="section">
    <div class="container split">
      <div>
        ${sectionIntro("Guardrails", "Useful intelligence starts with restraint", "The goal is to protect communities and clarify risk. The work avoids exploit steps, private surveillance, credential theft, evasion, or invasive targeting.")}
        <ul class="check-list">${ethics.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </div>
      <div class="callout-panel reveal">
        <h3>Analyst promise</h3>
        <p>Every finding should be traceable to public sources, reviewed for proportionality, and written so a non-specialist can understand both the evidence and the uncertainty.</p>
      </div>
    </div>
  </section>
  <section class="section soft-band">
    <div class="container">
      ${sectionIntro("Technique library", "Methods that support responsible analysis", "Each technique is framed for defensive, educational, and ethical use.", "center")}
      <div class="technique-grid">
        ${osintTechniques
          .map(
            (technique) => `<article class="technique-card reveal">
              <h3>${esc(technique.title)}</h3>
              <p>${esc(technique.summary)}</p>
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      ${sectionIntro("Workflow", "From collection plan to reviewed report", "A simple process keeps OSINT work auditable and calm.", "center")}
      ${workflowMarkup()}
    </div>
  </section>
  ${cta(depth)}`;
}

function renderThreatIntel(depth) {
  return `${pageHero("Threat intelligence and analysis", "Signal intelligence for safer decisions", "A refined intelligence view for public-source findings, confidence levels, case status, and risk movement.", depth, "assets/framer-about-photo.jpg")}
  <section class="section">
    <div class="container dashboard-grid">
      ${chartCard("Threat category distribution", "Issue types seen in a defensive analysis queue.", "threatCategories")}
      ${chartCard("Risk clarity trend", "Composite clarity movement across a recent review cycle.", "riskTrend")}
      ${chartCard("Investigation timeline", "Progress from signal detection to report issue.", "investigationTimeline")}
      ${chartCard("Source reliability breakdown", "How the source pool is weighted before conclusions are made.", "reliability")}
      ${chartCard("Regional signal breakdown", "Region-level distribution for public safety planning.", "regionBreakdown")}
      ${chartCard("Case status overview", "A review queue split by triage, analysis, review, and closed cases.", "caseStatus")}
      ${chartCard("OSINT workflow funnel", "How raw signals narrow into corroborated reporting.", "workflowFunnel")}
      ${chartCard("Alert severity distribution", "Severity mix after analyst review and de-duplication.", "severity")}
    </div>
  </section>
  <section class="section section-dark">
    <div class="container split">
      <div>
        ${sectionIntro("Analysis model", "Clear findings, confidence, and next steps", "The dashboard is designed to support human review, not replace it. Analysts still explain what is known, what is inferred, and what needs more evidence.")}
      </div>
      <div class="insight-list">
        <article class="insight-item reveal"><span>01</span><p>Use confidence levels so readers can see whether a claim is confirmed, likely, possible, or unverified.</p></article>
        <article class="insight-item reveal"><span>02</span><p>Keep raw public signals separate from analysis notes and recommendations.</p></article>
        <article class="insight-item reveal"><span>03</span><p>Present findings calmly so teams can respond without amplifying harm.</p></article>
      </div>
    </div>
  </section>
  ${cta(depth)}`;
}

function renderBlog(depth) {
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  return `${pageHero("Blog", "Digital resources and community updates", "Articles on ethical OSINT, digital resilience, risk scoring, misinformation response, and public-source intelligence workflows.", depth, "assets/framer-about-photo.jpg")}
  <section class="section">
    <div class="container">
      <div class="filter-row" aria-label="Blog filters">
        <button type="button" class="filter-button is-active" data-filter="all">All</button>
        ${categories.map((category) => `<button type="button" class="filter-button" data-filter="${esc(category)}">${esc(category)}</button>`).join("")}
      </div>
      ${blogCards(depth)}
    </div>
  </section>
  ${cta(depth)}`;
}

function renderPost(post, depth) {
  const articleBody = post.content
    .map(
      (section) => `<section>
        <h2>${esc(section.heading)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
      </section>`
    )
    .join("");

  return `<article class="article">
    <header class="article-hero section-dark">
      <div class="container article-hero-grid">
        <div>
          <a class="text-link invert" href="${href("blog/", depth)}">Back to blog</a>
          <div class="blog-meta article-meta"><span>${esc(post.category)}</span><span>${esc(post.displayDate)}</span><span>${esc(post.readTime)}</span></div>
          <h1>${esc(post.title)}</h1>
          <p>${esc(post.summary)}</p>
          <span class="article-author">By ${esc(post.author)}</span>
        </div>
        <img src="${asset(post.image, depth)}" alt="" loading="eager">
      </div>
    </header>
    <div class="container article-layout">
      <aside class="article-aside">
        <span>Responsible reading note</span>
        <p>This article is educational and defensive. It does not provide exploit steps, evasion tactics, or private surveillance guidance.</p>
      </aside>
      <div class="article-content">${articleBody}</div>
    </div>
  </article>
  ${cta(depth)}`;
}

function renderContact(depth) {
  return `${pageHero("Contact us", "Begin the conversation", "Tell us about your program, training need, public-source analysis question, or digital safety challenge.", depth, "assets/framer-about-photo.jpg")}
  <section class="section">
    <div class="container contact-grid">
      <div>
        ${sectionIntro("Start here", "A focused first brief", "Use the form for program, analysis, training, or partnership requests. Submissions are handled through the existing secure form endpoint.")}
        <figure class="contact-image reveal">
          <img src="${asset("assets/framer-about-photo.jpg", depth)}" alt="A small group working together in a training session" loading="lazy">
        </figure>
      </div>
      <form class="contact-form reveal" action="${esc(site.formAction)}" method="POST" data-contact-form>
        <input type="hidden" name="_next" value="${esc(site.contactPage)}">
        <input type="hidden" name="_subject" value="New mehfooz website inquiry">
        <label>
          <span>Name</span>
          <input name="name" type="text" autocomplete="name" required>
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autocomplete="email" required>
        </label>
        <label>
          <span>Organization</span>
          <input name="organization" type="text" autocomplete="organization">
        </label>
        <label>
          <span>Topic</span>
          <select name="topic" required>
            <option value="">Choose a topic</option>
            <option>Community program</option>
            <option>OSINT analysis</option>
            <option>Threat intelligence</option>
            <option>Workshop or training</option>
          </select>
        </label>
        <label class="span-full">
          <span>Message</span>
          <textarea name="message" rows="6" required></textarea>
        </label>
        <button class="button button-primary" type="submit">Send message</button>
        <p class="form-status" data-form-status aria-live="polite"></p>
      </form>
    </div>
  </section>`;
}

function renderTeam(depth) {
  return `${pageHero("Our team", "Meet the people behind the work", "A compact team page for the people shaping program, strategy, policy, and research direction.", depth, "assets/framer-founder.jpg")}
  <section class="section">
    <div class="container">${teamCards(depth)}</div>
  </section>
  ${cta(depth)}`;
}

function renderPrivacy(depth) {
  return `${pageHero("Privacy policy", "Respectful data handling", "A plain-language privacy note for the rebuilt website.", depth)}
  <section class="section">
    <div class="container legal-content">
      <h2>What this website collects</h2>
      <p>This static website does not run advertising trackers and does not collect personal data unless a visitor chooses to submit the contact form.</p>
      <h2>Public-source analysis</h2>
      <p>mehfooz analysis content is educational and defensive. Any real engagement should document scope, data minimization practices, source handling, and retention expectations before work begins.</p>
      <h2>Responsible requests</h2>
      <p>Privacy or responsible data handling questions should be submitted through the contact form so they can be reviewed with the right context.</p>
    </div>
  </section>`;
}

function pageSignalVisual(depth, image = "assets/framer-workshop.jpg") {
  return `<aside class="page-signal-visual reveal" data-tilt-scene>
    <canvas class="orbit-canvas compact" data-orbit-scene data-orbit-variant="compact" aria-hidden="true"></canvas>
    <img src="${asset(image, depth)}" alt="" loading="eager">
    <div class="signal-pin pin-a"><span></span>Verify</div>
    <div class="signal-pin pin-b"><span></span>Educate</div>
    <div class="signal-pin pin-c"><span></span>Report</div>
  </aside>`;
}

function pageHero(kicker, title, text, depth, image = "assets/framer-workshop.jpg") {
  return `<section class="page-hero section-dark">
    <div class="container page-hero-inner">
      <div class="page-hero-copy reveal">
        <span class="kicker">${esc(kicker)}</span>
        <h1>${esc(title)}</h1>
        <p>${esc(text)}</p>
        <div class="breadcrumb"><a href="${href("", depth)}">Home</a><span>/</span><strong>${esc(kicker)}</strong></div>
      </div>
      ${pageSignalVisual(depth, image)}
    </div>
  </section>`;
}

function cta(depth) {
  return `<section class="cta-band">
    <div class="container cta-inner">
      <div>
        <span class="kicker">Ready to build resilience?</span>
        <h2>Bring this digital safety and OSINT workflow into your next engagement.</h2>
      </div>
      <a class="button button-primary" href="${href("contact/", depth)}">Start a conversation</a>
    </div>
  </section>`;
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="mehfooz mark">
  <rect width="96" height="96" rx="20" fill="#f8fbff"/>
  <path d="M25 67 46 20" stroke="#07111f" stroke-width="11" stroke-linecap="round"/>
  <path d="M43 69 64 22" stroke="#3a3a3a" stroke-width="11" stroke-linecap="round"/>
  <path d="M61 67 76 34" stroke="#77736a" stroke-width="11" stroke-linecap="round"/>
</svg>`;
}

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
  </defs>
  <rect width="1200" height="630" fill="#080808"/>
  <rect x="64" y="64" width="1072" height="502" fill="none" stroke="#d8d1c4" opacity=".22"/>
  <g transform="translate(90 92) scale(1.25)">${logoSvg().replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
  <text x="90" y="330" fill="#fff" font-family="Arial, sans-serif" font-size="74" font-weight="800">mehfooz</text>
  <text x="92" y="405" fill="#d8d1c4" font-family="Arial, sans-serif" font-size="38">Responsible digital experiences, OSINT, and threat intelligence</text>
  <text x="92" y="490" fill="#a39b8f" font-family="Arial, sans-serif" font-size="26">Ethical public-source analysis for safer communities</text>
</svg>`;
}

function blogImage(title, accent, pattern) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="${esc(title)} illustration">
  <rect width="1200" height="720" fill="#080808"/>
  <rect x="64" y="64" width="1072" height="592" fill="#111111" stroke="#3a3a3a"/>
  <circle cx="1000" cy="150" r="170" fill="${accent}" opacity=".22"/>
  <circle cx="230" cy="620" r="190" fill="#d8d1c4" opacity=".08"/>
  <g stroke="#334155" stroke-width="2" opacity=".55">
    ${Array.from({ length: 10 }, (_, index) => `<path d="M120 ${160 + index * 42} H1080"/>`).join("")}
    ${Array.from({ length: 8 }, (_, index) => `<path d="M${180 + index * 120} 120 V600"/>`).join("")}
  </g>
  ${pattern}
  <text x="110" y="170" fill="#d8d1c4" font-family="Arial, sans-serif" font-size="28" font-weight="700">mehfooz research</text>
  <text x="110" y="535" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="800">${esc(title)}</text>
</svg>`;
}

function avatarSvg(initials, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="${esc(initials)} avatar">
  <rect width="240" height="240" rx="40" fill="#f8fbff"/>
  <circle cx="120" cy="98" r="48" fill="${color}" opacity=".9"/>
  <path d="M48 218c13-49 41-74 72-74s59 25 72 74" fill="${color}" opacity=".28"/>
  <text x="120" y="116" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="40" font-weight="800">${esc(initials)}</text>
</svg>`;
}

async function writeAssetFiles() {
  const blogPatterns = {
    "assets/blog-youth-peace.svg": blogImage(
      "Youth for a peaceful society",
      "#c6db7b",
      '<g fill="none" stroke="#c6db7b" stroke-width="8"><circle cx="270" cy="310" r="64"/><circle cx="500" cy="260" r="42"/><circle cx="730" cy="330" r="58"/><path d="M334 310C420 220 560 220 688 330M540 260c70-34 132-10 190 70"/></g><g fill="#edf4d2"><circle cx="270" cy="310" r="14"/><circle cx="500" cy="260" r="12"/><circle cx="730" cy="330" r="14"/></g>'
    ),
    "assets/blog-maternal-care.svg": blogImage(
      "Unequal maternal care",
      "#a5b66f",
      '<g fill="none" stroke="#a5b66f" stroke-width="9"><path d="M230 365c70-135 205-135 275 0 70-135 205-135 275 0"/><path d="M305 392h410"/><circle cx="370" cy="280" r="42"/><circle cx="640" cy="280" r="42"/></g><path d="M220 470c190-52 420-52 620 0" fill="none" stroke="#edf4d2" stroke-width="8" opacity=".6"/>'
    ),
    "assets/blog-digital-propaganda.svg": blogImage(
      "Digital propaganda",
      "#69764b",
      '<g fill="none" stroke="#a5b66f" stroke-width="8"><path d="M220 340h190l92-84h206l120 112h160"/><path d="M255 250c124-90 268-40 362-92 92-50 194-24 272 22"/></g><g fill="#edf4d2"><circle cx="220" cy="340" r="16"/><circle cx="502" cy="256" r="16"/><circle cx="828" cy="368" r="16"/><circle cx="889" cy="180" r="13"/></g>'
    )
  };

  await mkdir(path.join(root, "assets"), { recursive: true });
  await writeFile(path.join(root, "assets/brand-mark.svg"), logoSvg(), "utf8");
  await writeFile(path.join(root, "assets/og-card.svg"), ogSvg(), "utf8");
  await writeFile(path.join(root, "assets/avatar-ha.svg"), avatarSvg("HA", "#111111"), "utf8");
  await writeFile(path.join(root, "assets/avatar-zk.svg"), avatarSvg("ZK", "#5c5850"), "utf8");
  await writeFile(path.join(root, "assets/avatar-sa.svg"), avatarSvg("SA", "#8d867a"), "utf8");
  for (const [file, svg] of Object.entries(blogPatterns)) {
    await writeFile(path.join(root, file), svg, "utf8");
  }
}

async function writePages() {
  for (const dir of pageDirs) await mkdir(path.join(root, dir), { recursive: true });
  for (const post of blogPosts) await mkdir(path.join(root, "blog", post.slug), { recursive: true });

  const pages = [
    {
      file: "index.html",
      active: "",
      depth: 0,
      title: site.tagline,
      description: site.description,
      body: renderHome(0)
    },
    {
      file: "about/index.html",
      active: "about/",
      depth: 1,
      title: "About",
      description: "Learn about mehfooz mission, vision, founder, and community digital safety work.",
      body: renderAbout(1)
    },
    {
      file: "services/index.html",
      active: "services/",
      depth: 1,
      title: "Services",
      description: "Explore mehfooz programs, ethical OSINT services, and threat intelligence reporting support.",
      body: renderServices(1)
    },
    {
      file: "osint-techniques/index.html",
      active: "osint-techniques/",
      depth: 1,
      title: "OSINT Techniques",
      description: "Ethical public-source intelligence techniques for defensive investigations and education.",
      body: renderOsint(1)
    },
    {
      file: "threat-intelligence/index.html",
      active: "threat-intelligence/",
      depth: 1,
      title: "Threat Intelligence",
      description: "Threat intelligence dashboards, risk scoring, timelines, and source reliability visualizations.",
      body: renderThreatIntel(1)
    },
    {
      file: "blog/index.html",
      active: "blog/",
      depth: 1,
      title: "Blog",
      description: "Read mehfooz articles on OSINT, digital safety, threat intelligence, and responsible investigation workflows.",
      body: renderBlog(1)
    },
    {
      file: "contact/index.html",
      active: "contact/",
      depth: 1,
      title: "Contact",
      description: "Contact mehfooz about programs, digital safety workshops, OSINT analysis, or threat intelligence reporting.",
      body: renderContact(1)
    },
    {
      file: "team/index.html",
      active: "team/",
      depth: 1,
      title: "Our Team",
      description: "Meet the mehfooz team shaping program, strategy, policy, and research direction.",
      body: renderTeam(1)
    },
    {
      file: "privacy/index.html",
      active: "privacy/",
      depth: 1,
      title: "Privacy Policy",
      description: "Privacy and responsible data handling notes for the mehfooz website.",
      body: renderPrivacy(1)
    },
    {
      file: "404.html",
      active: "",
      depth: 0,
      title: "Page not found",
      description: "The requested page could not be found.",
      body: `${pageHero("404", "Page not found", "The page may have moved. Use the navigation to return to the mehfooz site.", 0)}${cta(0)}`,
      pageClass: "not-found"
    }
  ];

  for (const post of blogPosts) {
    pages.push({
      file: `blog/${post.slug}/index.html`,
      active: "blog/",
      depth: 2,
      title: post.title,
      description: strip(post.summary),
      body: renderPost(post, 2),
      pageClass: "article-page"
    });
  }

  for (const page of pages) {
    await writeFile(
      path.join(root, page.file),
      layout({
        title: page.title,
        description: page.description,
        active: page.active,
        depth: page.depth,
        body: page.body,
        pageClass: page.pageClass || ""
      }),
      "utf8"
    );
  }
}

async function cleanOldGenerated() {
  for (const dir of pageDirs) {
    await rm(path.join(root, dir), { recursive: true, force: true });
  }
  await mkdir(path.join(root, "assets"), { recursive: true });
  for (const file of [...assetFiles, ...staleAssetFiles]) {
    await rm(path.join(root, file), { force: true });
  }
  for (const file of ["assets/avatar-rj.svg", "assets/avatar-cf.svg"]) {
    await rm(path.join(root, file), { force: true });
  }
  for (const file of ["404.html"]) {
    await rm(path.join(root, file), { force: true });
  }
}

await cleanOldGenerated();
await writeAssetFiles();
await writePages();

console.log(`Generated mehfooz static site: ${1 + pageDirs.length + blogPosts.length + 1} pages, ${assetFiles.length} assets.`);
