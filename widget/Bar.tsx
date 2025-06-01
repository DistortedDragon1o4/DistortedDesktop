import { App } from "astal/gtk3";
import { Variable, GLib, bind, execAsync, exec } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import Cava from "gi://AstalCava";

import BarHoverState from "../services/BarHoverState";
import MusicVisualiser from "../services/MusicVisual";
import ControlCenterVis from "../services/ModuleVis";
import MusicVisualiserSys from "./MusicVisualier";

function SysTray() {
	const tray = Tray.get_default();

	return (
		<box className="SysUtilsArea">
			{bind(tray, "items").as((items) =>
				items.map((item) => (
					<menubutton
						className="TrayButton"
						tooltipMarkup={bind(item, "tooltipMarkup")}
						usePopover={false}
						actionGroup={bind(item, "actionGroup").as((ag) => [
							"dbusmenu",
							ag,
						])}
						menuModel={bind(item, "menuModel")}
					>
						<icon gicon={bind(item, "gicon")} />
					</menubutton>
				)),
			)}
		</box>
	);
}

function Wifi() {
	const { wifi } = Network.get_default();

	return (
		<icon
			tooltipText={bind(wifi, "ssid").as(String)}
			className="Wifi"
			icon={bind(wifi, "iconName")}
		/>
	);
}

function AudioSlider() {
	const speaker = Wp.get_default()?.audio.defaultSpeaker!;
	const mic = Wp.get_default()?.audio.defaultMicrophone!;

	return (
		<box className="AudioSlider">
			<icon icon={bind(speaker, "volumeIcon")} />
			<label css="min-width: 4px;" />
			<icon icon={bind(mic, "volumeIcon")} />
		</box>
	);
}

function BatteryLevel() {
	const bat = Battery.get_default();

	return (
		<box className="Battery" visible={bind(bat, "isPresent")}>
			<icon icon={bind(bat, "batteryIconName")} />
			<label
				css={"font-size: 0.77rem"}
				label={bind(bat, "percentage").as(
					(p) => `${Math.floor(p * 100)} %`,
				)}
			/>
		</box>
	);
}

function Media() {
	const mpris = Mpris.get_default();

	return (
		<box className="Media">
			{bind(mpris, "players").as((ps) =>
				ps[0] ? (
					<box>
						<box
							className="Cover"
							valign={Gtk.Align.CENTER}
							css={bind(ps[0], "coverArt").as(
								(cover) => `background-image: url('${cover}');`,
							)}
						/>
						<label
							label={bind(ps[0], "title").as(
								() => `${ps[0].title} - ${ps[0].artist}`,
							)}
						/>
					</box>
				) : (
					"Nothing Playing"
				),
			)}
		</box>
	);
}

function clamp(x: number, a: number, b: number) {
	if (x < a) x = a;
	if (x > b) x = b;
	return x;
}

function FocusedWorkspace() {
	return <box className="WorkspaceButton" widthRequest={18}></box>;
}

function UnfocusedWorkspace() {
	return <box className="WorkspaceButton" widthRequest={12}></box>;
}

function Workspaces() {
	const hypr = Hyprland.get_default();
	const workspaceIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	return (
		<box className="WorkspaceBox">
			<box className="Workspaces">
				{workspaceIds.map((wsid) => (
					<button
						className={bind(hypr, "focusedWorkspace").as((fw) =>
							wsid === fw.id
								? "focused"
								: bind(hypr, "workspaces")
											.as((wss) => wss.map((ws) => ws.id))
											.get()
											.includes(wsid)
									? "yesWindow"
									: "noWindow",
						)}
						onClicked={() =>
							Hyprland.Workspace.dummy(
								wsid,
								hypr.focusedMonitor,
							).focus()
						}
					>
						{bind(hypr, "focusedWorkspace").as((fw) =>
							wsid === fw.id ? (
								<FocusedWorkspace />
							) : (
								<UnfocusedWorkspace />
							),
						)}
					</button>
				))}
			</box>
		</box>
	);
}

