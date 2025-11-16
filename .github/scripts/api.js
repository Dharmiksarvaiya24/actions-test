const fs = require('fs');
const https = require('https');

const diff = fs.readFileSync('diff.patch', 'utf8');

const data = JSON.stringify({
  prompt: `Review this PR for correctness, code quality, performance, security, and potential issues, then provide approval : \n \n${diff}`
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_KEY}`
  }
};

const req = https.request(process.env.API_URL, options, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.write(data);
req.end();
