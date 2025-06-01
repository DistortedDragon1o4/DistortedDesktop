import AstalWp from "gi://AstalWp";
const wireplumber = AstalWp.get_default() as AstalWp.Wp;
export const audioService = wireplumber.audio;

import { bind } from "astal/binding.js";
import { AudioDevice } from "./Device";
import { NotFoundButton } from "./NotFoundButton";

export const PlaybackDevices = (): JSX.Element => {
	const playbackDevices = bind(audioService, "speakers");

	return (
		<box vertical>
			{playbackDevices.as((devices) => {
				if (!devices || devices.length === 0) {
					return <NotFoundButton type={"playback"} />;
				}

				return devices.map((device) => {
					return <AudioDevice device={device} type={"playback"} icon={""} />;
				});
			})}
		</box>
	);
};
