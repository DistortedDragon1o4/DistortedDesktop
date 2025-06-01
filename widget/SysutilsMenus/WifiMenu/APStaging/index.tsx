import { bind } from "astal/binding";
import { Variable } from "astal";
import Network from "gi://AstalNetwork";

const networkService = Network.get_default();
import { AccessPoint } from "./AccessPoint";
import { PasswordInput } from "./PasswordInput";
import { connecting, staging } from "../WirelessAPs/helpers";

export const APStaging = (): JSX.Element => {
	const stagingBinding = Variable.derive(
		[bind(networkService, "wifi"), bind(staging)],
		() => {
			if (staging.get()?.ssid === undefined) {
				return <box css="margin: 0;" />;
			}

			return (
				<box css="margin: 0;" vertical>
					<AccessPoint connecting={connecting} staging={staging} />
					<PasswordInput connecting={connecting} staging={staging} />
				</box>
			);
		},
	);
	return (
		<box
			css="margin: 0;"
			className="wap-staging"
			onDestroy={() => {
				stagingBinding.drop();
			}}
		>
			{stagingBinding()}
		</box>
	);
};
