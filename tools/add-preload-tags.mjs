// @ts-check

import * as fs from 'fs';
import * as path from 'path';
const preloadTags = [];

/**
 * @param {string} absolutePath
 * @param {string} baseDirectory
 * @returns string
 */
const convertToRelativePath = (absolutePath, baseDirectory) => {
	const relativePath = path.relative(baseDirectory, absolutePath);
	return relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes for compatibility
};

/**
 * @param {string} directory
 * @param {string[]} blockList
 */
const traverseDirectory = (directory, blockList) => {
	const files = fs.readdirSync(directory);

	files.forEach((file) => {
		const filePath = path.join(directory, file);
		if (fs.statSync(filePath).isDirectory()) {
			traverseDirectory(filePath, blockList);
		} else {
			if (!blockList.some((entry) => filePath.includes(entry))) {
				if (filePath.includes('dmloader.js')) {
					// `dmloader.js` is highest priority
					preloadTags.push(
						`  <link rel="preload" href="${convertToRelativePath(filePath, 'copy-game-here')}" as="script" onload="document.querySelectorAll('link[data-rel]').forEach(link => link.setAttribute('rel', link.getAttribute('data-rel')))" />\n`,
					);
				} else if (filePath.includes('archive_files.json')) {
					// `archive_files.json` is also highest priority
					preloadTags.push(
						`  <link rel="preload" href="${convertToRelativePath(filePath, 'copy-game-here')}" as="fetch" crossorigin="*" />\n`,
					);
				} else {
					// All other files won't start downloading until `dmloader.js` is finished
					preloadTags.push(
						`  <link data-rel="preload" href="${convertToRelativePath(filePath, 'copy-game-here')}" as="fetch" crossorigin="*" />\n`,
					);
				}
			}
		}
	});
};

const main = () => {
	const currentDirectory = process.cwd();
	const copyGameDirectory = path.join(currentDirectory, 'copy-game-here');
	const htmlFilePath = path.join(copyGameDirectory, 'index.html');
	const blockList = [
		'node_modules',
		'Thumbs.db',
		'ehthumbs.db',
		'Desktop.ini',
		'$RECYCLE.BIN/',
		'.cab',
		'.msi',
		'.msm',
		'.msp',
		'.lnk',
		'.DS_Store',
		'.AppleDouble',
		'.LSOverride',
		'._',
		'.DocumentRevisions-V100',
		'.fseventsd',
		'.Spotlight-V100',
		'.TemporaryItems',
		'.Trashes',
		'.VolumeIcon.icns',
		'.AppleDB',
		'.AppleDesktop',
		'Network Trash Folder',
		'Temporary Items',
		'.apdisk',
		'.html',
		'.gitkeep',
		'robots.txt',
		'humans.txt',
		'browserconfig.xml',
		'apple-icon',
		'apple-splash',
		'mstile-icon',
		'manifest-icon',
		'.map',
		'service-worker.js',
		'load-sw.js',
		'workbox-',
	];

	// If there is a `wasm` file in the directory, don't preload `_asmjs.js`
	const wasmFiles = fs
		.readdirSync(copyGameDirectory)
		.filter((file) => file.endsWith('.wasm'));
	if (wasmFiles.length > 0) {
		blockList.push('_asmjs.js');
	}

	traverseDirectory(copyGameDirectory, blockList);

	fs.readFile(htmlFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(`Error reading file: ${err}`);
			return;
		}

		if (preloadTags.length === 0) {
			console.log('No files to preload.');
			return;
		}

		if (data.includes('<link rel="preload"')) {
			console.log('Preload tag already exists.');
			return;
		}

		const modifiedData = data.replace(
			'</title>',
			'</title>\n' + preloadTags.join(''),
		);

		fs.writeFile(htmlFilePath, modifiedData, 'utf8', (writeErr) => {
			if (writeErr) {
				console.error(`Error writing to file: ${writeErr}`);
			} else {
				console.log('Preload tags inserted successfully.');
			}
		});
	});
};

main();
