const fs = require('fs');
const path = require('path');

const dir = './src/pages';
function walk(currentDir) {
  let files = [];
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allTsx = walk(dir);
let modifiedCount = 0;

for (const file of allTsx) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('> Export') || content.includes('Export brief') || content.includes('Export Reports')) {
    if (!content.includes('import toast from \'react-hot-toast\'')) {
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + "import toast from 'react-hot-toast';\n" + content.slice(nextLineIndex + 1);
        changed = true;
      }
    }

    const regex = /<button type="button" className="btn btn-secondary">(\s*<Download.*?\/>\s*Export.*?)\s*<\/button>/g;
    if (regex.test(content)) {
        content = content.replace(regex, `<button type="button" className="btn btn-secondary" onClick={() => toast.success('Export downloaded successfully')}>$1</button>`);
        changed = true;
    }
    
    const dashboardRegex = /<button type="button" className="btn btn-secondary">\s*<Download size={17} \/>\s*Export brief\s*<\/button>/g;
    if (dashboardRegex.test(content)) {
        content = content.replace(dashboardRegex, `<button type="button" className="btn btn-secondary" onClick={() => toast.success('Export downloaded successfully')}>\n            <Download size={17} />\n            Export brief\n          </button>`);
        changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Fixed', file);
  }
}

console.log(`Modified ${modifiedCount} files.`);
