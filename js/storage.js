/**
 * ==========================================================================
 * KAVYA GURU — Local State & Session Store
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const STORAGE_KEYS = {
  THEME: "kavya_guru_theme",
  LANG: "kavya_guru_lang",
  USER: "kavya_guru_user",
  ADMIN_TOKEN: "kavya_guru_admin_token",
  LIKED_POEMS: "kavya_guru_liked_poems",
  SAVED_ITEMS: "kavya_guru_saved_items",
  ENROLLED_COURSES: "kavya_guru_enrolled_courses"
};

const StorageManager = {
  // Language Management (Multilingual: English & Hindi)
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANG) || "hi";
  },
  setLanguage(lang) {
    const valid = lang === "hi" ? "hi" : "en";
    localStorage.setItem(STORAGE_KEYS.LANG, valid);
    document.documentElement.setAttribute("lang", valid);
    document.documentElement.setAttribute("data-lang", valid);
    return valid;
  },

  // Theme Management
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute("data-theme", theme);
  },

  // Admin Session State
  isAdminLoggedIn() {
    return Boolean(localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN));
  },
  setAdminSession(token) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
  },
  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  },

  // Student / User Auth State
  getUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      const defaultUser = {
        name: "Student",
        email: "student@kavyaguru.com",
        role: "Student Member",
        avatar: "KG",
        streakDays: 1,
        savedItems: [],
        enrolledCourses: [],
        isLoggedIn: true
      };
      this.setUser(defaultUser);
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  logout() {
    const guest = {
      name: "Guest Student",
      email: "",
      role: "Guest",
      avatar: "G",
      streakDays: 0,
      savedItems: [],
      enrolledCourses: [],
      isLoggedIn: false
    };
    this.setUser(guest);
    return guest;
  },

  // Liked Poems
  getLikedPoems() {
    const raw = localStorage.getItem(STORAGE_KEYS.LIKED_POEMS);
    return raw ? JSON.parse(raw) : [];
  },
  toggleLikePoem(poemId) {
    let likes = this.getLikedPoems();
    const index = likes.indexOf(poemId);
    let isLiked = false;
    if (index > -1) {
      likes.splice(index, 1);
      isLiked = false;
    } else {
      likes.push(poemId);
      isLiked = true;
    }
    localStorage.setItem(STORAGE_KEYS.LIKED_POEMS, JSON.stringify(likes));
    return { isLiked, totalLiked: likes.length };
  },

  // Saved Library Items
  getSavedItems() {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_ITEMS);
    return raw ? JSON.parse(raw) : [];
  },
  toggleSaveItem(itemId) {
    let saved = this.getSavedItems();
    const index = saved.indexOf(itemId);
    let isSaved = false;
    if (index > -1) {
      saved.splice(index, 1);
      isSaved = false;
    } else {
      saved.push(itemId);
      isSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(saved));
    
    const user = this.getUser();
    if (user) {
      user.savedItems = saved;
      this.setUser(user);
    }
    return { isSaved, totalSaved: saved.length };
  },

  // Course Enrollments
  getEnrolledCourses() {
    const raw = localStorage.getItem(STORAGE_KEYS.ENROLLED_COURSES);
    return raw ? JSON.parse(raw) : [];
  },
  enrollInCourse(courseId) {
    let list = this.getEnrolledCourses();
    if (!list.includes(courseId)) {
      list.push(courseId);
      localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(list));
      
      const user = this.getUser();
      if (user) {
        user.enrolledCourses = list;
        this.setUser(user);
      }
    }
    return list;
  }
};
