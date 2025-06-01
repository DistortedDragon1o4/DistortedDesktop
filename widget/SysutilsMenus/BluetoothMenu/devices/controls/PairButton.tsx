import { Gdk, Astal } from "astal/gtk3";
import { bind } from "astal";
import { ActionButton } from "./ActionButton";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";

const isPrimaryClick = (event: Astal.ClickEvent): boolean =>
	event.button === Gdk.BUTTON_PRIMARY;

export const PairButton = ({ device }: PairButtonProps): JSX.Element => {
	return (
		<ActionButton
			name={"unpair"}
			tooltipText={bind(device, "paired").as((paired) =>
				paired ? "Unpair" : "Pair",
			)}
			label={bind(device, "paired").as((paired) => (paired ? "" : ""))}
			onClick={(_, self) => {
				if (!isPrimaryClick(self)) {
					return;
				}

				if (device.paired) {
					device.pair();
				} else {
					device.cancel_pairing();
				}
			}}
		/>
	);
};

interface PairButtonProps {
	device: AstalBluetooth.Device;
}
