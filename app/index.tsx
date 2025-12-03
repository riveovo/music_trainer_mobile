
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import { useTranslation } from 'react-i18next';
import '../i18n'; // Initialize i18n

import { ViewMode } from '../types';
import { NoteTrainer } from '../components/NoteTrainer';
import { IntervalTrainer } from '../components/IntervalTrainer';
import { IntervalDirectionTrainer } from '../components/IntervalDirectionTrainer';
import { MelodicContourTrainer } from '../components/MelodicContourTrainer';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export default function App() {
    const { t } = useTranslation();
    const [view, setView] = useState<ViewMode>(ViewMode.NOTE_TRAINER);

    const navBtnClass = (active: boolean) => `
    flex-1 py-3 px-1 border-4 border-neo-black items-center justify-center
    ${active
            ? 'bg-neo-black shadow-none translate-x-[2px] translate-y-[2px]'
            : 'bg-white shadow-neo'
        }
  `;

    const navTextClass = (active: boolean) => `
    font-black uppercase tracking-tighter text-xs
    ${active ? 'text-neo-yellow' : 'text-gray-500'}
  `;

    return (
        <StyledSafeAreaView className="flex-1 bg-gray-100">
            <StatusBar style="dark" />
            <StyledScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
                <StyledView className="flex-1 flex-col items-center p-4">

                    {/* Header & Nav */}
                    <StyledView className="w-full max-w-3xl mb-8 flex flex-col gap-4">

                        {/* Title Block */}
                        <StyledView className="flex-row justify-between items-center bg-neo-white border-4 border-neo-black p-4 shadow-neo rounded-base">
                            <StyledView className="flex-row items-baseline gap-2">
                                <StyledText className="text-2xl font-black italic tracking-tighter uppercase">{t('title')}</StyledText>
                                <StyledView className="bg-neo-pink px-2 py-0.5 border-2 border-neo-black -rotate-2">
                                    <StyledText className="text-xs font-bold">NEO</StyledText>
                                </StyledView>
                            </StyledView>
                            <StyledText className="font-mono text-xs font-bold">v2.0</StyledText>
                        </StyledView>

                        {/* View Switcher Tabs */}
                        <StyledView className="flex-row flex-wrap gap-2">
                            <StyledTouchableOpacity
                                onPress={() => setView(ViewMode.NOTE_TRAINER)}
                                className={navBtnClass(view === ViewMode.NOTE_TRAINER)}
                            >
                                <StyledText className={navTextClass(view === ViewMode.NOTE_TRAINER)}>{t('notes')}</StyledText>
                            </StyledTouchableOpacity>

                            <StyledTouchableOpacity
                                onPress={() => setView(ViewMode.INTERVAL_QUALITY)}
                                className={navBtnClass(view === ViewMode.INTERVAL_QUALITY)}
                            >
                                <StyledText className={navTextClass(view === ViewMode.INTERVAL_QUALITY)}>{t('intervals')}</StyledText>
                            </StyledTouchableOpacity>

                            <StyledTouchableOpacity
                                onPress={() => setView(ViewMode.INTERVAL_DIRECTION)}
                                className={navBtnClass(view === ViewMode.INTERVAL_DIRECTION)}
                            >
                                <StyledText className={navTextClass(view === ViewMode.INTERVAL_DIRECTION)}>{t('direction')}</StyledText>
                            </StyledTouchableOpacity>

                            <StyledTouchableOpacity
                                onPress={() => setView(ViewMode.MELODIC_CONTOUR)}
                                className={navBtnClass(view === ViewMode.MELODIC_CONTOUR)}
                            >
                                <StyledText className={navTextClass(view === ViewMode.MELODIC_CONTOUR)}>{t('melody')}</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    </StyledView>

                    {/* Main Content Area */}
                    <StyledView className="w-full max-w-3xl">
                        {view === ViewMode.NOTE_TRAINER && <NoteTrainer />}
                        {view === ViewMode.INTERVAL_QUALITY && <IntervalTrainer />}
                        {view === ViewMode.INTERVAL_DIRECTION && <IntervalDirectionTrainer />}
                        {view === ViewMode.MELODIC_CONTOUR && <MelodicContourTrainer />}
                    </StyledView>

                    <StyledText className="mt-12 font-mono text-xs font-bold border-t-4 border-neo-black pt-4 w-full max-w-3xl text-center uppercase tracking-widest text-gray-500">
                        {t('footer')}
                    </StyledText>
                </StyledView>
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}
