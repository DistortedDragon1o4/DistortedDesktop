import { App } from "astal/gtk3";
import { bind } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import DockHoverState from "../services/DockHoverState";

import { PinnedApps } from "./Dock/PinnedApps";

function DockContainer() {
	const hypr = Hyprland.get_default();
	const clients = bind(hypr, "clients");

	console.log(
		hypr.get_clients().map((c) => {
			return c.title;
		}),
	);

	return (
		<box halign={Gtk.Align.CENTER} className="DockContainer">
			<PinnedApps />
		</box>
	);
}

export default function Dock(monitor: Gdk.Monitor) {
	const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor;
	const hoverState = DockHoverState.get_default();

	return (
		<window
			className="Dock"
			name="Dock"
			application={App}
			gdkmonitor={monitor}
			exclusivity={Astal.Exclusivity.NORMAL}
			layer={Astal.Layer.TOP}
			anchor={TOP | LEFT | BOTTOM}
			visible={true}
		>
			<eventbox
				onHoverLost={() => {
					hoverState.hover_start = false;
					hoverState.hover_state = false;
					setTimeout(() => {
						if (hoverState.hover_state == false)
							hoverState.dock_state = false;
					}, 100);
				}}
			>
				<box className="DockMouseArea">
					<stack
						shown={bind(hoverState, "dock_state_str")}
						transitionType={
							Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
						}
						transitionDuration={80}
						className="DockMouseArea"
						visible={bind(hoverState, "dock_state")}
					>
						<box name="dock" halign={Gtk.Align.CENTER}>
							<DockContainer />
						</box>
						<box name="no_dock"></box>
					</stack>
					<eventbox
						css="font-size: 2px; font-weight: normal; min-height: 4px; padding: 4px; opacity: 0;"
						onHover={() => {
							hoverState.hover_start = true;
							setTimeout(() => {
								if (hoverState.hover_start == true) {
									hoverState.dock_state = true;
									hoverState.hover_state = true;
								}
							}, 100);
						}}
						onHoverLost={() => {
							hoverState.hover_start = false;
						}}
					>
						Rihnosaur
					</eventbox>
				</box>
			</eventbox>
		</window>
	);
}
