
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IntervalQuestion } from '../types';
import { generateIntervalQuestion } from '../utils/musicTheory';
import { useGuitarSynth } from '../hooks/useGuitarSynth';
import { GuitarIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const IntervalDirectionTrainer = () => {
    const { t } = useTranslation();
    const [question, setQuestion] = useState<IntervalQuestion | null>(null);
    const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [isPlaying, setIsPlaying] = useState(false);

    const { playInterval, playFeedback, isLoaded } = useGuitarSynth(true);

    useEffect(() => {
        newQuestion();
    }, []);

    const newQuestion = () => {
        setQuestion(generateIntervalQuestion());
        setAnswerStatus('idle');
        setIsPlaying(false);
    };

    const handlePlay = useCallback(() => {
        if (!question || !isLoaded) return;
        setIsPlaying(true);
        playInterval(question.firstNote, question.secondNote);
        setTimeout(() => setIsPlaying(false), 2000);
    }, [question, playInterval, isLoaded]);

    useEffect(() => {
        if (question && answerStatus === 'idle' && isLoaded) {
            const timer = setTimeout(() => {
                handlePlay();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [question, answerStatus, handlePlay, isLoaded]);

    const handleAnswer = (direction: 'ascending' | 'descending') => {
        if (!question || answerStatus === 'correct') return;

        if (direction === question.direction) {
            setAnswerStatus('correct');
            playFeedback('success');
            setTimeout(() => {
                newQuestion();
            }, 1000);
        } else {
            setAnswerStatus('wrong');
            playFeedback('error');
        }
    };

    return (
        <StyledView className="flex-1 w-full gap-4">

            {/* Top Play Area */}
            <StyledView className="w-full h-64 bg-neo-blue border-4 border-neo-black shadow-neo rounded-base flex items-center justify-center relative overflow-hidden">
                {isPlaying && (
                    <StyledView className="absolute w-64 h-64 rounded-full border-4 border-neo-white opacity-50" />
                )}

                {!isLoaded ? (
                    <StyledView className="flex items-center gap-4">
                        <StyledText className="font-bold font-mono text-sm uppercase">{t('downloading')}</StyledText>
                    </StyledView>
                ) : (
                    <StyledTouchableOpacity
                        onPress={handlePlay}
                        className={`z-10 bg-neo-white border-4 border-neo-black p-6 rounded-full shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none ${isPlaying ? 'bg-neo-pink' : ''
                            }`}
                    >
                        <GuitarIcon />
                    </StyledTouchableOpacity>
                )}

                <StyledView className="mt-6 flex flex-col items-center gap-2">
                    <StyledView className={`px-4 py-1 -rotate-1 ${isLoaded ? 'bg-neo-black' : 'bg-gray-300'
                        }`}>
                        <StyledText className={`font-black uppercase tracking-widest ${isLoaded ? 'text-neo-white' : 'text-gray-500'
                            }`}>
                            {isLoaded
                                ? (isPlaying ? t('playing') : t('tap_replay'))
                                : t('tuning')
                            }
                        </StyledText>
                    </StyledView>
                </StyledView>
            </StyledView>

            {/* Answer Buttons */}
            <StyledView className="flex-row justify-between gap-4 h-40">
                <StyledTouchableOpacity
                    onPress={() => handleAnswer('ascending')}
                    disabled={answerStatus === 'correct' || !isLoaded}
                    className={`flex-1 border-4 border-neo-black shadow-neo rounded-base items-center justify-center active:translate-x-1 active:translate-y-1 active:shadow-none ${answerStatus === 'correct' && question?.direction === 'ascending' ? 'bg-neo-yellow' :
                        answerStatus === 'wrong' && question?.direction !== 'ascending' ? 'bg-red-500' : 'bg-neo-green'
                        }`}
                >
                    <ArrowUpIcon width={56} height={56} color="white" />
                    <StyledText className="text-xl font-black uppercase tracking-wider text-neo-black mt-2">{t('higher')}</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity
                    onPress={() => handleAnswer('descending')}
                    disabled={answerStatus === 'correct' || !isLoaded}
                    className={`flex-1 border-4 border-neo-black shadow-neo rounded-base items-center justify-center active:translate-x-1 active:translate-y-1 active:shadow-none ${answerStatus === 'correct' && question?.direction === 'descending' ? 'bg-neo-yellow' :
                        answerStatus === 'wrong' && question?.direction !== 'descending' ? 'bg-red-500' : 'bg-neo-pink'
                        }`}
                >
                    <ArrowDownIcon width={56} height={56} color="white" />
                    <StyledText className="text-xl font-black uppercase tracking-wider text-neo-black mt-2">{t('lower')}</StyledText>
                </StyledTouchableOpacity>
            </StyledView>

            {/* Footer Info */}
            <StyledView className="bg-neo-white border-4 border-neo-black shadow-neo rounded-base p-4 items-center">
                <StyledText className="font-bold text-sm uppercase text-center">{t('identify_direction')}</StyledText>
            </StyledView>

        </StyledView>
    );
};
