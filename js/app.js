/**
 * ==========================================================================
 * KAVYA GURU — Master Application Logic & Real Database Sync
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * Features: Separated Admin & User sections, Password: Ashish123,
 * External YouTube Player, Full Responsiveness.
 * ==========================================================================
 */

const App = {
  activePoem: null,
  activeNote: null,

  // Live in-memory cache synchronized with SQLite database
  cachedPoems: [],
  cachedNotes: [],
  cachedVideos: [],
  cachedCourses: [],
  cachedCareers: KAVYA_GURU_CAREERS,
  cachedThreads: [],
  pendingAdminPoemImageData: null,
  pendingAdminPoemPdfData: null,

  async init() {
    // Initialize Multilingual system first
    if (typeof I18n !== "undefined") {
      I18n.init();
    }
    UIManager.init();
    Router.init();
    this.bindGlobalEvents();

    // Fetch real content from backend database
    await this.syncDataFromBackend();

    this.renderAllViews();
    this.updateUserNavState();
    this.updateNotificationBadge();
  },

  async syncDataFromBackend() {
    try {
      const [backendPoems, backendNotes, backendVideos, backendCourses, backendThreads] = await Promise.all([
        ApiClient.getPoems(),
        ApiClient.getNotes(),
        ApiClient.getVideos(),
        ApiClient.getCourses(),
        ApiClient.getCommunity()
      ]);

      this.cachedPoems = Array.isArray(backendPoems) ? backendPoems : [];
      this.cachedNotes = Array.isArray(backendNotes) ? backendNotes : [];
      this.cachedVideos = Array.isArray(backendVideos) ? backendVideos : [];
      this.cachedCourses = Array.isArray(backendCourses) ? backendCourses : [];
      this.cachedThreads = Array.isArray(backendThreads) ? backendThreads : [];
    } catch (err) {
      console.warn("Backend sync notice:", err);
      this.cachedPoems = [];
      this.cachedNotes = [];
      this.cachedVideos = [];
      this.cachedCourses = [];
      this.cachedThreads = [];
    }
  },

  // ------------------------------------------------------------------------
  // Global Event Listeners & Binding
  // ------------------------------------------------------------------------
  bindGlobalEvents() {
    // Multilingual toggle button (Header)
    const langToggleBtn = document.getElementById("langToggleBtn");
    if (langToggleBtn) {
      langToggleBtn.addEventListener("click", () => {
        if (typeof I18n !== "undefined") {
          I18n.toggleLanguage();
        }
      });
    }

    // Multilingual footer buttons
    const footerLangEn = document.getElementById("footerLangEn");
    if (footerLangEn) {
      footerLangEn.addEventListener("click", () => {
        if (typeof I18n !== "undefined") {
          I18n.setLanguage("en");
        }
      });
    }

    const footerLangHi = document.getElementById("footerLangHi");
    if (footerLangHi) {
      footerLangHi.addEventListener("click", () => {
        if (typeof I18n !== "undefined") {
          I18n.setLanguage("hi");
        }
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => UIManager.toggleTheme());
    }

    // Global search trigger
    const searchTrigger = document.getElementById("globalSearchTrigger");
    if (searchTrigger) {
      searchTrigger.addEventListener("click", () => UIManager.openGlobalSearch());
    }

    const searchInput = document.getElementById("globalSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        UIManager.handleGlobalSearch(e.target.value);
      });
    }

    // Modal background close triggers
    document.querySelectorAll(".kg-modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          UIManager.closeModal(overlay.id);
        }
      });
    });

    // Close buttons
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetModal = btn.getAttribute("data-close-modal");
        UIManager.closeModal(targetModal);
      });
    });

    // Navigation links click handling
    document.querySelectorAll("[data-route]").forEach(elem => {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        const route = elem.getAttribute("data-route");
        Router.navigate(route);
      });
    });

    // Notification bell
    const notifBtn = document.getElementById("notificationBellBtn");
    if (notifBtn) {
      notifBtn.addEventListener("click", () => {
        this.openNotificationsDrawer();
      });
    }

    // User auth button
    const authBtn = document.getElementById("authNavBtn");
    if (authBtn) {
      authBtn.addEventListener("click", () => {
        const user = StorageManager.getUser();
        if (user && user.isLoggedIn) {
          Router.navigate("profile");
        } else {
          this.openAuthModal();
        }
      });
    }
  },

  onLanguageChange(lang) {
    this.renderAllViews();
    this.updateUserNavState();
  },

  onRouteEnter(route) {
    if (route === "admin") {
      this.renderAdminDashboard();
    } else if (route === "profile") {
      this.renderProfileView();
    }
  },

  updateUserNavState() {
    const user = StorageManager.getUser();
    const authBtn = document.getElementById("authNavBtn");
    if (!authBtn) return;

    if (user && user.isLoggedIn) {
      authBtn.innerHTML = `
        <span style="width: 28px; height: 28px; border-radius: 50%; background: var(--kg-brand-primary); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold;">${user.avatar || 'KG'}</span>
        <span class="kg-hide-sm" style="font-size: 0.88rem; font-weight: 600;">${(user.name || 'Student').split(' ')[0]}</span>
      `;
      authBtn.setAttribute("title", `Logged in as ${user.name}`);
    } else {
      const signInLabel = typeof I18n !== "undefined" ? I18n.t("nav_login") : "Sign In";
      authBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span class="kg-hide-sm" style="font-size: 0.88rem; font-weight: 600;">${signInLabel}</span>
      `;
      authBtn.setAttribute("title", signInLabel);
    }
  },

  updateNotificationBadge() {
    const notifs = StorageManager.getNotifications ? StorageManager.getNotifications() : [];
    const unreadCount = notifs.filter(n => n.unread).length;
    const badge = document.getElementById("notifBadge");
    if (!badge) return;

    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.classList.remove("kg-hidden");
    } else {
      badge.classList.add("kg-hidden");
    }
  },

  // ------------------------------------------------------------------------
  // Render All Views
  // ------------------------------------------------------------------------
  renderAllViews() {
    this.renderHomeFeatured();
    this.renderPoetrySection("all");
    this.renderNotesSection("all");
    this.renderVideosSection("all");
    this.renderMeetCourses();
    this.renderCareersSection();
    this.renderCommunitySection();
  },

  // ------------------------------------------------------------------------
  // 1. Home Section
  // ------------------------------------------------------------------------
  renderHomeFeatured() {
    const featuredPoetryContainer = document.getElementById("homeFeaturedPoetry");
    if (featuredPoetryContainer) {
      if (this.cachedPoems.length === 0) {
        const emptyTitle = typeof I18n !== "undefined" ? I18n.t("poetry_empty_title") : "No Poems Published Yet";
        const emptyDesc = typeof I18n !== "undefined" ? I18n.t("poetry_empty_desc") : "Publish poems via Admin Portal or submit your original verse.";
        const emptyBtn = typeof I18n !== "undefined" ? I18n.t("poetry_submit_btn") : "Submit Poem";
        featuredPoetryContainer.innerHTML = `
          <div class="kg-empty-state" style="grid-column: 1 / -1; padding: 2rem 1rem;">
            <div class="kg-empty-icon" style="width: 48px; height: 48px;">📜</div>
            <h3 class="kg-empty-title" style="font-size: 1.05rem;">${emptyTitle}</h3>
            <p class="kg-empty-desc" style="font-size: 0.85rem; margin-bottom: 1rem;">${emptyDesc}</p>
            <button class="kg-btn kg-btn-sm kg-btn-primary" onclick="App.openSubmitPoemModal()">${emptyBtn}</button>
          </div>
        `;
      } else {
        const topPoems = this.cachedPoems.slice(0, 3);
        featuredPoetryContainer.innerHTML = topPoems.map(p => this.createPoemCardHtml(p)).join("");
      }
    }
  },

  // ------------------------------------------------------------------------
  // 2. Poetry Corner (Kavya Manch)
  // ------------------------------------------------------------------------
  renderPoetrySection(filter = "all") {
    const grid = document.getElementById("poetryGrid");
    if (!grid) return;

    const allPoems = this.cachedPoems;
    let filtered = allPoems;
    if (filter === "hindi") {
      filtered = allPoems.filter(p => p.language === "hindi");
    } else if (filter === "english") {
      filtered = allPoems.filter(p => p.language === "english");
    } else if (filter === "ghazal") {
      filtered = allPoems.filter(p => p.category === "ghazal");
    } else if (filter === "inspirational") {
      filtered = allPoems.filter(p => p.category === "inspirational");
    } else if (filter === "student") {
      filtered = allPoems.filter(p => p.is_custom || p.isCustom);
    }

    if (filtered.length === 0) {
      const emptyTitle = typeof I18n !== "undefined" ? I18n.t("poetry_empty_title") : "No Poetry Published Yet in this Category";
      const emptyDesc = typeof I18n !== "undefined" ? I18n.t("poetry_empty_desc") : "The poetry stage is ready. Submit your original verse.";
      const emptyBtn = typeof I18n !== "undefined" ? I18n.t("poetry_submit_btn") : "Submit Your Kavya";
      grid.innerHTML = `
        <div class="kg-empty-state" style="grid-column: 1 / -1;">
          <div class="kg-empty-icon">📜</div>
          <h3 class="kg-empty-title">${emptyTitle}</h3>
          <p class="kg-empty-desc">${emptyDesc}</p>
          <button class="kg-btn kg-btn-primary" onclick="App.openSubmitPoemModal()">${emptyBtn}</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => this.createPoemCardHtml(p)).join("");
  },

  createPoemCardHtml(p) {
    const isLiked = StorageManager.getLikedPoems().includes(p.id);
    const isSaved = StorageManager.getSavedItems().includes(p.id);
    const previewStanza = (p.stanza || '').split("\n\n")[0];
    const isHindiLang = typeof I18n !== "undefined" && I18n.getLang() === "hi";

    const langMap = {
      hindi: isHindiLang ? 'हिंदी कविता' : 'Hindi Poetry',
      english: isHindiLang ? 'अंग्रेजी कविता' : 'English Poetry',
      sanskrit: isHindiLang ? 'संस्कृत काव्य' : 'Sanskrit Kavya',
      urdu: isHindiLang ? 'اردو शायरी' : 'Urdu Poetry',
      awadhi: isHindiLang ? 'अवधी / ब्रज' : 'Awadhi / Braj',
      bilingual: isHindiLang ? 'द्विभाषी' : 'Bilingual'
    };
    const langLabel = langMap[p.language] || (p.language ? p.language.toUpperCase() : 'Poetry');

    const likesLabel = typeof I18n !== "undefined" ? I18n.t("poetry_card_likes") : "likes";
    const readBtnLabel = typeof I18n !== "undefined" ? I18n.t("poetry_card_read_recite") : "Read & Recite 🎙️";
    const saveTitle = isSaved ? (typeof I18n !== "undefined" ? I18n.t("poetry_card_unsave") : "Remove from Saved") : (typeof I18n !== "undefined" ? I18n.t("poetry_card_save") : "Save to Library");
    const yearMeta = p.year ? (isHindiLang ? 'रचना वर्ष: ' + p.year : 'Year: ' + p.year) : (isHindiLang ? 'काव्य गुरु रचनाकार' : 'Kavya Guru Member');

    let extraBadges = '';
    if (p.image_url) {
      extraBadges += `<span class="kg-card-badge image" title="Manuscript Image Attached">🖼️ ${isHindiLang ? 'पांडुलिपि' : 'Artwork'}</span>`;
    }
    if (p.pdf_url) {
      extraBadges += `<span class="kg-card-badge pdf" title="PDF Document Attached">📄 PDF</span>`;
    }

    return `
      <div class="kg-poetry-card" id="card-${p.id}">
        <div class="kg-poetry-header">
          <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
            <span class="kg-card-badge poetry">${langLabel} • ${p.category}</span>
            ${extraBadges}
          </div>
          <div style="display: flex; gap: 0.35rem;">
            <button class="kg-btn-icon" onclick="App.toggleSave('${p.id}')" title="${saveTitle}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="color: ${isSaved ? 'var(--kg-brand-accent)' : 'inherit'};">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button class="kg-btn-icon" onclick="App.toggleLike('${p.id}')" title="${isLiked ? 'Unlike' : 'Like'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="color: ${isLiked ? 'var(--kg-brand-rose)' : 'inherit'};">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>

        <h3 class="kg-card-title" style="cursor: pointer;" onclick="App.openPoemReader('${p.id}')">${p.title}</h3>

        <div class="kg-poet-meta">
          <div class="kg-poet-avatar">${(p.poet || 'KG').slice(0, 2)}</div>
          <div class="kg-poet-info">
            <h4>${p.poet}</h4>
            <span>${yearMeta}</span>
          </div>
        </div>

        <div class="kg-poetry-stanza ${p.language === 'hindi' ? 'hindi' : ''}" style="max-height: 140px; overflow: hidden; position: relative;">
          ${previewStanza}
        </div>

        <div class="kg-card-footer">
          <span>❤️ <b id="likes-count-${p.id}">${(p.likes || 0) + (isLiked ? 1 : 0)}</b> ${likesLabel}</span>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <button class="kg-btn kg-btn-sm kg-btn-accent" onclick="App.quickListenPoem('${p.id}', event)" title="Quick Listen / तुरंत वाचन सुनें">
              🎙️ ${isHindiLang ? 'सुनें' : 'Listen'}
            </button>
            <button class="kg-btn kg-btn-sm kg-btn-outline" onclick="App.openPoemReader('${p.id}')">
              ${readBtnLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  quickListenPoem(poemId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.openPoemReader(poemId);
    setTimeout(() => {
      UIManager.startRecitation();
    }, 280);
  },

  openPoemReader(poemId) {
    const poem = this.cachedPoems.find(p => p.id === poemId);
    if (!poem) return;

    this.activePoem = poem;
    const modal = document.getElementById("poemReaderModal");
    if (!modal) return;

    document.getElementById("poemReaderTitle").textContent = poem.title;
    document.getElementById("poemReaderPoet").textContent = `${poem.poet} • ${(poem.category || '').toUpperCase()} ${poem.year ? `(${poem.year})` : ''}`;

    // Handle Manuscript / Image Attachment display
    const imgWrap = document.getElementById("poemReaderImageWrap");
    const imgElem = document.getElementById("poemReaderImage");
    if (imgWrap && imgElem) {
      if (poem.image_url) {
        imgElem.src = poem.image_url;
        imgWrap.classList.remove("kg-hidden");
      } else {
        imgWrap.classList.add("kg-hidden");
      }
    }

    // Handle PDF Attachment display
    const pdfWrap = document.getElementById("poemReaderPdfWrap");
    const pdfBtn = document.getElementById("poemReaderPdfBtn");
    if (pdfWrap && pdfBtn) {
      if (poem.pdf_url) {
        pdfBtn.href = poem.pdf_url;
        pdfWrap.classList.remove("kg-hidden");
      } else {
        pdfWrap.classList.add("kg-hidden");
      }
    }

    // Initialize the comprehensive multilingual audio recitation studio
    UIManager.setupPoemReciteStudio(poem);

    UIManager.openModal("poemReaderModal");
  },

  openSubmitPoemModal() {
    UIManager.openModal("submitPoemModal");
  },

  async handleSubmitPoem(e) {
    e.preventDefault();
    const title = document.getElementById("poemInputTitle").value.trim();
    const poet = document.getElementById("poemInputPoet").value.trim() || StorageManager.getUser().name;
    const language = document.getElementById("poemInputLanguage").value;
    const category = document.getElementById("poemInputCategory").value;
    const stanza = document.getElementById("poemInputStanza").value.trim();
    const meaning = document.getElementById("poemInputMeaning").value.trim();

    if (!title || !stanza) {
      UIManager.showToast("Please enter title and poem verses", "warning");
      return;
    }

    const created = await ApiClient.createPoem({
      title,
      poet,
      language,
      category,
      stanza,
      meaning: meaning || "Poem submitted on Kavya Manch."
    });

    if (created && created.id) {
      this.cachedPoems.unshift(created);
      UIManager.showToast("Your poem was saved to the database! 🎉", "success");
    }

    UIManager.closeModal("submitPoemModal");
    this.renderPoetrySection("all");
    this.renderHomeFeatured();
    Router.navigate("poetry");
    document.getElementById("submitPoemForm").reset();
  },

  async toggleLike(itemId) {
    const res = StorageManager.toggleLikePoem(itemId);
    const countEl = document.getElementById(`likes-count-${itemId}`);
    if (countEl) {
      let current = parseInt(countEl.textContent, 10);
      countEl.textContent = res.isLiked ? current + 1 : Math.max(0, current - 1);
    }

    if (res.isLiked) {
      await ApiClient.likePoem(itemId);
    }
    UIManager.showToast(res.isLiked ? "Saved like to database ❤️" : "Removed like", "info");
  },

  async toggleSave(itemId) {
    const res = StorageManager.toggleSaveItem(itemId);
    const user = StorageManager.getUser();
    if (user && user.email) {
      await ApiClient.toggleSaveItem(user.email, itemId);
    }

    UIManager.showToast(res.isSaved ? "Saved to your library 🔖" : "Removed from Library", "info");
    this.renderPoetrySection();
    this.renderNotesSection();
  },

  // ------------------------------------------------------------------------
  // 3. Educational Notes Vault
  // ------------------------------------------------------------------------
  renderNotesSection(filter = "all") {
    const grid = document.getElementById("notesGrid");
    if (!grid) return;

    let filtered = this.cachedNotes;
    if (filter === "hindi") {
      filtered = this.cachedNotes.filter(n => (n.subject || '').includes("Hindi") || (n.subject || '').includes("हिंदी"));
    } else if (filter === "english") {
      filtered = this.cachedNotes.filter(n => (n.subject || '').includes("English"));
    } else if (filter === "exam") {
      filtered = this.cachedNotes.filter(n => (n.grade || '').includes("CUET") || (n.grade || '').includes("Exam"));
    }

    if (filtered.length === 0) {
      const emptyTitle = typeof I18n !== "undefined" ? I18n.t("notes_empty_title") : "No Study Notes in this Category Yet";
      const emptyDesc = typeof I18n !== "undefined" ? I18n.t("notes_empty_desc") : "Faculty notes for Hindi, English and exam prep will appear here.";
      grid.innerHTML = `
        <div class="kg-empty-state" style="grid-column: 1 / -1;">
          <div class="kg-empty-icon">📚</div>
          <h3 class="kg-empty-title">${emptyTitle}</h3>
          <p class="kg-empty-desc">${emptyDesc}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(n => this.createNoteCardHtml(n)).join("");
  },

  createNoteCardHtml(n) {
    const isSaved = StorageManager.getSavedItems().includes(n.id);
    const isHindiLang = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    const downloadBtnLabel = typeof I18n !== "undefined" ? I18n.t("note_card_download_btn") : "Download PDF 📥";
    const readBtnLabel = typeof I18n !== "undefined" ? I18n.t("note_card_read_btn") : "Read Chapter 📖";
    const saveTitle = isSaved ? (typeof I18n !== "undefined" ? I18n.t("poetry_card_unsave") : "Saved in library") : (typeof I18n !== "undefined" ? I18n.t("poetry_card_save") : "Save note");

    return `
      <div class="kg-notes-card" id="card-${n.id}">
        <div>
          <div class="kg-card-header">
            <span class="kg-card-badge notes">${n.subject}</span>
            <button class="kg-btn-icon" onclick="App.toggleSave('${n.id}')" title="${saveTitle}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="color: ${isSaved ? 'var(--kg-brand-secondary)' : 'inherit'};">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <h3 class="kg-card-title" style="cursor: pointer;" onclick="App.openNoteDetails('${n.id}')">${n.title}</h3>
          <p class="kg-card-body">${n.summary}</p>

          <div class="kg-notes-tags">
            <span class="kg-note-pill">⏱️ ${n.read_time || n.readTime || (isHindiLang ? '10 मिनट' : '10 min')}</span>
            <span class="kg-note-pill">🎓 ${n.grade || (isHindiLang ? 'सभी कक्षाएं' : 'All Classes')}</span>
            <span class="kg-note-pill">📥 ${(n.downloads || 0).toLocaleString()} ${isHindiLang ? 'पाठक' : 'readers'}</span>
          </div>
        </div>

        <div class="kg-card-footer">
          <button class="kg-btn kg-btn-sm kg-btn-secondary" onclick="App.downloadNotePdf('${n.id}')">
            ${downloadBtnLabel}
          </button>
          <button class="kg-btn kg-btn-sm kg-btn-primary" onclick="App.openNoteDetails('${n.id}')">
            ${readBtnLabel}
          </button>
        </div>
      </div>
    `;
  },

  openNoteDetails(noteId) {
    const note = this.cachedNotes.find(n => n.id === noteId);
    if (!note) return;

    this.activeNote = note;
    const modal = document.getElementById("noteViewerModal");
    if (!modal) return;

    document.getElementById("noteViewerTitle").textContent = note.title;
    document.getElementById("noteViewerSubject").textContent = `${note.subject} • ${note.grade || ''}`;
    document.getElementById("noteViewerSummary").textContent = note.summary;

    const chapters = note.chapters || [];
    const chaptersContainer = document.getElementById("noteViewerChapters");
    if (chaptersContainer) {
      chaptersContainer.innerHTML = chapters.map(c => `
        <li style="padding: 0.4rem 0; color: var(--kg-text-primary); font-weight: 500;">${c}</li>
      `).join("");
    }

    const keyPoints = note.keyPoints || [];
    const keyPointsContainer = document.getElementById("noteViewerKeyPoints");
    if (keyPointsContainer) {
      keyPointsContainer.innerHTML = keyPoints.map(kp => `
        <div style="background: var(--kg-bg-muted); padding: 0.6rem 0.9rem; border-radius: var(--kg-radius-md); font-size: 0.9rem; color: var(--kg-text-secondary); border-left: 3px solid var(--kg-brand-secondary);">
          ✦ ${kp}
        </div>
      `).join("");
    }

    UIManager.openModal("noteViewerModal");
  },

  downloadNotePdf(noteId) {
    const note = this.cachedNotes.find(n => n.id === noteId);
    if (!note) return;
    const isHindi = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    UIManager.showToast(isHindi ? `"${note.title}" की अध्ययन सामग्री तैयार हो रही है...` : `Generating Kavya Guru study sheet for "${note.title}"...`, "info");
    setTimeout(() => {
      UIManager.showToast(isHindi ? "काव्य गुरु अध्ययन सामग्री तैयार है! 📄" : "Kavya Guru study sheet ready! 📄", "success");
    }, 1000);
  },

  // ------------------------------------------------------------------------
  // 4. YouTube Learning Hub (OPENS DIRECTLY ON YOUTUBE IN NEW TAB)
  // ------------------------------------------------------------------------
  renderVideosSection(filter = "all") {
    const grid = document.getElementById("videosGrid");
    if (!grid) return;

    let filtered = this.cachedVideos;
    if (filter !== "all") {
      filtered = this.cachedVideos.filter(v => (v.category || '').toLowerCase().includes(filter.toLowerCase()));
    }

    if (filtered.length === 0) {
      const emptyTitle = typeof I18n !== "undefined" ? I18n.t("videos_empty_title") : "No YouTube Lectures Added Yet";
      const emptyDesc = typeof I18n !== "undefined" ? I18n.t("videos_empty_desc") : "Curated YouTube video lectures will be listed here.";
      const channelBtn = typeof I18n !== "undefined" ? I18n.t("videos_channel_btn") : "▶️ Visit Official Kavya Guru YouTube Channel ↗";
      grid.innerHTML = `
        <div class="kg-empty-state" style="grid-column: 1 / -1;">
          <div class="kg-empty-icon" style="background: var(--kg-brand-rose-light); color: var(--kg-brand-rose);">▶️</div>
          <h3 class="kg-empty-title">${emptyTitle}</h3>
          <p class="kg-empty-desc">${emptyDesc}</p>
          <a href="https://youtube.com/@KavyaGuru" target="_blank" rel="noopener noreferrer" class="kg-btn kg-btn-outline" style="border-color: #ff0000; color: #ff0000 !important;">
            ${channelBtn}
          </a>
        </div>
      `;
      return;
    }

    const isHindiLang = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    const watchLabel = typeof I18n !== "undefined" ? I18n.t("video_watch_btn") : "Watch on YouTube ↗";

    grid.innerHTML = filtered.map(v => {
      const ytUrl = v.youtube_url || (v.youtube_id ? `https://www.youtube.com/watch?v=${v.youtube_id}` : 'https://youtube.com/@KavyaGuru');
      return `
        <a href="${ytUrl}" target="_blank" rel="noopener noreferrer" class="kg-video-card" title="${v.title}">
          <div class="kg-video-thumb-wrap">
            <img src="${v.thumbnail}" alt="${v.title}" loading="lazy" />
            <div class="kg-video-play-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <span class="kg-video-yt-badge">YouTube ↗</span>
            <span class="kg-video-duration">${v.duration || (isHindiLang ? 'लेक्चर' : 'Lecture')}</span>
          </div>

          <div class="kg-video-info">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="kg-card-badge video">${v.category || 'General'}</span>
              <span style="font-size: 0.78rem; color: var(--kg-text-tertiary);">${isHindiLang ? 'यूट्यूब पर खुलेगा ↗' : 'Opens on YouTube ↗'}</span>
            </div>

            <h3 class="kg-card-title" style="font-size: 1.05rem;">${v.title}</h3>
            <p style="font-size: 0.85rem; color: var(--kg-text-secondary); line-height: 1.5;">${v.description || ''}</p>

            <div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--kg-border); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.82rem; font-weight: 600; color: var(--kg-brand-primary);">${v.channel || 'Kavya Guru'}</span>
              <span class="kg-btn kg-btn-sm" style="background: #ff0000; color: #ffffff; border-radius: var(--kg-radius-md);">
                ${watchLabel}
              </span>
            </div>
          </div>
        </a>
      `;
    }).join("");
  },

  // ------------------------------------------------------------------------
  // 5. Live Google Meet Courses
  // ------------------------------------------------------------------------
  renderMeetCourses() {
    const grid = document.getElementById("meetCoursesGrid");
    if (!grid) return;

    if (this.cachedCourses.length === 0) {
      const emptyTitle = typeof I18n !== "undefined" ? I18n.t("courses_empty_title") : "No Live Google Meet Courses Scheduled";
      const emptyDesc = typeof I18n !== "undefined" ? I18n.t("courses_empty_desc") : "Upcoming weekend batches will be listed here.";
      grid.innerHTML = `
        <div class="kg-empty-state" style="grid-column: 1 / -1;">
          <div class="kg-empty-icon" style="background: var(--kg-brand-accent-light); color: var(--kg-brand-accent-hover);">🎥</div>
          <h3 class="kg-empty-title">${emptyTitle}</h3>
          <p class="kg-empty-desc">${emptyDesc}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.cachedCourses.map(c => this.createMeetCardHtml(c)).join("");
  },

  createMeetCardHtml(c) {
    const isEnrolled = StorageManager.getEnrolledCourses().includes(c.id);
    const seatsTotal = c.seats_total || c.seatsTotal || 50;
    const seatsBooked = c.seats_booked || c.seatsBooked || 0;
    const seatsPct = Math.round((seatsBooked / seatsTotal) * 100);
    const highlights = c.highlights || [];
    const isHindiLang = typeof I18n !== "undefined" && I18n.getLang() === "hi";

    const seatsLabel = isHindiLang ? `आरक्षित सीटें (${seatsBooked}/${seatsTotal})` : `Seats Reserved (${seatsBooked}/${seatsTotal})`;
    const fullLabel = isHindiLang ? `${seatsPct}% भरी हुई` : `${seatsPct}% Full`;
    const learnHeading = isHindiLang ? "आप क्या सीखेंगे:" : "What You Learn:";
    const feeLabel = c.fee || (isHindiLang ? "छात्रों के लिए निःशुल्क" : "Free for Students");
    const enrollBtnLabel = isEnrolled ? (isHindiLang ? "🎥 गूगल मीट में जुड़ें" : "🎥 Join Google Meet") : (typeof I18n !== "undefined" ? I18n.t("course_reserve_btn") : "Enroll Free ✍️");

    return `
      <div class="kg-meet-card" id="card-${c.id}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="kg-card-badge meet">Google Meet • ${c.badge || (isHindiLang ? 'लाइव बैच' : 'Live Batch')}</span>
          <div class="kg-meet-live-indicator">
            <span class="kg-meet-live-dot"></span>
            ${c.status || (isHindiLang ? 'पंजीकरण जारी' : 'Active')}
          </div>
        </div>

        <div>
          <h3 class="kg-card-title">${c.title}</h3>
          <p style="font-size: 0.88rem; color: var(--kg-brand-primary); font-weight: 600; margin-bottom: 0.5rem;">👨‍🏫 ${c.instructor}</p>
        </div>

        <div class="kg-meet-schedule">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <div>
            <div>${c.date}</div>
            <div style="font-size: 0.8rem; color: var(--kg-text-tertiary);">${c.time}</div>
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.35rem; color: var(--kg-text-secondary);">
            <span>${seatsLabel}</span>
            <span style="font-weight: 700; color: var(--kg-brand-accent);">${fullLabel}</span>
          </div>
          <div class="kg-meet-seat-bar">
            <div class="kg-meet-seat-progress" style="width: ${seatsPct}%;"></div>
          </div>
        </div>

        ${highlights.length > 0 ? `
          <div style="background: var(--kg-bg-muted); border-radius: var(--kg-radius-md); padding: 0.75rem 1rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--kg-text-secondary); text-transform: uppercase; margin-bottom: 0.4rem;">${learnHeading}</div>
            <ul style="list-style: none; font-size: 0.84rem; color: var(--kg-text-secondary); display: flex; flex-direction: column; gap: 0.3rem;">
              ${highlights.slice(0, 2).map(h => `<li>✓ ${h}</li>`).join("")}
            </ul>
          </div>
        ` : ''}

        <div class="kg-card-footer" style="padding-top: 0.75rem;">
          <span style="font-size: 0.9rem; font-weight: 700; color: var(--kg-brand-emerald);">${feeLabel}</span>
          ${isEnrolled ? `
            <a href="${c.meet_link || c.meetLink}" target="_blank" rel="noopener noreferrer" class="kg-btn kg-btn-sm kg-btn-accent" style="text-decoration: none;">
              ${enrollBtnLabel}
            </a>
          ` : `
            <button class="kg-btn kg-btn-sm kg-btn-primary" onclick="App.openMeetRsvpModal('${c.id}')">
              ${enrollBtnLabel}
            </button>
          `}
        </div>
      </div>
    `;
  },

  openMeetRsvpModal(courseId) {
    const course = this.cachedCourses.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.getElementById("meetRsvpModal");
    if (!modal) return;

    const isHindi = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    document.getElementById("meetRsvpTitle").textContent = course.title;
    document.getElementById("meetRsvpInstructor").textContent = isHindi ? `मार्गदर्शक: ${course.instructor}` : `Conducted by ${course.instructor}`;
    document.getElementById("meetRsvpTiming").textContent = `${course.date} • ${course.time}`;
    document.getElementById("meetRsvpCourseId").value = course.id;

    UIManager.openModal("meetRsvpModal");
  },

  async handleMeetRsvpSubmit(e) {
    e.preventDefault();
    const courseId = document.getElementById("meetRsvpCourseId").value;
    const studentName = document.getElementById("meetRsvpName").value.trim();
    const studentEmail = document.getElementById("meetRsvpEmail").value.trim();

    if (!studentName || !studentEmail) {
      UIManager.showToast(typeof I18n !== "undefined" && I18n.getLang() === "hi" ? "कृपया अपना नाम और ईमेल दर्ज करें" : "Please provide your name and email", "warning");
      return;
    }

    await ApiClient.rsvpCourse(courseId, studentName, studentEmail);
    StorageManager.enrollInCourse(courseId);
    UIManager.closeModal("meetRsvpModal");
    const isHindi = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    UIManager.showToast(isHindi ? `बधाई ${studentName}! गूगल मीट में आपकी सीट सुरक्षित हो गई। 🎉` : `Congratulations ${studentName}! Your Meet seat is confirmed in the database.`, "success");

    const updatedCourses = await ApiClient.getCourses();
    if (Array.isArray(updatedCourses)) this.cachedCourses = updatedCourses;

    this.renderMeetCourses();
    this.renderProfileView();
  },

  // ------------------------------------------------------------------------
  // 6. Career Guidance & Roadmaps
  // ------------------------------------------------------------------------
  renderCareersSection() {
    const grid = document.getElementById("careerRoadmapsGrid");
    if (!grid) return;

    const isHindi = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    const compLabel = typeof I18n !== "undefined" ? I18n.t("career_avg_package") : "Avg. Compensation:";
    const roadmapHeading = typeof I18n !== "undefined" ? I18n.t("career_roadmap_steps") : "Strategic Roadmap:";
    const mentorBtnLabel = typeof I18n !== "undefined" ? I18n.t("career_mentorship_btn") : "Book 1-on-1 Guidance Session 🎯";

    grid.innerHTML = this.cachedCareers.map(c => {
      const title = (isHindi && c.title_hi) ? c.title_hi : c.title;
      const category = (isHindi && c.category_hi) ? c.category_hi : c.category;
      const salary = (isHindi && c.averageSalary_hi) ? c.averageSalary_hi : (c.avg_salary || c.averageSalary);
      const demand = (isHindi && c.demand_hi) ? c.demand_hi : c.demand;
      const desc = (isHindi && c.description_hi) ? c.description_hi : c.description;
      const roadmap = (isHindi && c.roadmap_hi) ? c.roadmap_hi : (c.roadmap || []);
      const skills = (isHindi && c.topSkills_hi) ? c.topSkills_hi : (c.topSkills || []);

      return `
        <div class="kg-career-path-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="kg-card-badge career">${category}</span>
            <span class="kg-accent-pill">${demand}</span>
          </div>

          <h3 class="kg-card-title">${title}</h3>
          <p style="font-size: 0.9rem; color: var(--kg-text-secondary); line-height: 1.5;">${desc}</p>

          <div style="font-size: 0.85rem; font-weight: 700; color: var(--kg-brand-emerald);">
            💰 ${compLabel} ${salary}
          </div>

          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--kg-text-secondary); text-transform: uppercase; margin-bottom: 0.5rem;">${roadmapHeading}</div>
            <div class="kg-roadmap-steps">
              ${roadmap.map(step => `<div class="kg-roadmap-step">${step}</div>`).join("")}
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.5rem;">
            ${skills.map(s => `<span class="kg-note-pill">✦ ${s}</span>`).join("")}
          </div>

          <div class="kg-card-footer" style="padding-top: 1rem;">
            <button class="kg-btn kg-btn-sm kg-btn-primary" style="width: 100%;" onclick="App.openMentorshipBooking('${title.replace(/'/g, "\\'")}')">
              ${mentorBtnLabel}
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  openMentorshipBooking(careerTitle) {
    const modal = document.getElementById("mentorshipModal");
    if (!modal) return;
    document.getElementById("mentorshipCareerInput").value = careerTitle;
    UIManager.openModal("mentorshipModal");
  },

  async handleMentorshipSubmit(e) {
    e.preventDefault();
    const studentName = document.getElementById("mentorshipName").value;
    const careerDomain = document.getElementById("mentorshipCareerInput").value;

    await ApiClient.bookMentorship({
      studentName,
      careerDomain,
      classDegree: "College / Exam Prep",
      questions: "Seeking career direction"
    });

    UIManager.closeModal("mentorshipModal");
    UIManager.showToast(`Thank you ${studentName}! Your session for "${careerDomain}" is stored in database.`, "success");
  },

  openCareerQuiz() {
    UIManager.openModal("careerQuizModal");
  },

  handleCareerQuizSubmit(e) {
    e.preventDefault();
    const q1 = document.querySelector('input[name="quiz_q1"]:checked')?.value;
    let recommendation = "Creative Writing & Content Strategy";
    if (q1 === "teaching") recommendation = "Literature Educator & Academic Researcher";
    if (q1 === "civil") recommendation = "Civil Services & Public Administration (UPSC)";

    document.getElementById("quizResultBox").classList.remove("kg-hidden");
    document.getElementById("quizResultTitle").textContent = recommendation;
    UIManager.showToast("Your Kavya Guru Career Pathway match is ready!", "success");
  },

  // ------------------------------------------------------------------------
  // 7. Student Community (Kavya Guru Charcha)
  // ------------------------------------------------------------------------
  renderCommunitySection() {
    const container = document.getElementById("communityThreadsList");
    if (!container) return;

    const isHindi = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    if (this.cachedThreads.length === 0) {
      const emptyTitle = typeof I18n !== "undefined" ? I18n.t("community_empty_title") : "Be The First To Start A Discussion";
      const emptyDesc = typeof I18n !== "undefined" ? I18n.t("community_empty_desc") : "Share an original verse, ask an academic question, or form a study circle with peers on Kavya Guru Charcha.";
      const emptyBtn = typeof I18n !== "undefined" ? I18n.t("community_new_btn") : "Start Discussion ✍️";
      container.innerHTML = `
        <div class="kg-empty-state">
          <div class="kg-empty-icon">💬</div>
          <h3 class="kg-empty-title">${emptyTitle}</h3>
          <p class="kg-empty-desc">${emptyDesc}</p>
          <button class="kg-btn kg-btn-primary" onclick="App.openNewThreadModal()">${emptyBtn}</button>
        </div>
      `;
      return;
    }

    const likesWord = isHindi ? "पसंद" : "Likes";
    const repliesWord = isHindi ? "उत्तर" : "Replies";
    const shareWord = isHindi ? "साझा करें" : "Share";
    const responsesHeading = isHindi ? "समुदाय की प्रतिक्रियाएं:" : "Community Responses:";

    container.innerHTML = this.cachedThreads.map(th => `
      <div class="kg-thread-card" id="thread-${th.id}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="kg-poet-avatar" style="background: var(--kg-brand-primary-light); color: var(--kg-brand-primary); font-weight: bold;">
              ${th.avatar || (th.author || 'KG').slice(0, 2)}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--kg-text-primary);">${th.author}</div>
              <div style="font-size: 0.78rem; color: var(--kg-text-tertiary);">${th.role || (isHindi ? 'विद्यार्थी' : 'Student')} • ${th.created_at ? (isHindi ? 'सक्रिय' : 'Active') : (isHindi ? 'हाल ही में' : 'Recent')}</div>
            </div>
          </div>
          <span class="kg-card-badge poetry">${th.tag}</span>
        </div>

        <h3 class="kg-card-title" style="font-size: 1.15rem;">${th.title}</h3>
        <p style="font-size: 0.95rem; color: var(--kg-text-secondary); white-space: pre-line; line-height: 1.6;">${th.content}</p>

        ${th.comments && th.comments.length > 0 ? `
          <div style="background: var(--kg-bg-muted); border-radius: var(--kg-radius-md); padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--kg-text-tertiary); text-transform: uppercase;">${responsesHeading}</div>
            ${th.comments.map(c => `
              <div style="font-size: 0.86rem; border-left: 2px solid var(--kg-brand-primary); padding-left: 0.6rem;">
                <b style="color: var(--kg-text-primary);">${c.author}:</b> <span style="color: var(--kg-text-secondary);">${c.text}</span>
              </div>
            `).join("")}
          </div>
        ` : ''}

        <div class="kg-thread-actions">
          <button class="kg-thread-act-btn" onclick="App.likeThread('${th.id}')">
            ❤️ <span id="thread-likes-${th.id}">${th.likes || 0}</span> ${likesWord}
          </button>
          <button class="kg-thread-act-btn" onclick="App.openReplyPrompt('${th.id}')">
            💬 ${th.comments ? th.comments.length : 0} ${repliesWord}
          </button>
          <button class="kg-thread-act-btn" onclick="App.shareItem('${th.title}')">
            🔗 ${shareWord}
          </button>
        </div>
      </div>
    `).join("");
  },

  async likeThread(threadId) {
    const likesEl = document.getElementById(`thread-likes-${threadId}`);
    if (likesEl) {
      likesEl.textContent = parseInt(likesEl.textContent, 10) + 1;
    }
    await ApiClient.likeThread(threadId);
    UIManager.showToast("Thank you for supporting fellow students! 👏", "info");
  },

  async openReplyPrompt(threadId) {
    const replyText = prompt("Write your response to this Kavya Guru discussion:");
    if (!replyText || !replyText.trim()) return;

    const user = StorageManager.getUser();
    await ApiClient.addComment(threadId, {
      author: user.name,
      text: replyText.trim()
    });

    UIManager.showToast("Comment added to discussion in database! 💬", "success");
    const updatedThreads = await ApiClient.getCommunity();
    if (Array.isArray(updatedThreads)) this.cachedThreads = updatedThreads;
    this.renderCommunitySection();
  },

  openNewThreadModal() {
    UIManager.openModal("newThreadModal");
  },

  async handleCreateThread(e) {
    e.preventDefault();
    const title = document.getElementById("threadInputTitle").value.trim();
    const tag = document.getElementById("threadInputTag").value;
    const content = document.getElementById("threadInputContent").value.trim();
    const user = StorageManager.getUser();

    if (!title || !content) {
      UIManager.showToast("Please provide topic title and description", "warning");
      return;
    }

    const created = await ApiClient.createThread({
      author: user.name,
      role: user.role,
      avatar: user.avatar,
      tag,
      title,
      content
    });

    if (created && created.id) {
      this.cachedThreads.unshift(created);
    }

    UIManager.closeModal("newThreadModal");
    UIManager.showToast("Discussion posted to Kavya Guru Charcha! 🌟", "success");
    this.renderCommunitySection();
    document.getElementById("newThreadForm").reset();
  },

  shareItem(title) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title} - Kavya Guru: https://kavyaguru.com`);
      UIManager.showToast("Link copied to clipboard! Share with peers 📤", "success");
    } else {
      UIManager.showToast("Share via Kavya Guru Community 📤", "info");
    }
  },

  // ------------------------------------------------------------------------
  // 8. Notifications & Email Preview Drawer
  // ------------------------------------------------------------------------
  openNotificationsDrawer() {
    const listContainer = document.getElementById("notifDrawerList");
    if (listContainer) {
      const notifs = [
        {
          id: "notif-01",
          title: "Welcome to Kavya Guru",
          message: "Read • Learn • Grow. Explore poetry, study notes and live workshops.",
          time: "Just now",
          unread: false
        }
      ];
      listContainer.innerHTML = notifs.map(n => `
        <div style="padding: 0.85rem 1rem; border-radius: var(--kg-radius-md); background: var(--kg-bg-muted); border-left: 3px solid var(--kg-brand-primary); display: flex; flex-direction: column; gap: 0.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <b style="font-size: 0.9rem; color: var(--kg-text-primary);">${n.title}</b>
            <span style="font-size: 0.75rem; color: var(--kg-text-tertiary);">${n.time}</span>
          </div>
          <div style="font-size: 0.84rem; color: var(--kg-text-secondary);">${n.message}</div>
        </div>
      `).join("");
    }

    UIManager.openModal("notificationsDrawerModal");
  },

  openEmailPreview(emailId) {
    const tmpl = KAVYA_GURU_EMAIL_TEMPLATES.find(e => e.id === emailId) || KAVYA_GURU_EMAIL_TEMPLATES[0];
    const previewContainer = document.getElementById("emailPreviewContainer");
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div style="border: 1px solid var(--kg-border); border-radius: var(--kg-radius-md); overflow: hidden;">
          <div style="background: var(--kg-bg-muted); padding: 0.75rem 1rem; font-size: 0.82rem; border-bottom: 1px solid var(--kg-border);">
            <div><strong>From:</strong> ${tmpl.sender}</div>
            <div><strong>Subject:</strong> ${tmpl.subject}</div>
          </div>
          <div style="padding: 1rem; background: var(--kg-bg-surface);">
            ${tmpl.bodyHtml}
          </div>
        </div>
      `;
    }
    UIManager.openModal("emailPreviewModal");
  },

  // ------------------------------------------------------------------------
  // 9. User Profile View
  // ------------------------------------------------------------------------
  async renderProfileView() {
    const user = StorageManager.getUser();
    if (!user) return;

    document.getElementById("profileName").textContent = user.name || "Student";
    document.getElementById("profileRole").textContent = user.role || "Student Member";
    document.getElementById("profileEmail").textContent = user.email || "student@kavyaguru.com";
    document.getElementById("profileAvatar").textContent = user.avatar || "KG";
    document.getElementById("profileStreakDays").textContent = `${user.streakDays || 1} Days`;

    // Fetch user profile from database
    const dbProfile = await ApiClient.getUserProfile(user.email || 'student@kavyaguru.com');
    const savedIds = (dbProfile && dbProfile.savedItems) || StorageManager.getSavedItems();

    const isHindi = typeof I18n !== "undefined" && I18n.getLang() === "hi";
    const savedContainer = document.getElementById("profileSavedList");
    if (savedContainer) {
      if (savedIds.length === 0) {
        savedContainer.innerHTML = `
          <div class="kg-empty-state" style="padding: 2rem 1rem;">
            <div class="kg-empty-icon" style="width: 48px; height: 48px;">🔖</div>
            <h4 class="kg-empty-title" style="font-size: 1rem;">${isHindi ? "आपकी काव्य गुरु लाइब्रेरी अभी खाली है" : "Your Kavya Guru library is empty"}</h4>
            <p class="kg-empty-desc" style="font-size: 0.85rem;">${isHindi ? "कविताएं या अध्ययन नोट्स ब्राउज़ करें और उन्हें सहेजने के लिए बुकमार्क आइकन पर टैप करें।" : "Browse poems or educational notes and tap the bookmark icon to save them here."}</p>
          </div>
        `;
      } else {
        const allItems = [...this.cachedPoems, ...this.cachedNotes];
        const matched = allItems.filter(item => savedIds.includes(item.id));
        savedContainer.innerHTML = `
          <div class="kg-grid-2">
            ${matched.map(item => `
              <div style="background: var(--kg-bg-surface); border: 1px solid var(--kg-border); border-radius: var(--kg-radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">${item.title}</h4>
                  <span style="font-size: 0.78rem; color: var(--kg-text-tertiary);">${item.poet ? (isHindi ? 'रचनाकार: ' + item.poet : 'Poetry by ' + item.poet) : item.subject}</span>
                </div>
                <button class="kg-btn kg-btn-sm kg-btn-outline" onclick="${item.poet ? `App.openPoemReader('${item.id}')` : `App.openNoteDetails('${item.id}')`}">${isHindi ? "खोलें" : "Open"}</button>
              </div>
            `).join("")}
          </div>
        `;
      }
    }

    // Enrolled Courses
    const enrolledIds = (dbProfile && dbProfile.enrolledCourses) || StorageManager.getEnrolledCourses();
    const coursesContainer = document.getElementById("profileCoursesList");
    if (coursesContainer) {
      const enrolledCourses = this.cachedCourses.filter(c => enrolledIds.includes(c.id));
      if (enrolledCourses.length === 0) {
        coursesContainer.innerHTML = `
          <div class="kg-empty-state" style="padding: 2rem 1rem;">
            <div class="kg-empty-icon" style="width: 48px; height: 48px;">🎥</div>
            <h4 class="kg-empty-title" style="font-size: 1rem;">${isHindi ? "अभी तक कोई गूगल मीट कोर्स नहीं चुना" : "No Live Google Meet Courses Yet"}</h4>
            <p class="kg-empty-desc" style="font-size: 0.85rem;">${isHindi ? "हमारे निःशुल्क काव्य लेखन या शैक्षिक मास्टरक्लास में नामांकन करें।" : "Enroll in our free poetry writing or academic masterclasses."}</p>
            <button class="kg-btn kg-btn-sm kg-btn-primary" onclick="Router.navigate('courses')">${isHindi ? "लाइव बैच देखें" : "Explore Live Batches"}</button>
          </div>
        `;
      } else {
        coursesContainer.innerHTML = `
          <div class="kg-grid-2">
            ${enrolledCourses.map(c => `
              <div style="background: var(--kg-bg-surface); border: 1px solid var(--kg-border); border-radius: var(--kg-radius-md); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span class="kg-card-badge meet">Google Meet</span>
                  <span class="kg-accent-pill">${isHindi ? "पुष्टि की गई" : "Confirmed"}</span>
                </div>
                <h4 style="font-size: 1rem;">${c.title}</h4>
                <div style="font-size: 0.82rem; color: var(--kg-text-secondary);">${c.date} • ${c.time}</div>
                <a href="${c.meet_link || c.meetLink}" target="_blank" rel="noopener noreferrer" class="kg-btn kg-btn-sm kg-btn-accent" style="text-decoration: none; text-align: center;">
                  🎥 ${isHindi ? "अभी गूगल मीट से जुड़ें" : "Join Live Class Now"}
                </a>
              </div>
            `).join("")}
          </div>
        `;
      }
    }
  },

  // ------------------------------------------------------------------------
  // 10. Admin Section & Dedicated Dashboard (Password: Ashish123)
  // ------------------------------------------------------------------------
  async handleAdminLogin(e) {
    e.preventDefault();
    const input = document.getElementById("adminPasswordInput");
    const errorEl = document.getElementById("adminLoginError");
    const password = input ? input.value.trim() : "";

    const res = await ApiClient.adminLogin(password);
    if (res && res.success) {
      StorageManager.setAdminSession(res.token);
      if (errorEl) errorEl.classList.add("kg-hidden");
      UIManager.showToast("Welcome Admin! Control Center Unlocked 🔓", "success");
      input.value = "";
      this.renderAdminDashboard();
    } else {
      if (errorEl) {
        errorEl.textContent = "Invalid Admin Password! Please try again.";
        errorEl.classList.remove("kg-hidden");
      }
      UIManager.showToast("Invalid password! Admin password is required.", "error");
    }
  },

  handleAdminLogout() {
    StorageManager.logoutAdmin();
    UIManager.showToast("Admin session ended successfully.", "info");
    this.renderAdminDashboard();
  },

  switchAdminSubTab(tabName, btnElem) {
    document.querySelectorAll(".kg-admin-subtab-content").forEach(c => c.classList.add("kg-hidden"));
    const target = document.getElementById(`adminTab-${tabName}`);
    if (target) target.classList.remove("kg-hidden");

    document.querySelectorAll(".kg-admin-tab-btn").forEach(b => b.classList.remove("active"));
    if (btnElem) btnElem.classList.add("active");
  },

  async renderAdminDashboard() {
    const isAuthed = StorageManager.isAdminLoggedIn();
    const gate = document.getElementById("adminLoginGate");
    const panel = document.getElementById("adminDashboardPanel");

    if (!isAuthed) {
      if (gate) gate.classList.remove("kg-hidden");
      if (panel) panel.classList.add("kg-hidden");
      return;
    }

    if (gate) gate.classList.add("kg-hidden");
    if (panel) panel.classList.remove("kg-hidden");

    // Fetch live aggregate statistics from database
    const stats = await ApiClient.getAdminStats();
    if (stats) {
      document.getElementById("adminStatPoems").textContent = (stats.poems || 0).toString();
      document.getElementById("adminStatNotes").textContent = (stats.notes || 0).toString();
      document.getElementById("adminStatVideos").textContent = (stats.videos || 0).toString();
      document.getElementById("adminStatMeet").textContent = (stats.meetCourses || 0).toString();
      document.getElementById("adminStatStudents").textContent = (stats.students || 0).toString();
    }

    // Refresh all admin tables
    this.renderAdminPoetryTable();
    this.renderAdminNotesTable();
    this.renderAdminVideosTable();
    this.renderAdminCoursesTable();
    this.renderAdminCommunityTable();
  },

  // Admin Attachment & Preview Handlers
  handleAdminPoemImageFile(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.pendingAdminPoemImageData = e.target.result;
      const previewImg = document.getElementById("adminPoemImagePreview");
      const previewWrap = document.getElementById("adminPoemImagePreviewWrap");
      if (previewImg) previewImg.src = e.target.result;
      if (previewWrap) previewWrap.classList.remove("kg-hidden");
    };
    reader.readAsDataURL(file);
  },

  clearAdminPoemImage() {
    this.pendingAdminPoemImageData = null;
    const fileInput = document.getElementById("adminPoemImageFile");
    if (fileInput) fileInput.value = "";
    const urlInput = document.getElementById("adminPoemImageUrl");
    if (urlInput) urlInput.value = "";
    const previewWrap = document.getElementById("adminPoemImagePreviewWrap");
    if (previewWrap) previewWrap.classList.add("kg-hidden");
    const previewImg = document.getElementById("adminPoemImagePreview");
    if (previewImg) previewImg.src = "";
  },

  handleAdminPoemPdfFile(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.pendingAdminPoemPdfData = e.target.result;
      const fileNameEl = document.getElementById("adminPoemPdfFileName");
      const previewWrap = document.getElementById("adminPoemPdfPreviewWrap");
      if (fileNameEl) fileNameEl.textContent = `📄 ${file.name} (${Math.round(file.size / 1024)} KB)`;
      if (previewWrap) previewWrap.classList.remove("kg-hidden");
    };
    reader.readAsDataURL(file);
  },

  clearAdminPoemPdf() {
    this.pendingAdminPoemPdfData = null;
    const fileInput = document.getElementById("adminPoemPdfFile");
    if (fileInput) fileInput.value = "";
    const urlInput = document.getElementById("adminPoemPdfUrl");
    if (urlInput) urlInput.value = "";
    const previewWrap = document.getElementById("adminPoemPdfPreviewWrap");
    if (previewWrap) previewWrap.classList.add("kg-hidden");
  },

  previewAdminVideoThumb(rawUrl) {
    const box = document.getElementById("adminVideoPreviewBox");
    const img = document.getElementById("adminVideoThumbImg");
    if (!box || !img) return;

    if (!rawUrl || !rawUrl.trim()) {
      box.classList.add("kg-hidden");
      return;
    }

    let vidId = null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = rawUrl.match(regExp);
    if (match && match[1]) {
      vidId = match[1];
    } else if (rawUrl.trim().length === 11 && !rawUrl.includes(".")) {
      vidId = rawUrl.trim();
    }

    if (vidId) {
      img.src = `https://img.youtube.com/vi/${vidId}/mqdefault.jpg`;
      box.classList.remove("kg-hidden");
    } else {
      box.classList.add("kg-hidden");
    }
  },

  // Admin Tables Rendering
  renderAdminPoetryTable() {
    const body = document.getElementById("adminPoetryTableBody");
    if (!body) return;
    if (this.cachedPoems.length === 0) {
      body.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--kg-text-tertiary);">No poems published yet. Add a poem above.</td></tr>`;
      return;
    }
    body.innerHTML = this.cachedPoems.map(p => {
      const attachments = [];
      if (p.image_url) attachments.push('<span class="kg-card-badge image" title="Artwork / Manuscript">🖼️ Image</span>');
      if (p.pdf_url) attachments.push('<span class="kg-card-badge pdf" title="PDF Document">📄 PDF</span>');
      if (p.stanza_trans) attachments.push('<span class="kg-card-badge translation" title="Translation Available">🌐 Trans</span>');
      const attachHtml = attachments.length > 0 ? attachments.join(" ") : `<span style="color: var(--kg-text-tertiary); font-size: 0.75rem;">None</span>`;

      return `
        <tr>
          <td><b>${p.title}</b> ${p.year ? `<small style="color: var(--kg-text-tertiary);">(${p.year})</small>` : ''}</td>
          <td>${p.poet}</td>
          <td><span class="kg-card-badge poetry">${p.language} • ${p.category}</span></td>
          <td>${attachHtml}</td>
          <td>${p.likes || 0} ❤️</td>
          <td>
            <button class="kg-btn kg-btn-sm" style="color: var(--kg-brand-rose); border: 1px solid var(--kg-brand-rose);" onclick="App.deleteAdminPoem('${p.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join("");
  },

  renderAdminNotesTable() {
    const body = document.getElementById("adminNotesTableBody");
    if (!body) return;
    if (this.cachedNotes.length === 0) {
      body.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--kg-text-tertiary);">No notes uploaded yet. Add notes above.</td></tr>`;
      return;
    }
    body.innerHTML = this.cachedNotes.map(n => `
      <tr>
        <td><b>${n.title}</b></td>
        <td>${n.subject}</td>
        <td>${n.grade || 'General'}</td>
        <td>
          <button class="kg-btn kg-btn-sm" style="color: var(--kg-brand-rose); border: 1px solid var(--kg-brand-rose);" onclick="App.deleteAdminNote('${n.id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  },

  renderAdminVideosTable() {
    const body = document.getElementById("adminVideosTableBody");
    if (!body) return;
    if (this.cachedVideos.length === 0) {
      body.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--kg-text-tertiary);">No YouTube videos added yet. Add a video above.</td></tr>`;
      return;
    }
    body.innerHTML = this.cachedVideos.map(v => `
      <tr>
        <td><b>${v.title}</b></td>
        <td>${v.channel}</td>
        <td><a href="${v.youtube_url}" target="_blank" rel="noopener noreferrer" style="color: var(--kg-brand-primary);">View on YouTube ↗</a></td>
        <td><span class="kg-card-badge video">${v.category}</span></td>
        <td>
          <button class="kg-btn kg-btn-sm" style="color: var(--kg-brand-rose); border: 1px solid var(--kg-brand-rose);" onclick="App.deleteAdminVideo('${v.id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  },

  renderAdminCoursesTable() {
    const body = document.getElementById("adminCoursesTableBody");
    if (!body) return;
    if (this.cachedCourses.length === 0) {
      body.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--kg-text-tertiary);">No Google Meet classes scheduled. Schedule one above.</td></tr>`;
      return;
    }
    body.innerHTML = this.cachedCourses.map(c => `
      <tr>
        <td><b>${c.title}</b></td>
        <td>${c.instructor}</td>
        <td>${c.date} • ${c.time}</td>
        <td>${c.seats_booked || 0}/${c.seats_total || 50}</td>
        <td>
          <button class="kg-btn kg-btn-sm" style="color: var(--kg-brand-rose); border: 1px solid var(--kg-brand-rose);" onclick="App.deleteAdminCourse('${c.id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  },

  renderAdminCommunityTable() {
    const body = document.getElementById("adminCommunityTableBody");
    if (!body) return;
    if (this.cachedThreads.length === 0) {
      body.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--kg-text-tertiary);">No community threads.</td></tr>`;
      return;
    }
    body.innerHTML = this.cachedThreads.map(th => `
      <tr>
        <td><b>${th.author}</b></td>
        <td>${th.title}</td>
        <td><span class="kg-card-badge poetry">${th.tag}</span></td>
        <td>${th.likes || 0}</td>
        <td>
          <button class="kg-btn kg-btn-sm" style="color: var(--kg-brand-rose); border: 1px solid var(--kg-brand-rose);" onclick="App.deleteAdminThread('${th.id}')">Remove</button>
        </td>
      </tr>
    `).join("");
  },

  // Admin Actions Execution
  async handleAdminAddPoem(e) {
    e.preventDefault();
    const title = document.getElementById("adminPoemTitle").value.trim();
    const poet = document.getElementById("adminPoemAuthor").value.trim();
    const language = document.getElementById("adminPoemLang").value;
    const year = (document.getElementById("adminPoemYear")?.value || "").trim();
    const category = document.getElementById("adminPoemCategory").value;
    const stanza = document.getElementById("adminPoemStanza").value.trim();
    const meaning = document.getElementById("adminPoemMeaning").value.trim();
    const stanza_trans = (document.getElementById("adminPoemStanzaTrans")?.value || "").trim();
    const meaning_trans = (document.getElementById("adminPoemMeaningTrans")?.value || "").trim();

    // Check image: local file upload (base64) takes priority, else direct URL input
    const directImageUrl = (document.getElementById("adminPoemImageUrl")?.value || "").trim();
    const image_url = this.pendingAdminPoemImageData || directImageUrl || null;

    // Check PDF: local file upload (base64) takes priority, else direct URL input
    const directPdfUrl = (document.getElementById("adminPoemPdfUrl")?.value || "").trim();
    const pdf_url = this.pendingAdminPoemPdfData || directPdfUrl || null;

    const payload = {
      title,
      poet,
      language,
      year,
      category,
      stanza,
      meaning,
      stanza_trans,
      meaning_trans,
      image_url,
      pdf_url
    };

    const created = await ApiClient.createPoem(payload);
    if (created && created.id) {
      this.cachedPoems.unshift(created);
      UIManager.showToast(`Published poem "${title}" with attachments to database! 📜`, "success");
      e.target.reset();
      this.clearAdminPoemImage();
      this.clearAdminPoemPdf();
      await this.renderAdminDashboard();
      this.renderPoetrySection();
      this.renderHomeFeatured();
    }
  },

  async deleteAdminPoem(poemId) {
    if (!confirm("Are you sure you want to delete this poem from the database?")) return;
    await ApiClient.deletePoem(poemId);
    this.cachedPoems = this.cachedPoems.filter(p => p.id !== poemId);
    UIManager.showToast("Poem deleted from database.", "info");
    await this.renderAdminDashboard();
    this.renderPoetrySection();
    this.renderHomeFeatured();
  },

  async handleAdminAddNote(e) {
    e.preventDefault();
    const title = document.getElementById("adminNoteTitle").value.trim();
    const subject = document.getElementById("adminNoteSubject").value.trim();
    const grade = document.getElementById("adminNoteGrade").value.trim();
    const summary = document.getElementById("adminNoteSummary").value.trim();

    const created = await ApiClient.createNote({ title, subject, grade, summary });
    if (created && created.id) {
      this.cachedNotes.unshift(created);
      UIManager.showToast(`Saved note "${title}" to database! 📚`, "success");
      e.target.reset();
      await this.renderAdminDashboard();
      this.renderNotesSection();
    }
  },

  async deleteAdminNote(noteId) {
    if (!confirm("Are you sure you want to delete this note?")) return;
    await ApiClient.deleteNote(noteId);
    this.cachedNotes = this.cachedNotes.filter(n => n.id !== noteId);
    UIManager.showToast("Note deleted from database.", "info");
    await this.renderAdminDashboard();
    this.renderNotesSection();
  },

  async handleAdminAddVideo(e) {
    e.preventDefault();
    const title = document.getElementById("adminVideoTitle").value.trim();
    const url = document.getElementById("adminVideoUrl").value.trim();
    const channel = document.getElementById("adminVideoChannel").value.trim();
    const duration = document.getElementById("adminVideoDuration").value.trim();
    const category = document.getElementById("adminVideoCategory").value;
    const description = document.getElementById("adminVideoDesc").value.trim();

    const created = await ApiClient.createVideo({ title, url, channel, duration, category, description });
    if (created && created.id) {
      this.cachedVideos.unshift(created);
      UIManager.showToast(`Added YouTube video "${title}" to database! ▶️`, "success");
      e.target.reset();
      this.previewAdminVideoThumb("");
      await this.renderAdminDashboard();
      this.renderVideosSection();
    }
  },

  async deleteAdminVideo(videoId) {
    if (!confirm("Are you sure you want to delete this video from catalog?")) return;
    await ApiClient.deleteVideo(videoId);
    this.cachedVideos = this.cachedVideos.filter(v => v.id !== videoId);
    UIManager.showToast("Video removed from database.", "info");
    await this.renderAdminDashboard();
    this.renderVideosSection();
  },

  async handleAdminAddCourse(e) {
    e.preventDefault();
    const title = document.getElementById("adminCourseTitle").value.trim();
    const meetLink = document.getElementById("adminCourseMeetLink").value.trim();
    const instructor = document.getElementById("adminCourseInstructor").value.trim();
    const date = document.getElementById("adminCourseDate").value.trim();
    const time = document.getElementById("adminCourseTime").value.trim();
    const seatsTotal = parseInt(document.getElementById("adminCourseSeats")?.value || "50", 10);
    const badge = document.getElementById("adminCourseBadge")?.value || "Live Masterclass";
    const fee = document.getElementById("adminCourseFee")?.value || "Free for Students";
    const highlightsRaw = document.getElementById("adminCourseHighlights")?.value || "";
    const highlights = highlightsRaw ? highlightsRaw.split(",").map(h => h.trim()).filter(Boolean) : ["Live Q&A", "Personal Verse Feedback"];

    const payload = {
      title,
      meetLink,
      instructor,
      date,
      time,
      seatsTotal,
      badge,
      fee,
      highlights
    };

    const created = await ApiClient.createCourse(payload);
    if (created && created.id) {
      this.cachedCourses.unshift(created);
      UIManager.showToast(`Scheduled Google Meet course "${title}" at ${date} ${time}! 🎥`, "success");
      e.target.reset();
      await this.renderAdminDashboard();
      this.renderMeetCourses();
    }
  },

  async deleteAdminCourse(courseId) {
    if (!confirm("Are you sure you want to cancel this Google Meet batch?")) return;
    await ApiClient.deleteCourse(courseId);
    this.cachedCourses = this.cachedCourses.filter(c => c.id !== courseId);
    UIManager.showToast("Course removed from database.", "info");
    await this.renderAdminDashboard();
    this.renderMeetCourses();
  },

  async deleteAdminThread(threadId) {
    if (!confirm("Are you sure you want to remove this community discussion?")) return;
    await ApiClient.deleteThread(threadId);
    this.cachedThreads = this.cachedThreads.filter(th => th.id !== threadId);
    UIManager.showToast("Thread removed from database.", "info");
    await this.renderAdminDashboard();
    this.renderCommunitySection();
  },

  // ------------------------------------------------------------------------
  // 11. Auth Modal & Flow
  // ------------------------------------------------------------------------
  openAuthModal() {
    UIManager.openModal("authModal");
  },

  handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("authEmailInput").value.trim();
    const name = document.getElementById("authNameInput").value.trim() || email.split("@")[0];

    const user = {
      name: name,
      email: email,
      role: "Student Member",
      avatar: name.slice(0, 2).toUpperCase(),
      streakDays: 1,
      savedItems: [],
      enrolledCourses: [],
      isLoggedIn: true
    };

    StorageManager.setUser(user);
    UIManager.closeModal("authModal");
    this.updateUserNavState();
    UIManager.showToast(`Welcome to Kavya Guru, ${name}! Read • Learn • Grow. ✨`, "success");
    Router.navigate("profile");
  },

  handleLogout() {
    StorageManager.logout();
    this.updateUserNavState();
    UIManager.showToast("Logged out of Kavya Guru.", "info");
    Router.navigate("home");
  }
};

// Global Boot
window.addEventListener("DOMContentLoaded", () => {
  App.init();
});
