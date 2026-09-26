import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputs = { main: path.resolve(root, 'index.html') };
for (const file of ['products.html', 'services.html', 'gallery.html', 'clients.html', 'about-us.html', 'contact-us.html']) {
  inputs[file.replace('.html','')] = path.resolve(root, file);
}
for (const folder of ['products', 'services']) {
  if (!fs.existsSync(path.resolve(root, folder))) continue;
  for (const file of fs.readdirSync(path.resolve(root, folder)).filter((file) => file.endsWith('.html'))) {
    inputs[`${folder}-${file.replace('.html','')}`] = path.resolve(root, folder, file);
  }
}

export default defineConfig({
  plugins: [{
    name: 'base-styles-before-page-overrides',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const baseStyles = [];
        const result = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]+\.css"[^>]*>/g, (tag) => {
          baseStyles.push(tag);
          return '';
        });
        return result.replace('<head>', '<head>' + baseStyles.join(''));
      }
    }
  }],
  build: { rollupOptions: { input: inputs } }
});
