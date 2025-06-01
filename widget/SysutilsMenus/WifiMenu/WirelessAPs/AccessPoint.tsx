import { Variable } from "astal";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import {
	connectToAP,
	getWifiStatus,
	isDisconnecting,
	isApEnabled,
	isApActive,
} from "./helpers";
import { Gtk } from "astal/gtk3";
import Network from "gi://AstalNetwork";

const networkService = Network.get_default();

export const AccessPoint = ({
	connecting,
	accessPoint,
}: AccessPointProps): JSX.Element => {
	const ConnectionIcon = (): JSX.Element => {
		return (
			<icon
				className={`network-icon wifi ${isApActive(accessPoint) ? "active" : ""} txt-icon`}
				icon={"network-wireless-symbolic"}
			/>
		);
	};
	const ConnectionAccessPoint = (): JSX.Element => {
		return (
			<box className="connection-container" valign={Gtk.Align.CENTER} hexpand>
				<label
					className="active-connection"
					valign={Gtk.Align.CENTER}
					halign={Gtk.Align.START}
					truncate
					wrap
					hexpand
					label={accessPoint.ssid ?? ""}
				/>
				<revealer
					revealChild={
						isApActive(accessPoint) && isApEnabled(networkService.wifi?.state)
					}
				>
					<icon
						className="connection-status dim"
						halign={Gtk.Align.END}
						valign={Gtk.Align.CENTER}
						icon={"object-select-symbolic"}
					/>
				</revealer>
			</box>
		);
	};

	const LoadingSpinner = (): JSX.Element => {
		return (
			<revealer
				halign={Gtk.Align.END}
				valign={Gtk.Align.CENTER}
				revealChild={
					accessPoint.bssid === connecting.get() || isDisconnecting(accessPoint)
				}
			>
				{/* <Spinner
					className="spinner wap"
					setup={(self: Spinner) => {
						self.start();
					}}
					halign={Gtk.Align.CENTER}
					valign={Gtk.Align.CENTER}
				/> */}
			</revealer>
		);
	};

	return (
		<button
			className="SysUtilsMenuChoiceButton"
			onClick={(_, event) => {
				connectToAP(accessPoint, event);
			}}
		>
			<box hexpand>
				<ConnectionIcon />
				<ConnectionAccessPoint />
				<LoadingSpinner />
			</box>
		</button>
	);
};

interface AccessPointProps {
	connecting: Variable<string>;
	accessPoint: AstalNetwork.AccessPoint;
}
