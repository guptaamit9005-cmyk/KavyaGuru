/**
 * ==========================================================================
 * KAVYA GURU — Vercel Serverless Function Dispatcher
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const { handleApiRequest } = require('../backend/apiHandler');

module.exports = async function handler(req, res) {
  // If Vercel rewrote the URL, preserve original request path
  if (req.headers) {
    const matched = req.headers['x-matched-path'] || req.headers['x-invoke-path'];
    if (matched && matched.startsWith('/api') && (!req.url || req.url === '/api' || req.url === '/api/index.js')) {
      req.url = matched;
    }
  }

  return handleApiRequest(req, res);
};
