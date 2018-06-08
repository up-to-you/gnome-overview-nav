const Lang = imports.lang;
const Main = imports.ui.main;

function init() {
	this.keyboardShortcut = "<ctrl>left";
}

function enable() {
	var OverviewKeyboardManager = new Lang.Class({
		Name: 'CustomOverviewKeyboardManager',
	
		_init: function() {
			this.grabbers = new Map()
	
			global.display.connect('accelerator-activated', 
									Lang.bind(this, function(display, action, deviceId, timestamp){
										this._onAccelerator(action)
									}))
		},
	
		listenFor: function(accelerator, callback){
			let action = global.display.grab_accelerator(accelerator);

			log("====>> BINDING <<====");
			log(action);

			if(action != Meta.KeyBindingAction.NONE) {
				let name = Meta.external_binding_name_for_action(action);
	
				Main.wm.allowKeybinding(name, Shell.ActionMode.ALL);
	
				this.grabbers.set(action, {
					name: name,
					accelerator: accelerator,
					callback: callback,
					action: action
				});
			}
		},

		disableListener: function(keybindingName) {
			Main.wm.removeKeybinding(keybindingName);
		},
	
		_onAccelerator: function(action) {
			let grabber = this.grabbers.get(action);
	
			if(grabber) {
				grabber.callback()
			};
		}
	});	

	let overviewKeyboardManager = new OverviewKeyboardManager();
	overviewKeyboardManager.listenFor("<alt>left", function(){
		toggleOverviewDisplayFocus(1);
	});
	overviewKeyboardManager.listenFor("<alt>right", function(){
		toggleOverviewDisplayFocus(0);
	});

	function toggleOverviewDisplayFocus(indexNextMonitor) {
		if(! Main.overview._shown) {
			Main.overview.show();
		}
		let actorChild = Main.overview.viewSelector._workspacesDisplay._workspacesViews[indexNextMonitor].actor;
		actorChild.navigate_focus(null, Gtk.DirectionType.TAB_FORWARD, true);
	}
}

function disable() {
	
	// Main.overview.viewSelector._workspacesDisplay._workspacesViews[0].actor.add_effect(new Clutter.BrightnessContrastEffect());
	// let from = Main.overview.viewSelector._workspacesDisplay._workspacesViews[2];
	// Main.overview.viewSelector._workspacesDisplay._workspacesViews[indexMonitor].actor.navigate_focus(Main.overview.viewSelector._workspacesDisplay._workspacesViews[2].actor, Gtk.DirectionType.TAB_FORWARD, true);


	// Main.overview.viewSelector._workspacesPage._workspacesViews[indexNextMonitor].actor;
}
