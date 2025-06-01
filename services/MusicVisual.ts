import { GObject, property, register } from "astal";

let len = 30;

@register({ GTypeName: "MusicVisualiser" })
export default class MusicVisualiser extends GObject.Object {
	static instance: MusicVisualiser;

	static get_default(): MusicVisualiser {
		if (!MusicVisualiser.instance) {
			MusicVisualiser.instance = new MusicVisualiser();
		}
		return MusicVisualiser.instance;
	}

	@property(Number)
	get bar_length() {
		return len;
	}

	set bar_length(value: number) {
		len = Math.max(Math.floor(value * 500), 30);
		this.notify("bar_length");
	}

	constructor() {
		super();
	}
}
