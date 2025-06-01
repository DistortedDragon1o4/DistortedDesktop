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
import BarHoverState from "../services/BarHoverState";
import PowerMenuSelection from "../services/PowerMenuSelection";

export default function PowerMenu(monitor: Gdk.Monitor) {
	const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

	const hoverState = BarHoverState.get_default();
	const powerMenuSelection = PowerMenuSelection.get_default();

	return (
		<window
			className="PowerMenu"
			name="PowerMenu"
			application={App}
			gdkmonitor={monitor}
			exclusivity={Astal.Exclusivity.IGNORE}
			keymode={Astal.Keymode.ON_DEMAND}
			layer={Astal.Layer.TOP}
			anchor={TOP | BOTTOM | LEFT | RIGHT}
			visible={false}
			onKeyPressEvent={function (self, event: Gdk.Event) {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
			}}
		>
			<box className="PowerMenuBg">
				<eventbox
					onClick={() => {
						if (powerMenuSelection.current_vis == 0) {
							execAsync([
								"astal",
								"-i",
								"DistortedDesktop",
								"-t",
								"PowerMenu",
							]);
							hoverState.bar_supress_toggle = false;
							hoverState.bar_state_str = false;
						} else {
							powerMenuSelection.current_vis = 0;
						}
					}}
				>
					<box
						vertical
						className="ButtonArea"
						vexpand
						hexpand
						valign={Gtk.Align.CENTER}
						halign={Gtk.Align.CENTER}
					>
						<box className="UpperBox" halign={Gtk.Align.CENTER}>
							<button
								className={"PowerMenuButtonLeft"}
								onClicked={() => {
									App.get_window("PowerMenu")!.hide();
									execAsync(["loginctl", "lock-session"]);
								}}
							>
								<icon icon="system-lock-screen-symbolic" />
							</button>
							<button
								className={"PowerMenuButton"}
								onClicked={() => {
									App.get_window("PowerMenu")!.hide();
									execAsync(["loginctl", "lock-session"]);
									execAsync(["systemctl", "suspend"]);
								}}
							>
								<icon icon="system-suspend-symbolic" />
							</button>
							<button
								className={"PowerMenuButton"}
								onClicked={() => {
									execAsync(["hyprctl", "dispatch", "exit"]);
								}}
							>
								<icon icon="system-log-out-symbolic" />
							</button>
							<button
								className={"PowerMenuButton"}
								onClicked={() => {
									execAsync(["systemctl", "reboot"]);
								}}
							>
								<icon icon="system-reboot-symbolic" />
							</button>
							<button
								className={"PowerMenuButtonRight"}
								onClicked={() => {
									execAsync(["systemctl", "poweroff"]);
								}}
							>
								<icon icon="system-shutdown-symbolic" />
							</button>
						</box>
					</box>
				</eventbox>
			</box>
		</window>
	);
}
