import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'src', 'environments', 'environment.generated.ts');

let baseUrl = '';
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key === 'BASE_URL') {
      baseUrl = value.replace(/^['\"]|['\"]$/g, '');
    }
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
const output = `export const environment = {\n  baseUrl: ${JSON.stringify(normalizedBaseUrl)},\n};\n`;
fs.writeFileSync(outPath, output);
console.log(`Generated ${outPath}`);
