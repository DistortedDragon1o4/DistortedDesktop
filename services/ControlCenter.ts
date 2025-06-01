import {
	exec,
	execAsync,
	GObject,
	monitorFile,
	property,
	readFileAsync,
	register,
} from "astal";

let StackState = "wifi-menu";

@register({ GTypeName: "ControlCenterMenu" })
export default class ControlCenterMenu extends GObject.Object {
	static instance: ControlCenterMenu;

	static get_default(): ControlCenterMenu {
		if (!ControlCenterMenu.instance) {
			ControlCenterMenu.instance = new ControlCenterMenu();
		}
		return ControlCenterMenu.instance;
	}

	#StackState = "wifi-menu";

	@property(String)
	get menu_state() {
		return StackState;
	}

	@property(String)
	get playback_menu_class() {
		return StackState == "playback-menu"
			? "ControlButtonEnabled"
			: "ControlButton";
	}

	@property(String)
	get audio_devices_menu_class() {
		return StackState == "audio-devices-menu"
			? "ControlButtonEnabled"
			: "ControlButton";
	}

	@property(String)
	get wifi_menu_class() {
		return StackState == "wifi-menu"
			? "ControlButtonEnabled"
			: "ControlButton";
	}

	@property(String)
	get bluetooth_menu_class() {
		return StackState == "bluetooth-menu"
			? "ControlButtonEnabled"
			: "ControlButton";
	}

	set menu_state(value: string) {
		StackState = value;
		this.notify("menu_state");
		this.notify("playback_menu_class");
		this.notify("audio_devices_menu_class");
		this.notify("wifi_menu_class");
		this.notify("bluetooth_menu_class");
	}

	constructor() {
		super();
	}
}
