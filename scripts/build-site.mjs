import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  blogPosts,
  chartData,
  ethics,
  faqs,
  featured,
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
  "assets/blog-osint-threat-intelligence.svg",
  "assets/blog-digital-footprint.svg",
  "assets/blog-ethical-workflow.svg",
  "assets/blog-risk-scores.svg",
  "assets/blog-actionable-intelligence.svg",
  "assets/avatar-ha.svg",
  "assets/avatar-rj.svg",
  "assets/avatar-cf.svg"
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
<body class="${esc(pageClass)}">
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
  ${footer(depth)}
</body>
</html>
`;
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

function heroDashboard() {
  return `<div class="hero-dashboard" aria-label="Demo intelligence dashboard">
    <div class="dashboard-top">
      <div>
        <span class="status-dot"></span>
        <strong>Public Signal Desk</strong>
      </div>
      <span>Demo environment</span>
    </div>
    <div class="risk-card">
      <span>Composite community risk</span>
      <strong>51</strong>
      <small>Down 7 points after source review</small>
    </div>
    <canvas class="mini-chart" data-chart="riskTrend" aria-label="Risk score trend chart"></canvas>
    <div class="signal-list">
      <div><span>High confidence sources</span><strong>52%</strong></div>
      <div><span>Items needing review</span><strong>17</strong></div>
      <div><span>Reports prepared</span><strong>38</strong></div>
    </div>
  </div>`;
}

function heroMedia(depth) {
  return `<div class="premium-media" aria-label="mehfooz visual story">
    <figure class="media-frame media-frame-main">
      <img src="${asset("assets/framer-workshop.jpg", depth)}" alt="Digital map of Gilgit Baltistan in a protective hand" loading="eager">
      <figcaption>
        <strong>Gilgit Baltistan first</strong>
        <span>Local context, safer digital participation, and clear public-source analysis.</span>
      </figcaption>
    </figure>
    <figure class="media-frame media-frame-secondary">
      <img src="${asset("assets/framer-community.jpg", depth)}" alt="Community member from Gilgit Baltistan" loading="eager">
    </figure>
    <div class="media-stat-card">
      <span>Modeled reach</span>
      <strong>50K+</strong>
      <small>learners and community members</small>
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

function chartCard(title, text, chart, note = "Demo data for product visualization, not live intelligence.") {
  return `<article class="chart-card reveal">
    <div class="chart-copy">
      <h3>${esc(title)}</h3>
      <p>${esc(text)}</p>
    </div>
    <canvas data-chart="${esc(chart)}" aria-label="${esc(title)} chart"></canvas>
    <small>${esc(note)}</small>
  </article>`;
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
          <a class="button button-primary" href="${href("contact/", depth)}">Join a program</a>
          <a class="button button-secondary" href="${href("threat-intelligence/", depth)}">View analysis dashboard</a>
        </div>
      </div>
      <div class="reveal">${heroMedia(depth)}</div>
    </div>
    ${partnerRail(depth)}
    <div class="container featured-strip" aria-label="Focus areas">
      <span>Featured focus</span>
      ${featured.map((item) => `<strong>${esc(item)}</strong>`).join("")}
    </div>
  </section>
  <section class="section">
    <div class="container">
      ${metricGrid()}
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
      ${programCards(6)}
      <div class="section-actions">
        <a class="button button-secondary" href="${href("services/", depth)}">View all services</a>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container split">
      <div>
        ${sectionIntro("OSINT analysis", "From public signals to responsible decisions", "mehfooz uses defensive public-source analysis to help teams understand misinformation, impersonation, digital exposure, and community risk.")}
        <ul class="check-list">
          ${ethics.map((item) => `<li>${esc(item)}</li>`).join("")}
        </ul>
        <a class="text-link" href="${href("threat-intelligence/", depth)}">See the analysis dashboard</a>
      </div>
      <div class="chart-stack">
        ${chartCard("Threat category distribution", "A quick view of common issue types in a demo monitoring queue.", "threatCategories")}
        ${chartCard("Source reliability breakdown", "Shows why claims need context before they become recommendations.", "reliability")}
      </div>
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
        (item) => `<li class="workflow-item reveal">
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
  return `${pageHero("About us", "Redefining the digital landscape", "mehfooz began with a simple belief: safer digital participation depends on local trust, clear education, and practical tools that respect the people they serve.", depth)}
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
    RJ: "assets/framer-avatar-2.png",
    CF: "assets/framer-avatar-1.jpg"
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
  return `${pageHero("Services and solutions", "Programs, OSINT, and threat intelligence support", "A complete view of mehfooz service pathways, from community workshops to defensive public-source investigation and reporting.", depth)}
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
  return `${pageHero("OSINT techniques", "Ethical public-source analysis for defensive work", "A professional, non-harmful overview of how mehfooz structures open-source intelligence collection, enrichment, analysis, and reporting.", depth)}
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
  return `${pageHero("Threat intelligence and analysis", "Demo analytics for safer decisions", "Realistic visualizations show how mehfooz can present public-source findings, confidence levels, case status, and risk movement without pretending demo data is live intelligence.", depth)}
  <section class="section">
    <div class="container dashboard-grid">
      ${chartCard("Threat category distribution", "Issue types seen in a sample defensive analysis queue.", "threatCategories")}
      ${chartCard("Risk score trend", "Composite score movement across an eight-week demo period.", "riskTrend")}
      ${chartCard("Investigation timeline", "Progress from signal detection to report issue.", "investigationTimeline")}
      ${chartCard("Source reliability breakdown", "How the source pool is weighted before conclusions are made.", "reliability")}
      ${chartCard("Regional signal breakdown", "Region-level demo distribution for public safety planning.", "regionBreakdown")}
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
        <article class="insight-item reveal"><span>03</span><p>Label demo data clearly and never imply unverified intelligence is real-world fact.</p></article>
      </div>
    </div>
  </section>
  ${cta(depth)}`;
}

