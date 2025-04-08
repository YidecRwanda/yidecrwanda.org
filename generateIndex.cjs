const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const BLOG_ROOT = path.join(__dirname, "static/content/blog");
const OUTPUT_FILE = path.join(BLOG_ROOT, "index.json");

// Recursively find all markdown files
function getAllMarkdownFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }

  return results;
}

// Capitalize metadata keys
function capitalizeKeys(obj) {
  const newObj = {};
  for (const key in obj) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    newObj[capitalizedKey] = obj[key];
  }
  return newObj;
}

// Extract metadata from a markdown file
function getFileMetadata(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);
  const stat = fs.statSync(filePath);
  const frontmatter = capitalizeKeys(data);

  // Ensure required fields
  if (!frontmatter.Title) {
    console.warn(`⚠️ Skipping file (missing Title): ${filePath}`);
    return null;
  }

  const date = frontmatter.Date || stat.mtime.toISOString();
  return {
    ...frontmatter,
    Date: new Date(date).toISOString(),
    Path: path.relative(path.join(__dirname, "static"), filePath).replace(/\\/g, "/")
  };
}

// Main function
function generateIndex() {
  try {
    const markdownFiles = getAllMarkdownFiles(BLOG_ROOT);

    if (markdownFiles.length === 0) {
      console.log("⚠️ No markdown files found.");
      return;
    }

    console.log("📄 Found markdown files:");
    markdownFiles.forEach((f) => console.log(" -", f));

    const posts = markdownFiles
      .map(getFileMetadata)
      .filter(Boolean) // Remove nulls
      .sort((a, b) => new Date(b.Date) - new Date(a.Date));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    console.log(`✅ Successfully wrote ${posts.length} entries to index.json`);
  } catch (err) {
    console.error("❌ Error generating index:", err.message);
    process.exit(1);
  }
}

generateIndex();
