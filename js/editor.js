var plugin, $aqm;
window.onload = function() {
	$aqm = document.URL.substring(document.URL.indexOf('?') + 1).split("&");
	if (window.localStorage.getItem("mcpm-proj") == null) {
		location.replace("../index.html");
	}
	plugin = JSON.parse(window.localStorage.getItem("mcpm-proj"));
	Array.from(document.getElementsByClassName("edit-field")).forEach(function(elm) {
		elm.type = "button";
		elm.value = "✏";
		var elmEditing = elm.getAttribute("editing"),
			elmGetInput = elm.getAttribute("path") ?? elm.getAttribute("path-inp"),
			elmWriteIn;
		if (elm.getAttribute("path")) {
			elmWriteIn = [elm.getAttribute("path")];
		}
		else {
			elmWriteIn = [];
			var i = 0;
			while (elm.getAttribute("path" + i)) {
				elmWriteIn.push(elm.getAttribute("path" + i));
				i++;
			}
		}
		eval(`document.getElementById(elmEditing).innerText = plugin.${elmGetInput}`);
		elm.id = "edit-" + elmEditing;
		elm.onclick = function() {
			editElement(document.getElementById(elmEditing), elmWriteIn);
		}
	});
	Array.from(document.getElementsByClassName("edit-select")).forEach(function(elm) {
		eval(`var value = plugin.${elm.getAttribute("path")}`);
		Array.from(elm.querySelectorAll("option")).forEach(function(opt) {
			if (opt.value == value) {
				opt.setAttribute("selected", "");
			}
			else {
				opt.removeAttribute("selected");
			}
		});
		elm.setAttribute("onchange", `plugin.${elm.getAttribute("path")} = this.value; savePlugin()`);
	});
	listAllProcedures();
	listAllArguments();
}
window.onbeforeunload = function() {
	if (document.getElementsByClassName("editable").length)
		return true;
	else
		return undefined;
}
function editElement(elm, path) {
	elm.setAttribute("contenteditable", "");
	elm.classList.add("editable");
	selectElementContents(elm);
	elm.onkeypress = function(e) {
		e = e || window.event;
		if (e.key == "Enter") {
			elm.classList.remove("editable");
			elm.onkeypress = null;
			elm.removeAttribute("contenteditable");
			path.forEach(function(p) {
				eval(`plugin.${p} = elm.innerText`);
			});
			savePlugin();
		}
	};
}
function selectElementContents(el) {
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}
function savePlugin() {
	window.localStorage.setItem("mcpm-proj", JSON.stringify(plugin));
}
function listAllProcedures() {
	var element = document.getElementById("procedures") ?? document.createElement("ul");
	if (plugin.procedures instanceof Array) {
		for (var i = 0; i < plugin.procedures.length; i++) {
			var procedure = plugin.procedures[i];
			var li = document.createElement("li");
			li.innerText = procedure.json.message0;
			li.id = i;
			li.setAttribute("onclick", "location.replace(`procedure.html?${this.id}`);");
			element.appendChild(li);
		}
	}
}
function listAllArguments() {
	var element = document.getElementById("args") ?? document.createElement("ul");
	if (plugin.procedures[$aqm[0]].json.args0 instanceof Array) {
		for (var i = 0; i < plugin.procedures[$aqm[0]].json.args0.length; i++) {
			var procedure = plugin.procedures[$aqm[0]].json.args0[i];
			var li = document.createElement("li");
			li.innerText = procedure.name;
			li.id = i;
			li.setAttribute("onclick", "location.replace(`procedure-argument.html?${$aqm[0]}&${this.id}`);");
			element.appendChild(li);
		}
	}
}
function downloadPlugin() {
	var a = prompt('Download as', plugin.id);
	if (a != null) {
		var b = document.createElement('a');
		b.href = 'data:text/plain,' + encodeURIComponent(JSON.stringify(plugin));
		b.download = a + '.json';
		b.click();
		b.remove();
	}
}
function exportPlugin() {
	alert('This function isn\'t supported yet.');
}
function removePlugin() {
	if (confirm(`This plugin will be removed. There is no going back.
If you want to save it, click on "Download".
Then you can upload it by clicking on the main page on "Upload File".
Are you really sure?`)) {
		window.localStorage.removeItem("mcpm-proj");
		location.reload(true);
	}
}
function newProcedure() {
	if (plugin.procedures instanceof Array) {
		plugin.procedures.push({
			name: "new_procedure",
			json: {
				message0: "example text here",
				args0: [],
				colour: 0,
				inputsInline: false,
				mcreator: {
					toolbox_id: "entities",
					toolbox_init: [],
					inputs: [],
					dependencies: []
				}
			}
		});
	}
	else {
		plugin.procedures = [{
			name: "new_procedure",
			json: {
				message0: "example text here",
				args0: [],
				colour: 0,
				inputsInline: false,
				mcreator: {
					toolbox_id: "entities",
					toolbox_init: [],
					inputs: [],
					dependencies: []
				}
			}
		}];
	}
	savePlugin();
	location.replace("procedure.html?" + (plugin.procedures.length - 1));
}
function newArgument() {
	plugin.procedures[$aqm[0]].json.args0.push({
		type: "input_value",
		name: "new_argument",
		check: "MCItem"
	});
	if (plugin.procedures[$aqm[0]].json.mcreator.inputs instanceof Array) {
		plugin.procedures[$aqm[0]].json.mcreator.inputs.push("new_argument");
	}
	else {
		plugin.procedures[$aqm[0]].json.mcreator.inputs = ["new_argument"];
	}
	savePlugin();
	location.replace("procedure-argument.html?" + $aqm[0] + "&" + (plugin.procedures[$aqm[0]].json.args0.length - 1));
}
function removeProcedure() {
	if (confirm("Are you sure that you want to remove this procedure?")) {
		plugin.procedures.splice(parseInt($aqm[0]), 1);
		savePlugin();
		location.replace("index.html");
	}
}
function removeArgument() {
	if (confirm("Are you sure that you want to remove this procedure argument?")) {
		plugin.procedures[$aqm[0]].json.args0.splice(parseInt($aqm[1]), 1);
		plugin.procedures[$aqm[0]].json.mcreator.inputs.splice(parseInt($aqm[1]), 1);
		savePlugin();
		location.replace("procedure.html?" + $aqm[0]);
	}
}