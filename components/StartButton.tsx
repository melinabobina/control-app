import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const StartButton = () => {
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
            const socket = io('http://192.168.1.224:5001', {
                reconnection: true,
                reconnectionAttempts: 5
            });

            socketRef.current = socket;

            socket.on('connect', () => {
                console.log('Connected to WebSocket');
                setConnectionStatus('Connected');
            });

            socket.on('connect_error', (error) => {
                console.error('⚠️ Connection error:', error);
                setConnectionStatus('Error');
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
                setConnectionStatus('Error');
            });

            socket.on('eeg_data', (data) => {
                console.log("Raw EEG data received:", data, typeof data);
                if (data) {
                    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                    const logMessage = `Alpha: ${parsed.frequency?.toFixed(2)}Hz, Amp: ${parsed.amplitude?.toFixed(2)}, PSD: ${parsed.psd?.toFixed(2)}`;
                    console.log(logMessage);
                } else {
                    console.log("Data received was null");
                }
            });

            return () => {
                socket.disconnect();
                console.log("Disconnected from WebSocket server");
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
