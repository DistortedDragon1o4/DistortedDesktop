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

export default function EventOverlay(monitor: Gdk.Monitor) {
	const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

	const hoverState = BarHoverState.get_default();

	return (
		<window
			className="EventOverlay"
			name="EventOverlay"
			application={App}
			gdkmonitor={monitor}
			exclusivity={Astal.Exclusivity.IGNORE}
			keymode={Astal.Keymode.ON_DEMAND}
			layer={Astal.Layer.TOP}
			anchor={TOP | BOTTOM | LEFT | RIGHT}
			visible={false}
			onKeyPressEvent={function (self, event: Gdk.Event) {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
				hoverState.bar_supress_toggle = false;
				hoverState.bar_state_str = false;
			}}
			onHide={() => {
				App.get_window("Applauncher")!.hide();
				App.get_window("SysutilsMenu")!.hide();
			}}
		>
			<eventbox
				onClick={() => {
					App.get_window("EventOverlay")!.hide();
				}}
			></eventbox>
		</window>
	);
}
