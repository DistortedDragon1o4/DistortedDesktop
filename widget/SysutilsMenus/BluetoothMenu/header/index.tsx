import { Gtk } from "astal/gtk3";
import { ToggleSwitch } from "./ToggleSwitch";
import { DiscoverButton } from "./DiscoverButton";

export const Header = (): JSX.Element => {
	const MenuLabel = (): JSX.Element => {
		return (
			<label
				className="menu-label"
				valign={Gtk.Align.CENTER}
				halign={Gtk.Align.START}
				hexpand
				css="font-size: 1em;"
				label=" Bluetooth"
			/>
		);
	};

	return (
		<box
			css="margin: 8px;"
			halign={Gtk.Align.FILL}
			valign={Gtk.Align.START}
		>
			<MenuLabel />
			<DiscoverButton />
			<ToggleSwitch />
		</box>
	);
};
