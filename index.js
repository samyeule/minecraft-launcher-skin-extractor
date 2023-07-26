const fs = require('fs');
const path = require('path');

// Set custom Minecraft installation folder path here
// ex: 'C:\Users\user\AppData\Roaming\.minecraft'
let minecraft;

const throwError = (str) => {throw new Error(`\x1b[91m${str}\x1b[0m`)};

if (!minecraft) {
    switch (process.platform) {
        case 'win32':
            minecraft = `${process.env.APPDATA}/.minecraft`;
            break;
        case 'darwin':
            minecraft = `${process.env.HOME}/Library/Application Support/minecraft`;
            break;
        default:
            throwError('It seems that you may be using Linux. Unfortunately, Linux is currently not supported. Read the repo page for more info.');
    }
}
if (!fs.existsSync(minecraft)) throwError('Your Minecraft installation folder was not found.');

const skinsFile = 
       (fs.existsSync(`${minecraft}/launcher_custom_skins.json`) && fs.readFileSync(`${minecraft}/launcher_custom_skins.json`))
    || (fs.existsSync(`${minecraft}/launcher_skins.json`) && fs.readFileSync(`${minecraft}/launcher_skins.json`))
    || null;
if (!skinsFile) throwError('Skins file does not exist.');

let skinsJSON;
try { skinsJSON = JSON.parse(skinsFile); }
catch (_) { throwError('Skins file contains invalid JSON.'); }

/**
 * Credit: https://github.com/helensy/base64-to-image
 * @param {String} base64 
 * @param {Object} options 
 * @returns {String}
 */
const createFile = (base64, options) => new Promise((res) => {
	options = options || {}
	options.fileName = options.fileName || `img-${Date.now()}`;
	options.outputPath = options.outputPath || './output';
	options.imageType = options.imageType || 'png';

	const buffer = (() => {
        const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) throwError('Invalid Base64 string');

        return {
            type: matches[1],
            data: Buffer.from(matches[2], 'base64')
        }
    })();
    
	let imageType = buffer.type || options.imageType || 'png';
	let abs;
	let fileName = '' + options.fileName;

	if (fileName.indexOf('.') === -1) {
		imageType = imageType.replace('image/', '');
		fileName = `${fileName}.${imageType}`;
	}

	abs = path.join(options.outputPath, fileName);
	fs.writeFileSync(abs, buffer.data, 'base64', ((err) => { throwError(`Failed to write image file: \x1b[0m \n${JSON.stringify(err)}`) }));

    return res(fileName);
});

(async () => {
    for (const [_, v] of Object.entries(skinsJSON['customSkins'])) {
        const image = await createFile(v['skinImage'], {fileName: v['name']});
        console.log(`\x1b[32mSuccessfully created skin file "${image}"\x1b[0m`)
    }

    console.log('\x1b[32m \nExtraction complete! Check the "output" folder for your skins.\n\x1b[0m')
})();