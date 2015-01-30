var worker = window.wrappedJSObject || window;

if (window.wrappedJSObject) {
	worker.GUIp = createObjectIn(worker);
} else {
	worker.GUIp = {};
}