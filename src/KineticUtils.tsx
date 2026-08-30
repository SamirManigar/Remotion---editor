import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const FlashTransition: React.FC<{ duration?: number; color?: string }> = ({ duration = 4, color = "#FFFFFF" }) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, Math.floor(duration / 2), duration], [0, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	return <AbsoluteFill style={{ backgroundColor: color, opacity, zIndex: 100 }} />;
};

export const CameraShake: React.FC<{ children: React.ReactNode; intensity?: number; activeDuration?: number; constantShake?: boolean }> = ({
	children,
	intensity = 20,
	activeDuration = 10,
	constantShake = false,
}) => {
	const frame = useCurrentFrame();
	const isActive = frame < activeDuration;
	
	const shakeX = isActive ? (random(`shakeX-${frame}`) - 0.5) * intensity * 2 : 0;
	const shakeY = isActive ? (random(`shakeY-${frame}`) - 0.5) * intensity * 2 : 0;
	
	const multiplier = constantShake ? 1 : interpolate(frame, [0, activeDuration], [1, 0], { extrapolateRight: "clamp" });
	const blurAmount = isActive && !constantShake ? interpolate(multiplier, [0, 1], [0, intensity * 0.15]) : 0;

	return (
		<div style={{ width: "100%", height: "100%", translate: `${shakeX * multiplier}px ${shakeY * multiplier}px`, scale: 1.05, filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none' }}>
			{children}
		</div>
	);
};

export const GlitchText: React.FC<{
	text: string;
	style?: React.CSSProperties;
	activeDuration?: number;
}> = ({ text, style, activeDuration = 15 }) => {
	const frame = useCurrentFrame();
	const isActive = frame < activeDuration;
	
	const offset1 = isActive ? (random(`glitch1-${frame}`) - 0.5) * 15 : 0;
	const offset2 = isActive ? (random(`glitch2-${frame}`) - 0.5) * 15 : 0;
	const isGlitching = isActive && frame % 4 < 2;

	return (
		<div style={{ position: "relative", ...style }}>
			{isGlitching && (
				<div style={{ position: "absolute", color: "cyan", translate: `${offset1}px 0px`, opacity: 0.7, mixBlendMode: "screen", zIndex: 1 }}>
					{text}
				</div>
			)}
			{isGlitching && (
				<div style={{ position: "absolute", color: "red", translate: `${offset2}px 0px`, opacity: 0.7, mixBlendMode: "screen", zIndex: 2 }}>
					{text}
				</div>
			)}
			<div style={{ position: "relative", zIndex: 3 }}>{text}</div>
		</div>
	);
};

export const KineticWordBounce: React.FC<{
	word: string;
	delay?: number;
	style?: React.CSSProperties;
}> = ({ word, delay = 0, style }) => {
	const frame = useCurrentFrame();
	const localFrame = Math.max(0, frame - delay);
	
	const scale = interpolate(localFrame, [0, 4, 8], [0.2, 1.15, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
	});
	
	const opacity = interpolate(localFrame, [0, 4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div style={{ display: "inline-block", scale, opacity, ...style }}>
			{word}
		</div>
	);
};

export const TypingText: React.FC<{
	text: string;
	style?: React.CSSProperties;
	typingSpeed?: number;
}> = ({ text, style, typingSpeed = 2 }) => {
	const frame = useCurrentFrame();
	const charCount = Math.floor(frame / typingSpeed);
	const visibleText = text.substring(0, charCount);
	const isTyping = charCount < text.length;

	return (
		<div style={{ display: "inline-block", ...style }}>
			{visibleText}
			{isTyping && <span style={{ opacity: frame % 10 < 5 ? 1 : 0, color: "red", marginLeft: 4 }}>|</span>}
		</div>
	);
};

export const SerifText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; entryFrame?: number }> = ({ children, style, entryFrame = 0 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	// localFrame resets the spring to 0 at the moment of entry.
	// Without this, spring({ frame: 15 }) is already at rest — no animation.
	const localFrame = Math.max(0, frame - entryFrame);
	const spr = spring({ fps, frame: localFrame, config: { damping: 12, mass: 0.5 } });
	const scale = interpolate(spr, [0, 1], [0.8, 1]);
	if (frame < entryFrame) return null;

	return (
		<div style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", scale, display: 'inline-block', lineHeight: 1, ...style }}>
			{children}
		</div>
	);
};

export const ImpactText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; entryFrame?: number }> = ({ children, style, entryFrame = 0 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	// localFrame resets the spring clock to zero at the exact frame this text enters.
	// Without this, spring({ frame: 60 }) is already fully settled — zero pop visible.
	const localFrame = Math.max(0, frame - entryFrame);
	const spr = spring({ fps, frame: localFrame, config: { damping: 10, mass: 0.4 } });
	// 0.7→1.0 gives a heavier, more physical punch than the previous 0.8→1.0
	const scale = interpolate(spr, [0, 1], [0.7, 1]);
	if (frame < entryFrame) return null;

	return (
		<div style={{ fontFamily: "'Anton', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", textTransform: 'uppercase', scale, display: 'inline-block', lineHeight: 1, ...style }}>
			{children}
		</div>
	);
};
