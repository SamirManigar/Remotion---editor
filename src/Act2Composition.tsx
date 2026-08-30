import React from "react";
import {
	AbsoluteFill,
	Img,
	Sequence,
	interpolate,
	random,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { CameraShake, ImpactText, SerifText } from "./KineticUtils";

export const ACT2_FPS = 30;
export const ACT2_DURATION_IN_FRAMES = 2370;

const BG = "#0F0F0F";
const WHITE = "#FFFFFF";
const RED = "#E50914";
const GOLD = "#D4AF37";
const MUTED = "#555555";
const VOICEOVER_GAIN = 1.55;
const DRONE_BED_GAIN = 0.26;

const v2Visual = (name: string) => staticFile(`assets/visuals/v2/${name}`);
const sound = (name: string) => staticFile(`assets/audio/${name}`);

const ACT2_VOICEOVER = sound("vo-act2.wav");

const center: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const vignette =
	"radial-gradient(circle at center, rgba(15,15,15,0) 0%, rgba(15,15,15,0.18) 42%, rgba(15,15,15,0.85) 100%)";

/** Every visual asset gets this continuous 1.0 → 1.05 push over its scene. */
const slowScale = (frame: number, durationInFrames: number) =>
	interpolate(frame, [0, durationInFrames], [1, 1.05], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

const BackgroundVideo: React.FC<{
	src: string;
	durationInFrames: number;
	darken?: number;
	filter?: string;
	trimBefore?: number;
}> = ({ src, durationInFrames, darken = 0, filter = "none", trimBefore }) => {
	const frame = useCurrentFrame();
	const scale = slowScale(frame, durationInFrames);

	return (
		<AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
			<Video
				src={src}
				muted
				loop
				trimBefore={trimBefore}
				objectFit="cover"
				style={{
					width: "100%",
					height: "100%",
					transform: `scale(${scale})`,
					filter: `brightness(${1 - darken}) ${filter}`,
				}}
			/>
		</AbsoluteFill>
	);
};

const BackgroundImage: React.FC<{
	src: string;
	durationInFrames: number;
	darken?: number;
	fit?: React.CSSProperties["objectFit"];
}> = ({ src, durationInFrames, darken = 0, fit = "cover" }) => {
	const frame = useCurrentFrame();
	const scale = slowScale(frame, durationInFrames);

	return (
		<AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
			<Img
				src={src}
				style={{
					width: "100%",
					height: "100%",
					objectFit: fit,
					transform: `scale(${scale})`,
					filter: `brightness(${1 - darken})`,
				}}
			/>
		</AbsoluteFill>
	);
};

const ProceduralDarkGraphic: React.FC<{ variant?: "misconception" | "far" }> = ({ variant = "misconception" }) => {
	const frame = useCurrentFrame();
	const pulse = interpolate(frame, [0, 45, 90], [0.92, 1.04, 0.96], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const accent = variant === "far" ? "rgba(212,175,55,0.2)" : "rgba(229,9,20,0.22)";

	return (
		<AbsoluteFill
			style={{
				background:
					variant === "far"
						? "radial-gradient(circle at 50% 45%, rgba(212,175,55,0.16) 0%, rgba(15,15,15,0) 34%), linear-gradient(135deg, #171717 0%, #0F0F0F 54%, #050505 100%)"
						: "radial-gradient(circle at 50% 45%, rgba(90,20,20,0.28) 0%, rgba(15,15,15,0) 34%), linear-gradient(135deg, #171717 0%, #0F0F0F 54%, #050505 100%)",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "18%",
					left: "50%",
					width: "42%",
					height: "64%",
					border: `1px solid ${accent}`,
					borderRadius: "50%",
					transform: `translateX(-50%) rotate(-9deg) scale(${pulse})`,
					boxShadow: `0 0 90px ${accent}, inset 0 0 60px ${accent}`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: "25%",
					left: "50%",
					width: "30%",
					height: "48%",
					border: "1px solid rgba(255,255,255,0.08)",
					transform: `translateX(-50%) rotate(21deg) scale(${1 / pulse})`,
				}}
			/>
		</AbsoluteFill>
	);
};

const BreathingRoomGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const light = interpolate(frame, [0, 75, 150], [0.4, 0.72, 0.5], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ background: "linear-gradient(160deg, #101010 0%, #201b19 58%, #080808 100%)", overflow: "hidden" }}>
			<div style={{ position: "absolute", top: 0, right: "13%", width: "28%", height: "100%", background: `linear-gradient(90deg, transparent, rgba(229,196,151,${light}), transparent)`, transform: "skewX(-12deg)" }} />
			<div style={{ position: "absolute", bottom: "12%", left: "20%", width: "60%", height: "18%", borderRadius: "50%", background: "rgba(0,0,0,0.5)", filter: "blur(18px)" }} />
			<div style={{ position: "absolute", bottom: "29%", left: "47%", width: 92, height: 92, borderRadius: "50%", background: "#161616", boxShadow: "0 0 0 10px #26201d" }} />
			<div style={{ position: "absolute", bottom: "4%", left: "33%", width: "35%", height: "28%", borderRadius: "48% 48% 18% 18%", background: "#111111", transform: "rotate(-4deg)" }} />
		</AbsoluteFill>
	);
};

const LonelinessGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const drift = interpolate(frame, [0, 120], [-3, 3], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #202a31 0%, #0F0F0F 62%)", overflow: "hidden" }}>
			<div style={{ position: "absolute", top: "18%", left: "50%", width: "1px", height: "64%", background: "rgba(255,255,255,0.1)" }} />
			<div style={{ position: "absolute", bottom: "13%", left: `calc(50% + ${drift}%)`, width: "24%", height: "4%", background: "#050505", borderRadius: "50%", filter: "blur(4px)" }} />
			<div style={{ position: "absolute", bottom: "17%", left: `calc(50% + ${drift}%)`, width: "7%", height: "25%", background: "#0a0a0a", borderRadius: "36% 36% 8% 8%" }} />
			<div style={{ position: "absolute", bottom: "38%", left: `calc(50% + ${drift - 1.2}%)`, width: "5%", height: "8%", background: "#0a0a0a", borderRadius: "50%" }} />
		</AbsoluteFill>
	);
};

const WireTensionGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const dashOffset = interpolate(frame, [0, 90], [980, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
	const tension = interpolate(frame, [0, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

	return (
		<AbsoluteFill style={{ background: "#0F0F0F", overflow: "hidden" }}>
			<svg viewBox="0 0 1920 1080" width="100%" height="100%">
				<path d="M180 760 C420 190 660 920 900 380 S1400 240 1740 690" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="34" />
				<path d="M180 760 C420 190 660 920 900 380 S1400 240 1740 690" fill="none" stroke={WHITE} strokeWidth="8" strokeDasharray="980" strokeDashoffset={dashOffset} />
				<circle cx="1740" cy="690" r={18 + tension * 10} fill={RED} />
			</svg>
		</AbsoluteFill>
	);
};

const EyeReflectionGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const pupilScale = interpolate(frame, [0, 45, 90], [0.88, 1.08, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

	return (
		<AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #253645 0%, #0F0F0F 64%)", overflow: "hidden" }}>
			<div style={{ position: "absolute", top: "27%", left: "17%", width: "66%", height: "46%", borderRadius: "50%", background: "#c9d3d1", transform: "rotate(-4deg)", boxShadow: "0 0 90px rgba(117,183,205,0.28)" }} />
			<div style={{ position: "absolute", top: "32%", left: "38%", width: "24%", height: "36%", borderRadius: "50%", background: "#527988", transform: `scale(${pupilScale})`, border: "18px solid #1e3037" }} />
			<div style={{ position: "absolute", top: "44%", left: "48%", width: "7%", height: "12%", borderRadius: "50%", background: "#050505", transform: `scale(${pupilScale})` }} />
			<div style={{ position: "absolute", top: "35%", left: "45%", width: "8%", height: "5%", background: "rgba(255,255,255,0.78)", transform: "rotate(-18deg)" }} />
			<div style={{ position: "absolute", top: "22%", left: "13%", width: "74%", height: "56%", borderTop: "22px solid #080808", borderRadius: "50%" }} />
		</AbsoluteFill>
	);
};

const SunriseGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const sunY = interpolate(frame, [0, 60], [60, 42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

	return (
		<AbsoluteFill style={{ background: "linear-gradient(180deg, #171b29 0%, #8a5e4d 58%, #d4af67 100%)", overflow: "hidden" }}>
			<div style={{ position: "absolute", top: `${sunY}%`, left: "50%", width: 190, height: 190, borderRadius: "50%", background: "#ffe6a2", transform: "translate(-50%, -50%)", boxShadow: "0 0 90px 30px rgba(255,212,124,0.45)" }} />
			<div style={{ position: "absolute", bottom: "22%", left: 0, width: "100%", height: "28%", background: "#141414", clipPath: "polygon(0 54%, 12% 43%, 26% 52%, 42% 30%, 59% 48%, 73% 34%, 89% 45%, 100% 27%, 100% 100%, 0 100%)" }} />
			<div style={{ position: "absolute", bottom: "18%", left: "50%", width: 120, height: 290, background: "#090909", transform: "translateX(-50%)", clipPath: "polygon(42% 0, 61% 0, 67% 22%, 100% 44%, 83% 49%, 73% 100%, 28% 100%, 17% 48%, 0 43%, 35% 21%)" }} />
		</AbsoluteFill>
	);
};

const CssFilmGrain: React.FC = () => (
	<AbsoluteFill
		style={{
			pointerEvents: "none",
			mixBlendMode: "screen",
			backgroundImage: "repeating-radial-gradient(circle at 17% 23%, rgba(255,255,255,0.09) 0 1px, transparent 1px 4px), repeating-radial-gradient(circle at 71% 68%, rgba(255,255,255,0.06) 0 1px, transparent 1px 5px)",
			backgroundSize: "13px 13px, 17px 17px",
			zIndex: 101,
		}}
	/>
);

const TimedShake: React.FC<{
	children: React.ReactNode;
	startFrame: number;
	durationInFrames: number;
	intensity: number;
}> = ({ children, startFrame, durationInFrames, intensity }) => {
	const frame = useCurrentFrame();
	const localFrame = frame - startFrame;
	const isActive = localFrame >= 0 && localFrame < durationInFrames;
	const fade = isActive
		? interpolate(localFrame, [0, durationInFrames], [1, 0], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
		  })
		: 0;
	const shakeX = isActive ? (random(`act2-shake-x-${frame}`) - 0.5) * intensity * 2 * fade : 0;
	const shakeY = isActive ? (random(`act2-shake-y-${frame}`) - 0.5) * intensity * 2 * fade : 0;

	return (
		<div style={{ width: "100%", height: "100%", translate: `${shakeX}px ${shakeY}px` }}>
			{children}
		</div>
	);
};

const SpringImpactText: React.FC<{
	children: React.ReactNode;
	entryFrame?: number;
	fromScale: number;
	style?: React.CSSProperties;
	config?: Parameters<typeof spring>[0]["config"];
}> = ({ children, entryFrame = 0, fromScale, style, config = { damping: 10, mass: 0.4 } }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = Math.max(0, frame - entryFrame);
	const entrySpring = spring({ fps, frame: localFrame, config });
	const scale = interpolate(entrySpring, [0, 1], [fromScale, 1]);

	return (
		<ImpactText entryFrame={entryFrame} style={{ ...style, scale }}>
			{children}
		</ImpactText>
	);
};

const SlowSerifLine: React.FC<{
	children: React.ReactNode;
	entryFrame?: number;
	color: string;
	fontSize: number;
	style?: React.CSSProperties;
}> = ({ children, entryFrame = 0, color, fontSize, style }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = Math.max(0, frame - entryFrame);
	const entrySpring = spring({
		fps,
		frame: localFrame,
		config: { damping: 18, stiffness: 88, mass: 1.2 },
	});
	const scale = interpolate(entrySpring, [0, 1], [0.82, 1]);
	const opacity = interpolate(localFrame, [0, 20], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<SerifText
			entryFrame={entryFrame}
			style={{
				color,
				fontSize,
				opacity,
				scale,
				textShadow: "0 2px 14px rgba(0,0,0,0.9)",
				...style,
			}}
		>
			{children}
		</SerifText>
	);
};

const RedStrikethrough: React.FC<{ startFrame: number; width?: number }> = ({ startFrame, width = 700 }) => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [startFrame, startFrame + 6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	if (frame < startFrame) return null;

	return (
		<div
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				width,
				height: 34,
				overflow: "hidden",
				transform: "translate(-50%, -50%) rotate(-10deg)",
				pointerEvents: "none",
			}}
		>
			<div style={{ width: `${progress * 100}%`, height: "100%", overflow: "hidden" }}>
				<div style={{ width, height: "100%", display: "flex", alignItems: "center" }}>
					<div style={{ width: "100%", height: 18, borderRadius: 99, backgroundColor: RED, boxShadow: "0 3px 0 rgba(100,0,0,0.35)" }} />
				</div>
			</div>
		</div>
	);
};

// 1. The Misconception (0–90)
const TheMisconception: React.FC = () => (
	<AbsoluteFill style={center}>
		<ProceduralDarkGraphic variant="misconception" />
		<ImpactText entryFrame={0} style={{ color: RED, fontSize: 150 }}>
			BIGGEST MISTAKE
		</ImpactText>
	</AbsoluteFill>
);

// 2. Single Action Myth (90–180)
const SingleActionMyth: React.FC = () => (
	<AbsoluteFill style={{ ...center, backgroundColor: BG }}>
		<SpringImpactText fromScale={0.25} config={{ damping: 9, stiffness: 190, mass: 0.55 }} style={{ color: WHITE, fontSize: 150 }}>
			SINGLE BAD ACTION
		</SpringImpactText>
	</AbsoluteFill>
);

// 3. The Click (180–270)
const TheClick: React.FC = () => (
	<AbsoluteFill style={center}>
		<BackgroundVideo src={v2Visual("mouse-click-dark.mp4")} durationInFrames={90} darken={0.18} />
		<ImpactText entryFrame={50} style={{ color: WHITE, fontSize: 145 }}>
			WHEN THEY CLICK
		</ImpactText>
		<Sequence from={50}>
			<Audio src={sound("digital-click.mp3")} volume={0.85} />
		</Sequence>
	</AbsoluteFill>
);

// 4. The Reality (270–360)
const TheReality: React.FC = () => (
	<AbsoluteFill style={center}>
		<BackgroundVideo src={v2Visual("ceiling-stare.mp4")} durationInFrames={90} darken={0.22} />
		<SerifText entryFrame={0} style={{ color: GOLD, fontSize: 132 }}>
			STARTS MUCH EARLIER
		</SerifText>
	</AbsoluteFill>
);

// 5. Nobody Wakes Up (360–450)
const NobodyWakesUp: React.FC = () => (
	<AbsoluteFill>
		<BackgroundVideo src={v2Visual("empty-bedroom-after-urge.mp4")} durationInFrames={90} darken={0.22} />
	</AbsoluteFill>
);

// 6. The Steps Before (450–540)
const TheStepsBefore: React.FC = () => (
	<AbsoluteFill style={center}>
		<WireTensionGraphic />
		<SpringImpactText fromScale={0.48} config={{ damping: 8, stiffness: 220, mass: 0.45 }} style={{ color: WHITE, fontSize: 128 }}>
			STEPS BEFORE IT
		</SpringImpactText>
	</AbsoluteFill>
);

// 7. The Triggers — Video/Account (540–630)
const VideoAndAccount: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={center}>
			<BackgroundVideo src={v2Visual("scrolling-thumb-dark.mp4")} durationInFrames={90} darken={0.32} />
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
				<ImpactText entryFrame={0} style={{ color: WHITE, fontSize: 118 }}>
					A VIDEO...
				</ImpactText>
				{frame >= 54 && (
					<ImpactText entryFrame={54} style={{ color: WHITE, fontSize: 118 }}>
						AN ACCOUNT...
					</ImpactText>
				)}
			</div>
		</AbsoluteFill>
	);
};

