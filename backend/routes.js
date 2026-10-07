/**
 * ==========================================================================
 * KAVYA GURU — Backend REST API Route Controllers
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const { db } = require('./db');

const ApiRoutes = {
  // 1. Health & Brand Status
  async getHealth(req, res) {
    sendJson(res, 200, {
      status: "online",
      brand: "Kavya Guru",
      tagline: "Read • Learn • Grow",
      description: "Kavya Guru is your space for poetry, knowledge, learning, courses and career guidance.",
      timestamp: new Date().toISOString()
    });
  },

  // 2. Admin Authentication (Password: Ashish123)
  async adminLogin(req, res) {
    const body = await parseJsonBody(req);
    const { password } = body;

    const row = db.prepare("SELECT value FROM admin_config WHERE key = 'admin_password'").get();
    const expectedPassword = row ? row.value : 'Ashish123';

    if (password === expectedPassword) {
      sendJson(res, 200, {
        success: true,
        message: "Admin authentication successful",
        token: `kg-admin-${Date.now()}`
      });
    } else {
      sendJson(res, 401, {
        success: false,
        error: "Incorrect Admin Password"
      });
    }
  },

  // 3. Poetry Endpoints
  async getPoems(req, res) {
    const poems = db.prepare('SELECT * FROM poetry ORDER BY created_at DESC').all();
    sendJson(res, 200, poems);
  },

  async createPoem(req, res) {
    const body = await parseJsonBody(req);
    const { title, poet, language, category, year, stanza, meaning, stanza_trans, meaning_trans, image_url, pdf_url } = body;

    if (!title || !stanza) {
      return sendJson(res, 400, { error: "Title and stanza are required" });
    }

    const id = `kg-p-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO poetry (id, title, poet, language, category, year, reads, likes, stanza, meaning, stanza_trans, meaning_trans, image_url, pdf_url, is_custom)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, 1)
    `);

    stmt.run(
      id,
      title,
      poet || 'Kavya Guru Member',
      language || 'hindi',
      category || 'modern',
      year || new Date().getFullYear().toString(),
      stanza,
      meaning || '',
      stanza_trans || null,
      meaning_trans || null,
      image_url || null,
      pdf_url || null
    );

    const created = db.prepare('SELECT * FROM poetry WHERE id = ?').get(id);
    sendJson(res, 201, created);
  },

  async deletePoem(req, res, poemId) {
    db.prepare('DELETE FROM poetry WHERE id = ?').run(poemId);
    sendJson(res, 200, { success: true, id: poemId });
  },

  async likePoem(req, res, poemId) {
    const poem = db.prepare('SELECT * FROM poetry WHERE id = ?').get(poemId);
    if (!poem) {
      return sendJson(res, 404, { error: "Poem not found" });
    }

    db.prepare('UPDATE poetry SET likes = likes + 1 WHERE id = ?').run(poemId);
    const updated = db.prepare('SELECT * FROM poetry WHERE id = ?').get(poemId);
    sendJson(res, 200, { id: poemId, likes: updated.likes });
  },

  // 4. Notes Endpoints
  async getNotes(req, res) {
    const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
    const formatted = notes.map(n => ({
      ...n,
      chapters: JSON.parse(n.chapters_json || '[]'),
      keyPoints: JSON.parse(n.key_points_json || '[]')
    }));
    sendJson(res, 200, formatted);
  },

  async createNote(req, res) {
    const body = await parseJsonBody(req);
    const { title, subject, grade, readTime, summary, chapters, keyPoints } = body;

    if (!title || !subject) {
      return sendJson(res, 400, { error: "Title and subject are required" });
    }

    const id = `kg-n-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO notes (id, title, subject, grade, read_time, downloads, summary, chapters_json, key_points_json)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    `);

    stmt.run(
      id,
      title,
      subject,
      grade || 'All Classes',
      readTime || '10 min read',
      summary || '',
      JSON.stringify(chapters || ['Introduction', 'Important Concepts']),
      JSON.stringify(keyPoints || ['Key study takeaways'])
    );

    const created = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    sendJson(res, 201, {
      ...created,
      chapters: JSON.parse(created.chapters_json || '[]'),
      keyPoints: JSON.parse(created.key_points_json || '[]')
    });
  },

  async deleteNote(req, res, noteId) {
    db.prepare('DELETE FROM notes WHERE id = ?').run(noteId);
    sendJson(res, 200, { success: true, id: noteId });
  },

  // 5. YouTube Video Resources (Real Links opened on YouTube)
  async getVideos(req, res) {
    const videos = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all();
    sendJson(res, 200, videos);
  },

  async createVideo(req, res) {
    const body = await parseJsonBody(req);
    const rawUrl = body.url || body.youtube_url;
    const { title, channel, duration, category, description } = body;

    if (!title || !rawUrl) {
      return sendJson(res, 400, { error: "Title and YouTube URL are required" });
    }

    // Extract YouTube ID
    let ytId = '';
    const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      ytId = match[1];
    } else {
      ytId = rawUrl.trim();
    }

    const cleanYoutubeUrl = ytId.length === 11 ? `https://www.youtube.com/watch?v=${ytId}` : rawUrl;
    const thumbnail = ytId.length === 11 ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';

    const id = `kg-v-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO videos (id, title, channel, duration, views, category, thumbnail, youtube_url, youtube_id, description)
      VALUES (?, ?, ?, ?, '0', ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      title,
      channel || 'Kavya Guru YouTube',
      duration || 'Lecture',
      category || 'Educational',
      thumbnail,
      cleanYoutubeUrl,
      ytId,
      description || ''
    );

    const created = db.prepare('SELECT * FROM videos WHERE id = ?').get(id);
    sendJson(res, 201, created);
  },

  async deleteVideo(req, res, videoId) {
    db.prepare('DELETE FROM videos WHERE id = ?').run(videoId);
    sendJson(res, 200, { success: true, id: videoId });
  },

  // 6. Google Meet Courses
  async getCourses(req, res) {
    const courses = db.prepare('SELECT * FROM meet_courses ORDER BY created_at DESC').all();
    const formatted = courses.map(c => ({
      ...c,
      highlights: JSON.parse(c.highlights_json || '[]'),
      curriculum: JSON.parse(c.curriculum_json || '[]')
    }));
    sendJson(res, 200, formatted);
  },

  async createCourse(req, res) {
    const body = await parseJsonBody(req);
    const { title, instructor, date, time, fee, badge, highlights } = body;
    const meetLink = body.meetLink || body.meet_link;
    const seatsTotal = body.seatsTotal || body.seats_total || 50;

    if (!title || !meetLink) {
      return sendJson(res, 400, { error: "Title and Google Meet link are required" });
    }

    const id = `kg-mc-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO meet_courses (id, title, instructor, date, time, platform, meet_link, status, seats_total, seats_booked, badge, fee, highlights_json, curriculum_json)
      VALUES (?, ?, ?, ?, ?, 'Google Meet', ?, 'Registration Open', ?, 0, ?, ?, ?, '[]')
    `);

    stmt.run(
      id,
      title,
      instructor || 'Kavya Guru Faculty',
      date || 'Upcoming Weekend',
      time || '6:00 PM IST',
      meetLink,
      parseInt(seatsTotal, 10) || 50,
      badge || 'Live Masterclass',
      fee || 'Free for Students',
      JSON.stringify(highlights || ['Live Interactive Discussion', 'Q&A with Instructor'])
    );

    const created = db.prepare('SELECT * FROM meet_courses WHERE id = ?').get(id);
    sendJson(res, 201, {
      ...created,
      highlights: JSON.parse(created.highlights_json || '[]'),
      curriculum: JSON.parse(created.curriculum_json || '[]')
    });
  },

  async deleteCourse(req, res, courseId) {
    db.prepare('DELETE FROM meet_courses WHERE id = ?').run(courseId);
    sendJson(res, 200, { success: true, id: courseId });
  },

  async rsvpCourse(req, res) {
    const body = await parseJsonBody(req);
    const { courseId, studentName, studentEmail } = body;

    if (!courseId || !studentName || !studentEmail) {
      return sendJson(res, 400, { error: "courseId, studentName, and studentEmail are required" });
    }

    const course = db.prepare('SELECT * FROM meet_courses WHERE id = ?').get(courseId);
    if (!course) {
      return sendJson(res, 404, { error: "Course not found" });
    }

    const enrollmentId = `en-${Date.now()}`;
    db.prepare(`
      INSERT INTO enrollments (id, course_id, student_name, student_email)
      VALUES (?, ?, ?, ?)
    `).run(enrollmentId, courseId, studentName, studentEmail);

    db.prepare('UPDATE meet_courses SET seats_booked = seats_booked + 1 WHERE id = ?').run(courseId);

    db.prepare(`
      INSERT OR IGNORE INTO users (id, name, email, role, avatar)
      VALUES (?, ?, ?, 'Student Member', ?)
    `).run(`u-${Date.now()}`, studentName, studentEmail, studentName.slice(0, 2).toUpperCase());

    sendJson(res, 201, {
      message: `Enrolled successfully in ${course.title}`,
      courseId,
      meetLink: course.meet_link,
      studentName,
      studentEmail
    });
  },

  // 7. Community Threads & Comments (Charcha)
  async getCommunity(req, res) {
    const threads = db.prepare('SELECT * FROM community_threads ORDER BY created_at DESC').all();
    const comments = db.prepare('SELECT * FROM thread_comments ORDER BY created_at ASC').all();

    const formatted = threads.map(th => {
      const threadComments = comments.filter(c => c.thread_id === th.id);
      return {
        ...th,
        commentsCount: threadComments.length,
        comments: threadComments
      };
    });

    sendJson(res, 200, formatted);
  },

  async createThread(req, res) {
    const body = await parseJsonBody(req);
    const { author, role, avatar, tag, title, content } = body;

    if (!title || !content) {
      return sendJson(res, 400, { error: "Title and content are required" });
    }

    const threadId = `th-${Date.now()}`;
    db.prepare(`
      INSERT INTO community_threads (id, author, role, avatar, tag, title, content, likes)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      threadId,
      author || 'Student',
      role || 'Student Member',
      avatar || 'KG',
      tag || 'Study Circle',
      title,
      content
    );

    const created = db.prepare('SELECT * FROM community_threads WHERE id = ?').get(threadId);
    sendJson(res, 201, { ...created, comments: [] });
  },

  async deleteThread(req, res, threadId) {
    db.prepare('DELETE FROM community_threads WHERE id = ?').run(threadId);
    sendJson(res, 200, { success: true, id: threadId });
  },

  async addComment(req, res, threadId) {
    const body = await parseJsonBody(req);
    const { author, text } = body;

    if (!text) {
      return sendJson(res, 400, { error: "Comment text is required" });
    }

    const commentId = `c-${Date.now()}`;
    db.prepare(`
      INSERT INTO thread_comments (id, thread_id, author, text)
      VALUES (?, ?, ?, ?)
    `).run(commentId, threadId, author || 'Student', text);

    const created = db.prepare('SELECT * FROM thread_comments WHERE id = ?').get(commentId);
    sendJson(res, 201, created);
  },

  async likeThread(req, res, threadId) {
    db.prepare('UPDATE community_threads SET likes = likes + 1 WHERE id = ?').run(threadId);
    const updated = db.prepare('SELECT * FROM community_threads WHERE id = ?').get(threadId);
    sendJson(res, 200, { id: threadId, likes: updated ? updated.likes : 0 });
  },

  // 8. User Profile & Saved Items
  async getUserProfile(req, res, query) {
    const email = query.email || '';
    if (!email) {
      return sendJson(res, 200, { savedItems: [], enrolledCourses: [] });
    }

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      user = {
        id: `u-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'Student Member',
        avatar: email.slice(0, 2).toUpperCase(),
        streak_days: 1
      };
      db.prepare(`
        INSERT INTO users (id, name, email, role, avatar, streak_days)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(user.id, user.name, user.email, user.role, user.avatar, user.streak_days);
    }

    const savedRows = db.prepare('SELECT item_id FROM saved_items WHERE user_email = ?').all(email);
    const enrollRows = db.prepare('SELECT course_id FROM enrollments WHERE student_email = ?').all(email);

    sendJson(res, 200, {
      ...user,
      streakDays: user.streak_days,
      savedItems: savedRows.map(r => r.item_id),
      enrolledCourses: enrollRows.map(r => r.course_id)
    });
  },

  async toggleSaveItem(req, res) {
    const body = await parseJsonBody(req);
    const { email, itemId } = body;

    if (!email || !itemId) {
      return sendJson(res, 400, { error: "Email and itemId are required" });
    }

    const existing = db.prepare('SELECT id FROM saved_items WHERE user_email = ? AND item_id = ?').get(email, itemId);
    let isSaved = false;
    if (existing) {
      db.prepare('DELETE FROM saved_items WHERE id = ?').run(existing.id);
      isSaved = false;
    } else {
      db.prepare('INSERT INTO saved_items (id, user_email, item_id) VALUES (?, ?, ?)').run(
        `s-${Date.now()}`,
        email,
        itemId
      );
      isSaved = true;
    }

    sendJson(res, 200, { itemId, isSaved });
  },

  // 9. Admin Stats & Catalog Overview
  async getAdminStats(req, res) {
    const poemsCount = db.prepare('SELECT COUNT(*) as count FROM poetry').get().count;
    const notesCount = db.prepare('SELECT COUNT(*) as count FROM notes').get().count;
    const videosCount = db.prepare('SELECT COUNT(*) as count FROM videos').get().count;
    const meetCount = db.prepare('SELECT COUNT(*) as count FROM meet_courses').get().count;
    const studentsCount = db.prepare('SELECT COUNT(*) as count FROM enrollments').get().count;
    const threadsCount = db.prepare('SELECT COUNT(*) as count FROM community_threads').get().count;

    sendJson(res, 200, {
      poems: poemsCount,
      notes: notesCount,
      videos: videosCount,
      meetCourses: meetCount,
      students: studentsCount,
      communityThreads: threadsCount
    });
  }
};

// Helper: Response Formatter
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  res.end(JSON.stringify(data));
}

// Helper: Request Body Parser (Supports both standalone Node stream & pre-parsed Vercel Serverless bodies)
function parseJsonBody(req) {
  return new Promise((resolve) => {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'object') {
        return resolve(req.body);
      }
      if (typeof req.body === 'string') {
        try {
          return resolve(req.body ? JSON.parse(req.body) : {});
        } catch {
          return resolve({});
        }
      }
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = {
  ApiRoutes,
  sendJson
};
