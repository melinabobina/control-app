import { useState } from "react";
import {
  TextInput as DefaultTextInput,
  Platform,
  TextInputProps,
} from "react-native";
import tailwind from "twrnc";

/**
 * React Native text input component built with Tailwind CSS
 */
export const TextInput = ({
  placeholderTextColor,
  ...props
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleEndEditing = () => {
    setIsFocused(false);
  };

  return (
    <DefaultTextInput
      {...props}
      onFocus={handleFocus}
      onEndEditing={handleEndEditing}
      style={[
        tailwind`w-64 bg-white dark:bg-neutral-900 border border-black/20 dark:border-white/20 rounded-xl h-11 px-4 text-neutral-950 dark:text-neutral-50`,
        isFocused && Platform.OS !== "web" ? tailwind`border` : {},
        props.style,
      ]}
      placeholderTextColor={
        placeholderTextColor || tailwind.color("text-neutral-500")
      }
    />
  );
};
