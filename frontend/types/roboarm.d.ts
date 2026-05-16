export interface ArmFrame {
  joints: number[];
  end_effector: { x: number; y: number; z: number };
  torques: number[];
  gripper: number;
}

export interface Preset {
  id: number;
  name: string;
  angles: number[];
  created_at: string;
}

export interface HistoryEntry {
  id: number;
  command_type: string;
  payload_json: string;
  created_at: string;
}

export type WsCommand =
  | { type: "joint_cmd"; joint: number; angle: number }
  | { type: "preset_cmd"; name: string };
