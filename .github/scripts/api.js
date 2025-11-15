
const fs = require('fs');
const path = require('path');

function parseToon(text) {
  const lines = text.split('\n');
  const data = { baseBranch: '', currentBranch: '', diff: '' };
  let inDiff = false;
  const diffLines = [];

  for (let raw of lines) {
    const line = raw.replace(/\r$/, ''); // drop CR if any
    const trimmed = line.trimStart();

    if (!inDiff && trimmed.startsWith('baseBranch:')) {
      data.baseBranch = trimmed.slice('baseBranch:'.length).trim();
      continue;
    }
    if (!inDiff && trimmed.startsWith('currentBranch:')) {
      data.currentBranch = trimmed.slice('currentBranch:'.length).trim();
      continue;
    }
    if (!inDiff && trimmed.startsWith('diff:')) {
      inDiff = true;
      continue;
    }
    if (inDiff) {
      // remove the 4-space prefix we added in workflow, if present
      diffLines.push(line.replace(/^\s{4}/, ''));
    }
  }

  data.diff = diffLines.join('\n').trim();
  return data;
}

async function main() {
  const toonPath = path.join(process.cwd(), 'diff.toon');
  if (!fs.existsSync(toonPath)) {
    fs.writeFileSync('api_response.txt', JSON.stringify({ error: 'diff.toon not found' }, null, 2));
    process.exit(1);
  }

  const raw = fs.readFileSync(toonPath, 'utf8');
  const parsed = parseToon(raw);

  const payload = {
    messages: [{ role: 'user', content: `Review this:\n${parsed.diff}` }],
    meta: { baseBranch: parsed.baseBranch, currentBranch: parsed.currentBranch }
  };

  // If no API_URL provided, write payload to api_response.txt and exit OK
  if (!process.env.API_URL) {
    fs.writeFileSync('api_response.txt', JSON.stringify({ simulated: true, payload }, null, 2));
    return;
  }

  try {
    const res = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY || ''}`
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let result;
    try { result = JSON.parse(text); } catch { result = { text }; }

    fs.writeFileSync('api_response.txt', JSON.stringify({ status: res.status, result }, null, 2));
  } catch (err) {
    fs.writeFileSync('api_response.txt', JSON.stringify({ error: String(err) }, null, 2));
    process.exit(1);
  }
}

main();
