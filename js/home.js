window.onload = function() {
	if (window.localStorage.getItem("mcpm-proj") != null) {
		location.replace("editor/index.html");
	}
}
function uploadFile() {
	var inp = document.createElement("input");
	inp.type = "file";
	inp.accept = ".json";
	inp.onchange = function() {
		var fr = new FileReader();
		fr.onload = function() {
			window.localStorage.setItem("mcpm-proj", fr.result);
			location.reload(true);
		}
		fr.readAsText(inp.files[0]);
	}
	inp.click();
}
function createNew() {
	window.localStorage.setItem("mcpm-proj", JSON.stringify({
		procedures: [],
		id: "new_plugin",
		info: {
			name: "New plugin",
			version: "1.0",
			description: "Enter description here...",
			author: "User",
			credits: "Made with MCreatorPluginMaker by EntityPlantt: https://entityplantt.github.io/MCreatorPluginMaker"
		}
	}));
	location.reload(true);
}