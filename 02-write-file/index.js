const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, '02-write-file.txt'));
stdout.write('Enter line that adding into .txt:  , ');
stdin.on('data', (data) => {
  stdout.write('if you need to adding again anything:  ');
  output.write(data);
});
process.on('SIGINT', function () {
  console.log('\nGoodbye!');
  process.exit();
});
