import AstalWp from "gi://AstalWp";
const wireplumber = AstalWp.get_default() as AstalWp.Wp;
export const audioService = wireplumber.audio;

import { bind } from "astal";
import { SliderItem } from "../sliderItem/SliderItem";

const NoStreams = (): JSX.Element => {
	return (
		<label
			className={"no-playbacks dim"}
			label={"No active playbacks found."}
			expand
		/>
	);
};

export const ActivePlaybacks = (): JSX.Element => {
	return (
		<scrollable className="SysUtilsMenuScrollableBox" vexpand>
			<box vertical>
				{bind(audioService, "streams").as((streams) => {
					if (!streams || streams.length === 0) {
						return <NoStreams />;
					}

					const currentStreams = streams;

					return currentStreams.map((stream) => {
						return <SliderItem type={"playback"} device={stream} />;
					});
				})}
			</box>
		</scrollable>
	);
};
