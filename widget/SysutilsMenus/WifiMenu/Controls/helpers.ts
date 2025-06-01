import Network from "gi://AstalNetwork";
import { bind, Variable } from "astal";
const networkService = Network.get_default();

export const isScanning: Variable<boolean> = Variable(false);
let scanningBinding: Variable<void> | undefined;

Variable.derive([bind(networkService, "wifi")], () => {
	scanningBinding?.drop();
	scanningBinding = undefined;

	if (!networkService.wifi) {
		return;
	}

	scanningBinding = Variable.derive(
		[bind(networkService.wifi, "scanning")],
		(scanning) => {
			isScanning.set(scanning);
		},
	);
});