function FocusedClient() {
	const hypr = Hyprland.get_default();
	const focused = bind(hypr, "focusedClient");

	return (
		<box>
			<box className="Focused" visible={focused.as(Boolean)}>
				{focused.as(
					(client) =>
						client && (
							<label
								truncate
								label={bind(client, "title").as((s) => {
									if (s) {
										s = s.replace(
											/[^a-zA-Z0-9\s\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\;\:\'\"\,\<\.\>\/\?\`\~]/g,
											"",
										);
										return s.length > 300
											? s.substr(0, 297) + "..."
											: s;
									}
								})}
							/>
						),
				)}
			</box>
			<box className="Focused" visible={focused.as((c) => !c)}>
				{focused.as((client) => (
					<label label="DistortedDesktop  —  The Delusional Distorted Dragon's Desktop" />
				))}
			</box>
		</box>
	);
}

function Time({ format = "%H:%M:%S %A %e/%m" }) {
	const time = Variable<string>("").poll(
		1000,
		() => GLib.DateTime.new_now_local().format("%H:%M:%S")!,
	);
	const date = Variable<string>("").poll(
		1000,
		() => GLib.DateTime.new_now_local().format("%A %e/%m")!,
	);

	return (
		<box className="TimeBox">
			<label
				css="min-width: 75px;"
				className="Time"
				onDestroy={() => time.drop()}
				label={time()}
			/>
			<label
				css="padding: 0 4px 0 4px;"
				className="Time"
				onDestroy={() => date.drop()}
				label={date()}
			/>
		</box>
	);
}

function MusicVisual() {
	const mpris = Mpris.get_default();

	return (
		<centerbox hexpand>
			<box halign={Gtk.Align.END} className="SysUtilsArea">
				{/* <box
					className="MusicVisBox"
					widthRequest={bind(music, "bar_length")}
				></box> */}
				{/* <MusicVisualiserSys mul={0.05625} reverse={true} />
				<MusicVisualiserSys mul={0.05625} reverse={false} /> */}
				<label
					className="MusicLabel"
					label={bind(mpris, "players")
						.as((arr) => {
							if (arr.length === 0) {
								return "Threatening Silence";
							} else {
								let t = arr[0].title;
								t = t.replace(
									/[^a-zA-Z0-9\s\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\;\:\'\"\,\<\.\>\/\?\`\~]/g,
									"",
								);
								t = t.length > 52 ? t.substr(0, 50) + "..." : t;
								return "Now playing  —  " + t + " ";
							}
						})
						.as(String)}
				/>
			</box>
		</centerbox>
	);
}

function SysUtilsArea() {
	const hoverState = BarHoverState.get_default();
	const controlCenterState = ControlCenterVis.get_default();

	return (
		<eventbox
			onClick={() => {
				// if (controlCenterState.control_center_state) {
				// 	App.get_window("SysutilsMenu")!.hide();
				// } else {
				// 	App.get_window("SysutilsMenu")!.show();
				// }
				execAsync([
					"astal",
					"-i",
					"DistortedDesktop",
					"-t",
					"SysutilsMenu",
				]);
			}}
		>
			<box className="SysUtilsArea">
				<AudioSlider />
				<label css="min-width: 4px;" />
				<Wifi />
				<label css="min-width: 4px;" />
				<BatteryLevel />
			</box>
		</eventbox>
	);
}

export default function Bar(monitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
	const hoverState = BarHoverState.get_default();
	const hypr = Hyprland.get_default();

	return (
		<window
			className="Bar"
			name="Bar"
			application={App}
			gdkmonitor={monitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			layer={Astal.Layer.TOP}
			anchor={TOP | LEFT | RIGHT}
		>
			<eventbox
				onHover={() => {
					hoverState.bar_state_str = true;
				}}
				onHoverLost={() => {
					hoverState.bar_state_str = false;
				}}
				onScroll={(s, e) =>
					clamp(
						hypr.focused_workspace.id + (e.delta_y > 0 ? 1 : -1),
						1,
						10,
					) == hypr.focused_workspace.id
						? 0
						: Hyprland.Workspace.dummy(
								clamp(
									hypr.focused_workspace.id +
										(e.delta_y > 0 ? 1 : -1),
									1,
									10,
								),
								hypr.focusedMonitor,
							).focus()
				}
			>
				<box className="BlurBox">
					<centerbox>
						<box hexpand halign={Gtk.Align.START}>
							<stack
								shown={bind(hoverState, "bar_state_str")}
								transitionType={
									Gtk.StackTransitionType.OVER_RIGHT
								}
								transitionDuration={250}
							>
								<box name="vis">
									<box
										visible={bind(
											hoverState,
											"bar_state_bool_inv",
										)}
									>
										<Workspaces />
									</box>
								</box>
								<box name="not_vis">
									<box
										visible={bind(
											hoverState,
											"bar_state_bool",
										)}
										css="margin-left: 4px;"
									>
										<FocusedClient />
									</box>
								</box>
							</stack>
						</box>
						<box></box>
						<box hexpand halign={Gtk.Align.END}>
							<stack
								shown={bind(hoverState, "bar_state_str")}
								transitionType={
									Gtk.StackTransitionType.OVER_LEFT
								}
								transitionDuration={250}
							>
								<box name="not_vis">
									<box
										visible={bind(
											hoverState,
											"bar_state_bool",
										)}
									>
										<MusicVisual />
									</box>
								</box>
								<centerbox name="vis">
									<box
										halign={Gtk.Align.END}
										visible={bind(
											hoverState,
											"bar_state_bool_inv",
										)}
									>
										<SysTray />
										<Time />
										<SysUtilsArea />
									</box>
								</centerbox>
							</stack>
						</box>
					</centerbox>
				</box>
			</eventbox>
		</window>
	);
}
