const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const readir = async (From, To) => {
  const output = fs.createWriteStream(To);
  //await createFold(To);
  console.log('ReadDir');
  const files = await fsPromises.readdir(From, {
    withFileTypes: true,
  });

  //console.log(files);
  files.forEach((file) => {
    if (path.extname(file['name']) === '.css') {
      const input = fs.createReadStream(path.join(From, file['name']), 'utf-8');
      input.on('data', (chunk) => output.write(chunk));
      input.on('error', (error) => console.log('Error', error.message));
    }
  });
};

const main = async () => {
  //   await checkAndRMcopy();
  //await createFold();
  await readir(
    path.join(__dirname, '/styles'),
    path.join(__dirname, '/project-dist/bundle.css'),
  );
};

main();
