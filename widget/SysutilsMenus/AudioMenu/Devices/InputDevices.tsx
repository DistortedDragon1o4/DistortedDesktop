import AstalWp from "gi://AstalWp";
const wireplumber = AstalWp.get_default() as AstalWp.Wp;
export const audioService = wireplumber.audio;

import { bind } from "astal/binding.js";
import { AudioDevice } from "./Device";
import { NotFoundButton } from "./NotFoundButton";

export const InputDevices = (): JSX.Element => {
	const inputDevices = bind(audioService, "microphones");

	return (
		<box vertical>
			{inputDevices.as((devices) => {
				if (!devices || devices.length === 0) {
					return <NotFoundButton type={"input"} />;
				}

				return devices.map((device) => {
					return <AudioDevice device={device} type={"input"} icon={""} />;
				});
			})}
		</box>
	);
};
