// generateIndex.js
const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'static/content/blog');
const OUTPUT_FILE = path.join(BLOG_DIR, 'index.json');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.md')) {
      const relPath = path.relative(__dirname, filePath).replace(/\\/g, '/');
      const stats = fs.statSync(filePath);
      results.push({
        path: relPath,
        date: stats.mtime.toISOString(),
      });
    }
  });

  return results;
}

const posts = walk(BLOG_DIR).sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
console.log(`Generated ${posts.length} posts in ${OUTPUT_FILE}`);
