import { BluetoothDevices } from "./devices/index.js";
import { Header } from "./header/index.js";
import { bind } from "astal";
import { Gtk } from "astal/gtk3";

export const BluetoothMenu = () => {
	return (
		<box
			className="SysUtilsMenuContainer"
			name="bluetooth-menu"
			halign={Gtk.Align.FILL}
			hexpand
			vertical
		>
			<Header />
			<BluetoothDevices />
		</box>
	);
};
