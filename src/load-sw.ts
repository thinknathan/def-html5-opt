import { Workbox } from 'workbox-window';

const main = () => {
	const wb = new Workbox('/service-worker.js');

	/**
	 * Add an event listener to detect when the registered
	 * service worker has installed but is waiting to activate.
	 */
	wb.addEventListener('waiting', () => {
		/**
		 * When `event.wasWaitingBeforeRegister` is true, a previously
		 * updated service worker is still waiting.
		 * You may want to create a UI prompt accordingly.
		 */
		wb.messageSkipWaiting();
	});

	// Runs when the service worker becomes operational.
	wb.addEventListener('activated', (event) => {
		// Does not run on subsequent updates.
		if (!event.isUpdate) {
			console.log('App is ready for offline use.');
		}
	});

	// Install the service worker.
	wb.register();

	// Check for updates.
	wb.update();
};

main();
