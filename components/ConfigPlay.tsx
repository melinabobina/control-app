import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const Config = ({name, color}) => {
    return (
        <View className="pt-3 px-1">
            <TouchableOpacity 
                activeOpacity={0.7}
                className={`h-10 w-40 rounded-3xl bg-${color}`}
            >
            <View className="justify-between items-center">
                <Text className="text-white text-sm pt-2.5 font-bold">{name}</Text>
            </View>
            </TouchableOpacity>
        </View>
    )
}

export default Config