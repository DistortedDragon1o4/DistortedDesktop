import { ActivePlaybacks } from "./Sliders/playbacks";
import { PlaybackDevices } from "./Devices/PlaybackDevices";
import { InputDevices } from "./Devices/InputDevices";

export const PlaybackMenu = () => {
	return (
		<box className="SysUtilsMenuContainer" name="playback-menu" vertical>
			<box>
				<ActivePlaybacks />
			</box>
		</box>
	);
};

export const DevicesMenu = () => {
	return (
		<box
			className="SysUtilsMenuContainer"
			name="audio-devices-menu"
			vertical
		>
			<scrollable className="SysUtilsMenuScrollableBox" vexpand>
				<box vertical>
					<PlaybackDevices />
					<InputDevices />
				</box>
			</scrollable>
		</box>
	);
};