function renderBlog(depth) {
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  return `${pageHero("Blog", "Digital resources and community updates", "Articles on ethical OSINT, digital resilience, risk scoring, misinformation response, and public-source intelligence workflows.", depth)}
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
  return `${pageHero("Contact us", "Begin the conversation", "Tell us about your program, training need, public-source analysis question, or digital safety challenge.", depth)}
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
  return `${pageHero("Our team", "Meet the people behind the work", "A compact team page for the people and fellows shaping the program, strategy, and research direction.", depth)}
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
      <p>This static website does not run advertising trackers and does not collect personal data unless a visitor chooses to submit the contact form. The demo form confirms locally in the browser and should be connected to a production intake system before real submissions are accepted.</p>
      <h2>Public-source analysis</h2>
      <p>mehfooz analysis content is educational and defensive. Any real engagement should document scope, data minimization practices, source handling, and retention expectations before work begins.</p>
      <h2>Responsible requests</h2>
      <p>Privacy or responsible data handling questions should be submitted through the contact form so they can be reviewed with the right context.</p>
    </div>
  </section>`;
}

function pageHero(kicker, title, text, depth) {
  return `<section class="page-hero section-dark">
    <div class="container page-hero-inner reveal">
      <span class="kicker">${esc(kicker)}</span>
      <h1>${esc(title)}</h1>
      <p>${esc(text)}</p>
      <div class="breadcrumb"><a href="${href("", depth)}">Home</a><span>/</span><strong>${esc(kicker)}</strong></div>
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
    "assets/blog-osint-threat-intelligence.svg": blogImage(
      "OSINT and threat intelligence",
      "#d8d1c4",
      '<path d="M185 330c130-130 285-36 390 20s224 42 340-74" fill="none" stroke="#d8d1c4" stroke-width="10"/><circle cx="185" cy="330" r="18" fill="#d8d1c4"/><circle cx="575" cy="350" r="18" fill="#8d867a"/><circle cx="915" cy="276" r="18" fill="#4b4842"/>'
    ),
    "assets/blog-digital-footprint.svg": blogImage(
      "Digital footprint mapping",
      "#a39b8f",
      '<g fill="none" stroke="#a39b8f" stroke-width="8"><rect x="190" y="235" width="170" height="110" rx="18"/><rect x="515" y="205" width="190" height="140" rx="18"/><rect x="850" y="260" width="150" height="96" rx="18"/><path d="M360 292h155M705 276h145"/></g>'
    ),
    "assets/blog-ethical-workflow.svg": blogImage(
      "Ethical investigation workflow",
      "#77736a",
      '<g fill="none" stroke="#77736a" stroke-width="8"><circle cx="250" cy="300" r="55"/><circle cx="500" cy="300" r="55"/><circle cx="750" cy="300" r="55"/><circle cx="1000" cy="300" r="55"/><path d="M305 300h140M555 300h140M805 300h140"/></g>'
    ),
    "assets/blog-risk-scores.svg": blogImage(
      "Risk scores in cyber intelligence",
      "#8d867a",
      '<g fill="#8d867a"><rect x="200" y="360" width="90" height="110" rx="14"/><rect x="330" y="300" width="90" height="170" rx="14"/><rect x="460" y="250" width="90" height="220" rx="14"/><rect x="590" y="325" width="90" height="145" rx="14"/><rect x="720" y="210" width="90" height="260" rx="14"/></g><path d="M190 270c160-80 280-20 390-76 108-55 205-26 292 18" fill="none" stroke="#d8d1c4" stroke-width="9"/>'
    ),
    "assets/blog-actionable-intelligence.svg": blogImage(
      "Raw signals to actionable intelligence",
      "#4b4842",
      '<g fill="none" stroke="#a39b8f" stroke-width="8"><path d="M210 310h200l95-80h210l115 120h170"/><circle cx="210" cy="310" r="16" fill="#a39b8f"/><circle cx="505" cy="230" r="16" fill="#d8d1c4"/><circle cx="830" cy="350" r="16" fill="#77736a"/></g>'
    )
  };

  await mkdir(path.join(root, "assets"), { recursive: true });
  await writeFile(path.join(root, "assets/brand-mark.svg"), logoSvg(), "utf8");
  await writeFile(path.join(root, "assets/og-card.svg"), ogSvg(), "utf8");
  await writeFile(path.join(root, "assets/avatar-ha.svg"), avatarSvg("HA", "#111111"), "utf8");
  await writeFile(path.join(root, "assets/avatar-rj.svg"), avatarSvg("RJ", "#5c5850"), "utf8");
  await writeFile(path.join(root, "assets/avatar-cf.svg"), avatarSvg("CF", "#8d867a"), "utf8");
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
      description: "Demo threat intelligence dashboards, risk scoring, timelines, and source reliability visualizations.",
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
      description: "Meet the mehfooz team and community fellows.",
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
  for (const file of assetFiles) {
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
