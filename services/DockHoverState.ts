import {
	exec,
	execAsync,
	GObject,
	monitorFile,
	property,
	readFileAsync,
	register,
} from "astal";

let currentlyHovering = false;
let currentlyVisible = false;
let currentlyHoveringStr = "no_dock";

let hoverStateLock = false;
let hoverStart = false;
// let currentlyHovering = false;

// export default function hoverState(setVal: boolean, val: boolean) {
// 	if (setVal) currentlyHovering = val;
// 	return currentlyHovering;
// }

@register({ GTypeName: "DockHoverState" })
export default class DockHoverState extends GObject.Object {
	static instance: DockHoverState;

	static get_default(): DockHoverState {
		if (!DockHoverState.instance) {
			DockHoverState.instance = new DockHoverState();
		}
		return DockHoverState.instance;
	}

	#StackState = "wifi-menu";

	@property(String)
	get dock_state_str() {
		return currentlyHoveringStr;
	}

	@property(Boolean)
	get dock_state() {
		return currentlyVisible;
	}

	@property(Boolean)
	get hover_state() {
		return currentlyHovering;
	}

	@property(Boolean)
	get hover_start() {
		return hoverStart;
	}

	// set dock_state_str(value: string) {
	// 	currentlyHoveringStr = value;
	// 	this.notify("dock_state_str");
	// }

	set dock_state(value: boolean) {
		if (!hoverStateLock) {
			currentlyVisible = value;
			this.notify("dock_state");
		}
	}

	set hover_state(value: boolean) {
		if (!hoverStateLock) {
			currentlyHovering = value;
			currentlyHoveringStr = value ? "dock" : "no_dock";
			this.notify("dock_state_str");
			this.notify("hover_state");
		}
	}

	set hover_start(value: boolean) {
		hoverStart = value;
	}

	set hover_lock(value: boolean) {
		hoverStateLock = value;
	}

	constructor() {
		super();
	}
}
