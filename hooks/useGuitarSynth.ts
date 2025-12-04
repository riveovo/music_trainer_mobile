
import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';

// Map note names to required assets
const SOUND_FILES: Record<string, any> = {
    'E2': require('../assets/sounds/E2.wav'),
    'A2': require('../assets/sounds/A2.wav'),
    'C3': require('../assets/sounds/C3.wav'),
    'D3': require('../assets/sounds/D3.wav'),
    'E3': require('../assets/sounds/E3.wav'),
    'G3': require('../assets/sounds/G3.wav'),
    'A3': require('../assets/sounds/A3.wav'),
    'C4': require('../assets/sounds/C4.wav'),
    'E4': require('../assets/sounds/E4.wav'),
    'G4': require('../assets/sounds/G4.wav'),
    'C5': require('../assets/sounds/C5.wav'),
    'success': require('../assets/sounds/success.wav'),
    'error': require('../assets/sounds/error.wav'),
};

export const useGuitarSynth = (enabled: boolean = true) => {
    const [isLoaded, setIsLoaded] = useState(false);
    // Store arrays of Sound objects for polyphony
    const sounds = useRef<Record<string, Audio.Sound[]>>({});
    const voiceIndex = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!enabled) return;

        const loadSounds = async () => {
            try {
                // Load all sounds - create 2 instances for each to allow overlap
                const promises = Object.keys(SOUND_FILES).map(async (key) => {
                    const pool: Audio.Sound[] = [];
                    for (let i = 0; i < 2; i++) {
                        const { sound } = await Audio.Sound.createAsync(SOUND_FILES[key]);
                        pool.push(sound);
                    }
                    sounds.current[key] = pool;
                    voiceIndex.current[key] = 0;
                });

                await Promise.all(promises);
                console.log("Guitar Samples Loaded (Polyphonic)!");
                setIsLoaded(true);
            } catch (error) {
                console.error("Failed to load sounds", error);
            }
        };

        loadSounds();

        return () => {
            // Unload sounds
            Object.values(sounds.current).forEach(pool => {
                pool.forEach(sound => sound.unloadAsync());
            });
        };
    }, [enabled]);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const playNote = useCallback(async (note: string, timeOffset: number = 0) => {
        if (!isMounted.current) return;

        // 1. Find closest base sample
        const targetMidi = getMidiNote(note);
        const availableNotes = Object.keys(SOUND_FILES);
        let closestNote = availableNotes[0];
        let minDiff = Infinity;

        availableNotes.forEach(baseNote => {
            // Skip non-note keys like 'success' or 'error'
            if (baseNote === 'success' || baseNote === 'error') return;

            const baseMidi = getMidiNote(baseNote);
            const diff = Math.abs(targetMidi - baseMidi);
            if (diff < minDiff) {
                minDiff = diff;
                closestNote = baseNote;
            }
        });

        const baseMidi = getMidiNote(closestNote);
        const semitones = targetMidi - baseMidi;

        // Calculate rate: 2^(semitones/12)
        const rate = Math.pow(2, semitones / 12);

        // Round-robin voice selection
        const pool = sounds.current[closestNote];
        if (pool && pool.length > 0) {
            const currentIndex = voiceIndex.current[closestNote] || 0;
            const sound = pool[currentIndex];
            // Update index for next time
            voiceIndex.current[closestNote] = (currentIndex + 1) % pool.length;

            try {
                const playSound = async () => {
                    if (!isMounted.current) return;
                    try {
                        const status = await sound.getStatusAsync();
                        if (!status.isLoaded) return;

                        // Stop if currently playing (though round-robin minimizes this)
                        if (status.isPlaying) {
                            await sound.stopAsync();
                        }

                        await sound.setRateAsync(rate, false);
                        await sound.playFromPositionAsync(0);
                    } catch (e) {
                        console.warn("Error playing sound", e);
                    }
                };

                if (timeOffset > 0) {
                    setTimeout(playSound, timeOffset * 1000);
                } else {
                    playSound();
                }
            } catch (e) {
                console.warn("Error scheduling sound", e);
            }
        }
    }, [isLoaded]);

    const playInterval = useCallback(async (note1: string, note2: string) => {
        if (!isLoaded) return;

        // Humanize
        const humanize = Math.random() * 0.05;

        playNote(note1, humanize);
        playNote(note2, 0.6 + humanize);

    }, [isLoaded, playNote]);

    const playMelody = useCallback(async (notes: string[]) => {
        if (!isLoaded) return;

        notes.forEach((note, index) => {
            const humanize = Math.random() * 0.03;
            const time = index * 0.6 + humanize;
            playNote(note, time);
        });
    }, [isLoaded, playNote]);

    const playFeedback = useCallback(async (type: 'success' | 'error') => {
        if (!isLoaded) return;

        // Use the dedicated SFX
        const soundKey = type;
        const pool = sounds.current[soundKey];

        if (pool && pool.length > 0) {
            const currentIndex = voiceIndex.current[soundKey] || 0;
            const sound = pool[currentIndex];
            voiceIndex.current[soundKey] = (currentIndex + 1) % pool.length;

            try {
                const status = await sound.getStatusAsync();
                if (!status.isLoaded) return;
                if (status.isPlaying) await sound.stopAsync();

                await sound.setRateAsync(1.0, false); // Normal speed
                await sound.playFromPositionAsync(0);
            } catch (e) {
                console.warn("Error playing feedback", e);
            }
        }
    }, [isLoaded]);

    return { playInterval, playMelody, playFeedback, isLoaded };
};

// Helper for MIDI calculation (duplicated from musicTheory to avoid circular deps or just for self-containment)
const getMidiNote = (note: string): number => {
    const match = note.match(/^([A-G][#b]?)(-?\d+)$/);
    if (!match) return 60;
    const [_, name, octStr] = match;
    const octave = parseInt(octStr, 10);
    const baseMap: Record<string, number> = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    return (octave + 1) * 12 + baseMap[name];
};
