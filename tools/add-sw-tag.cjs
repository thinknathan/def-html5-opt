// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');

const main = () => {
	const currentDirectory = process.cwd();
	const copyGameDirectory = path.join(currentDirectory, 'copy-game-here');
	const filePath = path.join(copyGameDirectory, 'index.html');

	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(`Error reading file: ${err}`);
			return;
		}

		if (data.includes('<script src="load-sw.js" async></script>')) {
			console.log('Script tag already exists.');
			return;
		}

		// If the script tag doesn't exist, find </body> tag and insert the script tag before it
		const modifiedData = data.replace(
			/<\/body>/i,
			'<script src="load-sw.js" async></script>\n</body>',
		);

		fs.writeFile(filePath, modifiedData, 'utf8', (writeErr) => {
			if (writeErr) {
				console.error(`Error writing to file: ${writeErr}`);
			} else {
				console.log('Script tag inserted successfully.');
			}
		});
	});
};

main();
