import fileImporter from 'file-importer';

export function parseImports(options) {
  return new Promise((resolve, reject) => {
    fileImporter.parse(options, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}
