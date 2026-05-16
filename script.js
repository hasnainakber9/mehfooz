(() => {
  const chartData = window.MEHFOOZ_CHARTS || {};
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function initMobileNavigation() {
    const header = qs("[data-header]");
    const toggle = qs("[data-mobile-toggle]");
    const panel = qs("[data-mobile-panel]");
    if (!header || !toggle || !panel) return;

    const close = () => {
      header.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      panel.setAttribute("aria-hidden", "true");
    };

    toggle.addEventListener("click", () => {
      const open = !header.classList.contains("is-open");
      header.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      panel.setAttribute("aria-hidden", String(!open));
    });

    qsa("a", panel).forEach((link) => link.addEventListener("click", close));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initReveals() {
    const items = qsa(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initFaqs() {
    qsa("[data-faq]").forEach((button) => {
      button.addEventListener("click", () => {
        const answer = button.parentElement.querySelector(".faq-answer");
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        if (answer) answer.hidden = isOpen;
      });
    });
  }

  function initBlogFilters() {
    const filters = qsa("[data-filter]");
    const cards = qsa(".blog-card[data-category]");
    if (!filters.length || !cards.length) return;

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filter;
        filters.forEach((item) => item.classList.toggle("is-active", item === button));
        cards.forEach((card) => {
          const show = value === "all" || card.dataset.category === value;
          card.hidden = !show;
        });
      });
    });
  }

  function initContactForm() {
    const form = qs("[data-contact-form]");
    if (!form) return;
    const status = qs("[data-form-status]", form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      if (status) {
        status.textContent = name
          ? `Thanks, ${name}. Your message is ready for intake.`
          : "Thanks. Your message is ready for intake.";
      }
      form.reset();
    });
  }

  function initBackToTop() {
    qsa("[data-back-top]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const main = qs("#main");
        if (!main) return;
        event.preventDefault();
        main.scrollIntoView({ behavior: "smooth", block: "start" });
        main.focus?.();
      });
    });
  }

  function resizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width));
    const height = Math.max(190, Math.floor(rect.height || 220));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width, height };
  }

  function chartTheme(canvas) {
    const dark = canvas.closest(".section-dark, .hero-dashboard");
    return {
      dark: Boolean(dark),
      text: dark ? "#eaf2ff" : "#0d1117",
      muted: dark ? "#9fb0c5" : "#5b6678",
      grid: dark ? "rgba(255,255,255,0.12)" : "rgba(13,17,23,0.1)",
      line: dark ? "#8fb8ff" : "#0b5cff",
      fill: dark ? "rgba(59,130,246,0.18)" : "rgba(11,92,255,0.12)"
    };
  }

  function clear(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  }

  function label(ctx, text, x, y, color, size = 12, weight = 700) {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  function drawLine(canvas, data) {
    const { ctx, width, height } = resizeCanvas(canvas);
    const theme = chartTheme(canvas);
    clear(ctx, width, height);

    const pad = { top: 24, right: 22, bottom: 38, left: 38 };
    const values = data.map((item) => item.value);
    const min = Math.min(...values) - 8;
    const max = Math.max(...values) + 8;
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i += 1) {
      const y = pad.top + (innerH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
    }

    const points = data.map((item, index) => {
      const x = pad.left + (innerW / Math.max(1, data.length - 1)) * index;
      const y = pad.top + innerH - ((item.value - min) / (max - min)) * innerH;
      return { x, y, ...item };
    });

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height - pad.bottom);
    ctx.lineTo(points[0].x, height - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = theme.fill;
    ctx.fill();

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = theme.line;
    ctx.lineWidth = 3;
    ctx.stroke();

    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, index === points.length - 1 ? 5 : 4, 0, Math.PI * 2);
      ctx.fillStyle = index === points.length - 1 ? "#22c55e" : theme.line;
      ctx.fill();
    });

    const last = points[points.length - 1];
    label(ctx, String(last.value), Math.min(width - 54, last.x + 10), last.y - 14, theme.text, 14, 800);
    label(ctx, data[0].label, pad.left, height - 17, theme.muted, 11, 700);
    label(ctx, data[data.length - 1].label, width - pad.right - 54, height - 17, theme.muted, 11, 700);
  }

  function drawDonut(canvas, data) {
    const { ctx, width, height } = resizeCanvas(canvas);
    const theme = chartTheme(canvas);
    clear(ctx, width, height);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = Math.min(width * 0.26, height * 0.34, 88);
    const cx = Math.min(width * 0.34, 170);
    const cy = height * 0.48;
    let angle = -Math.PI / 2;

    data.forEach((item) => {
      const slice = (item.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, angle, angle + slice);
      ctx.lineWidth = 22;
      ctx.strokeStyle = item.color;
      ctx.stroke();
      angle += slice;
    });

    label(ctx, `${total}%`, cx - 28, cy, theme.text, 20, 900);
    label(ctx, "mix", cx - 12, cy + 24, theme.muted, 12, 700);

    const legendX = Math.min(width * 0.56, cx + radius + 42);
    const startY = Math.max(30, cy - data.length * 15);
    data.forEach((item, index) => {
      const y = startY + index * 30;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.roundRect?.(legendX, y - 6, 12, 12, 4);
      if (!ctx.roundRect) ctx.rect(legendX, y - 6, 12, 12);
      ctx.fill();
      label(ctx, item.label, legendX + 20, y, theme.text, 12, 800);
      label(ctx, `${item.value}%`, width - 48, y, theme.muted, 12, 800);
    });
  }

  function drawBars(canvas, data) {
    const { ctx, width, height } = resizeCanvas(canvas);
    const theme = chartTheme(canvas);
    clear(ctx, width, height);

    const max = Math.max(...data.map((item) => item.value));
    const pad = 24;
    const rowH = (height - pad * 2) / data.length;
    const labelW = Math.min(110, width * 0.32);
    const barW = width - labelW - pad * 3;

    data.forEach((item, index) => {
      const y = pad + rowH * index + rowH * 0.25;
      const h = Math.max(12, rowH * 0.46);
      label(ctx, item.label, pad, y + h / 2, theme.text, 12, 800);
      ctx.fillStyle = theme.grid;
      ctx.fillRect(labelW + pad, y, barW, h);
      const widthValue = (item.value / max) * barW;
      const gradient = ctx.createLinearGradient(labelW + pad, 0, labelW + pad + barW, 0);
      gradient.addColorStop(0, "#0b5cff");
      gradient.addColorStop(0.65, "#38bdf8");
      gradient.addColorStop(1, "#22c55e");
      ctx.fillStyle = gradient;
      ctx.fillRect(labelW + pad, y, widthValue, h);
      label(ctx, `${item.value}%`, labelW + pad + widthValue + 8, y + h / 2, theme.muted, 12, 800);
    });
  }

  function drawStatus(canvas, data) {
    const { ctx, width, height } = resizeCanvas(canvas);
    const theme = chartTheme(canvas);
    clear(ctx, width, height);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const barX = 28;
    const barY = height * 0.42;
    const barW = width - 56;
    const barH = 34;
    let x = barX;

    data.forEach((item) => {
      const segment = (item.value / total) * barW;
      ctx.fillStyle = item.color;
      ctx.fillRect(x, barY, segment, barH);
      x += segment;
    });

    label(ctx, `${total} cases`, barX, barY - 30, theme.text, 22, 900);
    label(ctx, "demo review queue", barX, barY - 8, theme.muted, 12, 800);

    const cols = width > 480 ? 2 : 1;
    data.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const lx = barX + col * (barW / cols);
      const ly = barY + 72 + row * 28;
      ctx.fillStyle = item.color;
      ctx.fillRect(lx, ly - 6, 12, 12);
      label(ctx, `${item.label}: ${item.value}`, lx + 20, ly, theme.text, 12, 800);
    });
  }

  function drawFunnel(canvas, data) {
    const { ctx, width, height } = resizeCanvas(canvas);
    const theme = chartTheme(canvas);
    clear(ctx, width, height);

    const max = Math.max(...data.map((item) => item.value));
    const gap = 10;
    const rowH = (height - 42 - gap * (data.length - 1)) / data.length;

    data.forEach((item, index) => {
      const w = Math.max(80, (item.value / max) * (width - 72));
      const x = (width - w) / 2;
      const y = 22 + index * (rowH + gap);
      const gradient = ctx.createLinearGradient(x, 0, x + w, 0);
      gradient.addColorStop(0, "#0b5cff");
      gradient.addColorStop(1, index > 2 ? "#22c55e" : "#38bdf8");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect?.(x, y, w, rowH, 8);
      if (!ctx.roundRect) ctx.rect(x, y, w, rowH);
      ctx.fill();
      label(ctx, item.label, x + 14, y + rowH / 2, "#fff", 12, 900);
      label(ctx, String(item.value), x + w - 46, y + rowH / 2, "#fff", 12, 900);
    });
  }

  function drawTimeline(canvas, data) {
    const { ctx, width, height } = resizeCanvas(canvas);
    const theme = chartTheme(canvas);
    clear(ctx, width, height);

    const padX = 40;
    const y = height * 0.44;
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(padX, y);
    ctx.lineTo(width - padX, y);
    ctx.stroke();

    data.forEach((item, index) => {
      const x = padX + (item.value / 100) * (width - padX * 2);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = index === data.length - 1 ? "#22c55e" : "#0b5cff";
      ctx.fill();
      ctx.strokeStyle = theme.dark ? "#0d1117" : "#fff";
      ctx.lineWidth = 4;
      ctx.stroke();
      const textY = index % 2 ? y + 42 : y - 36;
      label(ctx, item.label, Math.max(12, Math.min(width - 150, x - 54)), textY, theme.text, 11, 800);
    });
  }

  function drawChart(canvas) {
    const type = canvas.dataset.chart;
    const data = chartData[type];
    if (!data || !data.length) return;

    if (type === "riskTrend") drawLine(canvas, data);
    else if (type === "threatCategories" || type === "reliability" || type === "severity") drawDonut(canvas, data);
    else if (type === "regionBreakdown") drawBars(canvas, data);
    else if (type === "caseStatus") drawStatus(canvas, data);
    else if (type === "workflowFunnel") drawFunnel(canvas, data);
    else if (type === "investigationTimeline") drawTimeline(canvas, data);
  }

  function initCharts() {
    const canvases = qsa("canvas[data-chart]");
    if (!canvases.length) return;
    canvases.forEach(drawChart);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLCanvasElement) drawChart(entry.target);
        });
      });
      canvases.forEach((canvas) => observer.observe(canvas));
    } else {
      window.addEventListener("resize", () => canvases.forEach(drawChart));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNavigation();
    initReveals();
    initFaqs();
    initBlogFilters();
    initContactForm();
    initBackToTop();
    initCharts();
  });
})();
