const fs = require("fs");
const path = require("path");

const BLOG_ROOT = path.join(__dirname, "static/content/blog");
const OUTPUT_FILE = path.join(BLOG_ROOT, "index.json");

function getAllMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllMarkdownFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getFileMetadata(filePath) {
  const stat = fs.statSync(filePath);
  return {
    path: path.relative(BLOG_ROOT, filePath).replace(/\\/g, "/"),
    date: stat.mtime.toISOString()
  };
}

function generateIndex() {
  const markdownFiles = getAllMarkdownFiles(BLOG_ROOT);
  const posts = markdownFiles.map(getFileMetadata);

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`✅ index.json updated with ${posts.length} posts`);
}

generateIndex();
