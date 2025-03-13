import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { icons } from '@/constants';
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase';

const Config = ({id, name, date, favorite, onDelete, onFavoriteChange, onPress}) => {
    const [isFavorite, setIsFavorite] = useState(favorite);

    const handleDeletePress = () => {
        Alert.alert(
          "Confirm Deletion",
          `Are you sure you want to delete ${name}?`,
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            { 
              text: "Yes", 
              onPress: () => {
                console.log('Confirmed delete for ID:', id);
                if (onDelete) {
                  onDelete();
                }
              },
              style: "destructive"
            }
          ]
        );
    };

    const updateFavorite = async () => {
        try {
            const newFavoriteStatus = !isFavorite;
            setIsFavorite(newFavoriteStatus);
            
            const { data, error } = await supabase
                .from('configs')
                .update({ favorite: newFavoriteStatus })
                .eq('id', id);
                
            if (error) {
                console.error('Error updating favorite status:', error);
                setIsFavorite(isFavorite);
                Alert.alert("Error", "Failed to update favorite status");
            } else {
                console.log('Favorite status updated successfully');
                if (onFavoriteChange) {
                    onFavoriteChange(id, newFavoriteStatus);
                }
            }
        } catch (error) {
            console.error('Exception updating favorite status:', error);
            setIsFavorite(isFavorite);
            Alert.alert("Error", "An unexpected error occurred");
        }
    };
      
    return (
        <View className="pt-5">
            <TouchableOpacity 
                activeOpacity={0.7}
                className="h-36 w-[350px] rounded-3xl bg-darkPurple"
                onPress={onPress}
            >
                <View className="h-full p-5">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lightYellow text-xl font-bold">{name}</Text>
                        <TouchableOpacity 
                            activeOpacity={0.7} 
                            onPress={updateFavorite}
                            className="p-1"
                        >
                            <Image
                                source={isFavorite ? icons.filledStar : icons.emptyStar}
                                tintColor="#F4E8D0"
                                resizeMode="contain"
                                className="w-6 h-6"
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-1 justify-end">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lightYellow text-base font-medium">Created: {date}</Text>
                            <TouchableOpacity 
                                onPress={handleDeletePress}
                                activeOpacity={0.7}
                                className="p-2"
                            >
                                <Image
                                    source={icons.trash}
                                    resizeMode="contain"
                                    tintColor="#F4E8D0"
                                    className="w-5 h-5"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Config