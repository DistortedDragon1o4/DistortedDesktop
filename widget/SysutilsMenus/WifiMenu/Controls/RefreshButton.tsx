import { Astal, Gdk, Gtk } from "astal/gtk3";
import Network from "gi://AstalNetwork";
const networkService = Network.get_default();
import { bind } from "astal";
const isPrimaryClick = (event: Astal.ClickEvent): boolean =>
	event.button === Gdk.BUTTON_PRIMARY;
import { isScanning } from "./helpers";

export const RefreshButton = (): JSX.Element => {
	return (
		<button
			className="SysUtilsMenuButton"
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.END}
			onClick={(_, event) => {
				if (isPrimaryClick(event)) {
					networkService.wifi?.scan();
				}
			}}
		>
			<icon
				className={bind(isScanning).as((scanning) =>
					scanning ? "spinning-icon" : "",
				)}
				icon="view-refresh-symbolic"
			/>
		</button>
	);
};
