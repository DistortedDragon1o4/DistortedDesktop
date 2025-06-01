import { Gtk } from "astal/gtk3";
import { APStaging } from "./APStaging";
import { WirelessAPs } from "./WirelessAPs";
import { WifiSwitch } from "./Controls/WifiSwitch";
import { RefreshButton } from "./Controls/RefreshButton";

export const WifiMenu = () => {
	return (
		<box className="SysUtilsMenuContainerTop" name="wifi-menu" vertical>
			<box css="margin: 8px;" halign={Gtk.Align.FILL}>
				<label
					className="menu-label"
					halign={Gtk.Align.START}
					hexpand
					css="font-size: 1em;"
					label=" Wifi"
				/>
				<button className="SysUtilsMenuButton">
					<icon icon="emblem-system-symbolic" />
				</button>
				<RefreshButton />
				<WifiSwitch />
			</box>

			<box className="SysUtilsMenuItems" css="margin-top: 0;" vertical>
				<WirelessAPs />
				<APStaging />
			</box>
		</box>
	);
};
