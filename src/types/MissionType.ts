export type Mission = {
  id: number;
  name: string;
  basePrice: number;
  expired: boolean;
  image: string;
  mission_level: string;
  production_per_hour: string | number;
  required_user_level?: number;
  required_friends_invitation?: number;
};
