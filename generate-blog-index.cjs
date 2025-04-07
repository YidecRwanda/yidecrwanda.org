const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(__dirname, 'static', 'content', 'blog');
const OUTPUT_FILE = path.join(BLOG_DIR, 'index.json');

function getAllMarkdownFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllMarkdownFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

function generateBlogIndex() {
  const markdownFiles = getAllMarkdownFiles(BLOG_DIR);
  const blogIndex = markdownFiles.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      title: data.title || 'Untitled Post',
      description: data.description || '',
      date: data.date || new Date(fs.statSync(filePath).mtime).toISOString(),
      path: filePath.replace(__dirname + '/', '') // relative path
    };
  });

  // Sort by date (newest first)
  blogIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(blogIndex, null, 2));
  console.log(`✅ index.json generated with ${blogIndex.length} posts.`);
}

generateBlogIndex();
