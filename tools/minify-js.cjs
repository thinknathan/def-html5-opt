'use strict';

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const main = async () => {
	const options = {
		ecma: 2020,
		compress: {
			passes: 2,
		},
	};
	const currentDirectory = process.cwd();
	const copyGameDirectory = path.join(currentDirectory, 'copy-game-here');

	// Find all JavaScript files in the `copy-game-here` directory
	const jsFiles = fs.readdirSync(copyGameDirectory, { withFileTypes: true });

	// Loop through each JavaScript file and run minify on them
	for (const file of jsFiles.filter((file) => file.name.endsWith('.js'))) {
		const filePath = path.join(copyGameDirectory, file.name);
		const minified = await minify(fs.readFileSync(filePath, 'utf8'), options);
		fs.writeFileSync(filePath, minified.code);
	}
};

main();
