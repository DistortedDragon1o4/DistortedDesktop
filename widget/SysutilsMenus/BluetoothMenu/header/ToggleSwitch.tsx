import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";

const bluetoothService = AstalBluetooth.get_default();

const isPowered = Variable(false);

Variable.derive([bind(bluetoothService, "isPowered")], (isOn) => {
	return isPowered.set(isOn);
});

export const ToggleSwitch = (): JSX.Element => (
	<switch
		className="SysUtilsMenuTogglebutton"
		valign={Gtk.Align.CENTER}
		active={bluetoothService.isPowered}
		setup={(self) => {
			self.connect("notify::active", () => {
				bluetoothService.adapter?.set_powered(self.active);
			});
		}}
	/>
);
