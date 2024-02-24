import { Workbox } from 'workbox-window';

const main = () => {
	const wb = new Workbox('/service-worker.js');

	// Runs when the service worker becomes operational.
	wb.addEventListener('activated', (event) => {
		if (event.isUpdate) {
			console.log('[load-sw.js] App has updated to latest version.');
		} else {
			console.log('[load-sw.js] App is ready for offline use.');
		}
	});

	// Install the service worker.
	void wb.register();

	// Check for updates.
	void wb.update();
};

main();
