/* eslint-disable */
(function () {
	let ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
}());

function analytics(data) {
	if (window._gaq) {
		window._gaq.push(data);
	}
}

window.analytics = analytics;
