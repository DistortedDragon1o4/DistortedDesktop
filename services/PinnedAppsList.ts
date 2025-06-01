import {
	exec,
	execAsync,
	GObject,
	monitorFile,
	property,
	readFileAsync,
	register,
} from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";

interface AppData {
	path: string;
	name: string;
	icon: string;
}

@register({ GTypeName: "PinnedAppsList" })
export default class PinnedAppsList extends GObject.Object {
	static instance: PinnedAppsList;

	static get_default(): PinnedAppsList {
		if (!PinnedAppsList.instance) {
			PinnedAppsList.instance = new PinnedAppsList();
		}
		return PinnedAppsList.instance;
	}

	@property(String)
	get pinned_apps() {
		const apps: AppData[] = JSON.parse(
			exec([
				"python",
				"scripts/desktop-parser.py",
				"./assets/pinnedApps.json",
			]),
		);
		return apps;
	}

	constructor() {
		super();
	}
}
PinnedAppsList;
