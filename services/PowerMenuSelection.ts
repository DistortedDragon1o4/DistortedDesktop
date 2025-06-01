import { GObject, property, register } from "astal";

let selection = 0;

@register({ GTypeName: "PowerMenuSelection" })
export default class PowerMenuSelection extends GObject.Object {
	static instance: PowerMenuSelection;

	static get_default(): PowerMenuSelection {
		if (!PowerMenuSelection.instance) {
			PowerMenuSelection.instance = new PowerMenuSelection();
		}
		return PowerMenuSelection.instance;
	}

	@property(Boolean)
	get vis_sleep() {
		return selection == 1 || selection == 0;
	}

	@property(Boolean)
	get vis_logout() {
		return selection == 2 || selection == 0;
	}

	@property(Boolean)
	get vis_suspend() {
		return selection == 3 || selection == 0;
	}

	@property(Boolean)
	get vis_reboot() {
		return selection == 4 || selection == 0;
	}

	@property(Boolean)
	get vis_shutdown() {
		return selection == 5 || selection == 0;
	}

	@property(String)
	get class_sleep() {
		return selection == 1 ? "BigButton" : "PowerMenuButton";
	}

	@property(String)
	get class_logout() {
		return selection == 2 ? "BigButton" : "PowerMenuButton";
	}

	@property(String)
	get class_suspend() {
		return selection == 3 ? "BigButton" : "PowerMenuButton";
	}

	@property(String)
	get class_reboot() {
		return selection == 4 ? "BigButton" : "PowerMenuButton";
	}

	@property(String)
	get class_shutdown() {
		return selection == 5 ? "BigButton" : "PowerMenuButton";
	}

	@property(Number)
	get current_vis() {
		return selection;
	}

	set current_vis(value: number) {
		selection = value;
		this.notify("vis_sleep");
		this.notify("vis_logout");
		this.notify("vis_suspend");
		this.notify("vis_reboot");
		this.notify("vis_shutdown");
		this.notify("class_sleep");
		this.notify("class_logout");
		this.notify("class_suspend");
		this.notify("class_reboot");
		this.notify("class_shutdown");
		this.notify("current_vis");
	}

	constructor() {
		super();
	}
}