// 8. The Triggers — Image (630–720)
const TheImageTrigger: React.FC = () => (
	<AbsoluteFill style={center}>
		<BackgroundVideo src={v2Visual("eye-reflecting-phone.mp4")} durationInFrames={90} darken={0.12} />
		<ImpactText entryFrame={24} style={{ color: WHITE, fontSize: 145 }}>
			AN IMAGE
		</ImpactText>
	</AbsoluteFill>
);

// 9. Boredom & Loneliness (720–810)
const BoredomAndLoneliness: React.FC = () => (
	<AbsoluteFill style={center}>
		<LonelinessGraphic />
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
			<ImpactText entryFrame={0} style={{ color: WHITE, fontSize: 138 }}>
				BOREDOM.
			</ImpactText>
			<ImpactText entryFrame={36} style={{ color: WHITE, fontSize: 138 }}>
				LONELINESS.
			</ImpactText>
		</div>
	</AbsoluteFill>
);

// 10. Defenses Low (810–900)
const DefensesLow: React.FC = () => (
	<AbsoluteFill style={center}>
		<BackgroundVideo src={v2Visual("tired-eye-rub.mp4")} durationInFrames={90} darken={0.28} />
		<CameraShake intensity={4} activeDuration={15}>
			<AbsoluteFill style={center}>
				<ImpactText entryFrame={0} style={{ color: RED, fontSize: 145 }}>
					DEFENSES ARE LOW
				</ImpactText>
			</AbsoluteFill>
		</CameraShake>
	</AbsoluteFill>
);

