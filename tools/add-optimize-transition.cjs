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

		if (data.includes('<script id="optimized-transition-script">')) {
			console.log('Optimized transition script tag already exists.');
			return;
		}

		// If the script tag doesn't exist, find </body> tag and insert the script tag before it
		let modifiedData = data.replace(
			/<\/body>/i,
			`
			<script id="optimized-transition-script">
			var Progress = Progress || {};
			/**
			 * @param {number} percentage
			 */
			Progress.updateProgress = function (percentage) {
				if (Progress.bar) {
					Progress.bar.style.transform = \`scaleX(\${Math.min(percentage / 100, 1) })\`;
				}
				Progress.notifyListeners(percentage);
			};
			</script>
			</body>
			`,
		);

		// Add a local style as well
		modifiedData = modifiedData.replace(
			/<\/head>/i,
			`
			<style id="optimized-transition-style">
				.canvas-app-progress-bar {
					transform-origin: left;
					transition: transform 0.3s ease;
					width: auto !important;
					transform: scaleX(0);
				}
			</style>
			</head>
			`,
		);

		fs.writeFile(filePath, modifiedData, 'utf8', (writeErr) => {
			if (writeErr) {
				console.error(`Error writing to file: ${writeErr}`);
			} else {
				console.log('Optimized transition script tag inserted successfully.');
			}
		});
	});
};

main();
