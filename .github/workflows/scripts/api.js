const fs = require('fs');

const toonContent = fs.readFileSync('./diff.toon', 'utf8');

function parseToon(content) {
  const lines = content.split('\n');
  const data = { baseBranch: '', currentBranch: '', diff: '' };
  let inDiff = false;
  let diffLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('baseBranch:')) {
      data.baseBranch = line.replace('baseBranch:', '').trim();
    } else if (line.startsWith('currentBranch:')) {
      data.currentBranch = line.replace('currentBranch:', '').trim();
    } else if (line.startsWith('diff:')) {
      inDiff = true;
      continue;
    }
    if (inDiff) {
      diffLines.push(line);
    }
  }
  
  data.diff = diffLines.join('\n').trim();
  return data;
}

const diffData = parseToon(toonContent);

async function sendToAPI() {
  const payload = {
    messages: [
      {
        role: "user",
        content: `Review this:\n${diffData.diff}`
      }
    ]
  };
  
  const response = await fetch(process.env.API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  fs.writeFileSync('api_response.txt', JSON.stringify(result));
}

sendToAPI();
