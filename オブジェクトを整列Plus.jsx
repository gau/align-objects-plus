/*
オブジェクトを整列Plus.jsx
Copyright (c) 2017 Toshiyuki Takahashi
Released under the MIT license
http://opensource.org/licenses/mit-license.php
http://www.graphicartsunit.com/
*/
(function() {

	// Settings
	var settings = {
		'horizontal' : 1,
		'vertical' : 1,
		'base' : 3,
		'previewArea' : false,
		'showDialog' : true,
		'widthAltKey' : true
	};

	// ダイアログ非表示で実行するときは、上記 settings の値で挙動を設定
	// 'vertical'    -> 水平方向［-1:移動なし｜0:左｜1:中央｜2:右］
	// 'horizontal'  -> 垂直方向［-1:移動なし｜0:上｜1:中段｜2:下］
	// 'base'        -> 整列の基準［0:アートボード｜1:選択範囲｜2:最前面オブジェクト｜3:最背面オブジェクト］
	// 'previewArea' -> 整列基準の範囲をハイライト［false:しない｜true:する］
	// 'showDialog'  -> ダイアログを表示［false:しない｜true:する］
	// 'widthAltKey'  -> option（Alt）キーを押しながら実行でダイアログを強制表示［false:しない｜true:する］

	// Constant
	const SCRIPT_TITLE = 'オブジェクトを整列Plus';
	const SCRIPT_VERSION = '0.5.13';
	const ILLUSTRATOR_VERSION = Number(app.version.split('.')[0]);
	const SUFFIX_NUMBER = Math.floor(Math.random() * 10000000000);
	const PEVIEW_LAYERNAME = '_gau_Align_Area_Preview_' + SUFFIX_NUMBER;
	const TEMP_GROUPNAME = '_gau_temp_pluginitem_group_' + SUFFIX_NUMBER;

	// Document and selection
	var doc = app.activeDocument;
	var sel = doc.selection;
	var wlay = sel.length ? sel[0].layer : undefined;
	var forciblyShowDialog = settings.widthAltKey && ScriptUI.environment.keyboardState.altKey;

	// UI Dialog
	function MainDialog() {
		this.init();
		return this;
	};
	MainDialog.prototype.init = function() {

		var unit = 10;
		var thisObj = this;

		thisObj.dlg = new Window('dialog', SCRIPT_TITLE + ' - ver.' + SCRIPT_VERSION);
		thisObj.dlg.margins = [unit * 2, unit * 2, unit * 2, unit * 2];

		thisObj.panelHorizontal = thisObj.dlg.add('panel', undefined, '水平方向：');
		thisObj.panelHorizontal.margins = [unit * 2, unit * 2, unit * 2, unit * 1.5];
		thisObj.panelHorizontal.alignment = 'fill';
		thisObj.panelHorizontal.orientation = 'row';
		thisObj.panelHorizontal.name = 'horizontal-group';

		thisObj.panelVertical = thisObj.dlg.add('panel', undefined, '垂直方向：');
		thisObj.panelVertical.margins = [unit * 2, unit * 2, unit * 2, unit * 1.5];
		thisObj.panelVertical.alignment = 'fill';
		thisObj.panelVertical.orientation = 'row';
		thisObj.panelVertical.name = 'vertical-group';

		thisObj.optionGroup = thisObj.dlg.add('group', undefined);
		thisObj.optionGroup.margins = [0, 0, 0, 0];
		thisObj.optionGroup.alignment = 'fill';
		thisObj.optionGroup.orientation = 'column';
		thisObj.optionGroup.name = 'option-group';

		thisObj.options = [
			thisObj.optionGroup.add('panel', undefined, '整列の基準：'),
			thisObj.optionGroup.add('group', undefined),
			thisObj.optionGroup.add('group', undefined)
		];

		thisObj.buttonGroup = thisObj.dlg.add('group', undefined);
		thisObj.buttonGroup.margins = [unit, unit, unit, unit * 0];
		thisObj.buttonGroup.alignment = 'center';
		thisObj.buttonGroup.orientation = 'row';
		thisObj.buttonGroup.name = 'button-group';

		// horizontal direction 
		thisObj.horizontalLines = [
			thisObj.panelHorizontal.add('checkbox', undefined, '左'),
			thisObj.panelHorizontal.add('checkbox', undefined, '中央'),
			thisObj.panelHorizontal.add('checkbox', undefined, '右')
		];
		if(settings.horizontal > thisObj.horizontalLines.length - 1 || isNaN(settings.horizontal)) {
			settings.horizontal = -1;
		} else {
			settings.horizontal = Math.floor(settings.horizontal);
		}
		for (var key in thisObj.horizontalLines) {
			thisObj.horizontalLines[key].name = 'horizontal-' + key;
			thisObj.horizontalLines[key].characters = 4;
			thisObj.horizontalLines[key].value = false;
			thisObj.horizontalLines[key].alignment = 'left';
			thisObj.horizontalLines[key].addEventListener('click', preview);
			thisObj.horizontalLines[key].onClick = function(){
				if(ILLUSTRATOR_VERSION >= 17) this.dispatchEvent(new UIEvent('click'));
			};
		}
		if(thisObj.horizontalLines[settings.horizontal]) thisObj.horizontalLines[settings.horizontal].value = true;

		// Vertical direction 
		thisObj.verticalLines = [
			thisObj.panelVertical.add('checkbox', undefined, '上'),
			thisObj.panelVertical.add('checkbox', undefined, '中段'),
			thisObj.panelVertical.add('checkbox', undefined, '下')
		];
		if(settings.vertical > thisObj.verticalLines.length - 1 || isNaN(settings.vertical)) {
			settings.vertical = -1;
		} else {
			settings.vertical = Math.floor(settings.vertical);
		}
		for (var key in thisObj.verticalLines) {
			thisObj.verticalLines[key].name = 'vertical-' + key;
			thisObj.verticalLines[key].characters = 4;
			thisObj.verticalLines[key].value = false;
			thisObj.verticalLines[key].alignment = 'left';
			thisObj.verticalLines[key].addEventListener('click', preview);
			thisObj.verticalLines[key].onClick = function () {
				if(ILLUSTRATOR_VERSION >= 17) this.dispatchEvent(new UIEvent('click'));
			};
		}
		if(thisObj.verticalLines[settings.vertical]) thisObj.verticalLines[settings.vertical].value = true;

		// Base area 
		thisObj.options[0].alignment = 'fill';
		thisObj.options[0].orientation = 'column';
		thisObj.options[0].margins = [unit * 2, unit * 2, unit * 2, unit * 1.5];
		thisObj.alignBases = [
			thisObj.options[0].add('radiobutton',undefined, 'アートボード'),
			thisObj.options[0].add('radiobutton', undefined, '選択範囲'),
			thisObj.options[0].add('radiobutton', undefined, '最前面オブジェクト'),
			thisObj.options[0].add('radiobutton', undefined, '最背面オブジェクト')
		];
		for (var key in thisObj.alignBases) {
			thisObj.alignBases[key].name = 'base-' + key;
			thisObj.alignBases[key].titleLayout = { alignment: ['left', 'center'], characters: 20 };
			thisObj.alignBases[key].value = false;
			thisObj.alignBases[key].alignment = 'left';
			thisObj.alignBases[key].addEventListener('click', preview);
			thisObj.alignBases[key].onClick = function(){
				if(ILLUSTRATOR_VERSION >= 17) this.dispatchEvent(new UIEvent('click'));
			};
		}
		if(thisObj.alignBases[settings.base]) thisObj.alignBases[settings.base].value = true;


		thisObj.options[1].alignment = 'left';
		thisObj.options[1].margins = [0, unit, 0, 0];
		thisObj.previewArea = thisObj.options[1].add('checkbox', undefined, '整列の範囲をハイライト');
		thisObj.previewArea.name = 'previewArea';
		if (isIsolationMode()) {
			thisObj.previewArea.enabled = false;
			thisObj.options[2].alignment = 'left';
			thisObj.options[2].margins = [0, 0, 0, 0];
			thisObj.messageArea = thisObj.options[2].add('statictext', undefined, '現在整列範囲のハイライト機能を利用できません', { multiline: true });
			thisObj.messageArea.preferredSize = [-1, 40];
			thisObj.messageArea.characters = 21;
		} else {
			thisObj.previewArea.enabled = true;
		}
		thisObj.previewArea.value = settings.previewArea;
		thisObj.previewArea.addEventListener('click', preview);
		thisObj.previewArea.onClick = function(){
			if(ILLUSTRATOR_VERSION >= 17) this.dispatchEvent(new UIEvent('click'));
		};

		thisObj.cancel = thisObj.buttonGroup.add('button', undefined, 'キャンセル', {name: 'cancel'});
		thisObj.ok = thisObj.buttonGroup.add('button', undefined, '実行', { name:'ok'});

		// Preview
		function preview(event) {
			if(event) {
				switch(event.target.name) {
					case 'horizontal-0' :
					case 'horizontal-1' :
					case 'horizontal-2' :
						event.target.value = true;
						if(settings.horizontal !== -1) thisObj.horizontalLines[settings.horizontal].value = false;
						break;
					case 'vertical-0' :
					case 'vertical-1' :
					case 'vertical-2' :
						event.target.value = true;
						if(settings.vertical !== -1) thisObj.verticalLines[settings.vertical].value = false;
						break;
					default :
						break;
				}
			}
			thisObj.updateSettings();
			try {
				mainProcess(true);
			} catch(er) {
				showError(er);
			}
			app.redraw();
			// var activeLayer = doc.activeLayer;
			// doc.activeLayer = activeLayer;
			var dummyObject = wlay.pathItems.add();
			dummyObject.remove();
			app.undo();
		}
		preview(null);

		// Add event handler to buttons
		thisObj.ok.onClick = function() {
			try {
				mainProcess(false);
			} catch(er) {
				showError(er);
			}
			thisObj.closeDialog();
		}
		thisObj.cancel.onClick = function() {
			thisObj.closeDialog();
		}

	};
	MainDialog.prototype.updateSettings = function() {
		settings.horizontal = this.getSelectedIndex(this.horizontalLines);
		settings.vertical = this.getSelectedIndex(this.verticalLines);
		settings.base = this.getSelectedIndex(this.alignBases);
		settings.previewArea = this.previewArea.value;
	};
	MainDialog.prototype.getSelectedIndex = function(array) {
		for (var i = 0; i < array.length; i++) {
			if(array[i].value) return i;
		}
		return -1;
	};
	MainDialog.prototype.showDialog = function() {
		this.dlg.show();
	};
	MainDialog.prototype.closeDialog = function() {
		this.dlg.close();
	};

	// Main process
	function mainProcess(preview) {

		// Get target objects and properties
		var targets = (isIsolationMode() && sel[0].typename === 'GroupItem') ? sel[0].pageItems : getTargetObjects(sel);
		var targetsProps = [];
		for (var i = 0; i < targets.length; i++) {
			targetsProps.push(getProperties(targets[i]));
		}

		// Get base area properties
		var baseProp = {};
		switch (settings.base) {
			case 0 :
				// Artboard
				baseProp = getProperties(doc.artboards[doc.artboards.getActiveArtboardIndex()]);
				break;
			case 1 :
				// Selection
				baseProp = {'bounds' : getMaxBounds(targets)};
				baseProp.size = [baseProp.bounds[2] - baseProp.bounds[0], (baseProp.bounds[3] - baseProp.bounds[1]) * -1];
				baseProp.center = [baseProp.bounds[2] - baseProp.size[0] / 2, (baseProp.bounds[3] + baseProp.size[1] / 2) * -1];
				break;
			case 2 :
				// Front object
				baseProp = getProperties(targets[0]);
				break;
			case 3 :
				// Back object
				baseProp = getProperties(targets[targets.length-1]);
				break;
			default :
				break;
		}

		// Calculate the gap distance
		for(var key in targetsProps) {
			targetsProps[key].gap = [0, 0];
			switch(settings.horizontal) {
				case 0 :
					targetsProps[key].gap[0] = baseProp.bounds[0] - targetsProps[key].bounds[0];
					break;
				case 1 :
					targetsProps[key].gap[0] = baseProp.center[0] - targetsProps[key].center[0];
					break;
				case 2 :
					targetsProps[key].gap[0] = baseProp.bounds[2] - targetsProps[key].bounds[2];
					break;
				default :
					break;
			}
			switch(settings.vertical) {
				case 0 :
					targetsProps[key].gap[1] = baseProp.bounds[1] - targetsProps[key].bounds[1];
					break;
				case 1 :
					targetsProps[key].gap[1] = (baseProp.center[1] - targetsProps[key].center[1]) * -1;
					break;
				case 2 :
					targetsProps[key].gap[1] = baseProp.bounds[3] - targetsProps[key].bounds[3];
					break;
				default :
					break;
			}

			// Translate the target
			targetsProps[key].item.translate(targetsProps[key].gap[0], targetsProps[key].gap[1]);

			// Ungrouping to PluginItems
			if(targetsProps[key].item.typename === 'GroupItem' && targetsProps[key].item.name === TEMP_GROUPNAME) ungroupingItems(targetsProps[key].item);

		}

		if(preview) {
			// Draw preview area
			if (settings.previewArea && !isIsolationMode()) drawPreviewArea(baseProp.bounds);
		} else {
			// Save Settings
			if(settings.showDialog || forciblyShowDialog) saveSettings();
		}

	}

	// Get target objects
	function getTargetObjects(objects) {
		var targets = [];
		for(var key in objects) {
			var item = objects[key].typename === 'PluginItem' ? groupingItems(objects[key]) : objects[key];
			targets.push(item);
		}
		return targets;
	}

	// Get the bounds from target
	function getTheBounds(item) {
		var bounds = item.geometricBounds;
		if(item.typename === 'TextFrame') {
			bounds = getTextItemBounds(item);
		} else if(item.typename === 'GroupItem') {
			bounds = item.clipped ? getClippingPath(item.pageItems).geometricBounds : getMaxBounds(item.pageItems);
		} else if(item.typename === 'Artboard') {
			bounds = item.artboardRect;
		}
		return bounds;
	}

	// Get the properties from target
	function getProperties(item) {
		var bounds = getTheBounds(item);
		var size = [bounds[2] - bounds[0], Math.abs(bounds[3] - bounds[1])];
		var props = {
			item : item,
			bounds : bounds,
			size : size,
			center : [bounds[2] - size[0] / 2, (bounds[3] + size[1] / 2) * -1]
		};
		return props;
	}

	// Get the clipping path from ClipGroup
	function getClippingPath(items) {
		for (var i = 0; i < items.length; i++) {
			if(items[i].clipping) return items[i];
		}
		return false;
	}

	// Get the max bounds from objects
	function getMaxBounds(items) {
		var boundsArray = [[], [], [], []];
		for (var i = 0; i < items.length; i++) {
			var bounds = getTheBounds(items[i]);
			for (var j = 0; j < bounds.length; j++) {
				boundsArray[j].push(bounds[j]);
			}
		}
		return [Math.min.apply(null, boundsArray[0]), Math.max.apply(null, boundsArray[1]), Math.max.apply(null, boundsArray[2]), Math.min.apply(null, boundsArray[3])];
	}

	// Get the bounds from TextFrame
	function getTextItemBounds(item) {
		if(item.orientation == TextOrientation.VERTICAL) return item.geometricBounds;

		var trackings = [];
		var charaAttrs = [];
		var dummyItem = item.duplicate();

		for(var j = 0; j < dummyItem.lines.length; j++) {
			charaAttrs[j] = dummyItem.lines[j].characters[dummyItem.lines[j].characters.length-1].characterAttributes;
			trackings[j] = charaAttrs[j].tracking;
			var dummyColor = new NoColor();
			if(charaAttrs[j].fillColor.typename == 'NoColor') dummyColor = new RGBColor();
			charaAttrs[j].fillColor = dummyColor;
			charaAttrs[j].tracking = 0;
		}

		var charaAttr = getMaxCharacter(dummyItem.lines[dummyItem.lines.length-1].characters);
		var heightGap = getTextHeight(charaAttr) - Math.max.apply(null, charaAttr.totalSize);
		var bounds = [dummyItem.geometricBounds[0], dummyItem.geometricBounds[1], dummyItem.geometricBounds[2], dummyItem.geometricBounds[3] + heightGap];
		dummyItem.remove();
		return bounds;
	}

	// Get the height form character
	function getTextHeight(charaAttr) {
		var activeLayer = doc.activeLayer;
		var tf = wlay.textFrames.add();
		tf.name = "_temp_textframe_";
		tf.contents = "D";
		tf.textRange.characterAttributes.size = Math.max.apply(null, charaAttr.totalSize);
		tf.textRange.characterAttributes.textFont = charaAttr.textFont[0];
		var tempHeight = (-tf.geometricBounds[3] + tf.geometricBounds[1]);
		tf.remove();
		doc.activeLayer = activeLayer;
		return tempHeight;
	}

	// Get max size form character
	function getMaxCharacter(chara) {
		var ca = {'size':[], 'baselineShift':[], 'textFont':[], 'horizontaltalScale':[], 'verticalScale':[], 'totalSize':[]};
		for (var i = 0; i < chara.length; i++) {
			ca.size.push(chara[i].characterAttributes.size);
			ca.baselineShift.push(chara[i].characterAttributes.baselineShift);
			ca.textFont.push(chara[i].characterAttributes.textFont);
			ca.horizontaltalScale.push(chara[i].characterAttributes.horizontaltalScale);
			ca.verticalScale.push(chara[i].characterAttributes.verticalScale);
			ca.totalSize.push(chara[i].characterAttributes.size * chara[i].characterAttributes.verticalScale / 100);
		}
		return ca;
	}

	// Grouping
	function groupingItems(items) {
		var gis = items.length ? items : [items];
		var targetLayer = gis[0].layer;
		var gi = targetLayer.groupItems.add();
		gi.name = TEMP_GROUPNAME;
		gi.move(gis[0], ElementPlacement.PLACEBEFORE);
		for(var i = gis.length - 1; i >= 0; i--){
			gis[i].move(gi, ElementPlacement.PLACEATBEGINNING);
		}
		return gi;
	}

	// Ungrouping
	function ungroupingItems(gi) {
		if(gi.typename !== 'GroupItem') return false;
		var items = gi.pageItems;
		for(var i = items.length - 1; i >= 0; i--){
			items[i].move(gi, ElementPlacement.PLACEAFTER);
		}
		gi.remove();
		return items;
	}

	// Draw preview area
	function drawPreviewArea(bounds) {
		var stroke = false;
		var activeLayer = doc.activeLayer;
		var alignAreaLayer = doc.layers.add();
		alignAreaLayer.name = PEVIEW_LAYERNAME;
		var rect = doc.pathItems.rectangle(bounds[1], bounds[0], bounds[2] - bounds[0], -bounds[3] + bounds[1]);
		doc.activeLayer = activeLayer;
		var color;
		var dcs = doc.documentColorSpace;
		if(dcs == DocumentColorSpace.CMYK) {
			color = new CMYKColor();
			color.black = 0;
			color.cyan = 0;
			color.magenta = 100;
			color.yellow = 0;
		} else {
			color = new RGBColor();
			color.red = 255;
			color.green = 0;
			color.blue = 128;
		}
		if(stroke) {
			rect.stroked = true;
			rect.filled = false;
			rect.strokeColor = color;
			rect.strokeDashes = [4,2];
			rect.strokeWidth = 2;
		} else {
			rect.stroked = false;
			rect.filled = true;
			rect.fillColor = color;
			rect.opacity = 30;
		}
		return rect;
	}

	function showError(er) {
		if(er.number === 9034) {
			alert('編集モードでは動作しません');
		} else {
			alert('エラーが発生しましたので処理を中止します\nエラー内容：' + er);
		}
	}

	// Load setting from json file
	var saveOptions = {
		'os' : File.fs,
		'jsxPath' : $.fileName,
		'reverseDomain' : 'com.graphicartsunit',
		'fileName' : 'align_objects_plus.json',
		'path' : ''
	};

	saveOptions.path = getSettingFilePath(saveOptions);
	if(settings.showDialog || forciblyShowDialog) {
		settings = loadSettings() ? loadSettings() : settings;
	}

	// Get path of json file
	function getSettingFilePath(options) {
		var filepath = '';
		switch(options.os) {
			case 'Macintosh':
				filepath = Folder.userData + '/' + options.reverseDomain + '/Illustrator/Scripts/' + options.fileName;
				break;
			case 'Windows':
				filepath = Folder.userData + '/' + options.reverseDomain + '/Illustrator/Scripts' + options.fileName;
				break;
			default :
				break;
		}
		return filepath;
	}

	// Load settings from json file
	function loadSettings() {
		if(new File(saveOptions.path).exists) {
			var settingFile = new File(saveOptions.path);
			settingFile.encoding = 'UTF-8';
			settingFile.open('r');
			var loadedSettings = settingFile.readln();
			loadedSettings = (new Function('return' + loadedSettings))();
			settingFile.close();
			return loadedSettings;
		} else {
			return false;
		}
	}

	// Save settings to json file
	function saveSettings() {
		var dir = saveOptions.path.match(/(.*)(\/)/)[1];
		if(!new Folder(dir).exists) {
			new Folder(dir).create();
		}
		var settingFile = new File(saveOptions.path);
		settingFile.open('w');
		settingFile.write(settings.toSource());
		settingFile.close();
	}

	// is Isolation Mode
	function isIsolationMode() {
		try {
			var duumyLayer = doc.layers.add();
			duumyLayer.remove();
		} catch(er) {
			// showError(er);
			return true;
		}
		return false;
	}

	// Show dialog
	var dialog;
	if (!doc) {
		alert('対象ドキュメントがありません');
	} else if (sel.length === 0) {
		alert('オブジェクトが選択されていません');
	} else {
		if(settings.showDialog || forciblyShowDialog) {
			dialog = new MainDialog();
			dialog.showDialog();
		} else {
			try {
				mainProcess(false);
			} catch(er) {
				showError(er);
			}
		}
	}

}());