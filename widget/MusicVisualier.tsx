import { Astal, Gtk } from "astal/gtk3";
import Cava from "gi://AstalCava";
import CavaVisualiser from "../services/CavaVisualiser";
import { bind, Variable } from "astal";

export default function MusicVisualiserSys({
	mul,
	reverse,
}: {
	mul: number;
	reverse: boolean;
}) {
	const cava = Cava.get_default();
	const bars = CavaVisualiser.get_default();

	cava?.set_framerate(30);
	cava?.set_samplerate(120);

	cava?.set_bars(20);

	cava?.connect("notify::values", () => {
		bars.bar_length = cava.get_values();
	});

	if (reverse)
		return (
			<box
				heightRequest={mul * 333}
				vexpand
				valign={Gtk.Align.END}
				hexpand
				className="BarContainer"
			>
				{bind(bars, "bar_length").as((c) => {
					return c
						.map((c) => (
							<box
								hexpand
								heightRequest={Math.min(c * mul, 320 * mul)}
								className="Bars"
								valign={Gtk.Align.END}
							></box>
						))
						.reverse();
				})}
			</box>
		);
	else
		return (
			<box
				heightRequest={mul * 333}
				vexpand
				valign={Gtk.Align.END}
				hexpand
				className="BarContainer"
			>
				{bind(bars, "bar_length").as((c) => {
					return c.map((c) => (
						<box
							hexpand
							heightRequest={Math.min(c * mul, 320 * mul)}
							className="Bars"
							valign={Gtk.Align.END}
						></box>
					));
				})}
			</box>
		);

	// return <box></box>;
}
