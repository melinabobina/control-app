Neural Kinetic Sculpture App 🎨🧠✨
Welcome to the Neural Kinetic Sculpture app 👋

This is an Expo project created with create-expo-app.

A mobile application built in React Native (Expo) to control and visualize settings for the Neural Kinetic Sculpture—an interactive LED installation enhanced by EEG brainwave signals. This app allows users to map EEG-derived data (like alpha wave amplitudes) to dynamic behaviors of the sculpture such as LED brightness and movement speed. It also provides real-time-like playback of pre-recorded EEG signals and communicates with the sculpture via WIFI.

📱 Features
User Authentication (via Supabase)
Configurable Settings: Map EEG frequency bands (alpha, beta, delta, etc.) to:
LED brightness levels
Panel motion speeds
Sound triggers
Archive of EEG Recordings:
Store & display EEG waveform CSVs
Playback with timestamp simulation
Bluetooth Communication: Send configuration data wirelessly to the sculpture's microcontroller.
Clean UI using Tailwind (NativeWind) for styling.
🌟 Tech Stack
Frontend	Backend/Storage	Communication
React Native (Expo)	Supabase (Auth & DB)	WIFI
NativeWind (Tailwind CSS)	Supabase Storage (CSVs)	WIFI to Microcontroller
🏗️ Project Structure Overview
/neural-kinetic-sculpture-app
├── assets/                # App assets (images, icons, etc.)
├── components/            # Reusable UI components
├── screens/               # App screens (Home, Config, Recordings, etc.)
├── services/
│   └── supabase.js        # Supabase client setup
├── utils/                 # Helper functions (e.g., CSV parsing, WIFI utils)
├── App.js                 # Main entry point
├── tailwind.config.js     # NativeWind/Tailwind config
├── app.json               # Expo config
└── README.md              # Project documentation (this file)
⚙️ Quick Setup Tips
Get started
Install dependencies

npm install
Start the app

npx expo start
In the output, you'll find options to open the app in:

Development Build
Android Emulator
iOS Simulator
Expo Go, a sandbox for trying out app development
Start developing by editing files inside the app/ directory. This project uses file-based routing.

🔀 Resetting Project (Optional)
When you're ready to start fresh:

npm run reset-project
This moves starter code to the app-example/ folder and creates a blank app/ directory for development.

🛠️ Necessary Installations
Feature/Component	Installation Command
React Native Vector Icons	Installation guide
Text Input Elements (RNE)	npx elements-cli@latest add text-input
Range Slider Input	npm install --save @ptomasroos/react-native-multi-slider
Supabase & Async Storage	npx expo install @supabase/supabase-js @react-native-async-storage/async-storage @rneui/themed react-native-url-polyfill
Environment Variables (.env)	npm install react-native-config
Color Picker	npm install reanimated-color-picker (Color Picker Package)
State Management (Zustand)	npm install zustand
Modal Support	npm i react-native-modal
📂 Supabase Database Schema Overview
users
configs
config-settings
recordings
Refer to Supabase schema setup for further detail.

🛡️ WIFI Communication Overview
Communicates via WIFI.
Sends config parameters (LED brightness, motion speed, sound triggers) to the microcontroller.
💡 Inspiration
This app is part of a larger Senior Design Project blending art, technology, and neuroscience—aiming to create an engaging, interactive experience where brainwaves control kinetic LED sculptures, enhancing performances and audience connection.

👤 Creator & Contact
Created & developed by Katrina Viray
Audio developed by Melina Moore

Feel free to reach out for questions, feedback, or collaboration opportunities!

📄 Attribution and Credits
Brain image provided by www.freepik.com
👌 Acknowledgments
Supabase
Expo
NativeWind
University of Houston Brain Center for EEG collaboration.
npm install socket.io-client@4.5.1 npm install react-native-chart-kit

Publishing to Expo Store
npx eas update --branch preview