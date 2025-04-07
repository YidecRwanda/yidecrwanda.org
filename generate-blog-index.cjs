const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(__dirname, 'static', 'content', 'blog');
const OUTPUT_FILE = path.join(BLOG_DIR, 'index.json');

function getAllMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nestedFiles = getAllMarkdownFiles(fullPath);
      files.push(...nestedFiles);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function generateIndex() {
  const files = getAllMarkdownFiles(BLOG_DIR);

  const posts = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    const relativePath = path.relative(BLOG_DIR, filePath);
    const slug = relativePath.replace(/\.md$/, '');

    return {
      title: data.title || 'Untitled',
      date: data.date || null,
      path: slug.replace(/\\/g, '/'),
    };
  });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`✅ Blog index generated with ${posts.length} posts`);
}

generateIndex();
