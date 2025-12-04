
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useTTS = (enabled: boolean) => {
    const [voices, setVoices] = useState<Speech.Voice[]>([]);

    useEffect(() => {
        const loadVoices = async () => {
            const availableVoices = await Speech.getAvailableVoicesAsync();
            setVoices(availableVoices);
        };
        loadVoices();
    }, []);

    const speak = useCallback((text: string) => {
        if (!enabled) return;

        // Stop any current speech
        Speech.stop();

        // Strategy to pick the best voice (similar to web app)
        // 1. iOS: Samantha / Daniel
        // 2. Android: en-US

        let voiceId = undefined;

        if (Platform.OS === 'ios') {
            const preferred = voices.find(v => v.name === 'Samantha') || voices.find(v => v.name === 'Daniel');
            if (preferred) voiceId = preferred.identifier;
        } else if (Platform.OS === 'android') {
            const preferred = voices.find(v => v.language.includes('en-US'));
            if (preferred) voiceId = preferred.identifier;
        }
        // On Web, we let the browser pick the default voice if we can't find a specific one, 
        // or we can try to find a "Google US English" one if available, but default is safer.

        const options: Speech.SpeechOptions = {
            rate: 1.0,
            pitch: 1.0,
            language: 'en-US', // Force English for note names
        };

        if (voiceId) {
            options.voice = voiceId;
        }

        Speech.speak(text, options);
    }, [enabled, voices]);

    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);

    return { speak };
};
