const fs = require('fs');

console.log('Starting API script...');
console.log('Current directory:', process.cwd());
console.log('Files in directory:', fs.readdirSync('.'));

const toonContent = fs.readFileSync('./diff.toon', 'utf8');
console.log('Toon file read successfully');

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
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;
  
  if (!apiUrl || !apiKey) {
    console.log('No API credentials, using dummy response');
    const dummyResponse = `## Code Review\n\nAPI credentials not configured. Using dummy review.\n\n- Code structure looks good\n- Consider adding tests\n- Documentation could be improved`;
    fs.writeFileSync('api_response.txt', dummyResponse);
    console.log('Dummy response written');
    return;
  }
  
  try {
    const payload = {
      messages: [
        {
          role: "user",
          content: `Review this:\n${diffData.diff}`
        }
      ]
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Extract text from Claude API response
    let responseText = '';
    if (result.content && result.content[0] && result.content[0].text) {
      responseText = result.content[0].text;
    } else if (typeof result === 'string') {
      responseText = result;
    } else {
      responseText = JSON.stringify(result, null, 2);
    }
    
    fs.writeFileSync('api_response.txt', responseText);
  } catch (error) {
    fs.writeFileSync('api_response.txt', `Error: ${error.message}`);
    process.exit(1);
  }
}

sendToAPI().catch(error => {
  console.error('Script failed:', error.message);
  fs.writeFileSync('api_response.txt', `Error: ${error.message}`);
  process.exit(1);
});






