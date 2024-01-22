const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const checkAndRMcopy = async (To) => {
  console.log('checkAndRMcopy');
  try {
    await fsPromises.rm(To, {
      recursive: true,
    });
  } catch (error) {
    console.error(error);
  }
};

const createFold = async (To) => {
  console.log('CreateDirec');
  try {
    await fsPromises.mkdir(
      To,
      //  console.log('Directory created successfully!');
    );
  } catch (error) {
    console.error(error);
  }
};

const readir = async (From, To) => {
  await createFold(To);
  console.log('ReadDir');
  const files = await fsPromises.readdir(From, {
    withFileTypes: true,
  });

  console.log(files);

  files.forEach((file) => {
    //  console.log(files);
    if (file.isDirectory()) {
      readir(path.join(From, file['name']), path.join(To, file['name']));
    }
    fs.copyFile(
      `${path.join(From, file['name'])}`,
      `${path.join(To, file['name'])}`,
      (err) => {
        if (err) {
          console.log('Error Found:', err);
        }
      },
    );
  });
};

const readirStyle = async (From, To) => {
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
  //create folder for style.css
  await createFold(path.join(__dirname, '/project-dist'));
  //upd style.css
  await readirStyle(
    path.join(__dirname, '/styles'),
    path.join(__dirname, '/project-dist/style.css'),
  );
  //check to have folder and delete
  await checkAndRMcopy(path.join(__dirname, '/project-dist/assets'));
  //create folder for assets
  await createFold(path.join(__dirname, '/project-dist/assets'));
  //upd folder for assets
  await readir(
    path.join(__dirname, '/assets'),
    path.join(__dirname, '/project-dist/assets'),
  );
};

main();
