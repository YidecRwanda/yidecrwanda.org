const fs = require('fs');
const path = require('path');
<<<<<<< HEAD

const blogFolder = path.join(__dirname, 'static', 'content', 'blog');
const outputFile = path.join(blogFolder, 'index.json');

function walk(dir) {
  let files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (file.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walk(blogFolder);

const posts = allFiles.map(filepath => {
  const content = fs.readFileSync(filepath, 'utf-8');
  const match = content.match(/date:\s*(.*)/i);
  const date = match ? new Date(match[1]) : new Date();
  const relativePath = filepath.split('static/')[1];
  return { path: 'static/' + relativePath.replace(/\\/g, '/'), date: date.toISOString() };
});

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`✅ index.json generated with ${posts.length} posts.`);

=======
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
>>>>>>> 50cd77992d4aa3abb9cb6e0771e4b22ec602226e
