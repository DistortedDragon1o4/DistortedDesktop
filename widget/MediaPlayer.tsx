import { Astal, Gtk } from "astal/gtk3";
import Mpris from "gi://AstalMpris";
import { bind } from "astal";

function lengthStr(length: number) {
	const min = Math.floor(length / 60);
	const sec = Math.floor(length % 60);
	const sec0 = sec < 10 ? "0" : "";
	return `${min}:${sec0}${sec}`;
}

function MediaPlayer({ player }: { player: Mpris.Player }) {
	const { START, END } = Gtk.Align;

	let dragging = false;
	let prevP = 0;

	const title = bind(player, "title")
		.as((t) => t || "Unknown Track")
		.as((t) => {
			return t.length > 22 ? t.substr(0, 20) + "..." : t;
		});

	const artist = bind(player, "artist")
		.as((a) => a || "Unknown Artist")
		.as((t) => {
			return t.length > 25 ? t.substr(0, 25) + "..." : t;
		});

	const coverArt = bind(player, "coverArt").as(
		(c) => `background-image: url('${c}'); margin: 0px;`,
	);

	const playerIcon = bind(player, "entry").as((e) =>
		Astal.Icon.lookup_icon(e) ? e : "audio-x-generic-symbolic",
	);

	const position = bind(player, "position").as((p) => {
		if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING || dragging)
			prevP = player.length > 0 ? p / player.length : 0;

		return prevP;
	});

	const positionStr = bind(player, "position").as((p) => {
		return lengthStr(prevP * player.length);
	});

	const playIcon = bind(player, "playbackStatus").as((s) =>
		s === Mpris.PlaybackStatus.PLAYING
			? "media-playback-pause-symbolic"
			: "media-playback-start-symbolic",
	);

	return (
		<box className="MediaPlayer" vertical>
			<box css="margin: 4px;">
				<box className="cover-art" css={coverArt} />
				<box css="margin-left: 6px;" vertical>
					<label
						className="title"
						halign={START}
						xalign={0}
						label={title}
						truncate
					/>
					<label
						halign={START}
						valign={START}
						label={artist}
						truncate
					/>
				</box>
			</box>
			<box vertical>
				<slider
					visible={bind(player, "length").as((l) => l > 0)}
					onDragged={({ value }) => {
						dragging = true;
						player.position = value * player.length;
						dragging = false;
					}}
					value={position}
				/>
				<centerbox className="actions">
					<label
						hexpand
						className="position"
						halign={START}
						visible={bind(player, "length").as((l) => l > 0)}
						label={positionStr}
					/>
					<box>
						<button
							onClicked={() => player.previous()}
							visible={bind(player, "canGoPrevious")}
						>
							<icon icon="media-skip-backward-symbolic" />
						</button>
						<button
							onClicked={() => player.play_pause()}
							visible={bind(player, "canControl")}
						>
							<icon icon={playIcon} />
						</button>
						<button
							onClicked={() => player.next()}
							visible={bind(player, "canGoNext")}
						>
							<icon icon="media-skip-forward-symbolic" />
						</button>
					</box>
					<label
						className="length"
						hexpand
						halign={END}
						visible={bind(player, "length").as((l) => l > 0)}
						label={bind(player, "length").as((l) =>
							l > 0 ? lengthStr(l) : "0:00",
						)}
					/>
				</centerbox>
			</box>
		</box>
	);
}

export default function MprisPlayers() {
	const mpris = Mpris.get_default();
	return (
		<box vertical>
			<box
				hexpand
				halign={Gtk.Align.CENTER}
				marginTop={90}
				className="NotPlaying"
				vertical
				visible={bind(mpris, "players").as((l) => l.length === 0)}
			>
				<icon hexpand icon="media-tape-symbolic" />
				<label hexpand label="Nothing's Playin" />
			</box>
			<scrollable
				className="SysUtilsMenuScrollableBox"
				css="min-height: 341px;"
				vexpand
				visible={bind(mpris, "players").as((l) => !(l.length === 0))}
			>
				<box vertical valign={Gtk.Align.END}>
					{bind(mpris, "players").as((arr) =>
						arr.map((player) => <MediaPlayer player={player} />),
					)}
				</box>
			</scrollable>
		</box>
	);
}
