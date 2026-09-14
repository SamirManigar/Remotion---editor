import React from "react";
import {
	AbsoluteFill,
	Easing,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import {Audio, Video} from "@remotion/media";

export const JSPARK_FPS = 30;
export const JSPARK_DURATION = 1606;

const INK = "#0B0D10";
const PAPER = "#F6F2E8";
const WHITE = "#FFFFFF";
const YELLOW = "#FFD84D";
const BLUE = "#7DD3FC";
const RED = "#FF5D5D";

type Caption = {
	start: number;
	end: number;
	lines: string[];
	accent: string[];
};

const captions: Caption[] = [
	{start: 0, end: 95, lines: ["PROBABLY THE BIGGEST", "REVELATION..."], accent: ["BIGGEST", "REVELATION"]},
	{start: 95, end: 230, lines: ["I HAD TO STOP STUDYING", "THE SUBJECT"], accent: ["STOP", "SUBJECT"]},
	{start: 230, end: 356, lines: ["AND START STUDYING", "THE PAPER"], accent: ["PAPER"]},
	{start: 356, end: 500, lines: ["NOBODY IS TESTING", "HOW MUCH BIOLOGY YOU KNOW"], accent: ["NOBODY", "BIOLOGY"]},
	{start: 500, end: 650, lines: ["THE EXAM ISN'T A COMPLETE", "MEASURE OF YOUR SKILLS"], accent: ["EXAM", "SKILLS"]},
	{start: 650, end: 760, lines: ["YOU'RE BEING TESTED", "BY AN EXAM PAPER"], accent: ["EXAM PAPER"]},
	{start: 760, end: 850, lines: ["THERE IS A LITERAL", "MARK SCHEME"], accent: ["MARK SCHEME"]},
	{start: 850, end: 1015, lines: ["AN EXAMINER COMPARES", "YOUR PAPER..."], accent: ["EXAMINER", "PAPER"]},
	{start: 1015, end: 1145, lines: ["...AGAINST THE", "MARK SCHEME"], accent: ["MARK SCHEME"]},
	{start: 1145, end: 1243, lines: ["IF THEY MATCH:", "GOOD GRADE"], accent: ["MATCH", "GOOD GRADE"]},
	{start: 1243, end: 1375, lines: ["SO MY MINDSET", "SHIFTED"], accent: ["MINDSET", "SHIFTED"]},
	{start: 1375, end: 1515, lines: ["STUDY EXACTLY", "WHAT IS NECESSARY"], accent: ["EXACTLY", "NECESSARY"]},
	{start: 1515, end: 1606, lines: ["100%.", "TIME-EFFICIENT."], accent: ["100%", "TIME-EFFICIENT"]},
];

const norm = (word: string) => word.toUpperCase().replace(/[^A-Z0-9%]/g, "");

const CaptionLine: React.FC<{line: string; accent: string[]}> = ({line, accent}) => {
	const accentWords = new Set(accent.flatMap((item) => item.split(" ")).map(norm));
	return (
		<div>
			{line.split(" ").map((word, index) => {
				const hot = accentWords.has(norm(word));
				return (
					<span
						key={word + index}
						style={{
							display: "inline-block",
							marginRight: 17,
							color: hot ? INK : WHITE,
							backgroundColor: hot ? YELLOW : "transparent",
							padding: hot ? "3px 10px 5px" : "3px 0 5px",
							borderRadius: 8,
							textShadow: hot ? "none" : "0 4px 18px rgba(0,0,0,.96)",
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};

const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const active = captions.find((caption) => frame >= caption.start && frame < caption.end);
	if (!active) return null;
	const local = frame - active.start;
	const entrance = spring({fps, frame: local, config: {damping: 18, stiffness: 260, mass: 0.48}});
	const opacity = interpolate(local, [0, 4], [0, 1], {extrapolateRight: "clamp"});
	const y = interpolate(entrance, [0, 1], [24, 0]);
	return (
		<div
			style={{
				position: "absolute",
				left: 70,
				right: 70,
				bottom: 270,
				zIndex: 30,
				textAlign: "center",
				fontFamily: "'Arial Black', Arial, sans-serif",
				fontWeight: 900,
				fontSize: 64,
				lineHeight: 1.08,
				letterSpacing: -2.2,
				opacity,
				transform: `translateY(${y}px)`,
			}}
		>
			{active.lines.map((line) => <CaptionLine key={line} line={line} accent={active.accent} />)}
		</div>
	);
};

const Footage: React.FC = () => {
	const frame = useCurrentFrame();
	const cut = frame < 356 ? 0 : frame < 850 ? 356 : frame < 1243 ? 850 : 1243;
	const local = frame - cut;
	const base = frame < 356 ? 1.12 : frame < 850 ? 1.17 : frame < 1243 ? 1.13 : 1.18;
	const settle = interpolate(local, [0, 18, 180], [base + 0.055, base, base + 0.018], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.quad),
	});
	const position = frame < 850 ? "50% 50%" : frame < 1243 ? "49% 50%" : "51% 50%";
	return (
		<AbsoluteFill style={{overflow: "hidden", backgroundColor: INK}}>
			<Video
				src={staticFile("jspark/source-cut.mp4")}
				volume={1}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
					objectPosition: position,
					transform: `scale(${settle})`,
					filter: "contrast(1.08) saturate(.92) brightness(.91)",
				}}
			/>
			<AbsoluteFill style={{background: "linear-gradient(180deg,rgba(5,7,10,.33) 0%,transparent 29%,transparent 52%,rgba(5,7,10,.2) 67%,rgba(5,7,10,.92) 100%)"}} />
			<AbsoluteFill style={{background: "radial-gradient(circle at 50% 41%,transparent 20%,rgba(0,0,0,.18) 68%,rgba(0,0,0,.52) 100%)"}} />
		</AbsoluteFill>
	);
};

const Header: React.FC = () => {
	const frame = useCurrentFrame();
	const fill = interpolate(frame, [0, JSPARK_DURATION], [0, 1], {extrapolateRight: "clamp"});
	return (
		<>
			<div style={{position: "absolute", top: 78, left: 70, display: "flex", alignItems: "center", gap: 14, zIndex: 40}}>
				<div style={{backgroundColor: YELLOW, color: INK, borderRadius: 999, padding: "11px 19px", fontFamily: "Arial, sans-serif", fontSize: 23, fontWeight: 900, letterSpacing: 1.5}}>ACADEMIC COMEBACK</div>
				<div style={{color: WHITE, fontFamily: "Arial, sans-serif", fontSize: 23, fontWeight: 800, letterSpacing: 1.7, opacity: .78}}>RULE 01</div>
			</div>
			<div style={{position: "absolute", left: 70, right: 70, bottom: 182, height: 5, borderRadius: 5, backgroundColor: "rgba(255,255,255,.18)", zIndex: 40}}>
				<div style={{height: "100%", width: `${fill * 100}%`, borderRadius: 5, backgroundColor: YELLOW}} />
			</div>
		</>
	);
};

const HookGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({fps, frame: Math.max(0, frame - 12), config: {damping: 14, stiffness: 190, mass: .65}});
	const opacity = interpolate(frame, [4, 14, 176, 198], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const strike = interpolate(frame, [68, 86], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<div style={{position: "absolute", left: 70, right: 70, top: 250, zIndex: 20, opacity, transform: `translateY(${interpolate(enter,[0,1],[-34,0])}px)`}}>
			<div style={{display: "inline-block", backgroundColor: "rgba(11,13,16,.92)", border: "1px solid rgba(255,255,255,.18)", padding: "22px 30px 26px", boxShadow: "0 20px 60px rgba(0,0,0,.34)"}}>
				<div style={{color: WHITE, fontFamily: "'Arial Black', Arial, sans-serif", fontSize: 76, fontWeight: 900, lineHeight: .95, letterSpacing: -4}}>STOP STUDYING</div>
				<div style={{position: "relative", display: "inline-block", marginTop: 10, color: WHITE, fontFamily: "'Arial Black', Arial, sans-serif", fontSize: 76, fontWeight: 900, lineHeight: .95, letterSpacing: -4}}>
					THE SUBJECT
					<div style={{position: "absolute", left: -5, right: -5, top: "54%", height: 12, backgroundColor: RED, transformOrigin: "left", transform: `rotate(-2deg) scaleX(${strike})`}} />
				</div>
			</div>
		</div>
	);
};

const PaperGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = frame - 650;
	const pop = spring({fps, frame: Math.max(0, local), config: {damping: 15, stiffness: 180}});
	const opacity = interpolate(frame, [642, 662, 826, 846], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<div style={{position: "absolute", top: 225, right: 62, width: 390, height: 320, zIndex: 22, opacity, transform: `rotate(3deg) scale(${interpolate(pop,[0,1],[.82,1])})`, transformOrigin: "top right"}}>
			<div style={{position: "absolute", inset: 0, backgroundColor: PAPER, boxShadow: "0 22px 70px rgba(0,0,0,.45)", borderRadius: 6, padding: "34px 32px"}}>
				<div style={{fontFamily: "Arial, sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: 2, color: INK}}>EXAM PAPER</div>
				<div style={{height: 4, backgroundColor: INK, margin: "16px 0 22px"}} />
				{["Define the term", "Explain why", "Six-mark answer"].map((item, i) => (
					<div key={item} style={{display: "flex", alignItems: "center", gap: 15, marginTop: 18}}>
						<div style={{width: 22, height: 22, border: `3px solid ${i === 2 ? BLUE : INK}`, backgroundColor: i === 2 ? BLUE : "transparent"}} />
						<div style={{fontFamily: "Arial, sans-serif", color: INK, fontSize: 21, fontWeight: 700}}>{item}</div>
					</div>
				))}
			</div>
		</div>
	);
};

const MatchGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [900, 1165], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const opacity = interpolate(frame, [858, 880, 1208, 1235], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<div style={{position: "absolute", top: 225, left: 62, right: 62, height: 260, zIndex: 22, opacity, display: "flex", gap: 22, alignItems: "stretch"}}>
			{[
				{label: "YOUR PAPER", color: WHITE, score: Math.round(progress * 92)},
				{label: "MARK SCHEME", color: YELLOW, score: 100},
			].map((item, i) => (
				<div key={item.label} style={{flex: 1, backgroundColor: i ? "rgba(255,216,77,.96)" : "rgba(11,13,16,.92)", border: "1px solid rgba(255,255,255,.22)", padding: "26px", boxShadow: "0 18px 50px rgba(0,0,0,.32)"}}>
					<div style={{fontFamily: "Arial, sans-serif", fontSize: 21, fontWeight: 900, letterSpacing: 1.5, color: i ? INK : WHITE}}>{item.label}</div>
					<div style={{marginTop: 28, fontFamily: "'Arial Black', Arial, sans-serif", fontSize: 76, lineHeight: 1, color: i ? INK : WHITE}}>{item.score}%</div>
					<div style={{height: 8, marginTop: 24, backgroundColor: i ? "rgba(11,13,16,.22)" : "rgba(255,255,255,.18)"}}>
						<div style={{width: `${(i ? 1 : progress) * 100}%`, height: "100%", backgroundColor: i ? INK : BLUE}} />
					</div>
				</div>
			))}
		</div>
	);
};

const PayoffGraphic: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const reveal = spring({fps, frame: Math.max(0, frame - 1278), config: {damping: 16, stiffness: 175}});
	const opacity = interpolate(frame, [1250, 1275, 1480, 1505], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<div style={{position: "absolute", top: 226, left: 70, zIndex: 22, opacity, transform: `translateX(${interpolate(reveal,[0,1],[-50,0])}px)`}}>
			<div style={{backgroundColor: "rgba(11,13,16,.92)", borderLeft: `10px solid ${YELLOW}`, padding: "22px 30px 24px", boxShadow: "0 18px 60px rgba(0,0,0,.38)"}}>
				<div style={{fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,.66)", fontSize: 22, fontWeight: 900, letterSpacing: 2}}>THE SHIFT</div>
				<div style={{fontFamily: "'Arial Black', Arial, sans-serif", color: WHITE, fontSize: 54, fontWeight: 900, lineHeight: 1.02, marginTop: 8}}>STUDY WHAT<br/><span style={{color: YELLOW}}>GETS MARKS.</span></div>
			</div>
		</div>
	);
};

const EndStamp: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pop = spring({fps, frame: Math.max(0, frame - 1518), config: {damping: 11, stiffness: 250, mass: .55}});
	const opacity = interpolate(frame, [1518, 1526], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<div style={{position: "absolute", top: 285, left: 70, right: 70, zIndex: 25, opacity, transform: `rotate(-2deg) scale(${interpolate(pop,[0,1],[.6,1])})`}}>
			<div style={{backgroundColor: YELLOW, color: INK, textAlign: "center", padding: "25px 30px", fontFamily: "'Arial Black', Arial, sans-serif", fontSize: 76, fontWeight: 900, letterSpacing: -3, boxShadow: "0 20px 70px rgba(0,0,0,.4)"}}>100% OF WHAT MATTERS</div>
		</div>
	);
};

const CutFlashes: React.FC = () => {
	const frame = useCurrentFrame();
	const distance = Math.min(...[356, 850, 1243].map((cut) => Math.abs(frame - cut)));
	const opacity = interpolate(distance, [0, 1, 3], [.42, .18, 0], {extrapolateRight: "clamp"});
	return <AbsoluteFill style={{zIndex: 50, pointerEvents: "none", backgroundColor: WHITE, opacity}} />;
};

const Texture: React.FC = () => {
	const frame = useCurrentFrame();
	const drift = (frame % 24) - 12;
	return (
		<AbsoluteFill style={{pointerEvents: "none", zIndex: 45, opacity: .1, mixBlendMode: "overlay", backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 4px)", transform: `translateY(${drift}px)`}} />
	);
};

export const JsparkShort: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: INK, overflow: "hidden"}}>
		<Footage />
		<Header />
		<Sequence from={0} durationInFrames={210}><HookGraphic /></Sequence>
		<PaperGraphic />
		<MatchGraphic />
		<PayoffGraphic />
		<EndStamp />
		<Captions />
		<CutFlashes />
		<Texture />

		<Sequence from={0} durationInFrames={32}><Audio src={staticFile("assets/audio/heavy-thud.mp3")} volume={0.055} /></Sequence>
		{[356, 850, 1243].map((from) => (
			<Sequence key={from} from={from} durationInFrames={28}>
				<Audio src={staticFile("assets/audio/digital-click.mp3")} volume={0.075} />
			</Sequence>
		))}
		<Sequence from={68} durationInFrames={35}><Audio src={staticFile("assets/audio/marker-scribble.mp3")} volume={0.06} /></Sequence>
	</AbsoluteFill>
);
