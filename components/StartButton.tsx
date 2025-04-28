import { useConfigStore } from '../store';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const StartButton = () => {
    const setEegData = useConfigStore((state) => state.setEegData);
    const [isPlaying, setIsPlaying] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const socketRef = useRef(null);

    const handlePress = () => {
        if (isPlaying) {
            Alert.alert(
                "Stop Playing?",
                "Are you sure you want to stop playing the configuration?",
                [
                    { text: "No", style: "cancel" },
                    { text: "Yes", onPress: () => setIsPlaying(false) }
                ]
            );
        } else {
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            const socket = io('https://signal-filter.onrender.com', {
                reconnection: true,
                reconnectionAttempts: 5
            });

            socketRef.current = socket;

            socket.on('connect', () => {
                console.log('Connected to WebSocket');
                setConnectionStatus('Connected');
            });

            socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                setConnectionStatus('Error');
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
                setConnectionStatus('Error');
            });

         socket.emit("control_command", "1 2 20 2");

            socket.on('eeg_data', (data) => {
                try {
                    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

                    const { alpha_band, beta_band, theta_band, delta_band, gamma_band, dominant_band, alpha_beta_ratio, alpha_delta_ratio, peak_alpha_freq, timestamp } = parsed;
                    console.log(
                        `Alpha: ${alpha_band.toFixed(2)} | Beta: ${beta_band.toFixed(2)} | Theta: ${theta_band.toFixed(2)}\n` +
                        `Delta: ${delta_band.toFixed(2)} | Gamma: ${gamma_band.toFixed(2)} | Dominant: ${dominant_band}\n` +
                        `Alpha/Beta Ratio: ${alpha_beta_ratio.toFixed(2)} | Alpha/Delta Ratio: ${alpha_delta_ratio.toFixed(2)}\n` +
                        `Peak Alpha Freq: ${peak_alpha_freq.toFixed(2)} Hz | Time: ${timestamp}`
                    );
                    setEegData(parsed);
                } catch (err) {
                    console.error("Error parsing EEG data:", err);
                }
            });

            return () => {
                socket.disconnect();
                console.log("🔌Disconnected from WebSocket server");
                setConnectionStatus('Disconnected');
            };
        } else {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setConnectionStatus('Disconnected');
            }
        }
    }, [isPlaying]);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'Connected': return 'text-green-500';
            case 'Disconnected': return 'text-red-400';
            case 'Error': return 'text-yellow-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <View className="pt-5 pb-5 items-center">
            <TouchableOpacity
                className={`rounded-2xl py-4 px-36 ${isPlaying ? 'bg-darkPurple' : 'bg-lightPurple'}`}
                onPress={handlePress}
            >
                <Text className="text-white font-bold">{isPlaying ? 'Playing...' : 'Press to begin'}</Text>
            </TouchableOpacity>

            <Text className={`mt-2 text-sm font-semibold ${getStatusColor()}`}>
                {connectionStatus}
            </Text>
        </View>
    );
};

export default StartButton;
