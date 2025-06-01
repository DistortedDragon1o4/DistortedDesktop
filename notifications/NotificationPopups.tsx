import { App } from "astal/gtk3";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "./Notification";
import { type Subscribable } from "astal/binding";
import { Variable, bind, timeout } from "astal";
import BarHoverState from "../services/BarHoverState";
import ControlCenterVis from "../services/ModuleVis";

// see comment below in constructor
const TIMEOUT_DELAY = 5000;

// The purpose if this class is to replace Variable<Array<Widget>>
// with a Map<number, Widget> type in order to track notification widgets
// by their id, while making it conviniently bindable as an array
class NotifiationMap implements Subscribable {
	private hoverState = BarHoverState.get_default();

	// the underlying map to keep track of id widget pairs
	private mapVis: Map<number, Gtk.Widget> = new Map();
	private mapHidden: Map<number, Gtk.Widget> = new Map();

	// it makes sense to use a Variable under the hood and use its
	// reactivity implementation instead of keeping track of subscribers ourselves
	private var: Variable<Array<Gtk.Widget>> = Variable([]);

	// notify subscribers to rerender when state changes
	notifiy() {
		if (this.hoverState.control_center_state) {
			this.var.set([...this.mapHidden.values()].reverse());
		} else {
			this.var.set([...this.mapVis.values()].reverse());
		}
	}

	constructor() {
		const notifd = Notifd.get_default();

		/**
		 * uncomment this if you want to
		 * ignore timeout by senders and enforce our own timeout
		 * note that if the notification has any actions
		 * they might not work, since the sender already treats them as resolved
		 */
		// notifd.ignoreTimeout = true

		notifd.connect("notified", (_, id) => {
			this.setVis(
				id,
				Notification({
					notification: notifd.get_notification(id)!,

					// once hovering over the notification is done
					// destroy the widget without calling notification.dismiss()
					// so that it acts as a "popup" and we can still display it
					// in a notification center like widget
					// but clicking on the close button will close it
					onHoverLost: () => {
						// timeout(TIMEOUT_DELAY, () => {
						// 	/**
						// 	 * uncomment this if you want to "hide" the notifications
						// 	 * after TIMEOUT_DELAY
						// 	 */
						// 	this.delete(id);
						// });
					},

					// notifd by default does not close notifications
					// until user input or the timeout specified by sender
					// which we set to ignore above
					setup: () => {
						this.setHidden(
							id,
							Notification({
								notification: notifd.get_notification(id)!,
								onHoverLost: () => {},
								setup: () => {},
							}),
						);
						timeout(TIMEOUT_DELAY, () => {
							/**
							 * uncomment this if you want to "hide" the notifications
							 * after TIMEOUT_DELAY
							 */

							this.deleteVis(id);
						});
					},
				}),
			);
		});

		// notifications can be closed by the outside before
		// any user input, which have to be handled too
		notifd.connect("resolved", (_, id) => {
			this.delete(id);
		});
	}

	private setVis(key: number, value: Gtk.Widget) {
		// in case of replacnotifsecment destroy previous widget
		this.mapVis.get(key)?.destroy();
		this.mapVis.set(key, value);
		this.notifiy();
	}

	private setHidden(key: number, value: Gtk.Widget) {
		// in case of replacecment destroy previous widget
		this.mapHidden.get(key)?.destroy();
		this.mapHidden.set(key, value);
		this.notifiy();
	}

	private deleteVis(key: number) {
		this.mapVis.get(key)?.destroy();
		this.mapVis.delete(key);
		this.notifiy();
	}

	private delete(key: number) {
		this.mapVis.get(key)?.destroy();
		this.mapHidden.get(key)?.destroy();
		this.mapVis.delete(key);
		this.mapHidden.delete(key);
		this.notifiy();
	}

	// needed by the Subscrinotifsbable interface
	get() {
		return this.var.get();
	}

	// needed by the Subscribable interface
	subscribe(callback: (list: Array<Gtk.Widget>) => void) {
		return this.var.subscribe(callback);
	}
}

export default function NotificationPopups(gdkmonitor: Gdk.Monitor) {
	const { TOP, RIGHT, BOTTOM } = Astal.WindowAnchor;
	const notifs = new NotifiationMap();

	const controlCenterState = ControlCenterVis.get_default();

	return (
		<window
			className="NotificationPopups"
			name="NotificationPopups"
			application={App}
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.NORMAL}
			anchor={TOP | RIGHT | BOTTOM}
			onShow={() => {
				notifs.notifiy();
			}}
			marginRight={bind(controlCenterState, "control_center_class")}
		>
			<box vertical noImplicitDestroy>
				{bind(notifs)}
			</box>
		</window>
	);
}