// 11. The Chain Reaction (900–1080)
const TheChainReaction: React.FC = () => (
	<AbsoluteFill style={center}>
		<BackgroundVideo src={v2Visual("falling-dominos.mp4")} durationInFrames={180} darken={0.12} trimBefore={10 * ACT2_FPS} />
		<Sequence from={0}>
			<Audio src={sound("domino-clatter.mp3")} volume={0.28} />
		</Sequence>
	</AbsoluteFill>
);

// 12. The Relapse Cycle (1080–1260)
const TheRelapseCycle: React.FC = () => (
	<AbsoluteFill style={{ ...center, backgroundColor: BG }}>
		<CameraShake intensity={22} activeDuration={18}>
			<AbsoluteFill style={center}>
				<SpringImpactText fromScale={3} config={{ damping: 11, stiffness: 180, mass: 0.65 }} style={{ color: RED, fontSize: 128 }}>
					BACK IN THE SAME CYCLE
				</SpringImpactText>
			</AbsoluteFill>
		</CameraShake>
		<Sequence from={0}>
			<Audio src={sound("heavy-bass-boom.mp3")} volume={0.42} />
		</Sequence>
	</AbsoluteFill>
);

// 13. Willpower Myth (1170–1260)
const WillpowerMyth: React.FC = () => (
	<AbsoluteFill style={{ ...center, backgroundColor: BG }}>
		<ProceduralDarkGraphic variant="misconception" />
		<SpringImpactText fromScale={0.45} config={{ damping: 11, stiffness: 165, mass: 0.7 }} style={{ color: WHITE, fontSize: 142 }}>
			WILLPOWER ALONE
		</SpringImpactText>
		<RedStrikethrough startFrame={30} width={900} />
		<Sequence from={30}>
			<Audio src={sound("marker-scribble.mp3")} volume={0.55} />
		</Sequence>
	</AbsoluteFill>
);

