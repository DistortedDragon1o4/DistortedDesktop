import {
	exec,
	execAsync,
	GObject,
	monitorFile,
	property,
	readFileAsync,
	register,
} from "astal";

let currentlyVisible = false;
let currentRightMargin = 0;

@register({ GTypeName: "ControlCenterVis" })
export default class ControlCenterVis extends GObject.Object {
	static instance: ControlCenterVis;

	static get_default(): ControlCenterVis {
		if (!ControlCenterVis.instance) {
			ControlCenterVis.instance = new ControlCenterVis();
		}
		return ControlCenterVis.instance;
	}

	@property(Boolean)
	get control_center_state() {
		return currentlyVisible;
	}

	@property(Number)
	get control_center_class() {
		return currentRightMargin;
	}

	set control_center_state(value: boolean) {
		currentlyVisible = value;
		currentRightMargin = value ? 310 : 0;
		this.notify("control_center_state");
		this.notify("control_center_class");
	}

	constructor() {
		super();
	}
}
