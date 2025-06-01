import AstalWp from "gi://AstalWp?version=0.1";
import { SliderIcon } from "./SliderIcon";
import { Slider } from "./Slider";

export const SliderItem = ({ type, device }: SliderItemProps): JSX.Element => {
	return (
		<box className={`SysUtilsMenuChoiceButton ${type}`} vertical>
			<SliderIcon type={type} device={device} />
			<Slider type={type} device={device} />
		</box>
	);
};

interface SliderItemProps {
	type: "playback" | "input";
	device: AstalWp.Endpoint;
}
