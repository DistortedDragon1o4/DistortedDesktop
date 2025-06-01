import { GObject, property, register } from "astal";

let hovering = [false, false, false, false, false];

@register({ GTypeName: "PowerButtonHoverState" })
export default class PowerButtonHoverState extends GObject.Object {
	static instance: PowerButtonHoverState;

	static get_default(): PowerButtonHoverState {
		if (!PowerButtonHoverState.instance) {
			PowerButtonHoverState.instance = new PowerButtonHoverState();
		}
		return PowerButtonHoverState.instance;
	}

	@property(String)
	get hovering_1() {
		return hovering[0] ? "name" : "none";
	}

	set set_hovering_1(value: boolean) {
		hovering[0] = value;
		this.notify("hovering_1");
	}

	@property(String)
	get hovering_2() {
		return hovering[1] ? "name" : "none";
	}

	set set_hovering_2(value: boolean) {
		hovering[1] = value;
		this.notify("hovering_2");
	}

	@property(String)
	get hovering_3() {
		return hovering[2] ? "name" : "none";
	}

	set set_hovering_3(value: boolean) {
		hovering[2] = value;
		this.notify("hovering_3");
	}

	@property(String)
	get hovering_4() {
		return hovering[3] ? "name" : "none";
	}

	set set_hovering_4(value: boolean) {
		hovering[3] = value;
		this.notify("hovering_4");
	}

	@property(String)
	get hovering_5() {
		return hovering[4] ? "name" : "none";
	}

	set set_hovering_5(value: boolean) {
		hovering[4] = value;
		this.notify("hovering_5");
	}

	constructor() {
		super();
	}
}
