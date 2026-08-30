import React, {useEffect, useState} from "react";
import {
	AbsoluteFill,
	Composition,
	Img,
	Sequence,
	continueRender,
	delayRender,
	interpolate,
	random,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import {Audio, Video} from "@remotion/media";
import {Act2Composition, ACT2_DURATION_IN_FRAMES, ACT2_FPS} from "./Act2Composition";

const FPS = 30;
const TOTAL_FRAMES = 1800;
const BG = "#0F0F0F";
const WHITE = "#FFFFFF";
const RED = "#E50914";
const GOLD = "#D4AF37";

const hook = (name: string) => staticFile(`assets/visuals/hook/${name}`);
const renderHook = (name: string) => staticFile(`assets/visuals/hook/render/${name}`);
const pexels = (name: string) => staticFile(`assets/visuals/pexels/render/${name}`);
const sfx = (name: string) => staticFile(`assets/audio/${name}`);

const center: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const FontLoader: React.FC = () => {
	const [handle] = useState(() => delayRender("Loading hook fonts"));
	useEffect(() => {
		Promise.all([
			document.fonts.load("400 48px Anton"),
			document.fonts.load("700 48px Playfair Hook"),
		]).finally(() => continueRender(handle));
	}, [handle]);
	return (
		<style>{`
			@font-face{font-family:Anton;src:url('${staticFile("assets/fonts/Anton-Regular.ttf")}') format('truetype');font-weight:400;font-style:normal}
			@font-face{font-family:'Playfair Hook';src:url('${staticFile("assets/fonts/PlayfairDisplay-Variable.ttf")}') format('truetype');font-weight:400 900;font-style:normal}
		`}</style>
	);
};

const Plate: React.FC<{
	src: string;
	duration: number;
	darken?: number;
	gray?: number;
	position?: string;
	zoom?: [number, number];
}> = ({src, duration, darken = 0.3, gray = 0, position = "center", zoom = [1.03, 1.1]}) => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, duration], zoom, {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	return (
		<AbsoluteFill style={{backgroundColor: BG, overflow: "hidden"}}>
			<Video
				src={src}
				muted
				objectFit="cover"
				style={{
					width: "100%",
					height: "100%",
					objectPosition: position,
					transform: `scale(${scale})`,
					filter: `brightness(${1 - darken}) grayscale(${gray}) contrast(1.08)`,
				}}
			/>
			<AbsoluteFill style={{background: "linear-gradient(90deg,rgba(15,15,15,.7),rgba(15,15,15,.06) 52%,rgba(15,15,15,.42))"}} />
		</AbsoluteFill>
	);
};

const Still: React.FC<{
	src: string;
	duration: number;
	darken?: number;
	zoom?: [number, number];
}> = ({src, duration, darken = 0.3, zoom = [1.02, 1.08]}) => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, duration], zoom, {extrapolateRight: "clamp"});
	return (
		<AbsoluteFill style={{backgroundColor: BG, overflow: "hidden"}}>
			<Img src={src} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, filter: `brightness(${1 - darken}) contrast(1.08)`}} />
			<AbsoluteFill style={{background: "rgba(15,15,15,.18)"}} />
		</AbsoluteFill>
	);
};

const Impact: React.FC<{
	children: React.ReactNode;
	entry?: number;
	size?: number;
	color?: string;
	align?: "left" | "center" | "right";
	style?: React.CSSProperties;
}> = ({children, entry = 0, size = 150, color = WHITE, align = "center", style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < entry) return null;
	const local = frame - entry;
	const pop = spring({fps, frame: local, config: {damping: 13, stiffness: 270, mass: 0.55}});
	const scale = interpolate(pop, [0, 1], [0.52, 1]);
	const opacity = interpolate(local, [0, 4], [0, 1], {extrapolateRight: "clamp"});
	return (
		<div style={{fontFamily: "Anton, Impact, sans-serif", fontSize: size, lineHeight: 0.92, color, textAlign: align, textTransform: "uppercase", letterSpacing: 0, opacity, transform: `scale(${scale})`, textShadow: "0 8px 30px rgba(0,0,0,.72)", ...style}}>
			{children}
		</div>
	);
};

const Serif: React.FC<{
	children: React.ReactNode;
	entry?: number;
	size?: number;
	color?: string;
	style?: React.CSSProperties;
}> = ({children, entry = 0, size = 108, color = WHITE, style}) => {
	const frame = useCurrentFrame();
	if (frame < entry) return null;
	const local = frame - entry;
	const opacity = interpolate(local, [0, 12], [0, 1], {extrapolateRight: "clamp"});
	const y = interpolate(local, [0, 16], [24, 0], {extrapolateRight: "clamp"});
	return (
		<div style={{fontFamily: "'Playfair Hook', Georgia, serif", fontWeight: 700, fontSize: size, lineHeight: 1.04, color, textAlign: "center", letterSpacing: 0, opacity, transform: `translateY(${y}px)`, textShadow: "0 8px 30px rgba(0,0,0,.75)", ...style}}>
			{children}
		</div>
	);
};

