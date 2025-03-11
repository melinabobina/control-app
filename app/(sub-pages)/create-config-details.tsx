import { View, Text, Image, SafeAreaView, ScrollView, Dimensions, Modal, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header';
import SignalButton from '@/components/SignalButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { TextInput } from "@/components/TextInput";
import { supabase } from '@/lib/supabase';
import { useConfigStore } from '../../store';
import {icons} from '../../constants'
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';


const CreateConfig2 = () => {
  const [selectedSignal, setSelectedSignal] = useState("Alpha (8 - 12 Hz)")
  const [rangeValues, setRangeValues] = useState([8, 12]); // Initial range values
  const screenWidth = Dimensions.get('window').width;
  const { x, y } = useConfigStore();
  const [selectedPanels, setSelectedPanels] = useState<Set<string>>(new Set());

  const [brightness, setBrightness] = useState("")
  const [speed, setSpeed] = useState("")
  const [direction, setDirection] = useState("")
  const [selectedColor, setSelectedColor] = useState('red') // Initial default color

  const [showModal, setShowModal] = useState(false);

  const signalRanges = {
    "Alpha (8 - 12 Hz)": [8, 12],
    "Beta (12 - 30 Hz)": [12, 30],
    "Gamma (30 - 50 Hz)": [30, 50],
    "Theta (4 - 8 Hz)": [4, 8],
    "Delta (<4 Hz)": [0, 4]
  };

  const onSelectColor = ({ hex }) => {
    setSelectedColor(hex)  // Save the selected color
    console.log(hex)
  }

  useEffect(() => {
    setRangeValues(signalRanges[selectedSignal]);
  }, [selectedSignal]);

  const togglePanel = (row: number, col: number) => {
    const panelId = `${row}-${col}`;
    setSelectedPanels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
      } else {
        newSet.add(panelId);
      }
      return newSet;
    });
  };

   const handlePress = async () => {
      
    }

  return (
    <SafeAreaView className="bg-white h-full">  
    <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
      <View className="items-center w-full justify-center">
        <Header 
          title="Create a new configuration"
          header="Add and edit new ranges below"
        />

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Choose a signal:</Text>
        <View className="mt-4 bg-medYellow w-11/12 py-3 rounded-3xl flex-wrap flex-row justify-center items-center">
          {["Alpha (8 - 12 Hz)", "Beta (12 - 30 Hz)", "Gamma (30 - 50 Hz)", 
            "Theta (4 - 8 Hz)", "Delta (<4 Hz)"].map((signal, index) => (
            <View key={signal} className={`w-1/2 mt-5 ${index === 4 ? "w-full flex items-center" : "justify-center items-center"}`}>
              <SignalButton 
                title={signal}
                isSelected={selectedSignal === signal}
                onPress={() => setSelectedSignal(signal)}
              />
            </View>
          ))}
        </View>

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Specify a range:</Text>
          <View className="mt-4 bg-medYellow w-11/12 h-48 py-3 rounded-3xl items-center">
            <Text className="text-darkPurple px-14 pb-2 text-center font-medium mt-4">
              {selectedSignal}
            </Text>

            <MultiSlider
              values={rangeValues}
              onValuesChange={(values) => setRangeValues(values)}
              min={signalRanges[selectedSignal][0]}
              max={signalRanges[selectedSignal][1]}
              step={1}
              allowOverlap={false}
              snapped
              containerStyle={{
                height: 40,
                marginTop: 10
              }}
              selectedStyle={{
                backgroundColor: '#47313E'
              }}
              unselectedStyle={{
                backgroundColor: '#E5E7EB' // light gray
              }}
              sliderLength={screenWidth * 0.75} // 75% of screen width
              markerStyle={{
                backgroundColor: '#47313E',
                height: 20,
                width: 20,
              }}
              trackStyle={{
                height: 6,
                borderRadius: 3,
              }}
            />

            <View className="flex-row">
              <Text className="text-darkPurple px-2 pb-2 text-center font-normal mt-4">
                Selected range: 
              </Text>
              <Text className="text-darkPurple pb-2 text-center font-normal mt-4">
                {rangeValues[0]} [Hz] to {rangeValues[1]} [Hz]
              </Text>
            </View>
          </View>

          <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">
            Choose panels to configure:
          </Text>
          <View className="mt-4 bg-medYellow w-11/12 py-3 rounded-3xl items-center">
            {Array.from({ length: parseInt(y) || 0 }).map((_, row) => (
              <View key={row} className="flex-row">
                {Array.from({ length: parseInt(x) || 0 }).map((_, col) => {
                  const isSelected = selectedPanels.has(`${row}-${col}`);
                  return (
                    <TouchableOpacity
                      key={`${row}-${col}`}
                      onPress={() => togglePanel(row, col)}
                      className={`w-12 h-12 m-1 rounded-lg ${
                        isSelected ? 'bg-darkPurple' : 'bg-lightPurple'
                      }`}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">
            Configure your sculpture's animations:
          </Text>
          <View className="mt-4 bg-medYellow w-11/12 py-3 rounded-3xl flex-wrap flex-row justify-center items-center px-4">
            <View className="flex-row items-center space-x-4 w-full mb-4">
              <Text className="text-darkPurplxe font-medium">Brightness:   </Text>
              <TextInput 
                className="bg-lightYellow px-4 py-2 rounded-lg flex-1"
                value={brightness}
                onChangeText={setBrightness}
                placeholder="Enter brightness (%)"
                keyboardType="numeric"
              />
            </View>

            <View className="flex-row items-center space-x-4 w-full mb-4">
              <Text className="text-darkPurple font-medium">Speed:   </Text>
              <TextInput 
                className="bg-lightYellow px-4 py-2 rounded-lg flex-1"
                value={speed}
                onChangeText={setSpeed}
                placeholder="Enter speed (m/s)"
                keyboardType="numeric"
              />
            </View>

            <View className="flex-row items-center space-x-4 w-full mb-4">
              <Text className="text-darkPurple font-medium">Direction:   </Text>
              <TextInput 
                className="bg-lightYellow px-4 py-2 rounded-lg flex-1"
                value={direction}
                onChangeText={setDirection}
                placeholder="Enter direction (up/down)"
                keyboardType="numeric"
              />
            </View>

            <View className="flex-row items-center space-x-4 w-full mb-4">
              <Text className="text-darkPurple font-medium">Color:   </Text>
              <View className="justify-center flex-1">
                <TouchableOpacity 
                  onPress={() => setShowModal(true)}
                  className="bg-lightPurple px-3 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium text-center">Choose your color</Text>
                </TouchableOpacity>

                <Modal 
                  visible={showModal} 
                  animationType='slide'
                  transparent={true}
                >
                  <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-6 rounded-xl w-11/12">
                      <ColorPicker 
                        style={{ width: '100%' }} 
                        value={selectedColor}
                        onComplete={onSelectColor}
                      >
                        <Preview />
                        <Panel1 />
                        <HueSlider />
                        <OpacitySlider />
                        <Swatches />
                      </ColorPicker>

                      <TouchableOpacity 
                        onPress={() => setShowModal(false)}
                        className="bg-lightPurple mt-4 px-6 py-3 rounded-lg"
                      >
                        <Text className="text-white font-medium text-center">Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            <Text className="text-darkPurple font-medium">Selected color: </Text>
            <Text className="text-darkPurple font-medium">{selectedColor}</Text>
            <View className="w-full px-2 flex-1">
              <Text style={{ backgroundColor: selectedColor }} className="text-darkPurple font-medium py-2 rounded-md text-center w-full"></Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handlePress}
            activeOpacity={0.7}
            className={`mt-5 h-10 w-[340px] rounded-xl bg-darkPurple justify-center items-center`}>

            <View className="flex-row items-center justify-between px-6">
              <Text className="text-white font-medium items-center flex-1 text-center">Save your configuration</Text>
                <Image
                  source={icons.bookmark}
                  tintColor="white"
                  resizeMode="contain"
                  className="w-5 h-5"
                />
            </View>
          </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default CreateConfig2