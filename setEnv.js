const fs = require('fs');
const envFile = __dirname + '/.env';
fs.createWriteStream(envFile).end();
console.log(process.argv[2]);
console.log(process.argv[3]);

const  writeStream = fs.createWriteStream(envFile);
writeStream.write(`REACT_APP_NOT_SECRET_CODE=${process.argv[2]}`);
writeStream.write(`\n`)
writeStream.write(`REACT_APP_SERVER_URL=${process.argv[3]}`);
writeStream.end();