import { App } from "astal/gtk3";
import {
	Variable,
	GLib,
	bind,
	execAsync,
	exec,
	property,
	register,
} from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import BrightnessCtl from "./../services/Brightness";
import ControlCenterMenu from "./../services/ControlCenter";

import { WifiMenu } from "./SysutilsMenus/WifiMenu";
import { PlaybackMenu } from "./SysutilsMenus/AudioMenu";
import { DevicesMenu } from "./SysutilsMenus/AudioMenu";
import { BluetoothMenu } from "./SysutilsMenus/BluetoothMenu";
import { getIcon } from "./SysutilsMenus/AudioMenu/Sliders/utils";
import MprisPlayers from "./MediaPlayer";
import MusicVisualiserSys from "./MusicVisualier";

import BarHoverState from "../services/BarHoverState";
import ControlCenterVis from "../services/ModuleVis";
import { CenterBox } from "astal/gtk3/widget";

function formatUptime(uptimeOutput: string): string {
	// Extract the uptime portion from the full output
	const uptimeMatch = uptimeOutput.match(/up\s+(.*?),\s+\d+\s+user/);
	if (!uptimeMatch) return "N/A";

	const uptimeString = uptimeMatch[1];

	// Regex patterns to match different uptime formats
	const dayMinutePattern = /(\d+)\s+days?,\s+(\d+)\s+min/;
	const dayHourMinutePattern = /(\d+)\s+days?,\s+(\d+):(\d+)/;
	const hourMinutePattern = /(\d+):(\d+)/;
	const minutePattern = /(\d+)\s+min/;

	let match;

	// Check for "2 days, 19 min" format
	if ((match = uptimeString.match(dayMinutePattern))) {
		return `${match[1]}d`;
	}

	// Check for "1 day, 2:34" format
	if ((match = uptimeString.match(dayHourMinutePattern))) {
		return `${match[1]}d`;
	}

	// Check for hour:minute format (like "10:25")
	if ((match = uptimeString.match(hourMinutePattern))) {
		const hours = parseInt(match[1], 10);
		const minutes = parseInt(match[2], 10);

		if (hours >= 24) {
			const days = Math.floor(hours / 24);
			return `${days}d`;
		}
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
	}

	// Check for just minutes
	if ((match = uptimeString.match(minutePattern))) {
		return `${match[1]}m`;
	}

	// Default case if no patterns match
	return uptimeString;
}

const getUptime = () => {
	const uptime = exec(["bash", "-c", "uptime"]);
	return formatUptime(uptime);
};

function UserProfile() {
	const bat = Battery.get_default();
	const uptime = Variable<string>("").poll(60000, () => getUptime());

	return (
		<box>
			<box className="Pfp" />
			<box vertical valign={Gtk.Align.CENTER} className="Uptime">
				<box className="Battery" visible={bind(bat, "isPresent")}>
					<icon
						icon={bind(bat, "batteryIconName")}
						css="font-size: 1rem;"
					/>
					<label
						label={bind(bat, "percentage").as(
							(p) => `${Math.floor(p * 100)} %`,
						)}
					/>
				</box>
				<box>
					<icon
						icon="appointment-soon-symbolic"
						css="font-size: 1rem;"
					/>
					<label onDestroy={() => uptime.drop()} label={uptime()} />
				</box>
			</box>
		</box>
	);
}

function PowButtons() {
	const hoverState = BarHoverState.get_default();

	return (
		<box hexpand halign={Gtk.Align.END} className="PowButtonsBox">
			<button className="PowButtons">
				<icon icon="emblem-system-symbolic" />
			</button>
			<button
				className="PowButtons"
				onClicked={() => {
					App.get_window("SysutilsMenu")!.hide();
					execAsync(["loginctl", "lock-session"]);
				}}
			>
				<icon icon="system-lock-screen-symbolic" />
			</button>
			<button
				className="PowButtons"
				onClicked={() => {
					App.get_window("PowerMenu")!.show();
					App.get_window("SysutilsMenu")!.hide();
				}}
			>
				<icon icon="system-shutdown-symbolic" />
			</button>
		</box>
	);
}

function AudioNBrite() {
	const speaker = Wp.get_default()?.audio.defaultSpeaker!;
	const mic = Wp.get_default()?.audio.defaultMicrophone!;
	const brightnessService = BrightnessCtl.get_default();

	const speakerIconBinding = Variable.derive(
		[bind(speaker, "volume"), bind(speaker, "mute")],
		(volume, isMuted) => {
			const iconType = "spkr";

			const effectiveVolume = volume > 0 ? volume : 100;
			const mutedState = volume > 0 ? isMuted : true;

			return getIcon(effectiveVolume, mutedState)[iconType];
		},
	);
	const micIconBinding = Variable.derive(
		[bind(mic, "volume"), bind(mic, "mute")],
		(volume, isMuted) => {
			const iconType = "mic";

			const effectiveVolume = volume > 0 ? volume : 100;
			const mutedState = volume > 0 ? isMuted : true;

			return getIcon(effectiveVolume, mutedState)[iconType];
		},
	);

	return (
		<box vertical className="AudioNBriteBox">
			<box className="slider">
				<button
					className="AudioButton"
					onClick={(_, event) => {
						speaker.mute = !speaker.mute;
					}}
					onDestroy={() => {
						speakerIconBinding.drop();
					}}
				>
					<icon icon={speakerIconBinding()} />
				</button>
				<slider
					hexpand
					onDragged={({ value }) => (speaker.volume = value)}
					value={bind(speaker, "volume")}
				/>
			</box>
			<box className="slider">
				<button
					className="AudioButton"
					onClick={(_, event) => {
						mic.mute = !mic.mute;
					}}
					onDestroy={() => {
						micIconBinding.drop();
					}}
				>
					<icon icon={micIconBinding()} />
				</button>
				<slider
					hexpand
					onDragged={({ value }) => (mic.volume = value)}
					value={bind(mic, "volume")}
				/>
			</box>
			<box className="slider">
				<button className="AudioButton">
					<icon icon="display-brightness-symbolic" />
				</button>
				<slider
					hexpand
					value={bind(brightnessService, "screen")}
					onDragged={({ value, dragging }) => {
						if (dragging) {
							brightnessService.screen = value;
						}
					}}
				/>
			</box>
		</box>
	);
}

