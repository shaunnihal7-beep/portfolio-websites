const PROJECTS = [
  {
    id: "aureon",
    title: "Aureon",
    subtitle: "AI-Native Finance Intelligence",
    description: "A premium 3D concept landing page for a futuristic AI financial intelligence platform. Features animated orbital canvas models, smooth scroll trigger timelines, and high-tech typography.",
    thumbnail: "./gallery_assets/thumbnails/aureon.png",
    path: "./aureon/dist/index.html",
    accent: "#c49a58", // Gold
    glowColor: "rgba(196, 154, 88, 0.4)",
    glowBg: "rgba(196, 154, 88, 0.08)",
    badge: "3D Finance",
    category: "Tech",
    tags: ["React", "Three.js", "GSAP", "Lenis", "3D WebGL", "TailwindCSS"],
    highlights: [
      "Custom 3D orbital rings rendering with React Three Fiber",
      "GSAP timeline animations tied to scroll behavior",
      "Dynamic interactive risk analytics charts",
      "Premium typography using Satoshi and Clash Display",
      "Subtle grain canvas overlay and sleek dark styling"
    ],
    codeFiles: [
      { name: "App.jsx", path: "./aureon/src/App.jsx" },
      { name: "vite.config.js", path: "./aureon/vite.config.js" },
      { name: "main.jsx", path: "./aureon/src/main.jsx" }
    ]
  },
  {
    id: "walsh",
    title: "Walsh Creative",
    subtitle: "Ink & Paper Editorial Studio",
    description: "An editorial warm-paper style showcase for a New York creative studio. It features dramatic horizontal scroll layouts, canvas ink blooms, and a magnetic custom-follow cursor.",
    thumbnail: "./gallery_assets/thumbnails/walsh.png",
    path: "./new/index.html",
    accent: "#c1421a", // Red
    glowColor: "rgba(193, 66, 26, 0.4)",
    glowBg: "rgba(193, 66, 26, 0.08)",
    badge: "Creative Studio",
    category: "Creative",
    tags: ["HTML", "Vanilla JS", "GSAP", "ScrollTrigger", "Lenis", "Halftone SVG"],
    highlights: [
      "Warm paper tone (#f2ede4) and bold ink (#16140f) theme inversion",
      "Custom SVG film grain overlay and halftone waves",
      "Canvas-rendered drift blobs with mouse parallax",
      "Custom magnetic buttons and lerped custom cursor",
      "Preloader script and reduced-motion fallback options"
    ],
    codeFiles: [
      { name: "index.html", path: "./new/index.html" },
      { name: "styles.css", path: "./new/css/styles.css" },
      { name: "main.js", path: "./new/js/main.js" }
    ]
  },
  {
    id: "meridian",
    title: "Meridian Marketing",
    subtitle: "Creative Agency Hub",
    description: "A gorgeous agency showcase page highlighting modern campaigns and brand messaging. Packed with vibrant neon purple styles and dynamic interactive elements.",
    thumbnail: "./gallery_assets/thumbnails/meridian.png",
    path: "./Meridian_Marketing_Agency_Website/Meridian.dc.html",
    accent: "#a855f7", // Purple
    glowColor: "rgba(168, 85, 247, 0.4)",
    glowBg: "rgba(168, 85, 247, 0.08)",
    badge: "Marketing Portal",
    category: "Corporate",
    tags: ["HTML", "CSS", "Vanilla JS", "Canvas Engine", "Glassmorphism"],
    highlights: [
      "Dynamic interactive particle effects",
      "Vibrant radial gradients and neon border accents",
      "Smooth layout transitions",
      "High quality custom screenshots and brand assets"
    ],
    codeFiles: [
      { name: "Meridian.dc.html", path: "./Meridian_Marketing_Agency_Website/Meridian.dc.html" },
      { name: "support.js", path: "./Meridian_Marketing_Agency_Website/support.js" }
    ]
  },
  {
    id: "salon",
    title: "The Boardroom Barber",
    subtitle: "Premium Grooming & Salon",
    description: "A dark, highly luxurious single-page website for an upscale men's salon. Elegant editorial structure, leather textures, and detailed pricing and barbers grids.",
    thumbnail: "./gallery_assets/thumbnails/salon.png",
    path: "./mens-salon/index.html",
    accent: "#f59e0b", // Amber
    glowColor: "rgba(245, 158, 11, 0.4)",
    glowBg: "rgba(245, 158, 11, 0.08)",
    badge: "Luxury Service",
    category: "Minimalist",
    tags: ["HTML", "Vanilla CSS", "Grid Layout", "Elegant Type", "Responsive"],
    highlights: [
      "Classic dark wood and gold color palette",
      "Highly detailed responsive grids of services and booking rules",
      "Smooth interactive details elements for hair styles",
      "Premium typography using elegant display serifs"
    ],
    codeFiles: [
      { name: "index.html", path: "./mens-salon/index.html" }
    ]
  },
  {
    id: "aldermere",
    title: "Aldermere Estates",
    subtitle: "Luxury Real Estate Showcase",
    description: "An elegant, photo-forward showcase for a high-end real estate development. Modern structures meet clean serif editorial layout.",
    thumbnail: "./gallery_assets/thumbnails/aldermere.png",
    path: "./high-end_skill/aldermere-estates.html",
    accent: "#10b981", // Emerald
    glowColor: "rgba(16, 185, 129, 0.4)",
    glowBg: "rgba(16, 185, 129, 0.08)",
    badge: "Real Estate",
    category: "Corporate",
    tags: ["HTML", "Vanilla CSS", "Vanilla JS", "Image Slider", "Clean Layout"],
    highlights: [
      "Serene emerald green accent matching lake aesthetics",
      "Immersive hero slide panel with subtle fade animations",
      "Clean metadata grids for estate parameters",
      "Minimalist typography framing high-quality images"
    ],
    codeFiles: [
      { name: "aldermere-estates.html", path: "./high-end_skill/aldermere-estates.html" },
      { name: "style.css", path: "./high-end_skill/style.css" },
      { name: "script.js", path: "./high-end_skill/script.js" }
    ]
  },
  {
    id: "stitch",
    title: "Stitch Design System",
    subtitle: "Typography & UI Framework",
    description: "A clean, highly structured typographic playground and Markdown reader. Perfect for reading documentation or inspecting standard web components.",
    thumbnail: "./gallery_assets/thumbnails/stitch.svg",
    path: "./stitch_markdown_design_system/code.html",
    accent: "#6366f1", // Indigo
    glowColor: "rgba(99, 102, 241, 0.4)",
    glowBg: "rgba(99, 102, 241, 0.08)",
    badge: "Design System",
    category: "Minimalist",
    tags: ["HTML", "Vanilla CSS", "Typography scale", "Document Reader", "Component Grids"],
    highlights: [
      "Rigid pixel-perfect typographic hierarchy grids",
      "Styled documentation layout showcasing tables, cards, blocks",
      "Pure CSS implementation, extremely fast and lightweight",
      "Clean contrast margins designed for reading focus"
    ],
    codeFiles: [
      { name: "code.html", path: "./stitch_markdown_design_system/code.html" }
    ]
  },
  {
    id: "marmo",
    title: "MARMO",
    subtitle: "Michelin-Star Fine Dining",
    description: "A luxurious, editorial web concept for a three-Michelin-star Italian tasting-menu restaurant in Rome. Features custom IntersectionObserver scroll transitions, parallax content modules, and dynamic SVG marble-vein animations.",
    thumbnail: "./gallery_assets/thumbnails/marmo.png",
    path: "./front-end_skill_claude_code/index.html",
    accent: "#b1874c",
    glowColor: "rgba(177, 135, 76, 0.4)",
    glowBg: "rgba(177, 135, 76, 0.08)",
    badge: "Michelin Dining",
    category: "Minimalist",
    tags: ["HTML", "Vanilla CSS", "Vanilla JS", "Scroll Reveal", "Parallax", "SVG Path Animation"],
    highlights: [
      "Smooth scroll-triggered visual reveals and staggers using IntersectionObserver",
      "Sophisticated micro-interactions and requestAnimationFrame-driven parallax movement",
      "Dynamic SVG paths mimicking organic marble veins that draw on page load",
      "Seamless responsiveness with fallback options for prefers-reduced-motion",
      "Elegant typography pairing high-contrast display serif headers with clean sans-serif body text"
    ],
    codeFiles: [
      { name: "index.html", path: "./front-end_skill_claude_code/index.html" },
      { name: "styles.css", path: "./front-end_skill_claude_code/styles.css" },
      { name: "script.js", path: "./front-end_skill_claude_code/script.js" }
    ]
  }
];

