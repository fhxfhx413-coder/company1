(function () {
  const companyEmail = "info@brokercompany.iq";
  const path = window.location.pathname.split("/").pop() || "index.html";

  function buildMailto(subject, body) {
    const params = new URLSearchParams({
      subject,
      body,
    });
    return `mailto:${companyEmail}?${params.toString()}`;
  }

  document.querySelectorAll("[data-mailto-subject]").forEach((link) => {
    const subject = link.dataset.mailtoSubject || "Broker website inquiry";
    const body =
      link.dataset.mailtoBody ||
      "السلام عليكم،\nأرغب بالتواصل مع شركة بروكر.\n\nالاسم:\nرقم الهاتف:\nالخدمة المطلوبة:";
    link.setAttribute("href", buildMailto(subject, body));
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  const languageButton = document.querySelector("[data-language-toggle]");
  const savedLanguage = localStorage.getItem("broker-wireframe-language") || "ar";

  function setLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-ar][data-en]").forEach((node) => {
      node.textContent = node.dataset[language];
    });
    if (languageButton) {
      languageButton.setAttribute("aria-pressed", String(language === "en"));
    }
    localStorage.setItem("broker-wireframe-language", language);
  }

  setLanguage(savedLanguage);

  if (languageButton) {
    languageButton.addEventListener("click", () => {
      const nextLanguage = document.documentElement.lang === "ar" ? "en" : "ar";
      setLanguage(nextLanguage);
    });
  }

  document.querySelectorAll("[data-tab-list]").forEach((tabList) => {
    const buttons = Array.from(tabList.querySelectorAll("[role='tab']"));
    const panels = buttons
      .map((button) => document.getElementById(button.getAttribute("aria-controls")))
      .filter(Boolean);

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.setAttribute("aria-selected", String(item === button)));
        panels.forEach((panel) => {
          panel.hidden = panel.id !== button.getAttribute("aria-controls");
        });
      });
    });
  });

  document.querySelectorAll(".accordion-button").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  const dialog = document.getElementById("partner-dialog");
  const dialogTitle = document.getElementById("partner-dialog-title");
  const dialogBody = document.getElementById("partner-dialog-body");

  document.querySelectorAll(".partner-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!dialog || !dialogTitle || !dialogBody) {
        return;
      }
      dialogTitle.textContent = trigger.dataset.title || trigger.textContent.trim();
      dialogBody.textContent = trigger.dataset.body || "";
      dialog.showModal();
    });
  });

  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentDialog = button.closest("dialog");
      if (currentDialog) {
        currentDialog.close();
      }
    });
  });

  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const phone = formData.get("phone") || "";
      const service = formData.get("service") || "";
      const message = formData.get("message") || "";
      const subject = `طلب خدمة من موقع بروكر - ${service || "تواصل عام"}`;
      const body = [
        "السلام عليكم،",
        "وصل طلب خدمة من نموذج موقع بروكر.",
        "",
        `الاسم: ${name}`,
        `البريد الإلكتروني: ${email}`,
        `رقم الجوال: ${phone}`,
        `الخدمة المطلوبة: ${service}`,
        "",
        "الرسالة:",
        `${message}`,
      ].join("\n");
      window.location.href = buildMailto(subject, body);
      formStatus.textContent =
        document.documentElement.lang === "ar"
          ? `سيتم فتح برنامج البريد لإرسال الرسالة إلى ${companyEmail}.`
          : `Your email app will open to send the message to ${companyEmail}.`;
      contactForm.reset();
    });
  }

  document.querySelectorAll("[data-placeholder-alert]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      window.alert(
        document.documentElement.lang === "ar"
          ? "سيتم ربط هذا الملف بعد اعتماد الوايرفرام."
          : "This file can be linked after the wireframe is approved."
      );
    });
  });

  document.querySelectorAll("img[data-fallback-target]").forEach((image) => {
    const showFallback = () => {
      const target = document.querySelector(image.dataset.fallbackTarget);
      image.hidden = true;
      if (target) {
        target.hidden = false;
      }
    };
    image.addEventListener("error", showFallback);
    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }
  });
})();