// 14. Temptation is Far (1260–1350)
const TemptationIsFar: React.FC = () => (
	<AbsoluteFill style={center}>
		<BackgroundVideo src={v2Visual("faceless-restless-person.mp4")} durationInFrames={90} darken={0.42} />
		<ImpactText
			entryFrame={0}
			style={{
				color: WHITE,
				fontSize: 122,
				WebkitTextStroke: "2px rgba(15,15,15,0.88)",
				textShadow: "0 4px 22px rgba(0,0,0,0.95)",
			}}
		>
			WILLPOWER IS STRONGEST
		</ImpactText>
	</AbsoluteFill>
);

// 15. The Trap (1350–1440)
const TheTrap: React.FC = () => {
	const frame = useCurrentFrame();
	const trapScale = slowScale(frame, 90);
	const scribbleScale = interpolate(frame, [30, 35], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ ...center, backgroundColor: BG, overflow: "hidden" }}>
			<BackgroundImage src={v2Visual("paper-trap.jpeg")} durationInFrames={90} darken={0.08} fit="contain" />
			{frame >= 30 && (
				<Img
					src={v2Visual("red-scribble-circle.jpeg")}
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						width: "72%",
						height: "72%",
						objectFit: "contain",
						transform: `translate(-50%, -50%) scale(${trapScale * scribbleScale})`,
						mixBlendMode: "multiply",
					}}
				/>
			)}
			<Sequence from={30}>
				<Audio src={sound("marker-scribble.mp3")} volume={0.62} />
			</Sequence>
		</AbsoluteFill>
	);
};

