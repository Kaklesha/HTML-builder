const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const checkAndRMcopy = async () => {
  console.log('checkAndRMcopy');
  try {
    await fsPromises.rm(path.join(__dirname, 'files-copy'), {
      recursive: true,
    });
  } catch (error) {
    console.error(error);
  }
};

const createFold = async () => {
  console.log('CreateDirec');
  try {
    await fsPromises.mkdir(
      path.join(__dirname, 'files-copy'),
      //  console.log('Directory created successfully!');
    );
  } catch (error) {
    console.error(error);
  }
};

const readir = async () => {
  console.log('ReadDir');
  const files = await fsPromises.readdir(path.join(__dirname, '/files'), {
    withFileTypes: true,
  });

  console.log(files);

  files.forEach((file) => {
    //  console.log(files);
    fs.copyFile(
      `${path.join(__dirname, 'files', file['name'])}`,
      `${path.join(__dirname, 'files-copy', file['name'])}`,
      (err) => {
        if (err) {
          console.log('Error Found:', err);
        }
      },
    );
  });
};

const main = async () => {
  await checkAndRMcopy();
  await createFold();
  await readir();
};

main();
