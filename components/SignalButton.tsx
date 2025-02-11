import { View, Text, TouchableOpacity } from 'react-native'

const SignalButton = ({ title, isSelected, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`rounded-3xl h-10 w-40 items-center justify-center 
        ${isSelected ? 'bg-darkPurple' : 'bg-lightPurple'}`}
    >
      <Text className="text-white text-sm font-medium">{title}</Text>
    </TouchableOpacity>
  )
}

export default SignalButton
