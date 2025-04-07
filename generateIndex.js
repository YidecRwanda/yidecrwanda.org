const fs = require("fs");
const path = require("path");

const BLOG_ROOT = path.join(__dirname, "static/content/blog");
const OUTPUT_FILE = path.join(BLOG_ROOT, "index.json");

// Recursively get all markdown files
function getAllMarkdownFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".md")
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

// Get metadata for each post
function getFileMetadata(filePath) {
  const stat = fs.statSync(filePath);
  return {
    path: path.relative(path.join(__dirname, "static"), filePath).replace(/\\/g, "/"),
    date: stat.mtime.toISOString()
  };
}

// Generate the blog index
function generateIndex() {
  try {
    const markdownFiles = getAllMarkdownFiles(BLOG_ROOT);

    if (markdownFiles.length === 0) {
      console.log("⚠️  No markdown files found.");
      return;
    }

    console.log("📄 Found markdown files:");
    markdownFiles.forEach(f => console.log(" -", f));

    const posts = markdownFiles.map(getFileMetadata);
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    console.log(`✅ Successfully wrote ${posts.length} entries to index.json`);
  } catch (err) {
    console.error("❌ Error generating index:", err.message);
    process.exit(1);
  }
}

generateIndex();
