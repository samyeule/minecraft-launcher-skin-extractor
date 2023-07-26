const fs = require('fs');
const path = require('path');

// Set custom Minecraft installation folder path here
// ex: 'C:\Users\user\AppData\Roaming\.minecraft'
let minecraft;

if (!minecraft) {
    switch (process.platform) {
        case 'win32':
            minecraft = `${process.env.APPDATA}/.minecraft`;
            break;
        case 'darwin':
            minecraft = `${process.env.HOME}/Library/Application Support/minecraft`;
            break;
        default:
            throw new Error('It seems that you may be using Linux. Unfortunately, Linux is currently not supported. Read the repo page for more info.')
    }
}

if (!fs.existsSync(minecraft)) throw new Error('Your Minecraft installation folder was not found.');
console.log(minecraft);

const skinsFile = fs.readFileSync((fs.existsSync(`${minecraft}/launcher_custom_skins.json`) && `${minecraft}/launcher_custom_skins.json`) || `${minecraft}/launcher_skins.json`, {encoding: 'utf8'});
if (!skinsFile) throw new Error('Skins file does not exist.');

const skinsJSON = JSON.parse(skinsFile);
if (!skinsJSON) throw new Error('Skins file contains invalid JSON.');

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
        if (!matches || matches.length !== 3) throw new Error('Invalid Base64 string');

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
	fs.writeFileSync(abs, buffer.data, 'base64', ((err) => {
		throw new Error(`Failed to write image file:\n${JSON.stringify(err)}`);
	}));

    return res(fileName);
});

(async () => {
    for (const [_, v] of Object.entries(skinsJSON['customSkins'])) {
        const image = await createFile(v['skinImage'], {fileName: v['name']});
        console.log(`\x1b[32m Successfully created skin file "${image}" \x1b[0m`)
    }
})();