
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GenerationMode, NoteObject } from '../types';
import { generateScale, getNextSequentialNote, getRandomNote } from '../utils/musicTheory';
import { useTTS } from '../hooks/useTTS';
import { PlayIcon, PauseIcon, VolumeIcon, MuteIcon, ShuffleIcon, ListIcon } from './Icons';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';

// 默认配置常量
const DEFAULT_INTERVAL_MS = 2000;
const MIN_INTERVAL_MS = 500;
const MAX_INTERVAL_MS = 5000;

// 生成 C3 到 B4 的音阶
const NOTE_SCALE = generateScale(3, 4);

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const NoteTrainer = () => {
    const { t } = useTranslation();

    // --- 状态管理 ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [mode, setMode] = useState<GenerationMode>(GenerationMode.RANDOM);
    const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);
    const [currentNote, setCurrentNote] = useState<NoteObject | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    // 计时器引用
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // TTS Hook
    const { speak } = useTTS(!isMuted);

    // --- 核心逻辑 ---

    const nextNote = useCallback(() => {
        setCurrentNote((prev) => {
            let next: NoteObject;
            if (mode === GenerationMode.SEQUENTIAL) {
                next = getNextSequentialNote(prev, NOTE_SCALE);
            } else {
                next = getRandomNote(prev, NOTE_SCALE);
            }

            // 朗读纯净的音名
            speak(next.speakText);
            return next;
        });
    }, [mode, speak]);

    // 启动/停止 自动播放逻辑
    useEffect(() => {
        if (isPlaying) {
            if (!currentNote) {
                nextNote();
            }

            timerRef.current = setInterval(() => {
                nextNote();
            }, intervalMs);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPlaying, intervalMs, nextNote, currentNote]);


    // --- 事件处理 ---
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const adjustSpeed = (delta: number) => {
        setIntervalMs(prev => {
            const newVal = prev + delta;
            return Math.max(MIN_INTERVAL_MS, Math.min(MAX_INTERVAL_MS, newVal));
        });
    };

    const displaySpeed = (ms: number) => {
        return `${(ms / 1000).toFixed(1)}s`;
    };

    return (
        <StyledView className="flex-1 w-full p-4 gap-4">

            {/* CARD 1: Main Display (Hero) */}
            <StyledView className="w-full h-64 bg-neo-yellow border-4 border-neo-black shadow-neo rounded-base flex items-center justify-center relative overflow-hidden">

                {/* Progress Bar (Simplified for RN: just a static background or simple animation if possible, skipping complex CSS animation for now) */}
                {/* We could use Reanimated for the progress bar, but let's keep it simple first. */}

                {/* Note Text */}
                <StyledView className="z-10 flex flex-col items-center justify-center relative">
                    <StyledText
                        className={`text-8xl font-black tracking-tighter ${isPlaying ? 'translate-x-1 translate-y-1' : ''
                            }`}
                    >
                        {currentNote ? currentNote.base : '?'}
                    </StyledText>

                    {/* Decorative Elements */}
                    {currentNote && (
                        <StyledView className="absolute -right-8 -top-2 rotate-12 bg-neo-white border-2 border-neo-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <StyledText className="font-bold text-lg">{currentNote.octave}</StyledText>
                        </StyledView>
                    )}

                    <StyledView className="mt-4 px-4 py-1 bg-neo-black -rotate-1">
                        <StyledText className="text-neo-white font-mono text-lg font-bold">
                            {currentNote ? `${currentNote.scientificName}` : t('ready')}
                        </StyledText>
                    </StyledView>
                </StyledView>

                {/* Overlay for "Start" state */}
                {!isPlaying && !currentNote && (
                    <StyledView className="absolute inset-0 flex items-center justify-center z-20 bg-neo-yellow/90">
                        <StyledText className="font-black text-2xl uppercase tracking-widest">{t('press_start')}</StyledText>
                    </StyledView>
                )}
            </StyledView>

            {/* CARD 2: Play/Pause Control */}
            <StyledTouchableOpacity
                onPress={togglePlay}
                className={`w-full h-24 border-4 border-neo-black rounded-base shadow-neo flex flex-row items-center justify-center gap-4 ${isPlaying
                        ? 'bg-neo-pink'
                        : 'bg-neo-blue'
                    }`}
            >
                <StyledView className="scale-150">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </StyledView>
                <StyledText className="font-black text-2xl uppercase italic">
                    {isPlaying ? t('stop') : t('start')}
                </StyledText>
            </StyledTouchableOpacity>

            {/* Controls Row */}
            <StyledView className="flex-row gap-4 h-32">
                {/* Mode Toggle */}
                <StyledView className="flex-1 bg-neo-white border-4 border-neo-black shadow-neo rounded-base p-2 flex flex-col justify-between">
                    <StyledText className="text-xs font-black uppercase border-b-2 border-neo-black pb-1 self-start">{t('mode')}</StyledText>
                    <StyledView className="flex-col gap-2 mt-1">
                        <StyledTouchableOpacity
                            onPress={() => setMode(GenerationMode.RANDOM)}
                            className={`py-1 px-1 border-2 border-neo-black flex-row items-center justify-between ${mode === GenerationMode.RANDOM ? 'bg-neo-black' : 'bg-white'
                                }`}
                        >
                            <StyledText className={`text-xs font-bold ${mode === GenerationMode.RANDOM ? 'text-neo-yellow' : 'text-black'}`}>{t('random')}</StyledText>
                            {/* Icon color handling is tricky with SVG props, simplifying for now */}
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity
                            onPress={() => setMode(GenerationMode.SEQUENTIAL)}
                            className={`py-1 px-1 border-2 border-neo-black flex-row items-center justify-between ${mode === GenerationMode.SEQUENTIAL ? 'bg-neo-black' : 'bg-white'
                                }`}
                        >
                            <StyledText className={`text-xs font-bold ${mode === GenerationMode.SEQUENTIAL ? 'text-neo-yellow' : 'text-black'}`}>{t('sequential')}</StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>

                {/* Mute Toggle */}
                <StyledTouchableOpacity
                    onPress={() => setIsMuted(!isMuted)}
                    className={`flex-1 border-4 border-neo-black shadow-neo rounded-base p-2 flex flex-col justify-between ${isMuted ? 'bg-gray-300' : 'bg-neo-white'
                        }`}
                >
                    <StyledText className="text-xs font-black uppercase border-b-2 border-neo-black pb-1 self-start">{t('audio')}</StyledText>
                    <StyledView className={`self-end p-2 border-2 border-neo-black rounded-full ${isMuted ? 'bg-gray-400' : 'bg-neo-yellow'}`}>
                        {isMuted ? <MuteIcon /> : <VolumeIcon />}
                    </StyledView>
                </StyledTouchableOpacity>
            </StyledView>

            {/* Speed Control */}
            <StyledView className="bg-neo-white border-4 border-neo-black shadow-neo rounded-base p-4 flex flex-row items-center justify-between">
                <StyledView className="flex-row items-center gap-2">
                    <StyledText className="font-black text-lg uppercase italic">{t('speed')}</StyledText>
                    <StyledView className="bg-neo-black px-2 py-1 -rotate-2">
                        <StyledText className="text-neo-yellow font-mono font-bold">{displaySpeed(intervalMs)}</StyledText>
                    </StyledView>
                </StyledView>

                <StyledView className="flex-row gap-4">
                    <StyledTouchableOpacity onPress={() => adjustSpeed(-100)} className="w-10 h-10 bg-neo-white border-2 border-neo-black items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        <StyledText className="font-black text-xl">-</StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity onPress={() => adjustSpeed(100)} className="w-10 h-10 bg-neo-white border-2 border-neo-black items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        <StyledText className="font-black text-xl">+</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>

        </StyledView>
    );
};
