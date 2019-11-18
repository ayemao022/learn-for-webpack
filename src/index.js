console.log('hello');

if ('serviceWork' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js')
			.then(registration => {
				console.log('Service-worker registed');
			})
			.catch(error => {
				console.log('Service-worker register error')
			})
	})
}