import { Astal, Gdk, Gtk } from "astal/gtk3";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { execAsync, Variable } from "astal";

const isPrimaryClick = (event: Astal.ClickEvent): boolean =>
	event.button === Gdk.BUTTON_PRIMARY;

export const PasswordInput = ({
	connecting,
	staging,
}: PasswordInputProps): JSX.Element => {
	const shouldMaskPassword = true;

	return (
		<box
			className="network-password-input-container"
			halign={Gtk.Align.FILL}
			hexpand
			css="margin: 0;"
		>
			<entry
				className="SysUtilsMenuEntry"
				css="margin-left: 4px; margin-top: 6px;"
				hexpand
				visibility={!shouldMaskPassword}
				placeholderText="Enter Password"
				onKeyPressEvent={(self, event) => {
					const keyPressed = event.get_keyval()[1];

					if (keyPressed === Gdk.KEY_Return) {
						connecting.set(staging.get()?.bssid ?? "");

						const connectCommand = `nmcli device wifi connect "${staging.get()?.ssid}" password "${self.text}"`;

						execAsync(connectCommand)
							.catch((err) => {
								connecting.set("");
							})
							.then(() => {
								connecting.set("");

								staging.set({} as AstalNetwork.AccessPoint);
							});

						self.text = "";
					}
				}}
			/>
		</box>
	);
};

interface PasswordInputProps {
	staging: Variable<AstalNetwork.AccessPoint | undefined>;
	connecting: Variable<string>;
}
