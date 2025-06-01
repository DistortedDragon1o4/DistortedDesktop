import { bind } from "astal";
import { Gdk, Gtk } from "astal/gtk3";
import AstalWp from "gi://AstalWp";

export const Slider = ({ device, type }: SliderProps): JSX.Element => {
	return (
		<box className="slider" css="margin: 0 4px 8px 4px; padding: 0;">
			<slider
				value={bind(device, "volume")}
				drawValue={false}
				hexpand
				css="padding: 0;"
				min={0}
				// max={
				// 	type === "playback"
				// 		? bind(raiseMaximumVolume).as((raise) => (raise ? 1.5 : 1))
				// 		: 1
				// }
				onDragged={({ value, dragging }) => {
					if (dragging) {
						device.volume = value;
						device.mute = false;
					}
				}}
			/>
		</box>
	);
};

interface SliderProps {
	device: AstalWp.Endpoint;
	type: "playback" | "input";
}
