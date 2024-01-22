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
    await fsPromises.mkdir(To);
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
  console.log('ReadDir');
  const files = await fsPromises.readdir(From, {
    withFileTypes: true,
  });

  files.forEach((file) => {
    if (path.extname(file['name']) === '.css') {
      const input = fs.createReadStream(path.join(From, file['name']), 'utf-8');
      input.on('data', (chunk) => output.write(chunk));
      input.on('error', (error) => console.log('Error', error.message));
    }
  });
};

const readirComponents = async (From, To) => {
  const output = fs.createWriteStream(To);
  let templateHTML;
  try {
    templateHTML = await fsPromises.readFile(
      path.join(__dirname, 'template.html'),
    );
  } catch (error) {
    console.error(error);
  }
  templateHTML = templateHTML.toString();
  console.log('ReadDirComponents');
  const files = await fsPromises.readdir(From, {
    withFileTypes: true,
  });

  for (const file of files) {
    if (path.extname(file['name']) === '.html') {
      const tempFileName = `{{${path.basename(file['name'], '.html')}}}`;
      if (templateHTML.includes(tempFileName)) {
        let inputFile = await fsPromises.readFile(
          path.join(From, file['name']),
        );
        inputFile = inputFile.toString();
        templateHTML = templateHTML.replaceAll(tempFileName, inputFile);
      }
    }
  }
  try {
    output.write(templateHTML);
  } catch (error) {
    console.error(error);
  }
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
  await readirComponents(
    path.join(__dirname, '/components'),
    path.join(__dirname, '/project-dist/index.html'),
  );
};

main();
