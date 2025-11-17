const fs = require('fs');
const https = require('https');

const diff = fs.readFileSync('diff.patch', 'utf8');

const data = JSON.stringify({
  prompt: `Review this GitHub pull request and provide a concise 3–4 line summary covering correctness, code quality, performance, security, and any potential issues. End with a clear approval or rejection. : \n \n${diff}`
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
  let response = '';
  
  res.on('data', (chunk) => {
    response += chunk.toString();
  });
  
  res.on('end', () => {
    console.log('Full Response:', response);
    try {
      const result = JSON.parse(response);
      console.log('Parsed result:', result);
      
      if (!result.result) {
        console.log('ERROR: result.result is empty');
        fs.writeFileSync('pr-review.txt', 'No review generated');
        return;
      }
      
      let review = result.response || result.result;
      if (typeof review === 'object') {
        review = review.text || review.content || review.response || JSON.stringify(review);
      }
      console.log('Review content:', review);
      
      fs.writeFileSync('pr-review.txt', review);
      console.log('Review saved successfully');
    } catch (err) {
      console.error('Error parsing response:', err);
      fs.writeFileSync('pr-review.txt', `Error: ${err.message}`);
    }
  });
});

req.write(data);
req.end();
