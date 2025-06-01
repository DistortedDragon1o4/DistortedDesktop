import { App } from "astal/gtk3";
import {
	Variable,
	GLib,
	bind,
	execAsync,
	exec,
	property,
	register,
} from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import PinnedAppsList from "../../services/PinnedAppsList";

// interface AppData {
// 	path: string;
// 	name: string;
// 	icon: string;
// }

// function getPinnedApps() {
// 	const apps: AppData[] = JSON.parse(
// 		exec([
// 			"python",
// 			"scripts/desktop-parser.py",
// 			"./assets/pinnedApps.json",
// 		]),
// 	);
// 	return apps;
// }

export const PinnedApps = () => {
	const hypr = Hyprland.get_default();
	const clients = bind(hypr, "clients");
	const apps = PinnedAppsList.get_default();

	return (
		<centerbox vexpand vertical>
			<box vertical valign={Gtk.Align.START}>
				{bind(apps, "pinned_apps").as((apps) => {
					return apps.map((appItem) => {
						return (
							<overlay
								passThrough
								overlay={
									<icon
										className="DockIcon"
										icon={appItem.icon}
									/>
								}
							>
								<button
									className="DockElement"
									onClicked={() => {
										execAsync(["gtk-launch", appItem.path]);
									}}
								></button>
							</overlay>
						);
					});
				})}
			</box>
			<box></box>
			<overlay
				valign={Gtk.Align.END}
				passThrough
				overlay={<icon className="DockIcon" icon="app-launcher" />}
			>
				<button
					className="DockElement"
					onClicked={() => {
						execAsync([
							"astal",
							"-i",
							"DistortedDesktop",
							"-t",
							"Launcher",
						]);
					}}
				></button>
			</overlay>
		</centerbox>
	);
};
