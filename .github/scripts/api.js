const fs = require('fs');

const patchContent = fs.readFileSync('diff.patch', 'utf8');

console.log('Patch file content:');
console.log(patchContent);

const data = {
  patch: patchContent,
  timestamp: new Date().toISOString(),
  size: Buffer.byteLength(patchContent, 'utf8')
};

fs.writeFileSync('diff-output.json', JSON.stringify(data, null, 2));

console.log('Diff processed and saved to diff-output.json');
