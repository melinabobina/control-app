// utils/espCommunication.ts

import { Socket } from 'socket.io-client';

interface ConfigSetting {
  setting_name: string;
  brightness: number;
  speed: number;
  direction: string;
  color: string;
  selected_panels: string[];
}

export class ESPCommunicator {
  private socket: Socket | null = null;

  constructor(socket: Socket | null) {
    this.socket = socket;
  }

  // Convert color hex to RGB values
  private hexToRGB(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  // Convert panel coordinates to ESP panel IDs
  private convertPanelCoordinates(selectedPanels: string[], x: number, y: number): number[] {
    return selectedPanels.map(panel => {
      const [row, col] = panel.split('-').map(Number);
      // Convert row-col to panel number based on grid size
      return row * x + col + 1;
    });
  }

  // Send configuration to ESP
  sendConfig(config: ConfigSetting, gridX: number, gridY: number) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    const rgb = this.hexToRGB(config.color);
    const panelIds = this.convertPanelCoordinates(config.selected_panels, gridX, gridY);
    const directionCode = config.direction.toLowerCase() === 'up' ? 1 : 0;

    // Format: CONFIG <brightness> <speed> <direction> <r> <g> <b> <panel_count> <panel_ids...>
    const command = `CONFIG ${config.brightness} ${config.speed} ${directionCode} ${rgb.r} ${rgb.g} ${rgb.b} ${panelIds.length} ${panelIds.join(' ')}`;

    console.log('Sending command to ESP:', command);
    this.socket.emit("control_command", command);
  }

  // Send EEG data to ESP for visualization
  sendEEGData(eegData: any) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    // Format: EEG <alpha> <beta> <theta> <delta> <gamma> <dominant_band>
    const dominantBandCode = {
      'alpha': 1,
      'beta': 2,
      'theta': 3,
      'delta': 4,
      'gamma': 5
    }[eegData.dominant_band.toLowerCase()] || 0;

    const command = `EEG ${eegData.alpha_band.toFixed(2)} ${eegData.beta_band.toFixed(2)} ${eegData.theta_band.toFixed(2)} ${eegData.delta_band.toFixed(2)} ${eegData.gamma_band.toFixed(2)} ${dominantBandCode}`;

    console.log('Sending EEG data to ESP:', command);
    this.socket.emit("control_command", command);
  }

  // Send start command
  sendStart() {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    console.log('Sending start command to ESP');
    this.socket.emit("control_command", "START");
  }

  // Send stop command
  sendStop() {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    console.log('Sending stop command to ESP');
    this.socket.emit("control_command", "STOP");
  }
}

export default ESPCommunicator;