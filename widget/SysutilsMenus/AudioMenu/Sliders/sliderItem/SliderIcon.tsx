import { bind, Variable } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";

const isPrimaryClick = (event: Astal.ClickEvent): boolean =>
	event.button === Gdk.BUTTON_PRIMARY;

import { getIcon } from "../utils";
import AstalWp from "gi://AstalWp?version=0.1";

export const SliderIcon = ({ type, device }: SliderIconProps): JSX.Element => {
	const iconBinding = Variable.derive(
		[bind(device, "volume"), bind(device, "mute")],
		(volume, isMuted) => {
			const iconType = type === "playback" ? "spkr" : "mic";

			const effectiveVolume = volume > 0 ? volume : 100;
			const mutedState = volume > 0 ? isMuted : true;

			return getIcon(effectiveVolume, mutedState)[iconType];
		},
	);

	return (
		<box>
			<button
				className={bind(device, "mute").as(
					(isMuted) => `AudioButton ${type} ${isMuted ? "muted" : ""}`,
				)}
				onClick={(_, event) => {
					if (isPrimaryClick(event)) {
						device.mute = !device.mute;
					}
				}}
				onDestroy={() => {
					iconBinding.drop();
				}}
			>
				<icon className={`menu-active-icon ${type}`} icon={iconBinding()} />
			</button>
			<label
				className={`menu-active ${type}`}
				truncate
				hexpand
				wrap
				label={bind(device, "description").as(
					(description) =>
						/*capitalizeFirstLetter*/ description ?? `Unknown ${type} Device`,
				)}
			/>
		</box>
	);
};

interface SliderIconProps {
	type: "playback" | "input";
	device: AstalWp.Endpoint;
}
