/**
 * ==========================================================================
 * KAVYA GURU — Multilingual Localization System (i18n)
 * Languages Supported: Hindi (हिंदी) & English (EN)
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow | पढ़ें • सीखें • आगे बढ़ें
 * ==========================================================================
 */

const I18n = {
  currentLang: "hi",

  translations: {
    // ========================================================================
    // 1. ENGLISH (EN)
    // ========================================================================
    en: {
      // Brand & Navigation
      brand_name: "Kavya Guru",
      brand_tagline: "Read • Learn • Grow",
      brand_desc: "Kavya Guru is your space for poetry, knowledge, learning, courses and career guidance.",
      nav_home: "Home",
      nav_poetry: "Poetry",
      nav_notes: "Notes",
      nav_videos: "Videos",
      nav_courses: "Google Meet",
      nav_career: "Career",
      nav_community: "Community",
      nav_admin: "Admin",
      nav_search: "Search",
      nav_search_placeholder: "Search by poem title, poet, note subject, course, or video...",
      nav_search_shortcut: "⌘K",
      nav_notifications: "Notifications",
      nav_login: "Student Login",
      nav_account: "My Account",
      lang_switch_title: "Switch Language / भाषा बदलें",
      theme_switch_title: "Switch Theme",

      // Hero Discovery Section
      hero_badge: "✦ Official Platform: Kavya Guru",
      hero_title_prefix: "The Youth Space for",
      hero_title_highlight: "Poetry, Knowledge & Career.",
      hero_subtitle: "Kavya Guru is your space for poetry, knowledge, learning, courses and career guidance. Empowering curious minds with timeless literature, curated academic vaults, YouTube video lessons, and live Google Meet mentor workshops.",
      hero_btn_poetry: "Explore Kavya Manch 📜",
      hero_btn_courses: "Join Google Meet Live 🎥",
      hero_btn_notes: "Access Study Notes 📚",
      hero_stat_poems_num: "500+",
      hero_stat_poems_label: "Timeless Poems",
      hero_stat_students_num: "12,000+",
      hero_stat_students_label: "Students Guided",
      hero_stat_free_num: "100%",
      hero_stat_free_label: "Free Student Access",
      hero_visual_badge_title: "Kavya Guru Masterclass",
      hero_visual_badge_sub: "Live Google Meet Every Weekend",
      hero_visual_badge_btn: "View Schedule",

      // 6 Pillars Section
      pillars_badge: "Explore Our Universe",
      pillars_title: "Everything You Need To Grow",
      pillars_desc: "Six interconnected learning and creative dimensions brought together under one unified brand.",
      p1_title: "1. Kavya Manch (Poetry)",
      p1_desc: "Classic and modern Hindi & English poetry, Ghazals, and original student submissions with audio recitation reader.",
      p1_cta: "Explore Poetry →",
      p2_title: "2. Educational Notes",
      p2_desc: "High-yield study guides for Hindi Sahitya, English literature, grammar rules, and competitive exam summaries.",
      p2_cta: "Access Notes →",
      p3_title: "3. YouTube Learning Hub",
      p3_desc: "Curated high-impact video lectures, recitation masterclasses, and exam strategies with timestamps and key takeaways.",
      p3_cta: "Watch Lectures →",
      p4_title: "4. Google Meet Live Courses",
      p4_desc: "Interactive virtual workshops with renowned authors, poets, and academic mentors with real-time feedback.",
      p4_cta: "Join Live Batches →",
      p5_title: "5. Career Guidance & Roadmaps",
      p5_desc: "Actionable career tracks in Writing, Academia, Media, Civil Services, and 1-on-1 counselor appointments.",
      p5_cta: "Explore Pathways →",
      p6_title: "6. Kavya Guru Charcha",
      p6_desc: "Vibrant student forum for peer critique, daily creative contests, doubt clearance, and supportive study circles.",
      p6_cta: "Enter Charcha →",

      // Trending Home Section
      home_trending_badge: "Trending Poems",
      home_trending_title: "Poetic Verses Inspiring Thousands",
      home_view_all_poems: "View All Poems",

      // Poetry Corner View
      poetry_badge: "काव्य मंच • Kavya Manch",
      poetry_title: "Poetry & Timeless Verses",
      poetry_subtitle: "Recite, experience, and celebrate the melody of emotions in Hindi & English.",
      poetry_submit_btn: "✍️ Submit Your Kavya",
      tab_all_poems: "All Poems",
      tab_hindi_poems: "हिंदी कविता (Hindi)",
      tab_english_poems: "English Poetry",
      tab_ghazal: "ग़ज़ल एवं नज़्म (Ghazal)",
      tab_inspirational: "Inspirational",
      tab_student: "Student Submissions",
      poetry_empty_title: "No Poetry Published Yet in this Category",
      poetry_empty_desc: "The poetry stage is ready. Submit your original verse or login as Admin to add classical literature.",
      poetry_card_read_recite: "Read & Recite 🎙️",
      poetry_card_likes: "likes",
      poetry_card_save: "Save to Library",
      poetry_card_unsave: "Remove from Saved",

      // Notes View
      notes_badge: "Study Vault",
      notes_title: "Educational Notes & Guides",
      notes_subtitle: "High-yield academic summaries, grammar cheat sheets, and literature analyses.",
      notes_search_btn: "🔍 Search Notes",
      tab_all_notes: "All Subjects",
      tab_hindi_notes: "हिंदी साहित्य (Hindi Literature)",
      tab_english_notes: "English Literature",
      tab_exam_notes: "Exams & CUET Prep",
      notes_empty_title: "No Study Notes in this Category Yet",
      notes_empty_desc: "High-yield study guides are being digitized. Check back soon or request a subject on Charcha.",
      note_card_read_time: "Read Time",
      note_card_downloads: "downloads",
      note_card_read_btn: "Read Complete Note 📖",
      note_card_download_btn: "Download PDF 📥",

      // Videos View
      videos_badge: "Video Vault",
      videos_title: "YouTube Curated Masterclasses",
      videos_subtitle: "Watch verified lectures with timestamp notes, recitation workshops, and exam tips.",
      videos_channel_btn: "▶️ Official Kavya Guru Channel",
      tab_all_videos: "All Videos",
      tab_video_lit: "Literature Strategy",
      tab_video_poetry: "Voice & Recitation",
      tab_video_grammar: "Grammar & Writing",
      tab_video_career: "Career Sessions",
      videos_empty_title: "No Videos in this Category",
      videos_empty_desc: "New YouTube masterclasses are uploaded weekly. Subscribe to our channel to stay updated.",
      video_watch_btn: "Watch Lecture ▶️",
      video_views: "views",

      // Google Meet Courses View
      courses_badge: "Live Classes",
      courses_title: "Google Meet Live Courses",
      courses_subtitle: "Direct interactive sessions with distinguished mentors, authors, and educators.",
      courses_free_badge: "ℹ️ Free Student Access",
      courses_empty_title: "No Active Batches Scheduled",
      courses_empty_desc: "New weekend cohorts will be announced on Telegram and notified to enrolled students.",
      course_instructor_label: "Mentor:",
      course_timing_label: "Session:",
      course_seats_left: "seats remaining",
      course_reserve_btn: "Reserve Free Seat 🎥",
      course_enrolled_badge: "✓ Enrolled",

      // Career Guidance View
      career_badge: "Career Pathfinder",
      career_title: "Career Guidance & Roadmaps",
      career_subtitle: "Turn your passion for words and knowledge into a meaningful, sustainable career.",
      career_quiz_btn: "🎯 Take Career Match Quiz",
      career_avg_package: "Avg. Compensation:",
      career_demand: "Demand Index:",
      career_roadmap_steps: "Actionable Roadmap:",
      career_top_skills: "High-Value Skills:",
      career_mentorship_btn: "Book Mentorship Session 🧭",

      // Community Forum (Charcha) View
      community_badge: "काव्य गुरु चर्चा • Student Forum",
      community_title: "Kavya Guru Community",
      community_subtitle: "A safe, supportive circle for youth to share original poetry, ask academic doubts, and collaborate.",
      community_new_btn: "💬 Start New Discussion",
      community_empty_title: "No Discussions Started Yet",
      community_empty_desc: "Break the ice! Ask a doubt about Hindi Sahitya, English literature, or share your thoughts.",
      thread_reply_btn: "Reply to Thread",
      thread_send_comment: "Post Reply",
      thread_likes: "likes",
      thread_comments_count: "replies",

      // Admin Section
      admin_gate_title: "Kavya Guru Admin Portal",
      admin_gate_desc: "This section is restricted to administrators & faculty. Enter your master password to manage poetry, notes, YouTube resources, and live classes.",
      admin_gate_pass_label: "Master Password",
      admin_gate_pass_placeholder: "Enter admin password (Ashish123)",
      admin_gate_unlock_btn: "Unlock Admin Portal 🚀",
      admin_gate_footer: "Kavya Guru Platform • Read • Learn • Grow",
      admin_dash_title: "Kavya Guru Control Center",
      admin_dash_sub: "Manage all website content in the SQLite database.",
      admin_dash_access_badge: "Admin Access Active",
      admin_email_templates_btn: "📧 Email Templates",
      admin_logout_btn: "🚪 Log Out Admin",
      admin_stat_poems: "Live Poems",
      admin_stat_notes: "Study Notes",
      admin_stat_videos: "YouTube Videos",
      admin_stat_courses: "Meet Batches",
      admin_stat_students: "Total Students",
      admin_stat_threads: "Forum Threads",

      // Modals: Poem Reader & Reciter
      modal_recite_listen: "🎙️ Listen to Recitation",
      modal_recite_stop: "⏹️ Stop Recitation",
      modal_recite_share: "🔗 Share Verse",
      modal_bhavarth_heading: "Kavya Guru Bhavarth (Meaning & Insight):",
      modal_close: "Close",
      modal_cancel: "Cancel",
      modal_submit: "Submit",
      modal_save: "Save",
      modal_confirm: "Confirm",

      // Modal: Submit Poetry
      modal_submit_poem_title: "✍️ Submit Your Original Poetry",
      modal_submit_poem_title_label: "Poem Title *",
      modal_submit_poem_poet_label: "Poet / Pen Name",
      modal_submit_poem_lang_label: "Language *",
      modal_submit_poem_cat_label: "Genre / Category *",
      modal_submit_poem_stanza_label: "Poetic Verses (Stanza) *",
      modal_submit_poem_meaning_label: "Bhavarth / Underlying Theme (Optional)",
      modal_submit_poem_cta: "Publish to Kavya Manch 🌟",

      // Modal: Note Viewer
      modal_note_viewer_keypoints: "High-Yield Summary & Key Concepts:",
      modal_note_download_pdf: "📥 Download PDF",
      modal_note_done: "Done Reading",

      // Modal: Google Meet RSVP
      modal_meet_title: "🎥 Google Meet Enrollment",
      modal_meet_free_badge: "Free Live Access",
      modal_meet_name_label: "Full Name *",
      modal_meet_email_label: "Email Address *",
      modal_meet_confirm_btn: "Confirm Reservation",

      // Modal: 1-on-1 Mentorship
      modal_mentor_title: "🧭 Book 1-on-1 Guidance Session",
      modal_mentor_domain_label: "Your Chosen Career Domain",
      modal_mentor_name_label: "Your Name *",
      modal_mentor_class_label: "Current Class / Degree *",
      modal_mentor_questions_label: "Questions for the Mentor",
      modal_mentor_schedule_btn: "Schedule Mentorship",

      // Modal: Career Match Quiz
      modal_quiz_title: "🎯 Kavya Guru Career Match Quiz",
      modal_quiz_q1: "1. What excites you the most?",
      modal_quiz_q1_opt1: "Writing captivating stories, scripts & blogs",
      modal_quiz_q1_opt2: "Teaching, research & deep literary philosophy",
      modal_quiz_q1_opt3: "Public administration & solving societal challenges",
      modal_quiz_q2: "2. Preferred work style?",
      modal_quiz_q2_opt1: "Creative flexibility & dynamic media",
      modal_quiz_q2_opt2: "Academic rigor & institutional scholarship",
      modal_quiz_result_label: "Top Recommended Career Track:",
      modal_quiz_find_btn: "Find My Path",

      // Modal: Community Thread
      modal_thread_title: "💬 Start Discussion on Kavya Guru Charcha",
      modal_thread_topic_label: "Topic Title *",
      modal_thread_tag_label: "Category Tag",
      modal_thread_content_label: "Your Thoughts / Question *",
      modal_thread_submit_btn: "Post to Community",

      // Modal: Auth
      modal_auth_welcome: "Welcome to Kavya Guru",
      modal_auth_sub: "Sign in to save poems, join Google Meet courses, and participate in community discussions.",
      modal_auth_name_label: "Full Name",
      modal_auth_email_label: "Email Address",
      modal_auth_btn: "Enter Kavya Guru",
      modal_auth_free: "Free Student Access",

      // Footer
      footer_philosophy: "Kavya Guru is your space for poetry, knowledge, learning, courses and career guidance. Read • Learn • Grow.",
      footer_nav_heading: "Navigation",
      footer_academics_heading: "Academics & Learning",
      footer_connect_heading: "Connect with Us",
      footer_live_batches: "Live Google Meet Batches",
      footer_youtube_classes: "YouTube Masterclasses",
      footer_notes_vault: "Academic Notes Vault",
      footer_career_roadmaps: "Career Roadmaps",
      footer_copyright: "© 2026 Kavya Guru. All rights reserved. Read • Learn • Grow.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Learning",
      footer_honor: "Student Code of Honor",

      // Toast Notifications & Status Messages
      toast_lang_switched: "Language switched to English 🌐",
      toast_theme_light: "Switched to Light ☀️ Mode",
      toast_theme_dark: "Switched to Dark 🌙 Mode",
      toast_copied: "Link copied to clipboard! 📋",
      toast_rsvp_success: "🎉 Seat reserved! Check your email for Google Meet details.",
      toast_poem_submitted: "Your poem was saved to the database! 🎉",
      toast_thread_posted: "Discussion posted to Kavya Guru Charcha! 💬",
      toast_liked: "Saved like to database ❤️",
      toast_unliked: "Removed like",
      toast_saved: "Saved to your library 🔖",
      toast_unsaved: "Removed from Library",
      toast_mentorship_booked: "Guidance session booked! Our counselor will reach out. 🧭",
      toast_auth_success: "Welcome back, {name}! 🎉"
    },

    // ========================================================================
    // 2. HINDI (हिंदी)
    // ========================================================================
    hi: {
      // Brand & Navigation
      brand_name: "काव्य गुरु",
      brand_tagline: "पढ़ें • सीखें • आगे बढ़ें",
      brand_desc: "काव्य गुरु आपकी कविता, ज्ञान, शिक्षा, कोर्सेज और करियर मार्गदर्शन की एक समर्पित जगह है।",
      nav_home: "होम",
      nav_poetry: "काव्य मंच",
      nav_notes: "अध्ययन नोट्स",
      nav_videos: "वीडियो",
      nav_courses: "गूगल मीट",
      nav_career: "करियर",
      nav_community: "चर्चा मंच",
      nav_admin: "एडमिन",
      nav_search: "खोजें",
      nav_search_placeholder: "कविता, कवि, अध्ययन नोट्स, कोर्स या वीडियो खोजें...",
      nav_search_shortcut: "⌘K",
      nav_notifications: "सूचनाएं",
      nav_login: "विद्यार्थी लॉगिन",
      nav_account: "मेरा खाता",
      lang_switch_title: "भाषा बदलें / Switch Language",
      theme_switch_title: "थीम बदलें (Dark / Light)",

      // Hero Discovery Section
      hero_badge: "✦ आधिकारिक मंच: काव्य गुरु",
      hero_title_prefix: "युवाओं का मंच —",
      hero_title_highlight: "काव्य, ज्ञान और करियर का संगम।",
      hero_subtitle: "काव्य गुरु आपकी कविता, ज्ञान, शिक्षा, लाइव कोर्सेज और करियर मार्गदर्शन की समर्पित जगह है। कालातीत साहित्य, उच्चस्तरीय शैक्षिक नोट्स, यूट्यूब वीडियो और लाइव गूगल मीट मेंटरशिप के साथ अपने सपनों को पंख दें।",
      hero_btn_poetry: "काव्य मंच देखें 📜",
      hero_btn_courses: "लाइव मीट से जुड़ें 🎥",
      hero_btn_notes: "अध्ययन नोट्स पढ़ें 📚",
      hero_stat_poems_num: "500+",
      hero_stat_poems_label: "कालातीत कविताएं",
      hero_stat_students_num: "12,000+",
      hero_stat_students_label: "छात्र मार्गदर्शन",
      hero_stat_free_num: "100%",
      hero_stat_free_label: "निःशुल्क छात्र शिक्षा",
      hero_visual_badge_title: "काव्य गुरु मास्टरक्लास",
      hero_visual_badge_sub: "हर वीकेंड लाइव गूगल मीट सत्र",
      hero_visual_badge_btn: "शेड्यूल देखें",

      // 6 Pillars Section
      pillars_badge: "हमारी दुनिया देखें",
      pillars_title: "आपके संपूर्ण विकास के लिए सब कुछ",
      pillars_desc: "छह परस्पर जुड़े आयाम, एक सशक्त मंच के तहत।",
      p1_title: "१. काव्य मंच (कविताएं)",
      p1_desc: "क्लासिक एवं आधुनिक हिंदी व अंग्रेजी कविताएं, ग़ज़लें और छात्र रचनाएं - ऑडियो वाचन के साथ।",
      p1_cta: "कविताएं देखें →",
      p2_title: "२. शैक्षिक नोट्स",
      p2_desc: "हिंदी साहित्य, अंग्रेजी साहित्य, व्याकरण और प्रतियोगी परीक्षाओं के उच्च-स्तरीय नोट्स।",
      p2_cta: "नोट्स देखें →",
      p3_title: "३. यूट्यूब लर्निंग हब",
      p3_desc: "क्यूरेटेड वीडियो लेक्चर्स, वाचन मास्टरक्लास व परीक्षा रणनीति - टाइमस्टैम्प नोट्स सहित।",
      p3_cta: "लेक्चर्स देखें →",
      p4_title: "४. गूगल मीट लाइव कोर्सेज",
      p4_desc: "प्रतिष्ठित कवियों, लेखकों व शिक्षकों के साथ इंटरैक्टिव वर्चुअल वर्कशॉप और सीधा मार्गदर्शन।",
      p4_cta: "लाइव बैच में जुड़ें →",
      p5_title: "५. करियर मार्गदर्शन व रोडमैप",
      p5_desc: "लेखन, अकादमिक, मीडिया, सिविल सेवा में करियर विकल्प और व्यक्तिगत 1-ऑन-1 मेंटरशिप।",
      p5_cta: "रास्ते खोजें →",
      p6_title: "६. काव्य गुरु चर्चा मंच",
      p6_desc: "छात्रों का जीवंत मंच - रचनाएं साझा करें, सवाल पूछें और साथियों के साथ मिलकर सीखें।",
      p6_cta: "चर्चा में शामिल हों →",

      // Trending Home Section
      home_trending_badge: "लोकप्रिय कविताएं",
      home_trending_title: "हज़ारों युवाओं को प्रेरित करती कालजयी रचनाएं",
      home_view_all_poems: "सभी कविताएं देखें",

      // Poetry Corner View
      poetry_badge: "काव्य मंच • Kavya Manch",
      poetry_title: "कविताएं एवं अमर रचनाएं",
      poetry_subtitle: "भावनाओं और सुरमयी शब्दों का संगम हिंदी व अंग्रेजी में।",
      poetry_submit_btn: "✍️ अपनी रचना भेजें",
      tab_all_poems: "सभी कविताएं",
      tab_hindi_poems: "हिंदी कविताएं",
      tab_english_poems: "अंग्रेजी कविताएं (English)",
      tab_ghazal: "ग़ज़ल एवं नज़्म",
      tab_inspirational: "प्रेरणादायक",
      tab_student: "छात्र रचनाएं",
      poetry_empty_title: "इस श्रेणी में अभी कोई कविता प्रकाशित नहीं है",
      poetry_empty_desc: "काव्य मंच पूरी तरह तैयार है। अपनी मौलिक कविता सबमिट करें या एडमिन पोर्टल से रचनाएं जोड़ें।",
      poetry_card_read_recite: "वाचन सुनें 🎙️",
      poetry_card_likes: "पसंद",
      poetry_card_save: "लाइब्रेरी में सहेजें",
      poetry_card_unsave: "सहेजे गए से हटाएं",

      // Notes View
      notes_badge: "ज्ञान भंडार",
      notes_title: "शैक्षिक नोट्स एवं मार्गदर्शिका",
      notes_subtitle: "परीक्षा उपयोगी सारांश, व्याकरण सूत्र और साहित्यिक समीक्षाएं।",
      notes_search_btn: "🔍 नोट्स खोजें",
      tab_all_notes: "सभी विषय",
      tab_hindi_notes: "हिंदी साहित्य",
      tab_english_notes: "English Literature",
      tab_exam_notes: "प्रतियोगी परीक्षा व CUET",
      notes_empty_title: "इस श्रेणी में अभी कोई नोट्स उपलब्ध नहीं हैं",
      notes_empty_desc: "उच्च-स्तरीय अध्ययन नोट्स संकलित किए जा रहे हैं। जल्द ही उपलब्ध होंगे या चर्चा मंच पर अनुरोध करें।",
      note_card_read_time: "पढ़ने का समय",
      note_card_downloads: "डाउनलोड्स",
      note_card_read_btn: "सम्पूर्ण नोट्स पढ़ें 📖",
      note_card_download_btn: "पीडीएफ डाउनलोड 📥",

      // Videos View
      videos_badge: "वीडियो संग्रह",
      videos_title: "यूट्यूब मास्टरक्लास लेक्चर्स",
      videos_subtitle: "विषयवार व्याख्यान, वाचन कार्यशालाएं और परीक्षा रणनीति - नोट्स सहित।",
      videos_channel_btn: "▶️ आधिकारिक यूट्यूब चैनल",
      tab_all_videos: "सभी वीडियो",
      tab_video_lit: "साहित्य रणनीति",
      tab_video_poetry: "वाचन व स्वर कला",
      tab_video_grammar: "व्याकरण व लेखन",
      tab_video_career: "करियर सत्र",
      videos_empty_title: "इस श्रेणी में कोई वीडियो नहीं है",
      videos_empty_desc: "काव्य गुरु चैनल पर हर हफ्ते नए वीडियो जोड़े जाते हैं। चैनल सब्सक्राइब करें।",
      video_watch_btn: "लेक्चर देखें ▶️",
      video_views: "बार देखा गया",

      // Google Meet Courses View
      courses_badge: "लाइव कक्षाएं",
      courses_title: "गूगल मीट लाइव कोर्सेज",
      courses_subtitle: "विशेषज्ञों व शिक्षकों के साथ सीधा संवाद और संवादात्मक कक्षाएं।",
      courses_free_badge: "ℹ️ छात्रों के लिए निःशुल्क",
      courses_empty_title: "वर्तमान में कोई लाइव बैच निर्धारित नहीं है",
      courses_empty_desc: "नए वीकेंड बैच की घोषणा टेलीग्राम पर की जाएगी और नामांकित छात्रों को सूचित किया जाएगा।",
      course_instructor_label: "मार्गदर्शक:",
      course_timing_label: "समय:",
      course_seats_left: "सीटें शेष",
      course_reserve_btn: "निःशुल्क सीट आरक्षित करें 🎥",
      course_enrolled_badge: "✓ नामांकित",

      // Career Guidance View
      career_badge: "करियर पथप्रदर्शक",
      career_title: "करियर मार्गदर्शन एवं रोडमैप",
      career_subtitle: "साहित्य, ज्ञान और लेखन को एक सफल एवं स्थायी करियर में बदलें।",
      career_quiz_btn: "🎯 करियर मैच क्विज़ लें",
      career_avg_package: "औसत पैकेज:",
      career_demand: "मांग सूचकांक:",
      career_roadmap_steps: "चरणबद्ध रोडमैप:",
      career_top_skills: "ज़रूरी मुख्य कौशल:",
      career_mentorship_btn: "मेंटरशिप सत्र बुक करें 🧭",

      // Community Forum (Charcha) View
      community_badge: "काव्य गुरु चर्चा • छात्र मंच",
      community_title: "काव्य गुरु समुदाय",
      community_subtitle: "छात्रों का सुरक्षित और प्रेरक मंच - रचनाएं साझा करें, प्रश्न पूछें और परस्पर सीखें।",
      community_new_btn: "💬 नई चर्चा शुरू करें",
      community_empty_title: "अभी तक कोई चर्चा शुरू नहीं हुई है",
      community_empty_desc: "चर्चा की शुरुआत करें! हिंदी साहित्य, अंग्रेजी या अध्ययन से जुड़ा कोई भी सवाल पूछें।",
      thread_reply_btn: "उत्तर दें",
      thread_send_comment: "टिप्पणी भेजें",
      thread_likes: "पसंद",
      thread_comments_count: "उत्तर",

      // Admin Section
      admin_gate_title: "काव्य गुरु एडमिन पोर्टल",
      admin_gate_desc: "यह अनुभाग केवल व्यवस्थापक व शिक्षकों के लिए है। काव्य, नोट्स, वीडियो व कक्षाओं के प्रबंधन हेतु पासवर्ड दर्ज करें।",
      admin_gate_pass_label: "मास्टर पासवर्ड",
      admin_gate_pass_placeholder: "एडमिन पासवर्ड दर्ज करें (Ashish123)",
      admin_gate_unlock_btn: "एडमिन पोर्टल खोलें 🚀",
      admin_gate_footer: "काव्य गुरु मंच • पढ़ें • सीखें • आगे बढ़ें",
      admin_dash_title: "काव्य गुरु नियंत्रण केंद्र",
      admin_dash_sub: "SQLite डेटाबेस में वेबसाइट सामग्री का प्रबंधन करें।",
      admin_dash_access_badge: "एडमिन एक्सेस सक्रिय",
      admin_email_templates_btn: "📧 ईमेल टेम्पलेट्स",
      admin_logout_btn: "🚪 एडमिन लॉगआउट",
      admin_stat_poems: "सक्रिय कविताएं",
      admin_stat_notes: "अध्ययन नोट्स",
      admin_stat_videos: "यूट्यूब वीडियो",
      admin_stat_courses: "मीट बैच",
      admin_stat_students: "कुल विद्यार्थी",
      admin_stat_threads: "मंच चर्चाएं",

      // Modals: Poem Reader & Reciter
      modal_recite_listen: "🎙️ वाचन सुनें",
      modal_recite_stop: "⏹️ वाचन रोकें",
      modal_recite_share: "🔗 रचना साझा करें",
      modal_bhavarth_heading: "काव्य गुरु भावार्थ एवं साहित्यिक संदर्भ:",
      modal_close: "बंद करें",
      modal_cancel: "रद्द करें",
      modal_submit: "जमा करें",
      modal_save: "सहेजें",
      modal_confirm: "पुष्टि करें",

      // Modal: Submit Poetry
      modal_submit_poem_title: "✍️ अपनी मौलिक कविता सबमिट करें",
      modal_submit_poem_title_label: "कविता का शीर्षक *",
      modal_submit_poem_poet_label: "कवि / उपनाम",
      modal_submit_poem_lang_label: "भाषा *",
      modal_submit_poem_cat_label: "विधा / श्रेणी *",
      modal_submit_poem_stanza_label: "काव्य पंक्तियां (Stanza) *",
      modal_submit_poem_meaning_label: "भावार्थ / साहित्यिक मर्म (वैकल्पिक)",
      modal_submit_poem_cta: "काव्य मंच पर प्रकाशित करें 🌟",

      // Modal: Note Viewer
      modal_note_viewer_keypoints: "महत्वपूर्ण बिंदु एवं मुख्य अवधारणाएं:",
      modal_note_download_pdf: "📥 पीडीएफ डाउनलोड",
      modal_note_done: "पढ़ लिया (समाप्त)",

      // Modal: Google Meet RSVP
      modal_meet_title: "🎥 गूगल मीट सीट आरक्षण",
      modal_meet_free_badge: "निःशुल्क लाइव प्रवेश",
      modal_meet_name_label: "पूरा नाम *",
      modal_meet_email_label: "ईमेल पता *",
      modal_meet_confirm_btn: "आरक्षण की पुष्टि करें",

      // Modal: 1-on-1 Mentorship
      modal_mentor_title: "🧭 1-ऑन-1 मार्गदर्शन सत्र बुक करें",
      modal_mentor_domain_label: "आपका चयनित करियर क्षेत्र",
      modal_mentor_name_label: "आपका नाम *",
      modal_mentor_class_label: "वर्तमान कक्षा / डिग्री *",
      modal_mentor_questions_label: "मेंटर से आपके मुख्य सवाल",
      modal_mentor_schedule_btn: "मार्गदर्शन सत्र शेड्यूल करें",

      // Modal: Career Match Quiz
      modal_quiz_title: "🎯 काव्य गुरु करियर मैच क्विज़",
      modal_quiz_q1: "१. आपको सबसे अधिक क्या आकर्षित करता है?",
      modal_quiz_q1_opt1: "आकर्षक कहानियां, पटकथाएं और रचनात्मक ब्लॉग लिखना",
      modal_quiz_q1_opt2: "अध्यापन, शोध और गहरा साहित्यिक दर्शन",
      modal_quiz_q1_opt3: "प्रशासनिक सेवा और जन कल्याण के समाधान खोजना",
      modal_quiz_q2: "२. आपकी कार्यशैली की पसंद?",
      modal_quiz_q2_opt1: "रचनात्मक स्वतंत्रता और गतिशील मीडिया",
      modal_quiz_q2_opt2: "अकादमिक अनुशासन और शोध-आधारित अध्ययन",
      modal_quiz_result_label: "शीर्ष अनुशंसित करियर विकल्प:",
      modal_quiz_find_btn: "मेरा करियर पथ खोजें",

      // Modal: Community Thread
      modal_thread_title: "💬 काव्य गुरु चर्चा मंच पर विषय शुरू करें",
      modal_thread_topic_label: "चर्चा का शीर्षक *",
      modal_thread_tag_label: "श्रेणी टैग",
      modal_thread_content_label: "आपके विचार / प्रश्न *",
      modal_thread_submit_btn: "समुदाय में पोस्ट करें",

      // Modal: Auth
      modal_auth_welcome: "काव्य गुरु में आपका स्वागत है",
      modal_auth_sub: "कविताएं सहेजने, गूगल मीट कक्षाओं में भाग लेने और चर्चा में जुड़ने हेतु लॉगिन करें।",
      modal_auth_name_label: "पूरा नाम",
      modal_auth_email_label: "ईमेल पता",
      modal_auth_btn: "काव्य गुरु में प्रवेश करें",
      modal_auth_free: "निःशुल्क विद्यार्थी प्रवेश",

      // Footer
      footer_philosophy: "काव्य गुरु आपकी कविता, ज्ञान, शिक्षा, कोर्सेज और करियर मार्गदर्शन की समर्पित जगह है। पढ़ें • सीखें • आगे बढ़ें।",
      footer_nav_heading: "नेविगेशन",
      footer_academics_heading: "शिक्षा एवं संसाधन",
      footer_connect_heading: "हमसे जुड़ें",
      footer_live_batches: "लाइव गूगल मीट बैच",
      footer_youtube_classes: "यूट्यूब मास्टरक्लास",
      footer_notes_vault: "अकादमिक नोट्स भंडार",
      footer_career_roadmaps: "करियर रोडमैप",
      footer_copyright: "© 2026 काव्य गुरु। सर्वाधिकार सुरक्षित। पढ़ें • सीखें • आगे बढ़ें।",
      footer_privacy: "गोपनीयता नीति",
      footer_terms: "अध्ययन नियम व शर्तें",
      footer_honor: "छात्र आचार संहिता",

      // Toast Notifications & Status Messages
      toast_lang_switched: "भाषा बदलकर हिंदी कर दी गई 🇮🇳",
      toast_theme_light: "लाइट मोड ☀️ सक्रिय किया गया",
      toast_theme_dark: "डार्क मोड 🌙 सक्रिय किया गया",
      toast_copied: "लिंक क्लिपबोर्ड पर कॉपी हो गया! 📋",
      toast_rsvp_success: "🎉 सीट आरक्षित हो गई! गूगल मीट लिंक हेतु अपनी ईमेल देखें।",
      toast_poem_submitted: "आपकी कविता डेटाबेस में सुरक्षित कर ली गई! 🎉",
      toast_thread_posted: "काव्य गुरु चर्चा पर विषय पोस्ट हो गया! 💬",
      toast_liked: "पसंद डेटाबेस में सहेजी गई ❤️",
      toast_unliked: "पसंद हटा दी गई",
      toast_saved: "लाइब्रेरी में सहेज लिया गया 🔖",
      toast_unsaved: "लाइब्रेरी से हटाया गया",
      toast_mentorship_booked: "मार्गदर्शन सत्र बुक हो गया! हमारे काउंसलर संपर्क करेंगे। 🧭",
      toast_auth_success: "काव्य गुरु में स्वागत है, {name}! 🎉"
    }
  },

  /**
   * Initialize Localization
   */
  init() {
    this.currentLang = StorageManager.getLanguage() || "hi";
    this.applyLanguage(this.currentLang, false);
  },

  /**
   * Get translation for a given key
   */
  t(key, fallback = "") {
    const dict = this.translations[this.currentLang] || this.translations.en;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English
    if (this.translations.en && this.translations.en[key] !== undefined) {
      return this.translations.en[key];
    }
    return fallback || key;
  },

  /**
   * Get current language code ('en' or 'hi')
   */
  getLang() {
    return this.currentLang;
  },

  /**
   * Switch Language (en <-> hi)
   */
  setLanguage(lang, showToast = true) {
    const newLang = (lang === "hi") ? "hi" : "en";
    this.currentLang = newLang;
    StorageManager.setLanguage(newLang);
    this.applyLanguage(newLang, showToast);
  },

  /**
   * Toggle between EN and HI
   */
  toggleLanguage() {
    const nextLang = this.currentLang === "hi" ? "en" : "hi";
    this.setLanguage(nextLang, true);
  },

  /**
   * Apply language to DOM elements and notify App
   */
  applyLanguage(lang, showToast = true) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);

    // Update Language Switcher UI elements
    this.updateSwitcherUi(lang);

    // Translate DOM nodes with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = this.t(key);
      if (val) {
        // If element contains HTML or child icons, determine safe replace
        if (el.hasAttribute("data-i18n-html")) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Translate attributes: placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = this.t(key);
      if (val) el.setAttribute("placeholder", val);
    });

    // Translate attributes: title
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const val = this.t(key);
      if (val) el.setAttribute("title", val);
    });

    // Translate attributes: aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const key = el.getAttribute("data-i18n-aria");
      const val = this.t(key);
      if (val) el.setAttribute("aria-label", val);
    });

    // Notify listeners or App if initialized
    if (typeof App !== "undefined" && typeof App.onLanguageChange === "function") {
      App.onLanguageChange(lang);
    }

    if (showToast && typeof UIManager !== "undefined" && typeof UIManager.showToast === "function") {
      UIManager.showToast(this.t("toast_lang_switched"), "info");
    }
  },

  /**
   * Update all language switcher buttons across header/footer
   */
  updateSwitcherUi(lang) {
    const isHindi = lang === "hi";

    // Header toggle badges
    const badgeEn = document.getElementById("langOptEn");
    const badgeHi = document.getElementById("langOptHi");
    if (badgeEn && badgeHi) {
      if (isHindi) {
        badgeEn.classList.remove("active");
        badgeHi.classList.add("active");
      } else {
        badgeHi.classList.remove("active");
        badgeEn.classList.add("active");
      }
    }

    // Header toggle container button
    const toggleBtn = document.getElementById("langToggleBtn");
    if (toggleBtn) {
      toggleBtn.setAttribute("title", this.t("lang_switch_title"));
      toggleBtn.setAttribute("aria-label", this.t("lang_switch_title"));
    }

    // Footer buttons if present
    const footerBtnEn = document.getElementById("footerLangEn");
    const footerBtnHi = document.getElementById("footerLangHi");
    if (footerBtnEn && footerBtnHi) {
      if (isHindi) {
        footerBtnEn.classList.remove("active");
        footerBtnHi.classList.add("active");
      } else {
        footerBtnHi.classList.remove("active");
        footerBtnEn.classList.add("active");
      }
    }

    // Mobile Drawer Language Switcher Button Label
    const drawerLang = document.getElementById("drawerLangLabel");
    if (drawerLang) {
      drawerLang.textContent = isHindi ? "English (EN)" : "हिंदी (Hindi)";
    }
  }
};
