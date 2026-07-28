const body = document.body;
const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("siteNav");
const scrollProgress = document.getElementById("scrollProgress");
const dialog = document.getElementById("projectDialog");
const dialogClose = document.getElementById("dialogClose");
const documentDialog = document.getElementById("documentDialog");
const documentClose = document.getElementById("documentClose");
const documentViewerTitle = document.getElementById("documentViewerTitle");
const documentViewerType = document.getElementById("documentViewerType");
const documentViewerImage = document.getElementById("documentViewerImage");
const documentSlideFrame = document.getElementById("documentSlideFrame");
const documentSlideOverlay = document.getElementById("documentSlideOverlay");
const documentCounter = document.getElementById("documentCounter");
const documentPdfLink = document.getElementById("documentPdfLink");
const documentThumbnails = document.getElementById("documentThumbnails");
const documentPrevious = document.getElementById("documentPrevious");
const documentNext = document.getElementById("documentNext");
const copyEmailButton = document.getElementById("copyEmail");
const downloadToast = document.getElementById("downloadToast");
let downloadToastTimer;
let activeDocument;
let activeDocumentPage = 0;

const ASSET_VERSION = "20260728";
const assetUrl = (path) => `${path}?v=${ASSET_VERSION}`;
const portfolioSlideNumbers = [1, 2, 4, 5, 6, 7, 10, 11, 13, 15, 18, 19];

const showcaseDocuments = {
  portfolio: {
    title: "Professional Portfolio",
    type: `Portfolio presentation · ${portfolioSlideNumbers.length} slides`,
    pageLabel: "Slide",
    pdf: "assets/documents/eaint-the-hsu-portfolio.pdf",
    pages: portfolioSlideNumbers.map((slideNumber) => {
      const number = String(slideNumber).padStart(2, "0");
      return {
        full: assetUrl(`assets/showcase/full/portfolio-${number}.webp`),
        thumbnail: assetUrl(`assets/showcase/thumbs/portfolio-${number}.webp`),
        aspect: "16 / 9",
        ratio: "1.7778",
        layout: slideNumber === 2 ? "intro-clean" : slideNumber === 5 ? "skills-tight" : undefined,
      };
    }),
  },
  cv: {
    title: "Professional CV",
    type: "Curriculum vitae · 2 pages",
    pageLabel: "Page",
    pdf: "assets/documents/eaint-the-hsu-cv.pdf",
    pages: Array.from({ length: 2 }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return {
        full: assetUrl(`assets/showcase/full/cv-${number}.webp`),
        thumbnail: assetUrl(`assets/showcase/thumbs/cv-${number}.webp`),
        aspect: "794 / 1123",
        ratio: "0.7070",
      };
    }),
  },
};

const introSummary = [
  "Master’s student in Environmental Science with experience in project coordination, research support, stakeholder communication, and administrative assistance within ASEAN-focused initiatives.",
  "Skilled in reporting, data management, and cross-cultural collaboration, with a strong interest in regional cooperation, sustainable development, and programme management.",
];

const skillsRows = [
  ["Coordination & Operations", "Communication & Professional Skills"],
  ["Administrative Support", "Stakeholder Communication"],
  ["Scheduling & Calendar Coordination", "Team Coordination"],
  ["Workflow Coordination", "Cross-cultural Collaboration"],
  ["Documentation & Record Management", "Communication Skills"],
  ["Meeting Coordination", "Outreach Support"],
  ["Operational Support", "Multitasking"],
  ["Google Workspace", "Organisational Skills"],
  ["Microsoft Office Suite", "Attention to Detail"],
  ["Spreadsheets & Data Organisation", "Adaptability"],
  ["Online Collaboration Tools", "Time Management"],
  ["Canva", "Problem Solving"],
];