// 16. The Diet Metaphor (1440–1530)
const TheDietMetaphor: React.FC = () => (
	<AbsoluteFill>
		<BackgroundImage src={v2Visual("cake-cutout.jpeg")} durationInFrames={90} darken={0.14} fit="contain" />
	</AbsoluteFill>
);

// 17. The Struggle (1530–1710)
const TheStruggle: React.FC = () => {
	const frame = useCurrentFrame();
	const harderOpacity = interpolate(frame, [90, 98, 158, 174], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={center}>
			<BackgroundVideo src={v2Visual("hand-resisting-food.mp4")} durationInFrames={180} darken={0.2} />
			<RedStrikethrough startFrame={90} width={900} />
			<ImpactText entryFrame={90} style={{ color: RED, fontSize: 170, opacity: harderOpacity }}>
				HARDER.
			</ImpactText>
			<Sequence from={90}>
				<Audio src={sound("paper-tear.mp3")} volume={0.55} />
			</Sequence>
		</AbsoluteFill>
	);
};

// 17b. The metaphor resolves into the habit argument (1710–1800).
const SamePrinciple: React.FC = () => {
	const frame = useCurrentFrame();
	const lineWidth = interpolate(frame, [10, 42], [0, 720], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ ...center, backgroundColor: BG }}>
			<ProceduralDarkGraphic variant="far" />
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
				<SerifText entryFrame={0} style={{ color: GOLD, fontSize: 132, textShadow: "0 3px 18px rgba(0,0,0,0.95)" }}>
					THE SAME PRINCIPLE
				</SerifText>
				<div style={{ width: lineWidth, height: 5, backgroundColor: RED, boxShadow: "0 0 18px rgba(229,9,20,0.55)" }} />
			</div>
		</AbsoluteFill>
	);
};

// 18. Hundreds of Battles (1800–1980)
const HundredsOfBattles: React.FC = () => (
	<AbsoluteFill style={center}>
		<BackgroundImage src={v2Visual("tally-marks.jpeg")} durationInFrames={180} darken={0.22} fit="contain" />
		<SpringImpactText entryFrame={90} fromScale={3.1} config={{ damping: 9, stiffness: 175, mass: 0.6 }} style={{ color: RED, fontSize: 128 }}>
			HUNDREDS OF BATTLES
		</SpringImpactText>
		<Sequence from={90}>
			<Audio src={sound("marker-scribble.mp3")} volume={0.78} />
		</Sequence>
	</AbsoluteFill>
);

// 19. Exhaustion (1980–2160)
const Exhaustion: React.FC = () => {
	const frame = useCurrentFrame();
	const exhausted = frame >= 30;
	const imageScale = slowScale(frame, 180);

	return (
		<AbsoluteFill style={center}>
			<TimedShake startFrame={30} durationInFrames={15} intensity={4}>
				<Img
					src={v2Visual("battery-drain.jpeg")}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						objectFit: "contain",
						transform: `scale(${imageScale})`,
						filter: "brightness(0.88)",
						opacity: exhausted ? 0.3 : 1,
					}}
				/>
			</TimedShake>
			<AbsoluteFill style={center}>
				<ImpactText entryFrame={0} style={{ color: exhausted ? MUTED : WHITE, fontSize: 150 }}>
					SELF-CONTROL
				</ImpactText>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// 20. The Real Battle (2160–2370)
