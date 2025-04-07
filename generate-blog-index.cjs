const fs = require('fs');
const path = require('path');

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

