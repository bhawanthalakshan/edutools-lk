const express = require('express');
const router = express.Router();
const { getClientUrl } = require('../config/siteConfig');

router.get('/', (req, res) => {
  const clientUrl = getClientUrl();
  const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${clientUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(content);
});

module.exports = router;
