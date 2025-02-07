export type MissionType = {
  id: number;
  name: string;
};

export type Mission = {
  id: number;
  name: string;
  basePrice: number;
  image: string;
  mission_level: string;
  production_per_hour: string | number;
  required_user_level?: number;
  required_friends_invitation?: number;
};