const Eyebrow: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = WHITE}) => (
	<div style={{fontFamily: "Arial, sans-serif", fontSize: 30, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: 0, opacity: 0.84}}>{children}</div>
);

const Flash: React.FC<{color?: string}> = ({color = WHITE}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 1, 4], [0.85, 0.38, 0], {extrapolateRight: "clamp"});
	return <AbsoluteFill style={{backgroundColor: color, opacity, pointerEvents: "none"}} />;
};

const Strike: React.FC<{entry: number; width?: number; top?: string}> = ({entry, width = 720, top = "52%"}) => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [entry, entry + 7], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return <div style={{position: "absolute", left: "50%", top, width, height: 18, backgroundColor: RED, boxShadow: "0 0 18px rgba(229,9,20,.42)", transformOrigin: "left center", transform: `translateX(-50%) rotate(-1.5deg) scaleX(${progress})`}} />;
};

const LastTime: React.FC = () => (
	<AbsoluteFill>
		<Plate src={renderHook("blue-light-face.mp4")} duration={50} darken={0.2} gray={0.35} zoom={[1.08, 1.17]} />
		<AbsoluteFill style={{...center, flexDirection: "column", gap: 18}}>
			<Eyebrow>Have you ever told yourself</Eyebrow>
			<Impact entry={13} size={176} color={RED}>Last time?</Impact>
		</AbsoluteFill>
		<Sequence from={13} durationInFrames={32}><Audio src={sfx("heavy-bass-boom.mp3")} volume={0.28} /></Sequence>
	</AbsoluteFill>
);

const Close: React.FC = () => (
	<AbsoluteFill>
		<Plate src={pexels("computer-night.mp4")} duration={49} darken={0.18} position="center 48%" zoom={[1.05, 1.14]} />
		<div style={{position: "absolute", left: 160, bottom: 150}}><Impact entry={3} size={170} align="left">Close<br /><span style={{color: RED}}>the tab.</span></Impact></div>
		<Sequence from={4} durationInFrames={24}><Audio src={sfx("digital-click.mp3")} volume={0.34} /></Sequence>
		<Flash />
	</AbsoluteFill>
);

const Delete: React.FC = () => {
	const frame = useCurrentFrame();
	const mark = spring({fps: FPS, frame: Math.max(0, frame - 10), config: {damping: 11, stiffness: 310}});
	return (
		<AbsoluteFill>
			<Still src={hook("Smartphone_app_icon_paper_cutout_202607231703.jpeg")} duration={44} darken={0.08} />
			<Img src={hook("wrong.png")} style={{position: "absolute", width: 780, height: 780, left: "50%", top: "50%", objectFit: "contain", transform: `translate(-50%,-50%) scale(${mark})`, filter: "saturate(1.3) drop-shadow(0 12px 28px rgba(0,0,0,.6))"}} />
			<div style={{position: "absolute", left: 145, bottom: 140}}><Impact entry={5} size={148} color={RED} align="left">Delete<br />the app.</Impact></div>
			<Sequence from={8} durationInFrames={30}><Audio src={sfx("paper-tear.mp3")} volume={0.32} /></Sequence>
			<Sequence from={10} durationInFrames={30}><Audio src={sfx("marker-scribble.mp3")} volume={0.2} /></Sequence>
		</AbsoluteFill>
	);
};

const PromiseScene: React.FC = () => (
	<AbsoluteFill>
		<Plate src={renderHook("slumped-relief.mp4")} duration={38} darken={0.32} position="center 45%" />
		<div style={{position: "absolute", left: 145, bottom: 145}}><Serif entry={3} size={88} style={{textAlign: "left"}}>A sincere<br /><span style={{color: GOLD}}>promise.</span></Serif></div>
	</AbsoluteFill>
);

const Done: React.FC = () => (
	<AbsoluteFill>
		<Plate src={renderHook("slumped-relief.mp4")} duration={70} darken={0.4} position="center 45%" zoom={[1.08, 1.03]} />
		<AbsoluteFill style={center}><Serif entry={2} size={184} color={GOLD}>Done.</Serif></AbsoluteFill>
		<Sequence from={2} durationInFrames={42}><Audio src={sfx("bass-boom.mp3")} volume={0.24} /></Sequence>
	</AbsoluteFill>
);

