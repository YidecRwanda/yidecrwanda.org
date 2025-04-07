const fs = require("fs");
const path = require("path");

const BLOG_ROOT = path.join(__dirname, "static/content/blog");
const OUTPUT_FILE = path.join(BLOG_ROOT, "index.json");

function getAllMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (file.endsWith(".md")) {
      results.push(fullPath);
    }
  });

  return results;
}

function getFileMetadata(filePath) {
  const stat = fs.statSync(filePath);
  return {
    path: path.relative("static", filePath).replace(/\\/g, "/"),
    date: stat.mtime.toISOString()
  };
}

function generateIndex() {
  const markdownFiles = getAllMarkdownFiles(BLOG_ROOT);
  
  // Debug log to check what files are being picked up
  console.log("📄 Files found:");
  markdownFiles.forEach(f => console.log(" -", f));

  console.log(`🔍 Found ${markdownFiles.length} markdown files`);

  const posts = markdownFiles.map(getFileMetadata);
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`✅ Successfully wrote ${posts.length} entries to index.json`);
}

generateIndex();
