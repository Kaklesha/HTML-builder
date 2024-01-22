const path = require('path');
const fs = require('fs');
const { stat } = require('node:fs');

fs.readdir(
  path.join(__dirname, '/secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    console.log('\nCurrent directory files:');
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        stat(
          path.join(__dirname, '/secret-folder', file['name']),
          (err, stats) => {
            //  console.log(stats.isDirectory());
            if (!stats.isDirectory()) {
              console.log(
                `${path.parse(file['name']).name} - ${path
                  .parse(file['name'])
                  .ext.slice(1)} - ${stats.size}`,
              );
              // TODO: this solution have unknow units of memory so that i don't know how they exactl named
              // console.dir(path.parse(file['name']), { depth: null });
            }
          },
        );
      });
    }
  },
);