const Later: React.FC = () => (
	<AbsoluteFill>
		<Sequence from={0} durationInFrames={39}>
			<AbsoluteFill>
				<Plate src={pexels("pocket-watch.mp4")} duration={39} darken={0.25} gray={0.35} zoom={[1.02, 1.16]} />
				<AbsoluteFill style={center}><Impact entry={2} size={140}>Days later.</Impact></AbsoluteFill>
			</AbsoluteFill>
		</Sequence>
		<Sequence from={39} durationInFrames={39}>
			<AbsoluteFill>
				<Plate src={renderHook("Shadows_moving_across_bedroom_wall_202607231708.mp4")} duration={39} darken={0.28} />
				<AbsoluteFill style={center}><Impact entry={1} size={136} color={RED}>Hours later.</Impact></AbsoluteFill>
				<Flash color={RED} />
			</AbsoluteFill>
		</Sequence>
		<Audio src={sfx("fast-tick.mp3")} volume={0.15} />
		<Sequence from={39} durationInFrames={28}><Audio src={sfx("digital-glitch.mp3")} volume={0.2} /></Sequence>
	</AbsoluteFill>
);

const SamePlace: React.FC = () => {
	const frame = useCurrentFrame();
	const rotation = interpolate(frame, [0, 98], [0, 250], {extrapolateRight: "clamp"});
	return (
		<AbsoluteFill>
			<Plate src={renderHook("blue-light-face.mp4")} duration={98} darken={0.36} gray={0.3} zoom={[1.18, 1.08]} />
			<div style={{position: "absolute", left: "50%", top: "50%", width: 520, height: 520, border: `12px solid ${RED}`, borderRadius: "50%", borderRightColor: "transparent", opacity: 0.72, transform: `translate(-50%,-50%) rotate(${rotation}deg)`}} />
			<AbsoluteFill style={center}><Impact entry={40} size={154} color={RED}>Same place.</Impact></AbsoluteFill>
			<Sequence from={40} durationInFrames={44}><Audio src={sfx("heavy-thud.mp3")} volume={0.28} /></Sequence>
		</AbsoluteFill>
	);
};

const Guilt: React.FC = () => {
	const frame = useCurrentFrame();
	const decay = interpolate(frame, [0, 18], [1, 0], {extrapolateRight: "clamp"});
	const x = (random(`guilt-x-${frame}`) - 0.5) * 24 * decay;
	const y = (random(`guilt-y-${frame}`) - 0.5) * 24 * decay;
	return (
		<AbsoluteFill>
			<Plate src={pexels("man-alone-window.mp4")} duration={88} darken={0.3} gray={0.55} position="center 42%" />
			<AbsoluteFill style={{...center, transform: `translate(${x}px,${y}px) scale(1.02)`}}><Impact entry={2} size={170} color={RED}>The guilt hits.</Impact></AbsoluteFill>
			<Sequence from={0} durationInFrames={60}><Audio src={sfx("riser-drop.mp3")} trimBefore={76} volume={0.18} /></Sequence>
		</AbsoluteFill>
	);
};

const EverStop: React.FC = () => (
	<AbsoluteFill>
		<Plate src={pexels("insomnia-bed.mp4")} duration={89} darken={0.38} gray={0.25} position="center 43%" />
		<div style={{position: "absolute", left: 155, bottom: 150}}>
			<Eyebrow>Will I ever be able to</Eyebrow>
			<Impact entry={28} size={186} align="left">Stop?</Impact>
		</div>
		<Sequence from={28} durationInFrames={42}><Audio src={sfx("heavy-bass-boom.mp3")} volume={0.21} /></Sequence>
	</AbsoluteFill>
);

const NotAlone: React.FC = () => (
	<AbsoluteFill>
		<Plate src={renderHook("eyes-focus.mp4")} duration={80} darken={0.22} position="center 36%" zoom={[1.05, 1.01]} />
		<AbsoluteFill style={center}><Serif entry={14} size={132} color={GOLD}>You are not alone.</Serif></AbsoluteFill>
		<Sequence from={14} durationInFrames={45}><Audio src={sfx("bass-boom.mp3")} volume={0.16} /></Sequence>
	</AbsoluteFill>
);

const Willpower: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			{frame < 70 ? <Plate src={pexels("dominoes-dark.mp4")} duration={70} darken={0.3} gray={0.25} /> : <Still src={hook("Human_brain_torn_paper_collage_202607231706.jpeg")} duration={90} darken={0.4} zoom={[1.07, 1.02]} />}
			<div style={{position: "absolute", left: 145, top: 130}}><Eyebrow color={GOLD}>Why the cycle keeps repeating</Eyebrow></div>
			{frame < 70 && <div style={{position: "absolute", right: 140, bottom: 140}}><Impact entry={12} size={132} align="right">Keep<br /><span style={{color: RED}}>falling.</span></Impact></div>}
			{frame >= 70 && <AbsoluteFill style={center}><Impact entry={70} size={170}>Willpower</Impact><Strike entry={105} width={800} /></AbsoluteFill>}
			<Sequence from={0} durationInFrames={42}><Audio src={sfx("domino-clatter.mp3")} volume={0.15} /></Sequence>
			<Sequence from={105} durationInFrames={35}><Audio src={sfx("marker-scribble.mp3")} volume={0.22} /></Sequence>
		</AbsoluteFill>
	);
};

