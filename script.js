(() => {
  const chartData = window.mehfoozCharts || {};
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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const submitButton = qs('button[type="submit"]', form);
      if (submitButton) submitButton.disabled = true;
      if (status) {
        status.textContent = "Sending...";
      }

      try {
        const response = await fetch(form.action, {
          method: form.method || "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Form submission failed");
        if (status) {
          status.textContent = name
            ? `Thank you, ${name}. Your message has been received.`
            : "Thank you. Your message has been received.";
        }
        form.reset();
      } catch (error) {
        if (status) {
          status.textContent = "The form could not be submitted just now. Please try again.";
        }
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
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

  function initTiltScenes() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    qsa("[data-tilt-scene]").forEach((scene) => {
      scene.addEventListener("pointermove", (event) => {
        const rect = scene.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        scene.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
        scene.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
        scene.style.setProperty("--mouse-x", `${(event.clientX - rect.left).toFixed(0)}px`);
        scene.style.setProperty("--mouse-y", `${(event.clientY - rect.top).toFixed(0)}px`);
      });
      scene.addEventListener("pointerleave", () => {
        scene.style.setProperty("--tilt-x", "0deg");
        scene.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function initMagneticCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    qsa("[data-magnetic], .program-card, .chart-card, .blog-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--lift-x", `${(x * 10).toFixed(2)}px`);
        card.style.setProperty("--lift-y", `${(y * 10).toFixed(2)}px`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--lift-x", "0px");
        card.style.setProperty("--lift-y", "0px");
      });
    });
  }

  function initProgramAtlas() {
    qsa("[data-program-card]").forEach((card) => {
      const atlas = card.closest(".program-atlas");
      const preview = atlas?.querySelector("[data-program-preview]");
      if (!preview) return;
      const image = qs("[data-program-preview-image]", preview);
      const kicker = qs("[data-program-preview-kicker]", preview);
      const title = qs("[data-program-preview-title]", preview);
      const text = qs("[data-program-preview-text]", preview);

      const activate = () => {
        qsa("[data-program-card]", atlas).forEach((item) => item.classList.toggle("is-active", item === card));
        if (image && card.dataset.image) image.src = card.dataset.image;
        if (kicker) kicker.textContent = card.dataset.kicker || "";
        if (title) title.textContent = card.dataset.title || "";
        if (text) text.textContent = card.dataset.text || "";
      };

      card.tabIndex = 0;
      card.addEventListener("mouseenter", activate);
      card.addEventListener("focus", activate);
      card.addEventListener("click", activate);
    });
  }

  function initFlowSteps() {
    const steps = qsa("[data-flow-step]");
    if (!steps.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-current", entry.isIntersecting);
        });
      },
      { threshold: 0.55 }
    );
    steps.forEach((step) => observer.observe(step));
  }

  function initOrbitScenes() {
    const canvases = qsa("[data-orbit-scene]");
    if (!canvases.length) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    canvases.forEach((canvas) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const compact = canvas.dataset.orbitVariant === "compact";
      const nodes = Array.from({ length: compact ? 18 : 34 }, (_, index) => ({
        angle: (index / (compact ? 18 : 34)) * Math.PI * 2,
        ring: index % 3,
        drift: 0.65 + (index % 5) * 0.13
      }));
      let width = 0;
      let height = 0;
      let dpr = 1;
      let frame = 0;

      function resize() {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(320, Math.floor(rect.width));
        height = Math.max(260, Math.floor(rect.height || rect.width * 0.65));
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function draw(now = 0) {
        frame += 1;
        ctx.clearRect(0, 0, width, height);
        const cx = width * 0.5;
        const cy = height * (compact ? 0.52 : 0.5);
        const radiusX = width * (compact ? 0.34 : 0.38);
        const radiusY = height * (compact ? 0.24 : 0.28);
        const time = now * 0.00028;

        ctx.strokeStyle = "rgba(247,244,238,0.16)";
        ctx.lineWidth = 1;
        [0.62, 0.82, 1].forEach((scale, index) => {
          ctx.beginPath();
          ctx.ellipse(cx, cy, radiusX * scale, radiusY * scale, 0, 0, Math.PI * 2);
          ctx.stroke();
          if (!compact && index === 1) {
            ctx.beginPath();
            ctx.ellipse(cx, cy, radiusX * scale, radiusY * scale, Math.PI / 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

        const projected = nodes.map((node) => {
          const angle = node.angle + time * node.drift;
          const depth = (Math.sin(angle) + 1) / 2;
          const ringScale = 0.62 + node.ring * 0.18;
          return {
            x: cx + Math.cos(angle) * radiusX * ringScale,
            y: cy + Math.sin(angle) * radiusY * ringScale + (depth - 0.5) * 34,
            depth,
            size: 1.5 + depth * (compact ? 3 : 4)
          };
        });

        ctx.strokeStyle = "rgba(247,244,238,0.12)";
        ctx.lineWidth = 1;
        projected.forEach((point, index) => {
          const next = projected[(index + 5) % projected.length];
          if (Math.abs(point.depth - next.depth) < 0.42) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
        });

        projected.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(247,244,238,${0.2 + point.depth * 0.72})`;
          ctx.fill();
        });

        const pulse = 0.5 + Math.sin(now * 0.002) * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, compact ? 28 + pulse * 8 : 44 + pulse * 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247,244,238,${0.18 + pulse * 0.16})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (!reduceMotion) requestAnimationFrame(draw);
      }

      resize();
      draw();
      if ("ResizeObserver" in window) {
        new ResizeObserver(() => {
          resize();
          if (reduceMotion) draw();
        }).observe(canvas);
      } else {
        window.addEventListener("resize", resize);
      }
    });
  }

  function initChatBot() {
    const modal = qs("#chatModal");
    const log = qs("[data-chat-log]");
    const form = qs("[data-chat-form]");
    const input = qs("#chat-input");
    if (!modal || !log || !form || !input) return;

    const sessionId = `mhfz-${Math.random().toString(36).slice(2, 10)}`;
    let waiting = false;

    const offlineReply = (message = "") => {
      const text = message.toLowerCase();
      if (/misinfo|fake|hoax|rumou?r|verify|fact.?check|source/.test(text)) {
        return "Pause before sharing, look for the original source, compare it with trusted public references, and keep uncertainty visible when you discuss the claim.";
      }
      if (/safe|secur|password|phish|scam|hack|privacy|account/.test(text)) {
        return "Use unique passwords, turn on two-factor authentication, review privacy settings, and avoid links or files that pressure you to act quickly.";
      }
      if (/osint|public.?source|analysis|report|timeline|risk/.test(text)) {
        return "Responsible public-source analysis starts with a clear question, proportional collection, corroboration, confidence labels, and a calm report focused on harm reduction.";
      }
      if (/program|course|learn|train|workshop|join|enroll|service/.test(text)) {
        return "mehfooz supports community learning, campus programs, women-led safety, trusted messenger training, and public-source analysis workflows.";
      }
      if (/urdu|language|local/.test(text)) {
        return "You can write in Urdu. mehfoozbot will keep the guidance simple, respectful, and focused on practical digital safety.";
      }
      if (/contact|reach|email|phone|address/.test(text)) {
        return "Use the contact form on this website for program, training, analysis, or partnership requests.";
      }
      return "I can help with digital safety, verification, misinformation, privacy, and responsible public-source analysis. Share the question or situation you want to think through.";
    };

    const addMessage = (sender, text) => {
      const message = document.createElement("div");
      message.className = `chat-msg msg-${sender}`;
      if (text === "...") message.classList.add("typing");
      message.textContent = text;
      log.appendChild(message);
      log.scrollTop = log.scrollHeight;
      return message;
    };

    const open = () => {
      modal.classList.remove("hidden");
      document.body.classList.add("chat-open");
      if (!log.children.length) {
        addMessage(
          "bot",
          "Assalam-u-Alaikum. I am mehfoozbot. Ask me about verification, privacy, misinformation, OSINT workflows, or mehfooz programs."
        );
      }
      setTimeout(() => input.focus(), 120);
    };

    const close = () => {
      modal.classList.add("hidden");
      document.body.classList.remove("chat-open");
    };

    const askRemote = async (message) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(14000)
      });
      if (!response.ok) throw new Error("chat request failed");
      const data = await response.json();
      if (!data.reply) throw new Error("empty reply");
      return data.reply;
    };

    qsa("[data-chat-open]").forEach((button) => button.addEventListener("click", open));
    qsa("[data-chat-close]").forEach((button) => button.addEventListener("click", close));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) close();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text || waiting) return;

      addMessage("user", text);
      input.value = "";
      input.disabled = true;
      waiting = true;
      const typing = addMessage("bot", "...");

      try {
        typing.textContent = await askRemote(text);
      } catch {
        typing.textContent = offlineReply(text);
      } finally {
        typing.classList.remove("typing");
        input.disabled = false;
        waiting = false;
        input.focus();
        log.scrollTop = log.scrollHeight;
      }
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
    const dark = canvas.closest(".section-dark, .hero-dashboard, .cinematic-site");
    return {
      dark: Boolean(dark),
      text: dark ? "#f7f4ee" : "#090909",
      muted: dark ? "#bdb7ad" : "#706d66",
      grid: dark ? "rgba(255,255,255,0.14)" : "rgba(9,9,9,0.12)",
      line: dark ? "#f7f4ee" : "#111111",
      fill: dark ? "rgba(255,255,255,0.1)" : "rgba(9,9,9,0.08)"
    };
  }

  function clear(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  }

  function label(ctx, text, x, y, color, size = 12, weight = 700) {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
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
      ctx.fillStyle = index === points.length - 1 ? "#111111" : theme.line;
      ctx.fill();
    });

    const last = points[points.length - 1];
    label(ctx, `${last.value}%`, Math.min(width - 64, last.x + 10), last.y - 14, theme.text, 14, 800);
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

    const primary = data.reduce((winner, item) => (item.value > winner.value ? item : winner), data[0]);
    label(ctx, `${primary.value}%`, cx - 28, cy, theme.text, 20, 900);
    label(ctx, "primary", cx - 24, cy + 24, theme.muted, 12, 700);

    const legendX = Math.min(width * 0.56, cx + radius + 42);
    const valueX = width - 48;
    const labelMax = Math.max(58, valueX - legendX - 36);
    const startY = Math.max(30, cy - data.length * 15);
    data.forEach((item, index) => {
      const y = startY + index * 30;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.roundRect?.(legendX, y - 6, 12, 12, 4);
      if (!ctx.roundRect) ctx.rect(legendX, y - 6, 12, 12);
      ctx.fill();
      let legendLabel = item.label;
      while (legendLabel.length > 4 && ctx.measureText(legendLabel).width > labelMax) {
        legendLabel = `${legendLabel.slice(0, -4)}...`;
      }
      label(ctx, legendLabel, legendX + 20, y, theme.text, 12, 800);
      label(ctx, `${item.value}%`, valueX, y, theme.muted, 12, 800);
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
      gradient.addColorStop(0, "#111111");
      gradient.addColorStop(0.65, "#706d66");
      gradient.addColorStop(1, "#d8d1c4");
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

    label(ctx, "review balance", barX, barY - 20, theme.text, 18, 900);

    const cols = width > 480 ? 2 : 1;
    data.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const lx = barX + col * (barW / cols);
      const ly = barY + 72 + row * 28;
      ctx.fillStyle = item.color;
      ctx.fillRect(lx, ly - 6, 12, 12);
      label(ctx, `${item.label}: ${item.value}%`, lx + 20, ly, theme.text, 12, 800);
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
      gradient.addColorStop(0, "#111111");
      gradient.addColorStop(1, index > 2 ? "#8d867a" : "#706d66");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect?.(x, y, w, rowH, 8);
      if (!ctx.roundRect) ctx.rect(x, y, w, rowH);
      ctx.fill();
      label(ctx, item.label, x + 14, y + rowH / 2, "#fff", 12, 900);
      label(ctx, `${item.value}%`, x + w - 54, y + rowH / 2, "#fff", 12, 900);
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
      ctx.fillStyle = index === data.length - 1 ? "#111111" : "#706d66";
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
    initTiltScenes();
    initMagneticCards();
    initProgramAtlas();
    initFlowSteps();
    initOrbitScenes();
    initChatBot();
    initCharts();
  });
})();
