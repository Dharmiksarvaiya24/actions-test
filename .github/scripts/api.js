const fs = require('fs');
const https = require('https');

const diff = fs.readFileSync('diff.patch', 'utf8');
const data = JSON.stringify({
  prompt: `Review this GitHub pull request and provide a summary : \n \n${diff}`
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
      let review = result.response || result.result;
      
      if (typeof review === 'object') {
        review = review.text || review.content || review.response || JSON.stringify(review);
      }
      
      fs.writeFileSync('pr-review.txt', review);
      console.log('Review saved to pr-review.txt');
    } catch (error) {
      console.error('Error parsing response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.write(data);
req.end();
