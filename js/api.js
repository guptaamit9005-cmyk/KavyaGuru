/**
 * ==========================================================================
 * KAVYA GURU — Frontend API Client for Backend & Database Sync
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const ApiClient = {
  baseUrl: window.location.origin,

  async request(endpoint, options = {}) {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`[Kavya Guru API] Notice on ${endpoint}:`, err.message);
      return { error: err.message };
    }
  },

  // Health
  async getHealth() {
    return await this.request('/api/health');
  },

  // Admin Auth (Password: Ashish123)
  async adminLogin(password) {
    return await this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  },

  // Poems
  async getPoems() {
    return await this.request('/api/poems');
  },
  async createPoem(data) {
    return await this.request('/api/poems', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deletePoem(poemId) {
    return await this.request(`/api/poems/${poemId}`, { method: 'DELETE' });
  },
  async likePoem(poemId) {
    return await this.request(`/api/poems/${poemId}/like`, { method: 'POST' });
  },

  // Notes
  async getNotes() {
    return await this.request('/api/notes');
  },
  async createNote(data) {
    return await this.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteNote(noteId) {
    return await this.request(`/api/notes/${noteId}`, { method: 'DELETE' });
  },

  // Videos
  async getVideos() {
    return await this.request('/api/videos');
  },
  async createVideo(data) {
    return await this.request('/api/videos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteVideo(videoId) {
    return await this.request(`/api/videos/${videoId}`, { method: 'DELETE' });
  },

  // Courses
  async getCourses() {
    return await this.request('/api/courses');
  },
  async createCourse(data) {
    return await this.request('/api/courses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteCourse(courseId) {
    return await this.request(`/api/courses/${courseId}`, { method: 'DELETE' });
  },
  async rsvpCourse(courseId, studentName, studentEmail) {
    return await this.request('/api/courses/rsvp', {
      method: 'POST',
      body: JSON.stringify({ courseId, studentName, studentEmail })
    });
  },

  // Community
  async getCommunity() {
    return await this.request('/api/community');
  },
  async createThread(data) {
    return await this.request('/api/community', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteThread(threadId) {
    return await this.request(`/api/community/${threadId}`, { method: 'DELETE' });
  },
  async addComment(threadId, data) {
    return await this.request(`/api/community/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async likeThread(threadId) {
    return await this.request(`/api/community/${threadId}/like`, { method: 'POST' });
  },

  // User Profile
  async getUserProfile(email) {
    return await this.request(`/api/user/profile?email=${encodeURIComponent(email)}`);
  },
  async toggleSaveItem(email, itemId) {
    return await this.request('/api/user/save-item', {
      method: 'POST',
      body: JSON.stringify({ email, itemId })
    });
  },

  // Admin Stats
  async getAdminStats() {
    return await this.request('/api/admin/stats');
  }
};
