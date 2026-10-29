import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('.output/public');

if (fs.existsSync(publicDir)) {
  // 1. Create .nojekyll so GitHub Pages does not ignore _build directory
  fs.writeFileSync(path.join(publicDir, '.nojekyll'), '');
  console.log('✅ Created .output/public/.nojekyll');

  // 2. Adjust asset paths in index.html to be relative for subfolder deployment
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    html = html.replaceAll('/_build/', './_build/');
    html = html.replaceAll('/favicon.ico', './favicon.ico');
    fs.writeFileSync(indexPath, html, 'utf-8');
    console.log('✅ Converted absolute asset paths to relative in index.html');

    // 3. Create 404.html as a fallback for GitHub Pages SPA routing
    fs.writeFileSync(path.join(publicDir, '404.html'), html, 'utf-8');
    console.log('✅ Generated .output/public/404.html fallback');
  }
}
