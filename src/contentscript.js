(function ALIFF() {
	if (window.ALIFF_LOADED) return;
	window.ALIFF_LOADED = true;
	function insertText() {
		document.execCommand('paste');
	}

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		const el = document.activeElement;

		if (request.action) {
			const { type } = request.action;
			switch (type) {
				case 'getActiveElement':
					sendResponse(el ? { elementType: el.nodeName.toLowerCase(), name: el.name, type: el.type } : { type: undefined });
					return;
				case 'insertText':
					insertText(el);
					return;
				default:
					console.error(`Unhandled action type: ${type}`);
					return;
			}
		}
		console.error('Unhandled request: missing action');
	});
}());
