/**
 * ==========================================================================
 * KAVYA GURU — UI Systems & Interactive Components
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const UIManager = {
  activeSpeechUtterance: null,
  isSpeaking: false,
  currentRecitingPoem: null,
  selectedReciteLang: "hindi", // 'hindi' or 'english'
  selectedReciteVoiceUri: "auto",
  selectedReciteSpeed: 0.82,
  selectedReciteMode: "stanza", // 'stanza', 'meaning', 'both'
  activeReadingTab: "original", // 'original' or 'translation'
  availableVoices: [],
  studioInitialized: false,

  init() {
    this.initTheme();
    this.initKeyboardShortcuts();
    this.initToastContainer();
    this.initSpeechVoices();
    this.hideSplash();
  },

  // ------------------------------------------------------------------------
  // 1. Theme Controller
  // ------------------------------------------------------------------------
  initTheme() {
    const savedTheme = StorageManager.getTheme();
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcons(savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    StorageManager.setTheme(next);
    this.updateThemeIcons(next);
    this.showToast(`Switched to ${next === "dark" ? "Dark 🌙" : "Light ☀️"} Mode`, "info");
  },

  updateThemeIcons(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    if (theme === "dark") {
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      btn.setAttribute("title", "Switch to Light Mode");
    } else {
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      btn.setAttribute("title", "Switch to Dark Mode");
    }
  },

  // ------------------------------------------------------------------------
  // 2. Loading Screen & Splash
  // ------------------------------------------------------------------------
  hideSplash() {
    const splash = document.getElementById("kgSplashScreen");
    if (!splash) return;
    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.display = "none";
      }, 500);
    }, 450);
  },

  // ------------------------------------------------------------------------
  // 3. Toasts
  // ------------------------------------------------------------------------
  initToastContainer() {
    if (!document.getElementById("kgToastContainer")) {
      const container = document.createElement("div");
      container.id = "kgToastContainer";
      container.className = "kg-toast-container";
      document.body.appendChild(container);
    }
  },

  showToast(message, type = "success") {
    const container = document.getElementById("kgToastContainer") || document.body;
    const toast = document.createElement("div");
    toast.className = `kg-toast kg-toast-${type}`;

    let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    if (type === "info") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    } else if (type === "warning") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="kg-toast-icon">${iconSvg}</div>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.3s, transform 0.3s";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  },

  // ------------------------------------------------------------------------
  // 4. Modals
  // ------------------------------------------------------------------------
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";

    // Stop audio recitation if poem modal was closed
    if (modalId === "poemReaderModal" && this.isSpeaking) {
      this.stopRecitation();
    }
    // Stop video embed if video player was closed
    if (modalId === "videoPlayerModal") {
      const container = document.getElementById("videoPlayerContainer");
      if (container) container.innerHTML = "";
    }
  },

  closeAllModals() {
    document.querySelectorAll(".kg-modal-overlay.open").forEach(modal => {
      this.closeModal(modal.id);
    });
  },

  // ------------------------------------------------------------------------
  // 5. Global Keyboard Shortcuts (Ctrl+K, Esc)
  // ------------------------------------------------------------------------
  initKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.openGlobalSearch();
      }
      if (e.key === "Escape") {
        this.closeAllModals();
      }
    });
  },

  openGlobalSearch() {
    this.openModal("globalSearchModal");
    const input = document.getElementById("globalSearchInput");
    if (input) {
      input.value = "";
      input.focus();
      this.handleGlobalSearch("");
    }
  },

  handleGlobalSearch(query) {
    const q = query.trim().toLowerCase();
    const resultsContainer = document.getElementById("globalSearchResults");
    if (!resultsContainer) return;

    if (!q) {
      const emptyTitle = typeof I18n !== "undefined" && I18n.currentLang === "hi" ? "काव्य गुरु के संपूर्ण भंडार में खोजें" : "Search across all of Kavya Guru";
      const emptyDesc = typeof I18n !== "undefined" && I18n.currentLang === "hi" ? "कोई भी कविता शीर्षक, कवि का नाम, अध्ययन नोट्स, यूट्यूब पाठ या गूगल मीट बैच खोजें..." : "Type any poem title, poet name, exam note, YouTube lesson, or Google Meet course...";
      resultsContainer.innerHTML = `
        <div class="kg-empty-state" style="padding: 2rem 1rem;">
          <div class="kg-empty-icon" style="width: 48px; height: 48px; font-size: 1.25rem;">🔍</div>
          <p class="kg-empty-title" style="font-size: 1rem;">${emptyTitle}</p>
          <p class="kg-empty-desc" style="font-size: 0.85rem; margin-bottom: 0;">${emptyDesc}</p>
        </div>
      `;
      return;
    }

    const poems = (App.cachedPoems || []).filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.poet || '').toLowerCase().includes(q) ||
      (p.stanza || '').toLowerCase().includes(q)
    );

    const notes = (App.cachedNotes || []).filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.subject || '').toLowerCase().includes(q) ||
      (n.summary || '').toLowerCase().includes(q)
    );

    const meets = (App.cachedCourses || []).filter(m =>
      (m.title || '').toLowerCase().includes(q) ||
      (m.instructor || '').toLowerCase().includes(q)
    );

    const videos = (App.cachedVideos || []).filter(v =>
      (v.title || '').toLowerCase().includes(q) ||
      (v.category || '').toLowerCase().includes(q)
    );

    const totalFound = poems.length + notes.length + meets.length + videos.length;

    if (totalFound === 0) {
      const notFoundTitle = typeof I18n !== "undefined" && I18n.currentLang === "hi" ? `काव्य गुरु पर "${query}" से संबंधित कोई परिणाम नहीं मिला` : `No results found on Kavya Guru for "${query}"`;
      const notFoundDesc = typeof I18n !== "undefined" && I18n.currentLang === "hi" ? "कृपया अन्य कीवर्ड आज़माएं अथवा संबंधित अनुभाग देखें।" : "Try another keyword or browse the sections above.";
      resultsContainer.innerHTML = `
        <div class="kg-empty-state" style="padding: 2rem 1rem;">
          <div class="kg-empty-icon" style="width: 48px; height: 48px;">✦</div>
          <p class="kg-empty-title" style="font-size: 1rem;">${notFoundTitle}</p>
          <p class="kg-empty-desc" style="font-size: 0.85rem;">${notFoundDesc}</p>
        </div>
      `;
      return;
    }

    let html = `<div style="display: flex; flex-direction: column; gap: 0.75rem;">`;

    if (poems.length > 0) {
      const headingPoetry = typeof I18n !== "undefined" ? I18n.t("nav_poetry") : "Poetry";
      const readPoemBadge = typeof I18n !== "undefined" && I18n.currentLang === "hi" ? "कविता पढ़ें" : "Read Poem";
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--kg-brand-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.5rem;">${headingPoetry} (${poems.length})</div>`;
      poems.forEach(p => {
        html += `
          <div onclick="UIManager.closeModal('globalSearchModal'); App.openPoemReader('${p.id}');" style="padding: 0.75rem 1rem; border-radius: var(--kg-radius-md); background: var(--kg-bg-muted); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--kg-text-primary);">${p.title}</div>
              <div style="font-size: 0.8rem; color: var(--kg-text-secondary);">${p.poet} • ${p.category}</div>
            </div>
            <span class="kg-accent-pill">${readPoemBadge}</span>
          </div>
        `;
      });
    }

    if (notes.length > 0) {
      const headingNotes = typeof I18n !== "undefined" ? I18n.t("nav_notes") : "Educational Notes";
      const viewNoteBadge = typeof I18n !== "undefined" && I18n.currentLang === "hi" ? "नोट्स पढ़ें" : "View Notes";
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--kg-brand-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.5rem;">${headingNotes} (${notes.length})</div>`;
      notes.forEach(n => {
        html += `
          <div onclick="UIManager.closeModal('globalSearchModal'); Router.navigate('notes'); App.openNoteDetails('${n.id}');" style="padding: 0.75rem 1rem; border-radius: var(--kg-radius-md); background: var(--kg-bg-muted); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--kg-text-primary);">${n.title}</div>
              <div style="font-size: 0.8rem; color: var(--kg-text-secondary);">${n.subject} • ${n.read_time || n.readTime}</div>
            </div>
            <span class="kg-card-badge notes">${viewNoteBadge}</span>
          </div>
        `;
      });
    }

    if (videos.length > 0) {
      const headingVideos = typeof I18n !== "undefined" ? I18n.t("nav_videos") : "YouTube Videos";
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--kg-brand-rose); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.5rem;">${headingVideos} (${videos.length})</div>`;
      videos.forEach(v => {
        html += `
          <div onclick="window.open('${v.youtube_url}', '_blank');" style="padding: 0.75rem 1rem; border-radius: var(--kg-radius-md); background: var(--kg-bg-muted); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--kg-text-primary);">${v.title}</div>
              <div style="font-size: 0.8rem; color: var(--kg-text-secondary);">${v.channel} • Opens on YouTube ↗</div>
            </div>
            <span class="kg-card-badge video" style="background: #ff0000; color: #fff;">YouTube ↗</span>
          </div>
        `;
      });
    }

    if (meets.length > 0) {
      const headingCourses = typeof I18n !== "undefined" ? I18n.t("nav_courses") : "Google Meet";
      const meetBadge = typeof I18n !== "undefined" && I18n.currentLang === "hi" ? "मीट विवरण" : "Meet Info";
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--kg-brand-accent); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.5rem;">${headingCourses} (${meets.length})</div>`;
      meets.forEach(m => {
        html += `
          <div onclick="UIManager.closeModal('globalSearchModal'); Router.navigate('courses');" style="padding: 0.75rem 1rem; border-radius: var(--kg-radius-md); background: var(--kg-bg-muted); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--kg-text-primary);">${m.title}</div>
              <div style="font-size: 0.8rem; color: var(--kg-text-secondary);">${m.instructor} • ${m.date}</div>
            </div>
            <span class="kg-card-badge meet">${meetBadge}</span>
          </div>
        `;
      });
    }

    html += `</div>`;
    resultsContainer.innerHTML = html;
  },

  // ------------------------------------------------------------------------
  // 6. Multilingual Audio Recitation Studio & Speech Synthesis
  // ------------------------------------------------------------------------
  initSpeechVoices() {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      this.availableVoices = window.speechSynthesis.getVoices() || [];
      if (this.currentRecitingPoem) {
        this.populateRecitationVoices(this.selectedReciteLang);
      }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  },

  bindRecitationStudioControls() {
    if (this.studioInitialized) return;
    this.studioInitialized = true;

    // Recitation Language Switcher (Hindi vs English)
    const btnHindi = document.getElementById("reciteLangBtnHindi");
    const btnEnglish = document.getElementById("reciteLangBtnEnglish");

    if (btnHindi) {
      btnHindi.addEventListener("click", () => {
        this.setRecitationLanguage("hindi");
      });
    }
    if (btnEnglish) {
      btnEnglish.addEventListener("click", () => {
        this.setRecitationLanguage("english");
      });
    }

    // Recitation Mode Selector (Verses / Meaning / Both)
    const modeSelect = document.getElementById("reciteContentModeSelect");
    if (modeSelect) {
      modeSelect.addEventListener("change", (e) => {
        this.selectedReciteMode = e.target.value;
        this.updateRecitationStatus();
      });
    }

    // Voice Selector
    const voiceSelect = document.getElementById("reciteVoiceSelect");
    if (voiceSelect) {
      voiceSelect.addEventListener("change", (e) => {
        this.selectedReciteVoiceUri = e.target.value;
      });
    }

    // Cadence / Speed Selector
    const speedSelect = document.getElementById("reciteSpeedSelect");
    if (speedSelect) {
      speedSelect.addEventListener("change", (e) => {
        this.selectedReciteSpeed = parseFloat(e.target.value) || 0.82;
      });
    }

    // Main Play / Stop Button
    const playBtn = document.getElementById("poemRecitePlayBtn");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        this.toggleRecitation();
      });
    }

    // Stop Button
    const stopBtn = document.getElementById("poemReciteStopBtn");
    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        this.stopRecitation(true);
      });
    }

    // Stanza Reading Switcher Tabs (Original vs Translation)
    const tabOrig = document.getElementById("stanzaTabOriginal");
    const tabTrans = document.getElementById("stanzaTabTranslation");

    if (tabOrig) {
      tabOrig.addEventListener("click", () => {
        this.setReadingTab("original");
      });
    }
    if (tabTrans) {
      tabTrans.addEventListener("click", () => {
        this.setReadingTab("translation");
      });
    }
  },

  populateRecitationVoices(targetLang = "hindi") {
    const select = document.getElementById("reciteVoiceSelect");
    if (!select) return;

    if (!('speechSynthesis' in window)) {
      select.innerHTML = `<option value="auto">Default Browser Speech</option>`;
      return;
    }

    const voices = (this.availableVoices && this.availableVoices.length > 0)
      ? this.availableVoices
      : window.speechSynthesis.getVoices() || [];
    this.availableVoices = voices;

    const isHindiTarget = targetLang === "hindi" || targetLang === "hi";

    // Filter matching voices for chosen recitation language
    const matchedVoices = voices.filter(v => {
      const vLang = (v.lang || '').toLowerCase();
      const vName = (v.name || '').toLowerCase();
      if (isHindiTarget) {
        return vLang.startsWith("hi") || vName.includes("hindi") || (vLang.includes("in") && !vLang.startsWith("en"));
      } else {
        return vLang.startsWith("en");
      }
    });

    const autoLabel = isHindiTarget
      ? "✨ स्वचालित भावपूर्ण हिंदी स्वर (Natural Hindi Audio)"
      : "✨ Poetic Expressive Voice (Natural English Audio)";

    let optionsHtml = `<option value="auto">${autoLabel}</option>`;

    if (matchedVoices.length > 0) {
      matchedVoices.forEach(v => {
        const isSelected = this.selectedReciteVoiceUri === v.voiceURI ? "selected" : "";
        optionsHtml += `<option value="${v.voiceURI}" ${isSelected}>🗣️ ${v.name} (${v.lang})</option>`;
      });
    } else {
      // Fallback: list all system voices so the user can still select one
      voices.slice(0, 8).forEach(v => {
        const isSelected = this.selectedReciteVoiceUri === v.voiceURI ? "selected" : "";
        optionsHtml += `<option value="${v.voiceURI}" ${isSelected}>🗣️ ${v.name} (${v.lang})</option>`;
      });
    }

    select.innerHTML = optionsHtml;
  },

  setRecitationLanguage(lang) {
    const wasSpeaking = this.isSpeaking;
    if (this.isSpeaking) {
      this.stopRecitation(false);
    }

    this.selectedReciteLang = lang;
    this.selectedReciteVoiceUri = "auto";

    const btnHindi = document.getElementById("reciteLangBtnHindi");
    const btnEnglish = document.getElementById("reciteLangBtnEnglish");
    if (btnHindi && btnEnglish) {
      if (lang === "hindi") {
        btnHindi.classList.add("active");
        btnEnglish.classList.remove("active");
      } else {
        btnEnglish.classList.add("active");
        btnHindi.classList.remove("active");
      }
    }

    this.populateRecitationVoices(lang);
    this.updateRecitationStatus();

    // Contextual reading tab sync: if user switches recitation to English for a Hindi poem,
    // automatically switch reading display to English translation for a seamless experience
    if (this.currentRecitingPoem) {
      const origLang = this.currentRecitingPoem.language || "hindi";
      if (lang !== origLang && (this.currentRecitingPoem.stanza_trans || this.currentRecitingPoem.meaning_trans)) {
        this.setReadingTab("translation");
      } else if (lang === origLang) {
        this.setReadingTab("original");
      }
    }

    const isHi = typeof I18n !== "undefined" && I18n.currentLang === "hi";
    const langLabel = lang === "hindi" ? (isHi ? "हिंदी" : "Hindi") : (isHi ? "अंग्रेजी" : "English");
    this.showToast(isHi ? `वाचन भाषा: ${langLabel} चुनी गई 🎙️` : `Recitation language switched to ${langLabel} 🎙️`, "info");

    if (wasSpeaking) {
      this.startRecitation();
    }
  },

  setReadingTab(tab) {
    this.activeReadingTab = tab;
    const tabOrig = document.getElementById("stanzaTabOriginal");
    const tabTrans = document.getElementById("stanzaTabTranslation");
    const stanzaEl = document.getElementById("poemReaderStanza");
    const meaningEl = document.getElementById("poemReaderMeaning");
    const meaningHeading = document.getElementById("poemReaderMeaningHeading");

    if (tabOrig && tabTrans) {
      if (tab === "original") {
        tabOrig.classList.add("active");
        tabTrans.classList.remove("active");
      } else {
        tabTrans.classList.add("active");
        tabOrig.classList.remove("active");
      }
    }

    if (!this.currentRecitingPoem || !stanzaEl) return;
    const poem = this.currentRecitingPoem;
    const isOrig = tab === "original";

    if (isOrig) {
      stanzaEl.className = `kg-poetry-stanza ${poem.language === 'hindi' ? 'hindi' : ''}`;
      stanzaEl.textContent = poem.stanza;
      if (meaningEl) {
        meaningEl.textContent = poem.meaning || (poem.language === 'hindi' ? "काव्य गुरु साहित्य समीक्षा एवं भावार्थ।" : "Kavya Guru reflection on themes of emotional expression and literary beauty.");
      }
      if (meaningHeading) {
        meaningHeading.textContent = poem.language === 'hindi' ? "काव्य गुरु भावार्थ एवं अंतर्दृष्टि (Bhavarth):" : "Kavya Guru Bhavarth (Meaning & Insight):";
      }
    } else {
      // Translation tab view
      const isTransHindi = poem.language !== 'hindi';
      stanzaEl.className = `kg-poetry-stanza ${isTransHindi ? 'hindi' : ''}`;
      stanzaEl.textContent = poem.stanza_trans || poem.stanza;
      if (meaningEl) {
        meaningEl.textContent = poem.meaning_trans || poem.meaning || "Kavya Guru literary translation & contextual notes.";
      }
      if (meaningHeading) {
        meaningHeading.textContent = isTransHindi ? "काव्य गुरु अनुवादित भावार्थ (Hindi Translation):" : "Kavya Guru English Translation & Insight:";
      }
    }
  },

  setupPoemReciteStudio(poem) {
    this.currentRecitingPoem = poem;
    this.bindRecitationStudioControls();

    // Default recitation language is the poem's native language
    const defaultLang = poem.language === "english" ? "english" : "hindi";
    this.selectedReciteLang = defaultLang;
    this.selectedReciteVoiceUri = "auto";

    // Set active language button
    const btnHindi = document.getElementById("reciteLangBtnHindi");
    const btnEnglish = document.getElementById("reciteLangBtnEnglish");
    if (btnHindi && btnEnglish) {
      if (defaultLang === "hindi") {
        btnHindi.classList.add("active");
        btnEnglish.classList.remove("active");
      } else {
        btnEnglish.classList.add("active");
        btnHindi.classList.remove("active");
      }
    }

    // Configure translation tabs if bilingual content exists
    const tabOrig = document.getElementById("stanzaTabOriginal");
    const tabTrans = document.getElementById("stanzaTabTranslation");
    const tabsContainer = document.getElementById("stanzaReadingTabs");

    const hasTranslation = Boolean(poem.stanza_trans && poem.stanza_trans.trim());

    if (tabsContainer) {
      if (hasTranslation) {
        tabsContainer.style.display = "flex";
        if (poem.language === "hindi") {
          if (tabOrig) tabOrig.innerHTML = `📜 मूल हिंदी (Original Hindi)`;
          if (tabTrans) tabTrans.innerHTML = `🌐 English Translation (अनुवाद)`;
        } else {
          if (tabOrig) tabOrig.innerHTML = `📜 Original English`;
          if (tabTrans) tabTrans.innerHTML = `🌐 हिंदी अनुवाद (Hindi Translation)`;
        }
      } else {
        tabsContainer.style.display = "none";
      }
    }

    // Populate voices for the target language
    this.populateRecitationVoices(this.selectedReciteLang);

    // Reset displayed text to original
    this.setReadingTab("original");

    // Reset speech state
    this.stopRecitation(false);
    this.updateRecitationStatus();
  },

  getRecitationText() {
    if (!this.currentRecitingPoem) return { text: "", lang: "hindi" };
    const poem = this.currentRecitingPoem;
    const targetLang = this.selectedReciteLang; // 'hindi' or 'english'
    const mode = this.selectedReciteMode || "stanza"; // 'stanza', 'meaning', 'both'

    let stanzaText = "";
    let meaningText = "";

    if (targetLang === "hindi") {
      stanzaText = poem.language === "hindi" ? poem.stanza : (poem.stanza_trans || poem.stanza);
      meaningText = poem.language === "hindi" ? (poem.meaning || "") : (poem.meaning_trans || poem.meaning || "");
    } else {
      // English
      stanzaText = poem.language === "english" ? poem.stanza : (poem.stanza_trans || poem.stanza);
      meaningText = poem.language === "english" ? (poem.meaning || "") : (poem.meaning_trans || poem.meaning || "");
    }

    let finalText = "";
    if (mode === "stanza") {
      finalText = stanzaText;
    } else if (mode === "meaning") {
      finalText = meaningText || stanzaText;
    } else if (mode === "both") {
      const intro = targetLang === "hindi" ? "काव्य पाठ: " : "Poetic Verses: ";
      const mid = targetLang === "hindi" ? " । । काव्य गुरु भावार्थ: " : " ... Literary Insight and Bhavarth: ";
      finalText = `${intro}${stanzaText}${mid}${meaningText}`;
    }

    return { text: finalText, lang: targetLang };
  },

  updateRecitationStatus() {
    const statusText = document.getElementById("reciteStatusText");
    if (!statusText || this.isSpeaking) return;

    const isHindi = this.selectedReciteLang === "hindi";
    const mode = this.selectedReciteMode || "stanza";
    const modeLabel = mode === "meaning"
      ? (isHindi ? "भावार्थ" : "Bhavarth & Insight")
      : mode === "both"
      ? (isHindi ? "काव्य व भावार्थ दोनों" : "Verses & Bhavarth")
      : (isHindi ? "काव्य पंक्तियाँ" : "Poetic Verses");

    statusText.textContent = isHindi
      ? `वाचन भाषा: हिंदी 🇮🇳 • प्रकार: ${modeLabel} • सुनने हेतु प्ले दबाएं`
      : `Recitation: English 🇬🇧 • Mode: ${modeLabel} • Tap Play to start`;
  },

  toggleRecitation() {
    if (this.isSpeaking) {
      this.stopRecitation(true);
    } else {
      this.startRecitation();
    }
  },

  startRecitation() {
    if (!('speechSynthesis' in window)) {
      const isHi = typeof I18n !== "undefined" && I18n.currentLang === "hi";
      this.showToast(isHi ? "आपके ब्राउज़र में आवाज़ वाचन (Speech Synthesis) समर्थित नहीं है।" : "Audio recitation is not supported in this browser.", "warning");
      return;
    }

    this.stopRecitation(false);

    const { text, lang } = this.getRecitationText();
    if (!text || !text.trim()) {
      this.showToast("No text available for recitation", "warning");
      return;
    }

    const isHindi = lang === "hindi";
    // Natural poetic pauses with proper cadence
    const cleanText = text.replace(/[\n\r]+/g, isHindi ? " । " : ", ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHindi ? "hi-IN" : "en-US";
    utterance.rate = parseFloat(this.selectedReciteSpeed) || 0.82;
    utterance.pitch = 1.0;

    // Resolve specific voice selection
    const voices = (this.availableVoices && this.availableVoices.length > 0)
      ? this.availableVoices
      : window.speechSynthesis.getVoices() || [];

    if (this.selectedReciteVoiceUri && this.selectedReciteVoiceUri !== "auto") {
      const matched = voices.find(v => v.voiceURI === this.selectedReciteVoiceUri || v.name === this.selectedReciteVoiceUri);
      if (matched) utterance.voice = matched;
    } else {
      // Auto pick best matching native voice
      let preferred = null;
      if (isHindi) {
        preferred = voices.find(v => (v.lang && v.lang.toLowerCase().startsWith("hi")) || (v.name && v.name.toLowerCase().includes("hindi")));
      } else {
        preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Online")));
      }
      if (preferred) utterance.voice = preferred;
    }

    this.activeSpeechUtterance = utterance;

    const studioBox = document.getElementById("reciteStudioBox");
    const visualizer = document.getElementById("poemVisualizer");
    const playBtnText = document.getElementById("recitePlayBtnText");
    const playBtnIcon = document.getElementById("recitePlayBtnIcon");
    const stopBtn = document.getElementById("poemReciteStopBtn");
    const statusDot = document.getElementById("reciteStatusDot");
    const statusText = document.getElementById("reciteStatusText");

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (studioBox) studioBox.classList.add("is-playing");
      if (visualizer) visualizer.classList.remove("kg-hidden");
      if (statusDot) statusDot.classList.add("active");
      if (stopBtn) stopBtn.classList.remove("kg-hidden");
      if (playBtnIcon) playBtnIcon.textContent = "⏸️";
      if (playBtnText) playBtnText.textContent = isHindi ? "वाचन रोकें (Pause)" : "Pause Recitation";

      const modeName = this.selectedReciteMode === "meaning"
        ? (isHindi ? "भावार्थ" : "Bhavarth")
        : (this.selectedReciteMode === "both" ? (isHindi ? "पूर्ण काव्य व भावार्थ" : "Full Verses & Meaning") : (isHindi ? "काव्य पंक्तियाँ" : "Poetic Verses"));

      if (statusText) {
        statusText.textContent = isHindi
          ? `🎙️ ${modeName} का हिंदी में वाचन जारी है (${utterance.rate}x गति)...`
          : `🎙️ Reciting ${modeName} in English (${utterance.rate}x cadence)...`;
      }

      this.showToast(isHindi ? "काव्य गुरु ऑडियो वाचन शुरू हुआ 🎙️" : "Kavya Guru audio recitation started 🎙️", "info");
    };

    utterance.onend = () => {
      this.stopRecitation(false);
      if (statusText) {
        statusText.textContent = isHindi
          ? "✨ वाचन पूर्ण हुआ। पुनः सुनने के लिए प्ले दबाएं।"
          : "✨ Recitation complete. Tap Play to listen again.";
      }
      this.showToast(isHindi ? "वाचन संपन्न हुआ ✨" : "Recitation completed ✨", "success");
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      this.stopRecitation(false);
    };

    window.speechSynthesis.speak(utterance);
  },

  stopRecitation(showNotification = false) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.activeSpeechUtterance = null;

    const studioBox = document.getElementById("reciteStudioBox");
    const visualizer = document.getElementById("poemVisualizer");
    const playBtnText = document.getElementById("recitePlayBtnText");
    const playBtnIcon = document.getElementById("recitePlayBtnIcon");
    const stopBtn = document.getElementById("poemReciteStopBtn");
    const statusDot = document.getElementById("reciteStatusDot");

    if (studioBox) studioBox.classList.remove("is-playing");
    if (visualizer) visualizer.classList.add("kg-hidden");
    if (statusDot) statusDot.classList.remove("active");
    if (stopBtn) stopBtn.classList.add("kg-hidden");
    if (playBtnIcon) playBtnIcon.textContent = "▶️";

    const isHindi = this.selectedReciteLang === "hindi";
    if (playBtnText) {
      playBtnText.textContent = isHindi ? "वाचन सुनें (Listen Recitation)" : "Listen to Recitation";
    }

    this.updateRecitationStatus();

    if (showNotification) {
      const isHi = typeof I18n !== "undefined" && I18n.currentLang === "hi";
      this.showToast(isHi ? "वाचन रोका गया ⏹️" : "Recitation stopped ⏹️", "info");
    }
  }
};
