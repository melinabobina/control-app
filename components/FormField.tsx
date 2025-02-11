import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from "../constants"

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-medMauve font-semibold">{title}</Text>

      {/* Updated View to flex-row */}
      <View className="border-2 border-darkYellow w-96 h-16 px-4 bg-lightYellow
        rounded-2xl flex-row items-center">
        
        <TextInput 
          className="flex-1 text-darkPurple font-psemibold text-base" 
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b" 
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          {...props}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image 
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6 ml-2"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