const projects = {
  wetlands: {
    eyebrow: "Academic research · Chiang Mai University",
    title: "Assessment of carbon storage in Northern Thailand’s wetlands",
    summary:
      "A comprehensive study estimating carbon storage across wetland ecosystems in Chiang Rai, Thailand.",
    image: "assets/images/research-team.webp",
    alt: "Eaint and colleagues during wetland carbon research",
    points: [
      "Designed and carried out the environmental research study.",
      "Used R programming for quantitative analysis and tailored visualisations.",
      "Grouped urban wetland sites to identify clear environmental trends.",
      "Received first runner-up recognition for the oral research presentation.",
    ],
  },
  aun: {
    eyebrow: "Research internship · ASEAN University Network",
    title: "Programme assessment and regional research support",
    summary:
      "Research and coordination support for an ASEAN-focused initiative involving university staff and students.",
    image: "assets/images/aun-certificate.webp",
    alt: "Certificate of appreciation from the ASEAN University Network",
    points: [
      "Conducted interviews to gather qualitative information.",
      "Synthesised complex evidence into literature reviews and recommendations.",
      "Developed an internal database to track research progress.",
      "Supported communication and knowledge-sharing in a multicultural team.",
    ],
  },
  campaign: {
    eyebrow: "Team officer · University of Yangon Environmental Club",
    title: "Environmental awareness and event logistics",
    summary:
      "Youth-facing campaigns designed to make sustainability and waste management more accessible.",
    image: "assets/images/youth-event.webp",
    alt: "Students participating in an environmental awareness event",
    points: [
      "Helped deliver an awareness session for 300 high school students.",
      "Managed logistics, registration, and partner communication.",
      "Supported campus-wide campaigns, workshops, and digital events.",
      "Coordinated outreach, scheduling, and team-based delivery.",
    ],
  },
  eguard: {
    eyebrow: "Project assistant · EGuard Environmental Services",
    title: "Administrative support and stakeholder communication",
    summary:
      "Practical project support that kept documentation accurate and communication moving across stakeholder groups.",
    image: "assets/images/stakeholder-workshop.webp",
    alt: "Project stakeholder workshop and consultation",
    points: [
      "Tracked project progress and supported compliance reporting.",
      "Liaised with project proponents, communities, and internal teams.",
      "Helped resolve issues through clear, timely communication.",
      "Organised consultation meetings and documented public feedback.",
    ],
  },
};

function setMenu(open) {
  body.classList.toggle("nav-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
}

menuButton.addEventListener("click", () => setMenu(!body.classList.contains("nav-open")));

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

function updateScrollState() {
  header.classList.toggle("scrolled", window.scrollY > 28);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".site-nav a[href^='#']").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

function renderSlideOverlay(page) {
  documentSlideFrame.dataset.layout = page.layout || "";
  documentSlideOverlay.replaceChildren();
  documentSlideOverlay.hidden = !page.layout;

  if (page.layout === "intro-clean") {
    const cover = document.createElement("div");
    const copy = document.createElement("div");
    cover.className = "intro-slide-cover";
    copy.className = "intro-slide-copy";

    introSummary.forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      copy.append(paragraph);
    });

    documentSlideOverlay.append(cover, copy);
  }

  if (page.layout === "skills-tight") {
    const panel = document.createElement("div");
    const title = document.createElement("h3");
    const table = document.createElement("div");
    panel.className = "skills-slide";
    title.textContent = "SKILLS";
    table.className = "skills-slide-table";

    skillsRows.flat().forEach((skill, index) => {
      const cell = document.createElement(index < 2 ? "strong" : "span");
      cell.textContent = skill;
      table.append(cell);
    });

    panel.append(title, table);
    documentSlideOverlay.append(panel);
  }
}

