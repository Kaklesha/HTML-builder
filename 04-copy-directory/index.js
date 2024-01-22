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

const main = async () => {
  await checkAndRMcopy();
  //await createFold();
  await readir(
    path.join(__dirname, '/files'),
    path.join(__dirname, '/files-copy'),
  );
};

main();
