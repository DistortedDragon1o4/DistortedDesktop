import { Gtk } from "astal/gtk3";
import Network from "gi://AstalNetwork";

const networkService = Network.get_default();

export const WifiSwitch = (): JSX.Element => (
	<switch
		className="SysUtilsMenuTogglebutton"
		valign={Gtk.Align.CENTER}
		tooltipText="Toggle Wifi"
		active={networkService.wifi?.enabled}
		setup={(self) => {
			self.connect("notify::active", () => {
				networkService.wifi?.set_enabled(self.active);
			});
		}}
	/>
);