// State variables
let activeFilter = "All";
let searchQuery = "";
let selectedProject = null;
let currentDevice = "desktop";

// Elements
const gridEl = document.getElementById("portfolio-grid");
const searchInput = document.getElementById("search-input");
const filterPillsContainer = document.getElementById("filter-pills");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const drawer = document.getElementById("drawer");
const drawerCloseBtn = document.getElementById("drawer-close");
const drawerIframeContainer = document.getElementById("iframe-container");
const drawerIframe = document.getElementById("preview-iframe");
const drawerTitle = document.getElementById("drawer-title");
const drawerOpenNewTab = document.getElementById("drawer-open-tab");

// Device buttons
const deviceBtns = {
  desktop: document.getElementById("dev-desktop"),
  tablet: document.getElementById("dev-tablet"),
  mobile: document.getElementById("dev-mobile")
};

// Filter Categories
const CATEGORIES = ["All", "Tech", "Creative", "Corporate", "Minimalist"];

// Init
document.addEventListener("DOMContentLoaded", () => {
  renderFilterPills();
  renderGrid();
  setupEventListeners();
  updateStats();
});

// Render filter pills
function renderFilterPills() {
  filterPillsContainer.innerHTML = CATEGORIES.map(cat => `
    <button class="filter-btn ${cat === activeFilter ? 'active' : ''}" data-cat="${cat}">
      ${cat}
    </button>
  `).join("");
}

