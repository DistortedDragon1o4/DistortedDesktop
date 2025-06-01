import { Astal, Gtk, Gdk } from "astal/gtk3";
import { bind } from "astal/binding";
import { Variable } from "astal";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

const isPrimaryClick = (event: Astal.ClickEvent): boolean =>
	event.button === Gdk.BUTTON_PRIMARY;

export const AccessPoint = ({
	staging,
	connecting,
}: AccessPointProps): JSX.Element => {
	const ConnectionIcon = (): JSX.Element => (
		<icon className="network-icon wifi" icon={staging.get()?.iconName} />
	);
	const ConnectionSpinner = (): JSX.Element => (
		<revealer
			halign={Gtk.Align.END}
			revealChild={bind(connecting).as(
				(conBssid) => staging.get()?.bssid === conBssid,
			)}
		></revealer>
	);
	const ConnectionName = (): JSX.Element => (
		<box className="connection-container" vertical hexpand>
			<label
				className="active-connection"
				halign={Gtk.Align.START}
				truncate
				wrap
				label={staging.get()?.ssid ?? ""}
			/>
		</box>
	);

	return (
		<box
			className="SysUtilsMenuChoiceButton"
			css="background: none; margin: 0;"
		>
			<button
				className="SysUtilsMenuButtonLeft"
				onClick={(_, event) => {
					if (isPrimaryClick(event)) {
						connecting.set("");
						staging.set({} as AstalNetwork.AccessPoint);
					}
				}}
			>
				<icon icon="go-previous-symbolic" />
			</button>
			<box halign={Gtk.Align.FILL} hexpand>
				<ConnectionIcon />
				<ConnectionName />
				<ConnectionSpinner />
			</box>
		</box>
	);
};

interface AccessPointProps {
	staging: Variable<AstalNetwork.AccessPoint | undefined>;
	connecting: Variable<string>;
}