const TheRealBattle: React.FC = () => (
	<AbsoluteFill style={center}>
		<SunriseGraphic />
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
			<SlowSerifLine color={WHITE} fontSize={82}>
				REDUCE EXPOSURE
			</SlowSerifLine>
			<SlowSerifLine entryFrame={90} color={WHITE} fontSize={58}>
				DON'T JUST FIGHT THE HABIT.
			</SlowSerifLine>
			<SlowSerifLine entryFrame={150} color={GOLD} fontSize={116}>
				FIGHT THE ENVIRONMENT
			</SlowSerifLine>
		</div>
		<Sequence from={180}>
			<Audio src={sound("heavy-bass-boom.mp3")} volume={0.42} />
		</Sequence>
	</AbsoluteFill>
);

/** Duck down over 15 frames, then return to full volume over the next 15. */
const duckDroneVolume = (frame: number, impactFrames: number[]) => {
	let volume = 1;
	for (const impactFrame of impactFrames) {
		const localFrame = frame - impactFrame;
		if (localFrame >= 0 && localFrame <= 30) {
			volume = Math.min(
				volume,
				interpolate(localFrame, [0, 15, 30], [1, 0.2, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				}),
			);
		}
	}
	return volume;
};

export const Act2Composition: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: BG }}>
			<Sequence from={0} durationInFrames={90}><TheMisconception /></Sequence>
			<Sequence from={90} durationInFrames={90}><SingleActionMyth /></Sequence>
			<Sequence from={180} durationInFrames={90}><TheClick /></Sequence>
			<Sequence from={270} durationInFrames={90}><TheReality /></Sequence>
			<Sequence from={360} durationInFrames={90}><NobodyWakesUp /></Sequence>
			<Sequence from={450} durationInFrames={90}><TheStepsBefore /></Sequence>
			<Sequence from={540} durationInFrames={90}><VideoAndAccount /></Sequence>
			<Sequence from={630} durationInFrames={90}><TheImageTrigger /></Sequence>
			<Sequence from={720} durationInFrames={90}><BoredomAndLoneliness /></Sequence>
			<Sequence from={810} durationInFrames={90}><DefensesLow /></Sequence>
			<Sequence from={900} durationInFrames={180}><TheChainReaction /></Sequence>
			<Sequence from={1080} durationInFrames={90}><TheRelapseCycle /></Sequence>
			<Sequence from={1170} durationInFrames={90}><WillpowerMyth /></Sequence>
			<Sequence from={1260} durationInFrames={90}><TemptationIsFar /></Sequence>
			<Sequence from={1350} durationInFrames={90}><TheTrap /></Sequence>
			<Sequence from={1440} durationInFrames={90}><TheDietMetaphor /></Sequence>
			<Sequence from={1530} durationInFrames={180}><TheStruggle /></Sequence>
			<Sequence from={1710} durationInFrames={90}><SamePrinciple /></Sequence>
			<Sequence from={1800} durationInFrames={180}><HundredsOfBattles /></Sequence>
			<Sequence from={1980} durationInFrames={180}><Exhaustion /></Sequence>
			<Sequence from={2160} durationInFrames={210}><TheRealBattle /></Sequence>

			{/* Intro-matched global treatment: CSS vignette, grain, and CRT letterbox. */}
			<AbsoluteFill style={{ pointerEvents: "none", background: vignette, zIndex: 100 }} />
			<AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: 0.3, zIndex: 101 }}>
				<CssFilmGrain />
			</AbsoluteFill>
			<AbsoluteFill style={{ pointerEvents: "none", borderTop: "100px solid black", borderBottom: "100px solid black", zIndex: 102 }} />

			<Audio
				src={ACT2_VOICEOVER}
				durationInFrames={ACT2_DURATION_IN_FRAMES}
				volume={VOICEOVER_GAIN}
			/>
			<Audio
				src={sound("low-cinematic-drone.mp3")}
				volume={(audioFrame) => DRONE_BED_GAIN * duckDroneVolume(audioFrame, [1080, 2160 + 180])}
			/>
		</AbsoluteFill>
	);
};

export default Act2Composition;
