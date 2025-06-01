import { Gtk, Gdk, Astal } from "astal/gtk3";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { bind } from "astal";
import { DeviceIcon } from "./DeviceIcon";
import { DeviceName } from "./DeviceName";
import { DeviceStatus } from "./DeviceStatus";

const isPrimaryClick = (event: Astal.ClickEvent): boolean =>
	event.button === Gdk.BUTTON_PRIMARY;

export const BluetoothDevice = ({
	device,
	connectedDevices,
}: BluetoothDeviceProps): JSX.Element => {
	const IsConnectingSpinner = (): JSX.Element => {
		return (
			<revealer revealChild={bind(device, "connecting")}>
				{/* <Spinner
					valign={Gtk.Align.START}
					className="spinner bluetooth"
				/> */}
			</revealer>
		);
	};

	return (
		<button
			hexpand
			className="SysUtilsMenuChoiceButton"
			onClick={(_, event) => {
				if (
					!connectedDevices.includes(device.address) &&
					isPrimaryClick(event)
				) {
					device.connect_device((res) => {
						console.info(res);
					});
				}
			}}
		>
			<box css="margin: 0px;">
				<box
					css="margin: 0px;"
					hexpand
					halign={Gtk.Align.START}
					className="menu-button-container"
				>
					<DeviceIcon
						device={device}
						connectedDevices={connectedDevices}
					/>
					<box vertical valign={Gtk.Align.CENTER}>
						<DeviceName device={device} />
						<DeviceStatus device={device} />
					</box>
				</box>
				<box halign={Gtk.Align.END}>
					<IsConnectingSpinner />
				</box>
			</box>
		</button>
	);
};

interface BluetoothDeviceProps {
	device: AstalBluetooth.Device;
	connectedDevices: string[];
}