// Render the grid cards
function renderGrid() {
  const filtered = PROJECTS.filter(p => {
    const matchesFilter = activeFilter === "All" || p.category === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    gridEl.innerHTML = `
      <div class="no-results">
        <h3>No projects match your search</h3>
        <p>Try resetting the category filter or looking for other tags.</p>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = filtered.map(p => `
    <div class="card-item">
      <div class="card-image-wrapper">
        <img class="card-thumbnail" src="${p.thumbnail}" alt="${p.title}">
        <div class="card-overlay">
          <span class="card-accent-badge">${p.badge}</span>
        </div>
      </div>
      <div class="card-body">
        <h2 class="card-title">${p.title}</h2>
        <p class="card-desc">${p.description}</p>
        <div class="card-tags">
          ${p.tags.map(t => `<span class="tag-badge">${t}</span>`).join("")}
        </div>
        <div class="card-footer">
          <button class="btn-secondary btn-preview-action" data-id="${p.id}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            Live Preview
          </button>
          <a href="${p.path}" target="_blank" class="btn-primary">
            Launch
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    </div>
  `).join("");

  // Setup preview buttons inside cards
  document.querySelectorAll(".btn-preview-action").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const projId = btn.getAttribute("data-id");
      openPreview(projId);
    });
  });
}

// Setup stats counter numbers
function updateStats() {
  document.getElementById("stat-total").innerText = PROJECTS.length;
  
  // Unique tags
  const tagsSet = new Set();
  PROJECTS.forEach(p => p.tags.forEach(t => tagsSet.add(t)));
  document.getElementById("stat-tech").innerText = tagsSet.size;

  // Framework categories
  const categoriesSet = new Set(PROJECTS.map(p => p.category));
  document.getElementById("stat-categories").innerText = categoriesSet.size;
}

// Setup Event Listeners
function setupEventListeners() {
  // Search
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });

  // Filter Pills (delegated)
  filterPillsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    
    activeFilter = btn.getAttribute("data-cat");
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid();
  });

  // Close drawer
  drawerCloseBtn.addEventListener("click", closePreview);
  drawerBackdrop.addEventListener("click", (e) => {
    if (e.target === drawerBackdrop) closePreview();
  });

  // Device simulation buttons
  Object.keys(deviceBtns).forEach(dev => {
    deviceBtns[dev].addEventListener("click", () => {
      setDevice(dev);
    });
  });

  // ESC key closes preview
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePreview();
  });
}

// Set simulated device width
function setDevice(device) {
  currentDevice = device;
  
  // Update class on iframe wrapper
  drawerIframeContainer.className = "iframe-container " + device;
  
  // Update buttons state
  Object.keys(deviceBtns).forEach(dev => {
    if (dev === device) {
      deviceBtns[dev].classList.add("active");
    } else {
      deviceBtns[dev].classList.remove("active");
    }
  });
}

// Open Preview drawer
function openPreview(projectId) {
  selectedProject = PROJECTS.find(p => p.id === projectId);
  if (!selectedProject) return;

  // Set info
  drawerTitle.innerText = selectedProject.title;
  drawer.style.setProperty("--project-accent", selectedProject.accent);
  drawerOpenNewTab.href = selectedProject.path;
  
  // Load iframe
  drawerIframe.src = selectedProject.path;

  // Populate sidebar
  populateSidebar(selectedProject);

  // Set default device to desktop
  setDevice("desktop");

  // Show backdrop/drawer
  drawerBackdrop.classList.add("active");
  document.body.style.overflow = "hidden"; // Disable body scroll
}

// Close Preview drawer
function closePreview() {
  drawerBackdrop.classList.remove("active");
  document.body.style.overflow = ""; // Re-enable body scroll
  
  // Unload iframe after transition to avoid sound playing in background
  setTimeout(() => {
    drawerIframe.src = "about:blank";
  }, 400);
}

// Populate drawer sidebar
function populateSidebar(p) {
  const sidebarContainer = document.getElementById("sidebar-info");
  
  sidebarContainer.innerHTML = `
    <div class="info-section">
      <h3>Description</h3>
      <p class="info-desc">${p.description}</p>
    </div>

    <div class="info-section">
      <h3>Design Highlights</h3>
      <ul class="highlights-list">
        ${p.highlights.map(h => `<li>${h}</li>`).join("")}
      </ul>
    </div>

    <div class="info-section">
      <h3>Tech Stack</h3>
      <div class="card-tags" style="margin-bottom: 0;">
        ${p.tags.map(t => `<span class="tag-badge" style="border-color: rgba(255,255,255,0.1);">${t}</span>`).join("")}
      </div>
    </div>

    <div class="info-section">
      <h3>Source Files</h3>
      <div class="code-links-container">
        ${p.codeFiles.map(cf => `
          <a href="${cf.path}" target="_blank" class="code-link" title="Click to inspect code file">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            ${cf.name}
          </a>
        `).join("")}
      </div>
    </div>
  `;
}
