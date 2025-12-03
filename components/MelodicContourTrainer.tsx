
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MelodyQuestion, ContourDirection } from '../types';
import { generateMelodyQuestion } from '../utils/musicTheory';
import { useGuitarSynth } from '../hooks/useGuitarSynth';
import { GuitarIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const MelodicContourTrainer = () => {
    const { t } = useTranslation();
    const [question, setQuestion] = useState<MelodyQuestion | null>(null);
    const [userAnswer, setUserAnswer] = useState<ContourDirection[]>([]);
    const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [isPlaying, setIsPlaying] = useState(false);

    const { playMelody, playFeedback, isLoaded } = useGuitarSynth(true);

    useEffect(() => {
        newQuestion();
    }, []);

    const newQuestion = () => {
        setQuestion(generateMelodyQuestion());
        setUserAnswer([]);
        setAnswerStatus('idle');
        setIsPlaying(false);
    };

    const handlePlay = useCallback(() => {
        if (!question || !isLoaded) return;
        setIsPlaying(true);
        playMelody(question.notes);
        setTimeout(() => setIsPlaying(false), 3000);
    }, [question, playMelody, isLoaded]);

    useEffect(() => {
        if (question && answerStatus === 'idle' && isLoaded) {
            const timer = setTimeout(() => {
                handlePlay();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [question, answerStatus, handlePlay, isLoaded]);

    const handleInput = (direction: ContourDirection) => {
        if (answerStatus === 'correct') return;

        const newAnswer = [...userAnswer, direction];
        setUserAnswer(newAnswer);

        // Check if complete
        if (newAnswer.length === 4) { // 5 notes = 4 intervals
            checkAnswer(newAnswer);
        }
    };

    const checkAnswer = (finalAnswer: ContourDirection[]) => {
        if (!question) return;

        const isCorrect = finalAnswer.every((dir, index) => dir === question.directions[index]);

        if (isCorrect) {
            setAnswerStatus('correct');
            playFeedback('success');
            setTimeout(() => {
                newQuestion();
            }, 1500);
        } else {
            setAnswerStatus('wrong');
            playFeedback('error');
            setTimeout(() => {
                setUserAnswer([]);
                setAnswerStatus('idle');
            }, 1000);
        }
    };

    return (
        <StyledView className="flex-1 w-full gap-4">

            {/* Top Play Area */}
            <StyledView className="w-full h-48 bg-neo-blue border-4 border-neo-black shadow-neo rounded-base flex items-center justify-center relative overflow-hidden">
                {isPlaying && (
                    <StyledView className="absolute w-48 h-48 rounded-full border-4 border-neo-white opacity-50" />
                )}

                {!isLoaded ? (
                    <StyledView className="flex items-center gap-4">
                        <StyledText className="font-bold font-mono text-sm uppercase">{t('downloading')}</StyledText>
                    </StyledView>
                ) : (
                    <StyledTouchableOpacity
                        onPress={handlePlay}
                        className={`z-10 bg-neo-white border-4 border-neo-black p-4 rounded-full shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none ${isPlaying ? 'bg-neo-pink' : ''
                            }`}
                    >
                        <GuitarIcon />
                    </StyledTouchableOpacity>
                )}
            </StyledView>

            {/* Visualization of User Input */}
            <StyledView className="h-24 bg-neo-white border-4 border-neo-black shadow-neo rounded-base flex-row items-center justify-center gap-2 p-2">
                {/* Start Dot */}
                <StyledView className="w-4 h-4 bg-neo-black rounded-full" />

                {userAnswer.map((dir, i) => (
                    <StyledView key={i} className="flex-row items-center">
                        <StyledView className="h-1 w-4 bg-gray-300" />
                        <StyledView className="w-10 h-10 border-2 border-neo-black bg-neo-white items-center justify-center rounded-base">
                            {dir === 'up' ? <ArrowUpIcon width={24} height={24} color="#000" /> : <ArrowDownIcon width={24} height={24} color="#000" />}
                        </StyledView>
                    </StyledView>
                ))}

                {/* Placeholders */}
                {Array.from({ length: 4 - userAnswer.length }).map((_, i) => (
                    <StyledView key={`placeholder-${i}`} className="flex-row items-center">
                        <StyledView className="h-1 w-4 bg-gray-300" />
                        <StyledView className="w-10 h-10 border-2 border-dashed border-gray-400 rounded-base bg-gray-100" />
                    </StyledView>
                ))}
            </StyledView>

            {/* Input Buttons */}
            <StyledView className="flex-row justify-between gap-4 h-40">
                <StyledTouchableOpacity
                    onPress={() => handleInput('up')}
                    disabled={answerStatus === 'correct' || !isLoaded}
                    className="flex-1 bg-neo-green border-4 border-neo-black shadow-neo rounded-base items-center justify-center active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    <ArrowUpIcon width={56} height={56} color="white" />
                    <StyledText className="text-xl font-black uppercase tracking-wider text-neo-black mt-2">{t('higher')}</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity
                    onPress={() => handleInput('down')}
                    disabled={answerStatus === 'correct' || !isLoaded}
                    className="flex-1 bg-neo-pink border-4 border-neo-black shadow-neo rounded-base items-center justify-center active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    <ArrowDownIcon width={56} height={56} color="white" />
                    <StyledText className="text-xl font-black uppercase tracking-wider text-neo-black mt-2">{t('lower')}</StyledText>
                </StyledTouchableOpacity>
            </StyledView>

            {/* Footer Info */}
            <StyledView className="bg-neo-white border-4 border-neo-black shadow-neo rounded-base p-4 items-center">
                <StyledText className="font-bold text-sm uppercase text-center">{t('identify_melody')}</StyledText>
            </StyledView>

        </StyledView>
    );
};
