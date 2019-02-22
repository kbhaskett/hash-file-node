const fs = require('fs');
const readline = require('readline');
const config = require('./config.json');
const SimpleCryptoJS = require('simple-crypto-js').default;
const secretPassphrase = process.env.SECRET || 'some Secret passphrase';

fs.readdir(config.hashInputDir, function(err, files) {
    files.forEach(function (file) {
        var hashColumns = null;
        for (var k = 0; k < config.fileConfigs.length; k++) {
            var fileConfig = config.fileConfigs[k];
            if (file.startsWith(fileConfig.fileNamePrefix)) {
                hashColumns = fileConfig.hashColumns;
                break;
            }
        }
        if (hashColumns) {
            console.log("Configuration found for file:", file);
            processLineByLine(config.hashInputDir + "/" + file, config.hashOutputDir + "/" + file, hashColumns);
            fs.rea
        } else {
            console.log("No configuration found for file:", file);
        }
    });
});

async function processLineByLine(fileName, outputfileName, hashColumns) {
    var simpleCrypto = new SimpleCryptoJS(secretPassphrase);
    const fileStream = fs.createReadStream(fileName);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
        var columns = line.split('\t');
        for(var i = 0; i < hashColumns.length; i++) {
            var encrypted = simpleCrypto.encrypt(columns[hashColumns[i]]);
            columns[hashColumns[i]] = encrypted.toString();
       }
      fs.appendFileSync(outputfileName, columns.join('\t') + '\r\n');
    }
  }