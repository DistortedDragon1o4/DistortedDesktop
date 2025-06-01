import { GObject, property, register } from "astal";

let bars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

@register({ GTypeName: "CavaVisualiser" })
export default class CavaVisualiser extends GObject.Object {
	static instance: CavaVisualiser;

	static get_default(): CavaVisualiser {
		if (!CavaVisualiser.instance) {
			CavaVisualiser.instance = new CavaVisualiser();
		}
		return CavaVisualiser.instance;
	}

	@property(Number)
	get bar_length() {
		return bars;
	}

	set bar_length(value: Array<number>) {
		// print(value);
		bars = value.map((c) => Math.min(Math.floor(c * 300), 325));
		this.notify("bar_length");
	}

	constructor() {
		super();
	}
}
