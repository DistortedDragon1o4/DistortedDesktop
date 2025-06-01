import { Gdk, Astal } from "astal/gtk3";
import { ActionButton } from "./ActionButton";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { forgetBluetoothDevice } from "../helpers";

const isPrimaryClick = (event: Astal.ClickEvent): boolean =>
	event.button === Gdk.BUTTON_PRIMARY;

export const ForgetButton = ({ device }: ForgetButtonProps): JSX.Element => {
	return (
		<ActionButton
			name={"delete"}
			tooltipText={"Forget"}
			label={"󰆴"}
			onClick={(_, self) => {
				if (isPrimaryClick(self)) {
					forgetBluetoothDevice(device);
				}
			}}
		/>
	);
};

interface ForgetButtonProps {
	device: AstalBluetooth.Device;
}
