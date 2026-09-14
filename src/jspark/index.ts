import React from "react";
import {Composition, registerRoot} from "remotion";
import {JsparkShort, JSPARK_DURATION, JSPARK_FPS} from "./JsparkShort";

const JsparkRoot: React.FC = () =>
	React.createElement(Composition, {
		id: "JsparkShort",
		component: JsparkShort,
		durationInFrames: JSPARK_DURATION,
		fps: JSPARK_FPS,
		width: 1080,
		height: 1920,
	});

registerRoot(JsparkRoot);