function renderDocumentPage(index) {
  if (!activeDocument) return;

  const lastIndex = activeDocument.pages.length - 1;
  activeDocumentPage = Math.max(0, Math.min(index, lastIndex));
  const page = activeDocument.pages[activeDocumentPage];
  const pageNumber = activeDocumentPage + 1;

  documentSlideFrame.style.setProperty("--slide-aspect", page.aspect || "16 / 9");
  documentSlideFrame.style.setProperty("--slide-ratio", page.ratio || "1.7778");
  documentViewerImage.src = page.full;
  documentViewerImage.alt = `${activeDocument.title}, ${activeDocument.pageLabel.toLowerCase()} ${pageNumber}`;
  documentCounter.textContent = `${activeDocument.pageLabel} ${pageNumber} of ${activeDocument.pages.length}`;
  documentPrevious.disabled = activeDocumentPage === 0;
  documentNext.disabled = activeDocumentPage === lastIndex;
  renderSlideOverlay(page);

  documentViewerImage.classList.remove("page-enter");
  void documentViewerImage.offsetWidth;
  documentViewerImage.classList.add("page-enter");

  documentThumbnails.querySelectorAll(".document-thumbnail").forEach((thumbnail, thumbnailIndex) => {
    const isActive = thumbnailIndex === activeDocumentPage;
    thumbnail.classList.toggle("active", isActive);
    thumbnail.setAttribute("aria-pressed", String(isActive));
    if (isActive) {
      thumbnail.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  });
}

function openDocument(key) {
  const selectedDocument = showcaseDocuments[key];
  if (!selectedDocument) return;

  activeDocument = selectedDocument;
  activeDocumentPage = 0;
  documentViewerTitle.textContent = selectedDocument.title;
  documentViewerType.textContent = selectedDocument.type;
  documentPdfLink.href = selectedDocument.pdf;

  const thumbnails = selectedDocument.pages.map((page, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const number = document.createElement("span");
    button.type = "button";
    button.className = "document-thumbnail";
    if (page.layout) button.dataset.layout = page.layout;
    button.setAttribute("aria-label", `View ${selectedDocument.pageLabel.toLowerCase()} ${index + 1}`);
    image.src = page.thumbnail;
    image.alt = "";
    image.loading = "lazy";
    number.textContent = String(index + 1);
    button.append(image, number);
    button.addEventListener("click", () => renderDocumentPage(index));
    return button;
  });

  documentThumbnails.replaceChildren(...thumbnails);
  documentDialog.showModal();
  body.style.overflow = "hidden";
  renderDocumentPage(0);
}

function closeDocument() {
  documentDialog.close();
  body.style.overflow = "";
  documentViewerImage.removeAttribute("src");
  documentSlideFrame.removeAttribute("data-layout");
  documentSlideOverlay.hidden = true;
  documentSlideOverlay.replaceChildren();
  documentThumbnails.replaceChildren();
  activeDocument = undefined;
}

document.querySelectorAll("[data-document]").forEach((button) => {
  button.addEventListener("click", () => openDocument(button.dataset.document));
});

documentPrevious.addEventListener("click", () => renderDocumentPage(activeDocumentPage - 1));
documentNext.addEventListener("click", () => renderDocumentPage(activeDocumentPage + 1));
documentClose.addEventListener("click", closeDocument);
documentDialog.addEventListener("click", (event) => {
  if (event.target === documentDialog) closeDocument();
});
documentDialog.addEventListener("cancel", () => {
  body.style.overflow = "";
  documentViewerImage.removeAttribute("src");
  documentSlideFrame.removeAttribute("data-layout");
  documentSlideOverlay.hidden = true;
  documentSlideOverlay.replaceChildren();
  documentThumbnails.replaceChildren();
  activeDocument = undefined;
});
documentDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    renderDocumentPage(activeDocumentPage - 1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    renderDocumentPage(activeDocumentPage + 1);
  }
});

function openProject(key) {
  const project = projects[key];
  if (!project) return;

  document.getElementById("dialogEyebrow").append(project.eyebrow);
  document.getElementById("dialogTitle").textContent = project.title;
  document.getElementById("dialogSummary").textContent = project.summary;

  const image = document.getElementById("dialogImage");
  image.src = project.image;
  image.alt = project.alt;

  const list = document.getElementById("dialogPoints");
  list.replaceChildren(...project.points.map((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    return item;
  }));

  dialog.showModal();
  body.style.overflow = "hidden";
}

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => openProject(button.dataset.project));
});

function closeProject() {
  dialog.close();
  body.style.overflow = "";
  const eyebrow = document.getElementById("dialogEyebrow");
  eyebrow.replaceChildren(document.createElement("span"));
}

dialogClose.addEventListener("click", closeProject);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeProject();
});
dialog.addEventListener("cancel", () => {
  body.style.overflow = "";
  document.getElementById("dialogEyebrow").replaceChildren(document.createElement("span"));
});

copyEmailButton.addEventListener("click", async () => {
  const email = "eainthsu2019@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.firstChild.textContent = "Email copied ";
  } catch {
    window.location.href = `mailto:${email}`;
  }
  window.setTimeout(() => {
    copyEmailButton.firstChild.textContent = "Copy email ";
  }, 1800);
});

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-cv-download]").forEach((link) => {
  link.addEventListener("click", () => {
    window.clearTimeout(downloadToastTimer);
    downloadToast.classList.add("visible");
    downloadToastTimer = window.setTimeout(() => {
      downloadToast.classList.remove("visible");
    }, 3500);
  });
});

if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
