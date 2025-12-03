
import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';
import { View } from 'react-native';

export const PlayIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M5 3l14 9-14 9V3z" />
    </Svg>
);

export const PauseIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M6 4h4v16H6z" />
        <Path d="M14 4h4v16h-4z" />
    </Svg>
);

export const VolumeIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M11 5L6 9H2v6h4l5 4V5z" />
        <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </Svg>
);

export const MuteIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M11 5L6 9H2v6h4l5 4V5z" />
        <Path d="M23 9l-6 6" />
        <Path d="M17 9l6 6" />
    </Svg>
);

export const ShuffleIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16 3h5v5" />
        <Path d="M4 20L21 3" />
        <Path d="M21 16v5h-5" />
        <Path d="M15 15l6 6" />
        <Path d="M4 4l5 5" />
    </Svg>
);

export const ListIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M8 6h13" />
        <Path d="M8 12h13" />
        <Path d="M8 18h13" />
        <Path d="M3 6h.01" />
        <Path d="M3 12h.01" />
        <Path d="M3 18h.01" />
    </Svg>
);

export const GuitarIcon = () => (
    <Svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 18V5l12-2v13"></Path>
        <Circle cx="6" cy="18" r="3"></Circle>
        <Circle cx="18" cy="16" r="3"></Circle>
    </Svg>
);

export const ArrowUpIcon = ({ width = 48, height = 48, color = "currentColor" }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 12h6v10h8v-10h6L12 2z" fill={color} stroke="black" strokeWidth="2" strokeLinejoin="round" />
    </Svg>
);

export const ArrowDownIcon = ({ width = 48, height = 48, color = "currentColor" }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22L22 12h-6V2H8v10H2l10 10z" fill={color} stroke="black" strokeWidth="2" strokeLinejoin="round" />
    </Svg>
);
