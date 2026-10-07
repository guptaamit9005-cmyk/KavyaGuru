/**
 * ==========================================================================
 * KAVYA GURU — API Dispatcher & Router
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const { ApiRoutes, sendJson } = require('./routes');
const url = require('node:url');

async function handleApiRequest(req, res) {
  const host = (req.headers && req.headers.host) || 'localhost:3000';
  let requestPath = req.url || '/';

  // Support Vercel internal rewrite headers
  if (req.headers) {
    const matched = req.headers['x-matched-path'] || req.headers['x-invoke-path'];
    if (matched && matched.startsWith('/api')) {
      requestPath = matched;
    }
  }

  const parsedUrl = new URL(requestPath, `http://${host}`);
  const pathname = parsedUrl.pathname;
  const method = (req.method || 'GET').toUpperCase();

  // CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    return res.end();
  }

  try {
    // 1. Health
    if (pathname === '/api/health' && method === 'GET') {
      return await ApiRoutes.getHealth(req, res);
    }

    // 2. Admin Auth
    if (pathname === '/api/admin/login' && method === 'POST') {
      return await ApiRoutes.adminLogin(req, res);
    }

    // 3. Poems
    if (pathname === '/api/poems') {
      if (method === 'GET') return await ApiRoutes.getPoems(req, res);
      if (method === 'POST') return await ApiRoutes.createPoem(req, res);
    }
    const poemMatch = pathname.match(/^\/api\/poems\/([^/]+)$/);
    if (poemMatch && method === 'DELETE') {
      return await ApiRoutes.deletePoem(req, res, poemMatch[1]);
    }
    const likePoemMatch = pathname.match(/^\/api\/poems\/([^/]+)\/like$/);
    if (likePoemMatch && method === 'POST') {
      return await ApiRoutes.likePoem(req, res, likePoemMatch[1]);
    }

    // 4. Notes
    if (pathname === '/api/notes') {
      if (method === 'GET') return await ApiRoutes.getNotes(req, res);
      if (method === 'POST') return await ApiRoutes.createNote(req, res);
    }
    const noteMatch = pathname.match(/^\/api\/notes\/([^/]+)$/);
    if (noteMatch && method === 'DELETE') {
      return await ApiRoutes.deleteNote(req, res, noteMatch[1]);
    }

    // 5. Videos
    if (pathname === '/api/videos') {
      if (method === 'GET') return await ApiRoutes.getVideos(req, res);
      if (method === 'POST') return await ApiRoutes.createVideo(req, res);
    }
    const videoMatch = pathname.match(/^\/api\/videos\/([^/]+)$/);
    if (videoMatch && method === 'DELETE') {
      return await ApiRoutes.deleteVideo(req, res, videoMatch[1]);
    }

    // 6. Courses
    if (pathname === '/api/courses') {
      if (method === 'GET') return await ApiRoutes.getCourses(req, res);
      if (method === 'POST') return await ApiRoutes.createCourse(req, res);
    }
    const courseMatch = pathname.match(/^\/api\/courses\/([^/]+)$/);
    if (courseMatch && method === 'DELETE') {
      return await ApiRoutes.deleteCourse(req, res, courseMatch[1]);
    }
    if (pathname === '/api/courses/rsvp' && method === 'POST') {
      return await ApiRoutes.rsvpCourse(req, res);
    }

    // 7. Community
    if (pathname === '/api/community') {
      if (method === 'GET') return await ApiRoutes.getCommunity(req, res);
      if (method === 'POST') return await ApiRoutes.createThread(req, res);
    }
    const threadMatch = pathname.match(/^\/api\/community\/([^/]+)$/);
    if (threadMatch && method === 'DELETE') {
      return await ApiRoutes.deleteThread(req, res, threadMatch[1]);
    }
    const commentMatch = pathname.match(/^\/api\/community\/([^/]+)\/comments$/);
    if (commentMatch && method === 'POST') {
      return await ApiRoutes.addComment(req, res, commentMatch[1]);
    }
    const likeThreadMatch = pathname.match(/^\/api\/community\/([^/]+)\/like$/);
    if (likeThreadMatch && method === 'POST') {
      return await ApiRoutes.likeThread(req, res, likeThreadMatch[1]);
    }

    // 8. User Profile & Saved Items
    if (pathname === '/api/user/profile' && method === 'GET') {
      const email = parsedUrl.searchParams.get('email') || '';
      return await ApiRoutes.getUserProfile(req, res, { email });
    }
    if (pathname === '/api/user/save-item' && method === 'POST') {
      return await ApiRoutes.toggleSaveItem(req, res);
    }

    // 9. Admin Stats
    if (pathname === '/api/admin/stats' && method === 'GET') {
      return await ApiRoutes.getAdminStats(req, res);
    }

    // 404
    sendJson(res, 404, { error: `Endpoint ${pathname} not found on Kavya Guru API` });
  } catch (err) {
    console.error('API Error:', err);
    sendJson(res, 500, { error: 'Internal server error', details: err.message });
  }
}

module.exports = {
  handleApiRequest
};
