import { App } from "astal/gtk3";
import style from "./style.scss";
import NotificationPopups from "./notifications/NotificationPopups";
import OSD from "./osd/OSD";
import Bar from "./widget/Bar";
import Sysutils from "./widget/Sysutils";
import Dock from "./widget/Dock";
import PowerMenu from "./widget/PowerMenu";
import Applauncher from "./widget/Applauncher";

App.start({
	css: style,
	instanceName: "DistortedDesktop",
	requestHandler(request, res) {
		print(request);
		res("ok");
	},
	main() {
		App.get_monitors().map(NotificationPopups);
		App.get_monitors().map(OSD);
		App.get_monitors().map(Bar);
		App.get_monitors().map(Sysutils);
		App.get_monitors().map(Dock);
		App.get_monitors().map(PowerMenu);
		App.get_monitors().map(Applauncher);
	},
});
