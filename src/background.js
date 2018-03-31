chrome.runtime.onInstalled.addListener((details) => {
	if (['install'].includes(details.reason)) {
		chrome.runtime.openOptionsPage();
	}
});