const Labels: React.FC = () => {
	const labels = [
		{word: "Stronger", at: 0, strike: 27},
		{word: "Disciplined", at: 39, strike: 66},
		{word: "Motivated", at: 79, strike: 106},
	];
	return (
		<AbsoluteFill>
			<Still src={hook("paper-brain.png")} duration={132} darken={0.55} zoom={[1.03, 1.1]} />
			<div style={{position: "absolute", left: 180, top: 125, bottom: 125, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
				{labels.map((label) => (
					<div key={label.word} style={{position: "relative", width: 760}}>
						<Impact entry={label.at} size={118} align="left">{label.word}</Impact>
						<Strike entry={label.strike} width={650} top="54%" />
						<Sequence from={label.strike} durationInFrames={24}><Audio src={sfx("marker-scribble.mp3")} volume={0.17} /></Sequence>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

const NotWeak: React.FC = () => (
	<AbsoluteFill>
		<Plate src={pexels("man-distress-close.mp4")} duration={77} darken={0.38} gray={0.48} position="center 38%" zoom={[1.08, 1.16]} />
		<AbsoluteFill style={center}><Impact entry={8} size={206}>Not <span style={{color: RED}}>weak.</span></Impact></AbsoluteFill>
		<Sequence from={8} durationInFrames={50}><Audio src={sfx("heavy-thud.mp3")} volume={0.2} /></Sequence>
	</AbsoluteFill>
);

const WrongWay: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: BG, overflow: "hidden"}}>
			{[0, 1, 2, 3, 4].map((index) => {
				const offset = interpolate(frame, [0, 79], [-420 + index * 120, 2250 + index * 120]);
				return <div key={index} style={{position: "absolute", top: 190 + index * 155, left: offset, width: 560, height: 6, backgroundColor: index === 2 ? RED : "rgba(255,255,255,.38)", transform: `rotate(${index % 2 === 0 ? -6 : 6}deg)`}} />;
			})}
			<div style={{position: "absolute", left: 160, top: 170, fontFamily: "Arial, sans-serif", fontSize: 34, color: GOLD, fontWeight: 800}}>DIRECTION / 02</div>
			<AbsoluteFill style={center}><Impact entry={18} size={206} color={RED}>Wrong way.</Impact></AbsoluteFill>
			<Sequence from={18} durationInFrames={50}><Audio src={sfx("heavy-bass-boom.mp3")} volume={0.25} /></Sequence>
			<Flash color={RED} />
		</AbsoluteFill>
	);
};

const Title: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const slam = spring({fps, frame, config: {damping: 12, stiffness: 240, mass: 0.8}});
	const scale = interpolate(slam, [0, 1], [3.8, 1]);
	const decay = interpolate(frame, [0, 12], [1, 0], {extrapolateRight: "clamp"});
	const x = (random(`title-x-${frame}`) - 0.5) * 18 * decay;
	const y = (random(`title-y-${frame}`) - 0.5) * 18 * decay;
	return (
		<AbsoluteFill>
			<Plate src={renderHook("dark-abstract.mp4")} duration={155} darken={0.18} />
			<AbsoluteFill style={{...center, transform: `translate(${x}px,${y}px) scale(1.02)`}}>
				<div style={{transform: `scale(${scale})`, textAlign: "center"}}>
					<div style={{fontFamily: "Anton, Impact, sans-serif", color: WHITE, fontSize: 170, lineHeight: 0.9, textTransform: "uppercase"}}>Why you struggle</div>
					<div style={{marginTop: 32, fontFamily: "Arial, sans-serif", color: RED, fontSize: 42, fontWeight: 800, textTransform: "uppercase"}}>to stop watching haram content</div>
				</div>
			</AbsoluteFill>
			<Sequence from={0} durationInFrames={34}><Audio src={sfx("riser-drop.mp3")} volume={0.26} /></Sequence>
		</AbsoluteFill>
	);
};

const WillpowerFails: React.FC = () => {
	const frame = useCurrentFrame();
	const meter = interpolate(frame, [0, 22, 52, 66], [0.2, 1, 0.08, 0], {extrapolateRight: "clamp"});
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<div style={{position: "absolute", left: 160, right: 160, top: 180, height: 26, border: "3px solid rgba(255,255,255,.4)"}}>
				<div style={{height: "100%", width: `${meter * 100}%`, backgroundColor: meter > 0.45 ? WHITE : RED}} />
			</div>
			<div style={{position: "absolute", left: 160, top: 225, fontFamily: "Arial, sans-serif", fontSize: 28, color: GOLD, fontWeight: 800}}>WILLPOWER RESERVE</div>
			<AbsoluteFill style={center}>
				<Impact entry={2} size={142}>Willpower alone</Impact>
				<Strike entry={24} width={950} />
				<div style={{position: "absolute", bottom: 135}}><Impact entry={30} size={112} color={RED}>usually fails.</Impact></div>
			</AbsoluteFill>
			<Sequence from={24} durationInFrames={30}><Audio src={sfx("marker-scribble.mp3")} volume={0.2} /></Sequence>
		</AbsoluteFill>
	);
};

const MostImportant: React.FC = () => {
	const frame = useCurrentFrame();
	const line = interpolate(frame, [12, 32], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<AbsoluteFill style={{...center, backgroundColor: BG}}>
			<div style={{textAlign: "center"}}><Eyebrow color={GOLD}>Most importantly</Eyebrow><div style={{height: 5, width: 660, backgroundColor: RED, marginTop: 24, transform: `scaleX(${line})`}} /></div>
		</AbsoluteFill>
	);
};

const Practical: React.FC = () => (
	<AbsoluteFill>
		<Sequence from={0} durationInFrames={47}>
			<AbsoluteFill><Plate src={renderHook("eyes-focus.mp4")} duration={47} darken={0.3} position="center 36%" zoom={[1.08, 1.02]} /><AbsoluteFill style={center}><Impact entry={4} size={140}>Practical steps.</Impact></AbsoluteFill></AbsoluteFill>
		</Sequence>
		<Sequence from={47} durationInFrames={47}>
			<AbsoluteFill><Plate src={pexels("dominoes-dark.mp4")} duration={47} darken={0.34} zoom={[1.14, 1.04]} /><AbsoluteFill style={center}><Impact entry={3} size={156} color={RED}>Break the cycle.</Impact></AbsoluteFill><Flash color={RED} /></AbsoluteFill>
		</Sequence>
		<Sequence from={94} durationInFrames={47}>
			<AbsoluteFill><Plate src={pexels("sunrise-reflection.mp4")} duration={47} darken={0.12} position="center 48%" zoom={[1.08, 1.02]} /><div style={{position: "absolute", left: 145, bottom: 145}}><Serif entry={4} size={110} color={GOLD} style={{textAlign: "left"}}>Regain control.</Serif></div></AbsoluteFill>
		</Sequence>
		<Sequence from={4} durationInFrames={28}><Audio src={sfx("digital-click.mp3")} volume={0.2} /></Sequence>
		<Sequence from={50} durationInFrames={40}><Audio src={sfx("heavy-thud.mp3")} volume={0.22} /></Sequence>
		<Sequence from={98} durationInFrames={38}><Audio src={sfx("bass-boom.mp3")} volume={0.17} /></Sequence>
	</AbsoluteFill>
);

const Screen: React.FC = () => (
	<AbsoluteFill>
		<Plate src={pexels("phone-hand-dark.mp4")} duration={71} darken={0.34} position="center 45%" />
		<div style={{position: "absolute", left: 145, bottom: 145}}><Impact entry={8} size={128} align="left">Not just<br /><span style={{color: RED}}>a screen.</span></Impact></div>
	</AbsoluteFill>
);

const IconBeat: React.FC<{label: string; icon: string; duration: number; background: string}> = ({label, icon, duration, background}) => {
	const frame = useCurrentFrame();
	const pop = spring({fps: FPS, frame, config: {damping: 12, stiffness: 280}});
	return (
		<AbsoluteFill>
			<Plate src={background} duration={duration} darken={0.55} gray={0.55} />
			<AbsoluteFill style={{...center, gap: 40}}>
				{label === "FOCUS." ? (
					<div style={{position: "relative", width: 150, height: 150, transform: `scale(${pop})`}}>
						<div style={{position: "absolute", left: 23, top: 23, width: 100, height: 100, border: "10px solid white", borderRadius: "75% 12%", transform: "rotate(45deg)"}} />
						<div style={{position: "absolute", left: 57, top: 57, width: 36, height: 36, borderRadius: "50%", backgroundColor: WHITE, boxShadow: "0 0 22px rgba(255,255,255,.4)"}} />
					</div>
				) : (
					<Img src={icon} style={{width: 170, height: 170, objectFit: "contain", transform: `scale(${pop})`, filter: "grayscale(1) brightness(2) drop-shadow(0 8px 20px rgba(0,0,0,.7))"}} />
				)}
				<Impact entry={2} size={168} color={label === "HEART." ? RED : WHITE}>{label}</Impact>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const FinalRise: React.FC = () => {
	const frame = useCurrentFrame();
	const respect = interpolate(frame, [0, 12, 46, 57], [0, 1, 1, 0], {extrapolateRight: "clamp"});
	const becoming = interpolate(frame, [50, 80], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<AbsoluteFill>
			<Plate src={pexels("sunrise-reflection.mp4")} duration={103} darken={0.08} position="center 48%" zoom={[1.09, 1.01]} />
			<div style={{position: "absolute", left: 145, right: 145, bottom: 145}}>
				<div style={{opacity: respect}}><Impact entry={2} size={142} align="left">Self <span style={{color: RED}}>respect.</span></Impact></div>
				<div style={{position: "absolute", left: 0, right: 0, bottom: 0, opacity: becoming}}><Serif entry={50} size={92} color={GOLD} style={{textAlign: "left"}}>The person<br />you are becoming.</Serif></div>
			</div>
			<Sequence from={50} durationInFrames={45}><Audio src={sfx("heavy-bass-boom.mp3")} volume={0.17} /></Sequence>
		</AbsoluteFill>
	);
};

const GraphicFinalAct: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const segmentOpacity = (start: number, end: number, fade = 7) =>
		interpolate(frame, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	const practicalPop = spring({fps, frame, config: {damping: 13, stiffness: 220}});
	const cycle = interpolate(frame, [47, 83], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const control = interpolate(frame, [94, 145], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const scan = interpolate(frame, [155, 220], [40, 430], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const heartDraw = interpolate(frame, [226, 258], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const focusPulse = 1 + Math.sin(Math.max(0, frame - 273) * 0.35) * 0.06;
	const respectRise = interpolate(frame, [309, 344], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const becoming = spring({fps, frame: Math.max(0, frame - 359), config: {damping: 16, stiffness: 120}});
	const progress = interpolate(frame, [0, 412], [0, 1], {extrapolateRight: "clamp"});

	return (
		<AbsoluteFill style={{backgroundColor: BG, overflow: "hidden"}}>
			<AbsoluteFill
				style={{
					backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)",
					backgroundSize: "80px 80px",
					backgroundPosition: frame * 1.4 + "px " + frame * 0.55 + "px",
					opacity: 0.72,
				}}
			/>
			<div style={{position: "absolute", left: 120, top: 105, fontFamily: "Arial, sans-serif", fontSize: 24, color: GOLD, fontWeight: 800}}>
				RECOVERY PROTOCOL / FIELD NOTES
			</div>
			<div style={{position: "absolute", right: 120, top: 105, fontFamily: "Arial, sans-serif", fontSize: 24, color: WHITE, opacity: 0.6}}>
				{String(Math.floor(frame / 30)).padStart(2, "0")}:{String(frame % 30).padStart(2, "0")}
			</div>

			<AbsoluteFill style={{opacity: segmentOpacity(0, 47), padding: "190px 160px 140px", display: "flex", alignItems: "center", gap: 90}}>
				<div style={{fontFamily: "Anton, Impact, sans-serif", fontSize: 330, lineHeight: 0.8, color: RED, transform: "scale(" + practicalPop + ")"}}>01</div>
				<div style={{flex: 1}}>
					<Eyebrow color={GOLD}>The part that changes everything</Eyebrow>
					<div style={{marginTop: 24}}><Impact entry={3} size={150} align="left">Practical steps.</Impact></div>
					<div style={{display: "flex", alignItems: "center", marginTop: 55}}>
						{[0, 1, 2, 3].map((index) => (
							<React.Fragment key={index}>
								<div style={{width: 28, height: 28, borderRadius: "50%", backgroundColor: index === 0 ? RED : WHITE, transform: "scale(" + interpolate(frame, [7 + index * 5, 13 + index * 5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) + ")"}} />
								{index < 3 && <div style={{height: 4, width: 115, backgroundColor: "rgba(255,255,255,.45)"}} />}
							</React.Fragment>
						))}
					</div>
				</div>
			</AbsoluteFill>

			<AbsoluteFill style={{opacity: segmentOpacity(47, 94), ...center, gap: 120}}>
				<div style={{position: "relative", width: 560, height: 560}}>
					<svg width="560" height="560" viewBox="0 0 560 560">
						<circle cx="280" cy="280" r="190" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="34" />
						<circle cx="280" cy="280" r="190" fill="none" stroke={RED} strokeWidth="34" strokeLinecap="round" strokeDasharray={1194} strokeDashoffset={1194 * (1 - cycle)} transform="rotate(-90 280 280)" />
						<path d="M385 120 L450 70 L438 155" fill="none" stroke={WHITE} strokeWidth="18" />
					</svg>
					<div style={{position: "absolute", left: 255, top: 34, width: 40, height: 500, backgroundColor: BG, transform: "rotate(" + interpolate(cycle, [0, 1], [0, 22]) + "deg) scaleY(" + interpolate(cycle, [0.65, 1], [0, 1], {extrapolateLeft: "clamp"}) + ")"}} />
				</div>
				<Impact entry={50} size={160} color={RED} align="left">Break<br />the cycle.</Impact>
			</AbsoluteFill>

			<AbsoluteFill style={{opacity: segmentOpacity(94, 155), padding: "170px 170px 125px", display: "flex", alignItems: "center", gap: 150}}>
				<div style={{position: "relative", width: 190, height: 560, border: "4px solid rgba(255,255,255,.35)"}}>
					<div style={{position: "absolute", left: 82, top: 36, width: 20, height: 480, backgroundColor: "rgba(255,255,255,.18)"}} />
					<div style={{position: "absolute", left: 42, top: 440 - control * 380, width: 100, height: 28, backgroundColor: RED, boxShadow: "0 0 24px rgba(229,9,20,.5)"}} />
				</div>
				<div style={{flex: 1}}>
					<div style={{fontFamily: "Anton, Impact, sans-serif", fontSize: 250, color: WHITE, lineHeight: 0.8}}>{Math.round(12 + control * 88)}%</div>
					<div style={{marginTop: 36}}><Impact entry={98} size={144} color={GOLD} align="left">Regain control.</Impact></div>
				</div>
			</AbsoluteFill>

			<AbsoluteFill style={{opacity: segmentOpacity(155, 226), ...center, gap: 150}}>
				<div style={{position: "relative", width: 300, height: 520, border: "12px solid white", borderRadius: 28}}>
					<div style={{position: "absolute", left: 24, right: 24, top: scan, height: 8, backgroundColor: RED, boxShadow: "0 0 24px rgba(229,9,20,.8)"}} />
					<div style={{position: "absolute", left: 92, bottom: 22, width: 90, height: 10, backgroundColor: "rgba(255,255,255,.5)"}} />
				</div>
				<Impact entry={160} size={146} align="left">Not just<br /><span style={{color: RED}}>a screen.</span></Impact>
			</AbsoluteFill>

			<AbsoluteFill style={{opacity: segmentOpacity(226, 273), ...center}}>
				<svg width="1100" height="300" viewBox="0 0 1100 300" style={{position: "absolute"}}>
					<path d="M0 155 L210 155 L265 155 L310 62 L355 244 L405 116 L455 155 L1100 155" fill="none" stroke={RED} strokeWidth="14" strokeLinejoin="round" strokeDasharray={1450} strokeDashoffset={1450 * (1 - heartDraw)} />
				</svg>
				<div style={{width: 220, height: 220, borderRadius: "50%", backgroundColor: BG, border: "8px solid " + RED, ...center, transform: "scale(" + (0.85 + heartDraw * 0.15) + ")"}}>
					<Img src={hook("heart-icon.png")} style={{width: 112, height: 112, objectFit: "contain", filter: "grayscale(1) brightness(3)"}} />
				</div>
				<div style={{position: "absolute", bottom: 145}}><Impact entry={230} size={142} color={RED}>Heart.</Impact></div>
			</AbsoluteFill>

			<AbsoluteFill style={{opacity: segmentOpacity(273, 309), ...center}}>
				{[360, 250, 140].map((size, index) => (
					<div key={size} style={{position: "absolute", width: size, height: size, borderRadius: "50%", border: (index === 2 ? 10 : 4) + "px solid " + (index === 2 ? WHITE : RED), opacity: 0.9 - index * 0.18, transform: "scale(" + (focusPulse + index * 0.04) + ")"}} />
				))}
				<div style={{width: 36, height: 36, borderRadius: "50%", backgroundColor: GOLD}} />
				<div style={{position: "absolute", bottom: 135}}><Impact entry={275} size={146}>Focus.</Impact></div>
			</AbsoluteFill>

			<AbsoluteFill style={{opacity: segmentOpacity(309, 359), padding: "150px 170px 125px", display: "flex", alignItems: "flex-end", gap: 28}}>
				{[0.42, 0.58, 0.73, 0.88, 1].map((height, index) => (
					<div key={height} style={{width: 110, height: 500 * height * respectRise, backgroundColor: index === 4 ? GOLD : index % 2 === 0 ? RED : WHITE, opacity: index === 4 ? 1 : 0.72}} />
				))}
				<div style={{marginLeft: 80, marginBottom: 80}}><Impact entry={312} size={148} align="left">Self<br /><span style={{color: RED}}>respect.</span></Impact></div>
			</AbsoluteFill>

			<AbsoluteFill style={{opacity: interpolate(frame, [359, 372], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), ...center}}>
				<div style={{position: "absolute", width: 760, height: 760, borderRadius: "50%", border: "8px solid " + GOLD, transform: "scale(" + (0.35 + becoming * 0.65) + ")", opacity: 0.7}} />
				<div style={{position: "absolute", width: 540, height: 540, borderRadius: "50%", border: "3px solid " + WHITE, transform: "scale(" + (0.5 + becoming * 0.5) + ")", opacity: 0.28}} />
				<Serif entry={362} size={112} color={GOLD}>The person<br />you are becoming.</Serif>
			</AbsoluteFill>

			<div style={{position: "absolute", left: 0, right: 0, bottom: 82, height: 5, backgroundColor: "rgba(255,255,255,.16)"}}>
				<div style={{width: progress * 100 + "%", height: "100%", backgroundColor: RED}} />
			</div>

			<Sequence from={3} durationInFrames={25}><Audio src={sfx("digital-click.mp3")} volume={0.18} /></Sequence>
			<Sequence from={47} durationInFrames={40}><Audio src={sfx("heavy-thud.mp3")} volume={0.23} /></Sequence>
			<Sequence from={94} durationInFrames={42}><Audio src={sfx("bass-boom.mp3")} volume={0.16} /></Sequence>
			<Sequence from={155} durationInFrames={30}><Audio src={sfx("digital-glitch.mp3")} volume={0.16} /></Sequence>
			<Sequence from={226} durationInFrames={35}><Audio src={sfx("heavy-bass-boom.mp3")} volume={0.15} /></Sequence>
			<Sequence from={273} durationInFrames={25}><Audio src={sfx("digital-click.mp3")} volume={0.16} /></Sequence>
			<Sequence from={309} durationInFrames={34}><Audio src={sfx("bass-boom.mp3")} volume={0.14} /></Sequence>
			<Sequence from={359} durationInFrames={45}><Audio src={sfx("heavy-bass-boom.mp3")} volume={0.17} /></Sequence>
		</AbsoluteFill>
	);
};

const SunriseEnding: React.FC = () => {
	const frame = useCurrentFrame();
	const footageOpacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const respectOpacity = interpolate(frame, [0, 6, 36, 48], [0, 1, 1, 0], {
		extrapolateRight: "clamp",
	});
	const becomingOpacity = interpolate(frame, [38, 60], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const goldLine = interpolate(frame, [44, 72], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: BG, overflow: "hidden"}}>
			<AbsoluteFill style={{opacity: footageOpacity}}>
				<Plate src={renderHook("sunrise-man.mp4")} duration={101} darken={0.08} position="center 44%" zoom={[1.06, 1.01]} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: "linear-gradient(90deg,rgba(15,15,15,.68) 0%,rgba(15,15,15,.18) 58%,rgba(15,15,15,.08) 100%)"}} />
			<div style={{position: "absolute", left: 150, right: 150, bottom: 150}}>
				<div style={{opacity: respectOpacity}}>
					<Impact entry={2} size={138} align="left">Self <span style={{color: RED}}>respect.</span></Impact>
				</div>
				<div style={{position: "absolute", left: 0, bottom: 0, opacity: becomingOpacity}}>
					<Serif entry={38} size={96} color={GOLD} style={{textAlign: "left"}}>The person<br />you are becoming.</Serif>
					<div style={{width: 610 * goldLine, height: 6, marginTop: 26, backgroundColor: GOLD, boxShadow: "0 0 24px rgba(212,175,55,.42)"}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Finish: React.FC = () => (
	<>
		<AbsoluteFill style={{pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,.7) 100%)", zIndex: 90}} />
		<AbsoluteFill style={{pointerEvents: "none", mixBlendMode: "screen", opacity: 0.15, zIndex: 91}}>
			<Video src={hook("film-grain.mp4")} muted loop objectFit="cover" style={{width: "100%", height: "100%", filter: "contrast(1.18)"}} />
		</AbsoluteFill>
		<AbsoluteFill style={{pointerEvents: "none", borderTop: "72px solid #000", borderBottom: "72px solid #000", zIndex: 92}} />
	</>
);

export const HookComposition: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: BG}}>
		<FontLoader />
		<Sequence from={0} durationInFrames={50}><LastTime /></Sequence>
		<Sequence from={50} durationInFrames={49}><Close /></Sequence>
		<Sequence from={99} durationInFrames={44}><Delete /></Sequence>
		<Sequence from={143} durationInFrames={38}><PromiseScene /></Sequence>
		<Sequence from={181} durationInFrames={70}><Done /></Sequence>
		<Sequence from={251} durationInFrames={78}><Later /></Sequence>
		<Sequence from={329} durationInFrames={98}><SamePlace /></Sequence>
		<Sequence from={427} durationInFrames={88}><Guilt /></Sequence>
		<Sequence from={515} durationInFrames={89}><EverStop /></Sequence>
		<Sequence from={604} durationInFrames={80}><NotAlone /></Sequence>
		<Sequence from={684} durationInFrames={160}><Willpower /></Sequence>
		<Sequence from={844} durationInFrames={132}><Labels /></Sequence>
		<Sequence from={976} durationInFrames={77}><NotWeak /></Sequence>
		<Sequence from={1053} durationInFrames={79}><WrongWay /></Sequence>
		<Sequence from={1132} durationInFrames={155}><Title /></Sequence>
		<Sequence from={1287} durationInFrames={66}><WillpowerFails /></Sequence>
		<Sequence from={1353} durationInFrames={35}><MostImportant /></Sequence>
		<Sequence from={1388} durationInFrames={412}><GraphicFinalAct /></Sequence>
		<Sequence from={1699} durationInFrames={101}><SunriseEnding /></Sequence>

		<Finish />
		<Audio src={sfx("vo-hook-60s-clear.wav")} volume={1} />
		<Audio src={sfx("low-cinematic-drone.mp3")} volume={(frame) => interpolate(frame, [0, 45, 1500, 1800], [0, 0.09, 0.075, 0.1], {extrapolateRight: "clamp"})} />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HookComposition" component={HookComposition} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
		<Composition id="Act2Composition" component={Act2Composition} durationInFrames={ACT2_DURATION_IN_FRAMES} fps={ACT2_FPS} width={1920} height={1080} />
	</>
);

export default RemotionRoot;