function ControlCenter() {
	const { wifi } = Network.get_default();
	const menu = ControlCenterMenu.get_default();

	return (
		<box heightRequest={300}>
			<box vertical css="margin: 4px 0 4px 4px;">
				<button
					className={bind(menu, "wifi_menu_class")}
					onClick={(c) => {
						menu.menu_state = "wifi-menu";
					}}
				>
					<box>
						<icon icon={bind(wifi, "iconName")} />
					</box>
				</button>
				<button
					className={bind(menu, "bluetooth_menu_class")}
					onClick={(c) => {
						menu.menu_state = "bluetooth-menu";
					}}
				>
					<box>
						<icon icon="bluetooth-symbolic" />
					</box>
				</button>
				<button
					className={bind(menu, "playback_menu_class")}
					onClick={(c) => {
						menu.menu_state = "playback-menu";
					}}
				>
					<box>
						<icon icon="audio-speakers-symbolic" />
					</box>
				</button>
				<button
					className={bind(menu, "audio_devices_menu_class")}
					onClick={(c) => {
						menu.menu_state = "audio-devices-menu";
					}}
				>
					<box>
						<icon icon="audio-card-symbolic" />
					</box>
				</button>
			</box>
			<stack
				hexpand
				name="thingy"
				shown={bind(menu, "menu_state")}
				transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
			>
				<WifiMenu />
				<BluetoothMenu />
				<PlaybackMenu />
				<DevicesMenu />
			</stack>
		</box>
	);
}

export default function Sysutils(monitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
	const hoverState = BarHoverState.get_default();
	const controlCenterState = ControlCenterVis.get_default();

	const revealState = Variable(false);

	return (
		<window
			className="SysutilsMenu"
			name="SysutilsMenu"
			application={App}
			gdkmonitor={monitor}
			keymode={Astal.Keymode.ON_DEMAND}
			exclusivity={Astal.Exclusivity.NORMAL}
			layer={Astal.Layer.TOP}
			anchor={TOP | RIGHT | BOTTOM}
			visible={false}
			onShow={(self) => {
				App.get_window("NotificationPopups")!.hide();
				hoverState.bar_state_str = true;
				hoverState.control_center_state = true;
				controlCenterState.control_center_state = true;
				revealState.set(true);
				setTimeout(() => {
					App.get_window("NotificationPopups")!.show();
				}, 100);
			}}
			onHide={(self) => {
				App.get_window("NotificationPopups")!.hide();
				revealState.set(false);
				hoverState.control_center_state = false;
				hoverState.bar_state_str = false;
				controlCenterState.control_center_state = false;
				App.get_window("NotificationPopups")!.show();
			}}
			onKeyPressEvent={function (self, event: Gdk.Event) {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
			}}
		>
			<box css="margin: 0px;">
				{/* <eventbox
					hexpand
					vexpand
					onClick={() => {
						hoverState.bar_supress = false;
						hoverState.bar_state_str = false;
						controlCenterState.control_center_state = false;
						App.get_window("SysutilsMenu")!.hide();
					}}
					widthRequest={width((w) => w)}
				/> */}
				{/* <stack
					transitionDuration={200}
					transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
					shown={revealState((r) => {
						return r ? "vis" : "no_vis";
					})}
				> */}
				{/* <box name="no_vis" css="margin: 0px;"></box> */}
				<CenterBox name="vis" css="margin: 0px;" vertical>
					<box
						vertical
						className="SysutilsContainer"
						halign={Gtk.Align.END}
						valign={Gtk.Align.START}
					>
						<box>
							<UserProfile />
							<PowButtons />
						</box>
						<box>
							<AudioNBrite />
						</box>
						<ControlCenter />
					</box>
					<box
						vertical
						className="SysutilsContainerBottom"
						halign={Gtk.Align.END}
						valign={Gtk.Align.START | Gtk.Align.END}
						vexpand
						css="min-height: 340px;"
					>
						<overlay overlay={<MprisPlayers />}>
							<MusicVisualiserSys mul={1} reverse={false} />
						</overlay>
					</box>
				</CenterBox>
				{/* </stack> */}
			</box>
		</window>
	);
}
