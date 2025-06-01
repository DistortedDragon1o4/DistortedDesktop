import Apps from "gi://AstalApps";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { Variable, exec } from "astal";

import DockHoverState from "../services/DockHoverState";
import BarHoverState from "../services/BarHoverState";
import PinnedAppsList from "../services/PinnedAppsList";

const MAX_ITEMS = 16;

function hide() {
	App.get_window("Launcher")!.hide();
}

function AppButton({ app }: { app: Apps.Application }) {
	const apps = PinnedAppsList.get_default();
	return (
		<box>
			<button
				className="AppButton"
				onClick={() => {
					hide();
					app.launch();
				}}
			>
				<box>
					<icon icon={app.iconName} />
					<box hexpand valign={Gtk.Align.CENTER} vertical>
						<label
							className="name"
							truncate
							xalign={0}
							label={app.name}
						/>
						{app.description && (
							<label
								className="description"
								wrap
								xalign={0}
								label={app.description}
							/>
						)}
					</box>
				</box>
			</button>
			<button
				className="PinAppButton"
				onClick={() => {
					exec([
						"python",
						"scripts/desktop-parser.py",
						"--add",
						"--path",
						app.entry,
						"--name",
						app.name,
						"--icon",
						app.iconName,
						"./assets/pinnedApps.json",
					]);
					apps.notify("pinned_apps");
				}}
			>
				<icon icon="pin-symbolic" />
			</button>
		</box>
	);
}

export default function Applauncher() {
	const { CENTER } = Gtk.Align;
	const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor;
	let apps = new Apps.Apps();
	const width = Variable(1000);

	const text = Variable("");
	const list = text((text) => apps.fuzzy_query(text).slice(0, MAX_ITEMS));
	const onEnter = () => {
		apps.fuzzy_query(text.get())?.[0].launch();
		hide();
	};

	const hoverState = DockHoverState.get_default();
	const barHoverState = BarHoverState.get_default();

	const revealState = Variable(true);

	return (
		<window
			name="Launcher"
			anchor={TOP | LEFT | BOTTOM}
			exclusivity={Astal.Exclusivity.NORMAL}
			keymode={Astal.Keymode.ON_DEMAND}
			application={App}
			visible={false}
			onShow={(self) => {
				barHoverState.bar_state_str = true;
				barHoverState.app_launcher_state = true;
				apps.reload();
				text.set("");
				width.set(self.get_current_monitor().workarea.width);
				hoverState.dock_state = true;
				hoverState.hover_state = true;
				hoverState.hover_lock = true;
				setTimeout(() => {
					revealState.set(true);
				}, 90);
			}}
			onHide={(self) => {
				revealState.set(false);
				setTimeout(() => {
					barHoverState.app_launcher_state = false;
					barHoverState.bar_state_str = false;
					hoverState.hover_lock = false;
					hoverState.hover_state = false;
					setTimeout(() => {
						hoverState.dock_state = false;
					}, 100);
				}, 10);
			}}
			onKeyPressEvent={function (self, event: Gdk.Event) {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
			}}
			marginLeft={76}
		>
			<box>
				<stack
					transitionDuration={250}
					transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
					shown={revealState((r) => {
						return r ? "vis" : "no_vis";
					})}
				>
					<box name="vis">
						<box hexpand vexpand>
							<eventbox expand onClick={hide} />
							<box
								widthRequest={450}
								className="Applauncher"
								vexpand
								vertical
							>
								<entry
									placeholderText="Search"
									text={text()}
									onChanged={(self) => text.set(self.text)}
									onActivate={onEnter}
									isFocus={revealState((r) => r)}
								/>
								<box
									halign={CENTER}
									className="not-found"
									vertical
									visible={list.as((l) => l.length === 0)}
									marginTop={300}
								>
									<icon icon="system-search-symbolic" />
									<label label="No match found" />
								</box>
								<scrollable className="ScrollableBox" vexpand>
									<box spacing={6} vertical>
										{list.as((list) =>
											list.map((app) => (
												<AppButton app={app} />
											)),
										)}
									</box>
								</scrollable>
							</box>
							<eventbox expand onClick={hide} />
						</box>
					</box>
					<box name="no_vis"></box>
				</stack>
				{/* <eventbox
					widthRequest={width((w) => w)}
					expand
					hexpand
					vexpand
					onClick={hide}
				/> */}
			</box>
		</window>
	);
}
