/* ==========================================================================
   Fausto's Grill — comportamiento
   Sin dependencias. Todo el contenido es visible aunque este script falle.
   ========================================================================== */
(() => {
  "use strict";

  const C = window.FAUSTOS || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const digits = (s) => (s || "").replace(/[^\d+]/g, "");
  const localPhone = (s) => (s || "").replace(/^\+34\s?/, "");

  /* ---------- Datos de contacto desde config ---------- */
  function applyContact() {
    if (C.phone) {
      $$("[data-phone]").forEach((el) => (el.textContent = localPhone(C.phone)));
      $$("[data-phone-link], [data-fab]").forEach((el) => (el.href = "tel:" + digits(C.phone)));
    }
    const channel = (name, value, href, label) => {
      const li = $(`[data-channel="${name}"]`);
      if (!li || !value) return;
      li.hidden = false;
      $(`[data-${name}]`, li).textContent = label || value;
      $(`[data-${name}-link]`, li).href = href;
      const foot = $("[data-footer-contact]");
      if (foot) {
        const item = document.createElement("li");
        item.innerHTML = `<a href="${href}"${name === "email" ? "" : ' target="_blank" rel="noopener"'}></a>`;
        item.firstChild.textContent = label || value;
        foot.append(item);
      }
    };
    channel("whatsapp", C.whatsapp, "https://wa.me/" + digits(C.whatsapp).replace("+", ""), localPhone(C.whatsapp));
    channel("email", C.email, "mailto:" + C.email);
    channel("instagram", C.instagram, "https://instagram.com/" + C.instagram, "@" + C.instagram);

    if (C.address) {
      const q = encodeURIComponent(C.address.mapsQuery);
      $$("[data-directions]").forEach((a) => (a.href = "https://www.google.com/maps/dir/?api=1&destination=" + q));
      const map = $("[data-map]");
      const src = "https://www.google.com/maps?q=" + q + "&output=embed";
      if (map && map.getAttribute("src") !== src) map.src = src;
      const addr = $("[data-address]");
      if (addr) addr.innerHTML = `${C.address.street}<br>${C.address.city}`;
    }
    const y = $("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Fotos: si falta el archivo, queda el recuadro con el nombre ---------- */
  function initPhotos() {
    $$("img[data-photo]").forEach((img) => {
      const miss = () => img.classList.add("is-missing");
      if (img.complete && img.naturalWidth === 0) miss();
      else img.addEventListener("error", miss, { once: true });
    });
  }

  /* ---------- Galería: carrusel con la foto central enfocada ---------- */
  function initCoverflow() {
    const root = $("[data-coverflow]");
    if (!root) return;
    const track = $(".coverflow__track", root);
    const items = $$(".coverflow__item", root);
    const now = $("[data-cf-now]", root);
    $("[data-cf-total]", root).textContent = items.length;
    let active = 0, frame = 0;

    const update = () => {
      frame = 0;
      const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
      let best = Infinity;
      items.forEach((li, i) => {
        const r = li.getBoundingClientRect();
        const d = (r.left + r.width / 2 - mid) / (r.width || 1);
        const c = Math.max(-1, Math.min(1, d));
        li.style.setProperty("--r", c.toFixed(3));
        li.style.setProperty("--a", Math.abs(c).toFixed(3));
        li.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
        if (Math.abs(d) < best) { best = Math.abs(d); active = i; }
      });
      items.forEach((li, i) => li.classList.toggle("is-active", i === active));
      now.textContent = active + 1;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };

    const go = (i, instant) => {
      i = Math.max(0, Math.min(items.length - 1, i));
      const li = items[i];
      const left = li.offsetLeft + li.offsetWidth / 2 - track.clientWidth / 2;
      track.scrollTo({ left, behavior: instant || reduceMotion.matches ? "auto" : "smooth" });
    };

    track.addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    // Tocar una foto lateral la trae al centro; la del centro abre la ampliación.
    track.addEventListener("click", (e) => {
      const li = e.target.closest(".coverflow__item");
      if (!li || li.classList.contains("is-active")) return;
      e.stopPropagation();
      go(items.indexOf(li));
    }, true);
    track.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const n = active + (e.key === "ArrowRight" ? 1 : -1);
      if (items[n]) { go(n, true); $("button", items[n]).focus({ preventScroll: true }); }
    });
    $("[data-cf-prev]", root).addEventListener("click", () => go(active - 1));
    $("[data-cf-next]", root).addEventListener("click", () => go(active + 1));

    go(Math.floor((items.length - 1) / 2), true);
    update();
  }

  /* ---------- Cabecera ---------- */
  function initHeader() {
    const header = $(".site-header");
    const hero = $(".hero");
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => header.classList.toggle("is-solid", !e.isIntersecting), {
        rootMargin: "-72px 0px 0px 0px",
      }).observe(hero);
    } else header.classList.add("is-solid");

    const toggle = $(".nav-toggle");
    const nav = $("#nav");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      document.documentElement.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      $(".visually-hidden", toggle).textContent = open ? "Cerrar menú de navegación" : "Abrir menú de navegación";
      $("use", toggle).setAttribute("href", open ? "#i-x" : "#i-menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    matchMedia("(min-width: 52.01rem)").addEventListener("change", (m) => m.matches && setOpen(false));
  }

  /* ---------- Horario y estado "abierto ahora" ---------- */
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmt = (hhmm) => hhmm.replace(/^0/, "");

  function nowInTz() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: C.timezone || "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, min: Number(get("hour")) * 60 + Number(get("minute")) };
  }

  function openState() {
    const H = C.hours || {};
    const { day, min } = nowInTz();
    const today = H[day];
    const yest = H[(day + 6) % 7];
    // Turno de ayer que cruza la medianoche
    if (yest && toMin(yest.close) < toMin(yest.open) && min < toMin(yest.close)) return { open: true, until: yest.close };
    if (today) {
      const o = toMin(today.open), c = toMin(today.close);
      const crosses = c < o;
      if (min >= o && (crosses || min < c)) return { open: true, until: today.close };
      if (min < o) return { open: false, next: `hoy a las ${fmt(today.open)}` };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (H[d]) return { open: false, next: `${i === 1 ? "mañana" : DAYS[d].toLowerCase()} a las ${fmt(H[d].open)}` };
    }
    return { open: false };
  }

  function initHours() {
    const H = C.hours;
    if (!H) return;
    const s = openState();
    const el = $("[data-status]");
    const text = $("[data-status-text]");
    if (el && text) {
      el.classList.add(s.open ? "status--open" : "status--closed");
      text.innerHTML = s.open
        ? `<strong>Abierto ahora</strong> · cocina hasta las ${fmt(s.until)}`
        : `<strong>Cerrado ahora</strong>${s.next ? " · abrimos " + s.next : ""}`;
    }

    // Agrupa días consecutivos con el mismo horario (empezando el lunes)
    const order = [1, 2, 3, 4, 5, 6, 0];
    const label = (h) => (h ? `${fmt(h.open)} – ${fmt(h.close)}` : "Cerrado");
    const groups = [];
    order.forEach((d) => {
      const l = label(H[d]);
      const g = groups[groups.length - 1];
      if (g && g.label === l) g.days.push(d); else groups.push({ label: l, days: [d] });
    });
    const today = nowInTz().day;
    const tbody = $("[data-hours] tbody");
    if (tbody) {
      tbody.innerHTML = "";
      groups.forEach((g) => {
        const first = DAYS[g.days[0]], last = DAYS[g.days[g.days.length - 1]];
        const name = g.days.length === 1 ? first : g.days.length === 2 ? `${first} y ${last.toLowerCase()}` : `${first} a ${last.toLowerCase()}`;
        const tr = document.createElement("tr");
        if (g.days.includes(today)) tr.className = "is-today";
        tr.innerHTML = `<th scope="row">${name}</th><td>${g.label}</td>`;
        tbody.append(tr);
      });
    }
    const note = $("[data-hours-note]");
    if (note) { note.textContent = C.hoursNote || ""; note.hidden = !C.hoursNote; }
  }

  /* ---------- Carta: pestañas accesibles ---------- */
  function initMenu() {
    const list = $(".menu__tabs");
    if (!list) return;
    const tabs = $$('[role="tab"]', list);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));


    const select = (tab, { focus = false, instant = false } = {}) => {
      tabs.forEach((t, i) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tab.focus();
      // Desplaza sólo la fila de pestañas (nunca la página) para que la activa quede visible
      const tr = tab.getBoundingClientRect(), lr = list.getBoundingClientRect();
      const l = tr.left - lr.left + list.scrollLeft, r = l + tr.width;
      if (l < list.scrollLeft || r > list.scrollLeft + list.clientWidth) {
        list.scrollTo({ left: l - 16, behavior: instant || reduceMotion.matches ? "auto" : "smooth" });
      }
    };

    tabs.forEach((t) => t.addEventListener("click", () => select(t)));
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      // Acción de teclado: sin animación (Emil Kowalski)
      select(tabs[(map[e.key] + tabs.length) % tabs.length], { focus: true, instant: true });
    });

    select(tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0], { instant: true });
  }

  /* ---------- Galería + visor ---------- */
  function initLightbox() {
    const dialog = $(".lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;
    const img = $("img", dialog);
    const cap = $("figcaption", dialog);
    let items = [];
    let index = 0;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const src = $("img", items[index]);
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      cap.textContent = $(".photo__caption", items[index]).textContent;
    };

    $$("[data-lightbox]").forEach((btn) => {
      btn.addEventListener("click", () => {
        items = $$("[data-lightbox]").filter((b) => !$("img", b).classList.contains("is-missing"));
        const i = items.indexOf(btn);
        if (i < 0) return; // foto aún no subida
        show(i);
        dialog.showModal();
      });
    });
    $("[data-prev]", dialog).addEventListener("click", () => show(index - 1));
    $("[data-next]", dialog).addEventListener("click", () => show(index + 1));
    $("[data-close]", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    });
  }

  /* ---------- Reseñas ---------- */
  const DEMO_REVIEWS = [
    { author: "Cliente de ejemplo", rating: 5, when: "hace 1 semana", text: "Reseña de ejemplo: el entrecot llegó exactamente al punto que pedimos y el chimichurri es de los mejores de Málaga. Volveremos." },
    { author: "Cliente de ejemplo", rating: 5, when: "hace 2 semanas", text: "Reseña de ejemplo: desayunamos un sábado y acabamos volviendo a cenar. Trato muy cercano y la provoleta, espectacular." },
    { author: "Cliente de ejemplo", rating: 4, when: "hace 1 mes", text: "Reseña de ejemplo: buena relación calidad-precio y cocina abierta todo el día, perfecto para comer tarde." },
    { author: "Cliente de ejemplo", rating: 5, when: "hace 1 mes", text: "Reseña de ejemplo: la parrillada para dos da para tres. Carne de calidad y un Malbec muy rico." },
  ];

  const stars = (n) => {
    let html = "";
    for (let i = 1; i <= 5; i++) html += `<svg class="icon icon--fill${i <= Math.round(n) ? "" : " is-empty"}" aria-hidden="true"><use href="#i-star"/></svg>`;
    return `<span class="stars" role="img" aria-label="${n} de 5 estrellas">${html}</span>`;
  };

  function renderReviews(reviews, summary) {
    const list = $("[data-reviews]");
    list.innerHTML = "";
    reviews.forEach((r) => {
      const li = document.createElement("li");
      li.className = "review";
      li.innerHTML = `${stars(r.rating)}<blockquote><p></p></blockquote>
        <footer>${r.photo ? `<img class="review__avatar" src="${r.photo}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '<span class="review__avatar" aria-hidden="true"></span>'}
        <span><span class="review__name"></span><span class="review__when"></span></span></footer>`;
      $("blockquote p", li).textContent = r.text;
      $(".review__name", li).textContent = r.author;
      $(".review__when", li).textContent = r.when || "";
      list.append(li);
    });
    if (summary && summary.rating) {
      $("[data-rating]").hidden = false;
      $("[data-rating-score]").textContent = summary.rating.toFixed(1).replace(".", ",");
      $("[data-rating-stars]").outerHTML = stars(summary.rating);
      $("[data-rating-count]").textContent = summary.count ? `${summary.count.toLocaleString("es-ES")} reseñas en Google` : "";
    }
  }

  function loadGoogleReviews(g) {
    return new Promise((resolve, reject) => {
      const cb = "__faustosMaps";
      window[cb] = async () => {
        try {
          const { Place } = await google.maps.importLibrary("places");
          const place = new Place({ id: g.placeId, requestedLanguage: "es" });
          await place.fetchFields({ fields: ["rating", "userRatingCount", "reviews", "googleMapsURI"] });
          resolve(place);
        } catch (err) { reject(err); }
      };
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(g.apiKey)}&loading=async&language=es&callback=${cb}`;
      s.async = true;
      s.onerror = reject;
      document.head.append(s);
    });
  }

  function initReviews() {
    const g = C.google || {};
    const link = $("[data-reviews-link]");
    const write = $("[data-review-write]");
    if (link) link.href = g.reviewsUrl || "#";
    if (write) write.href = g.placeId ? `https://search.google.com/local/writereview?placeid=${g.placeId}` : (g.reviewsUrl || "#");

    const demo = () => {
      renderReviews(DEMO_REVIEWS);
      $("[data-reviews-demo]").hidden = false;
    };

    const featured = () => {
      if (!g.featured || !g.featured.length) return false;
      renderReviews(g.featured, { rating: g.rating, count: g.count });
      return true;
    };

    if (!g.apiKey || !g.placeId) return featured() || (g.demo === false ? null : demo());

    // Carga diferida: sólo al acercarse a la sección
    const section = $("#resenas");
    const go = () => loadGoogleReviews(g).then((place) => {
      const reviews = (place.reviews || []).map((r) => ({
        author: r.authorAttribution ? r.authorAttribution.displayName : "Cliente de Google",
        photo: r.authorAttribution && r.authorAttribution.photoURI,
        rating: r.rating || 5,
        when: r.relativePublishTimeDescription,
        text: r.text || "",
      })).filter((r) => r.text);
      if (!reviews.length) throw new Error("sin reseñas");
      renderReviews(reviews, { rating: place.rating, count: place.userRatingCount });
      if (place.googleMapsURI && link) link.href = place.googleMapsURI;
    }).catch((err) => {
      console.warn("[Fausto's] No se pudieron cargar las reseñas de Google:", err);
      if (!featured() && g.demo !== false) demo();
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); go(); } }, { rootMargin: "600px" });
      io.observe(section);
    } else go();
  }

  /* ---------- Formulario de reserva ---------- */
  function initReserve() {
    const form = $("[data-reserve]");
    if (!form) return;
    const status = $("[data-reserve-status]");
    const submit = $("[data-reserve-submit]");
    const date = form.elements.date;
    const time = form.elements.time;

    // Fecha mínima: hoy (hora de Málaga)
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: C.timezone || "Europe/Madrid" }).format(new Date());
    date.min = today;

    const via = C.whatsapp ? "whatsapp" : C.email ? "email" : "phone";
    submit.textContent = via === "whatsapp" ? "Enviar por WhatsApp" : via === "email" ? "Enviar por correo" : "Preparar reserva";
    if (via === "whatsapp") submit.classList.replace("btn--ember", "btn--whatsapp");

    const setError = (input, msg) => {
      const field = input.closest(".field");
      field.classList.toggle("has-error", !!msg);
      $(".field__error", field).textContent = msg || "";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    const validate = () => {
      let first = null;
      const fail = (input, msg) => { setError(input, msg); if (msg && !first) first = input; };
      fail(form.elements.name, form.elements.name.value.trim() ? "" : "Escribe tu nombre para la reserva.");
      if (!date.value) fail(date, "Elige el día.");
      else {
        const d = new Date(date.value + "T12:00:00").getDay();
        if (date.value < today) fail(date, "Esa fecha ya ha pasado.");
        else if (C.hours && !C.hours[d]) fail(date, `Los ${DAYS[d].toLowerCase().replace(/([^s])$/, "$1s")} cerramos. Elige otro día.`);
        else fail(date, "");
      }
      if (!time.value) fail(time, "Elige la hora.");
      else {
        const d = date.value ? new Date(date.value + "T12:00:00").getDay() : null;
        const h = d !== null && C.hours ? C.hours[d] : null;
        if (h && (toMin(time.value) < toMin(h.open) || toMin(time.value) > toMin(h.close) - 30)) {
          const last = toMin(h.close) - 30;
          fail(time, `Ese día reservamos de ${fmt(h.open)} a ${Math.floor(last / 60)}:${String(last % 60).padStart(2, "0")}.`);
        } else fail(time, "");
      }
      return first;
    };

    $$("input", form).forEach((i) => i.addEventListener("input", () => i.closest(".field").classList.contains("has-error") && validate()));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.className = "form__status";
      status.textContent = "";
      const bad = validate();
      if (bad) { bad.focus(); return; }

      const f = form.elements;
      const niceDate = new Date(f.date.value + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      const msg = `Hola, quería reservar en Fausto's Grill:\n• Nombre: ${f.name.value.trim()}\n• Día: ${niceDate}\n• Hora: ${f.time.value}\n• Personas: ${f.people.value}` +
        (f.notes.value.trim() ? `\n• Comentarios: ${f.notes.value.trim()}` : "");

      if (via === "whatsapp") {
        window.open("https://wa.me/" + digits(C.whatsapp).replace("+", "") + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
        status.textContent = "Se ha abierto WhatsApp con tu reserva. Envía el mensaje y te confirmamos.";
      } else if (via === "email") {
        location.href = `mailto:${C.email}?subject=${encodeURIComponent("Reserva · " + niceDate)}&body=${encodeURIComponent(msg)}`;
        status.textContent = "Se ha abierto tu correo con la reserva. Envíalo y te confirmamos.";
      } else {
        status.innerHTML = `Para confirmarla al momento, llámanos al <a href="tel:${digits(C.phone)}">${localPhone(C.phone)}</a>.`;
      }
      status.classList.add("is-ok");
    });
  }

  /* ---------- Brasas: el momento de autor de la portada ---------- */
  function initEmbers() {
    const canvas = $(".hero__embers");
    if (!canvas || reduceMotion.matches) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, sparks = [], running = false, raf = 0, last = 0;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, w / 18));
      sparks = Array.from({ length: count }, () => spawn(true));
    };
    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.6 + 0.5,
      vy: Math.random() * 28 + 14,
      sway: Math.random() * 2 * Math.PI,
      swaySpeed: Math.random() * 1.2 + 0.4,
      life: 0,
      max: Math.random() * 6 + 4,
    });

    const frame = (t) => {
      const dt = Math.min((t - last) / 1000 || 0, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const s of sparks) {
        s.life += dt;
        s.y -= s.vy * dt;
        s.sway += s.swaySpeed * dt;
        const x = s.x + Math.sin(s.sway) * 10;
        const fade = Math.max(0, 1 - s.life / s.max) * Math.min(1, s.life * 2) * Math.min(1, (s.y / h) * 1.6);
        const g = ctx.createRadialGradient(x, s.y, 0, x, s.y, s.r * 4);
        g.addColorStop(0, `rgba(255,190,120,${0.95 * fade})`);
        g.addColorStop(0.4, `rgba(255,110,40,${0.55 * fade})`);
        g.addColorStop(1, "rgba(255,80,20,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, s.y, s.r * 4, 0, Math.PI * 2); ctx.fill();
        if (s.life > s.max || s.y < -10) Object.assign(s, spawn(false));
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    addEventListener("resize", () => { clearTimeout(resize.t); resize.t = setTimeout(resize, 150); });
    // Se detiene fuera de pantalla o con la pestaña oculta
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden || !visible ? stop() : start()));
    reduceMotion.addEventListener("change", (m) => { if (m.matches) { stop(); ctx.clearRect(0, 0, w, h); } });
  }

  /* ---------- Botón flotante: se oculta en la sección de contacto ---------- */
  function initFab() {
    const fab = $("[data-fab]");
    const contact = $("#contacto");
    const hero = $(".hero");
    if (!fab || !("IntersectionObserver" in window)) return;
    let inHero = true, inContact = false;
    const update = () => fab.classList.toggle("is-hidden", inHero || inContact);
    new IntersectionObserver(([e]) => { inHero = e.isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(([e]) => { inContact = e.isIntersecting; update(); }, { threshold: 0.15 }).observe(contact);
    update();
  }

  applyContact();
  initPhotos();
  initHeader();
  initHours();
  initMenu();
  initCoverflow();
  initLightbox();
  initReviews();
  initReserve();
  initEmbers();
  initFab();
})();
