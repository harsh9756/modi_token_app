// import { useState } from "react";
import { Button } from "./ui/button";
import Drawer, { DrawerProps } from "./ui/drawer";
import Price from "./Price";
import { useMutation } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import { Mission } from "@/types/MissionType";
import { useUserStore } from "@/store/user-store";
import { useMemo } from "react";

export default function MissionDrawer({
  mission,
   setOwnedMissions,...props }: DrawerProps & {
    mission: any | null;
    setOwnedMissions: any,
  }) {
  // const queryClient = useQueryClient();
  const { balance } = useUserStore();
  const insufficientBalance = useMemo(() => {
    if (!mission?.basePrice) return false;
    return balance < mission?.basePrice;
  }, [balance, mission?.basePrice]);
  console.log("d")
  const upgradeMution = useMutation({
    mutationFn: () =>
      $http.post(
        `/clicker/mission-levels/${mission?.id}`
      ),
    onSuccess: ({ data }) => {
      toast.success(data.message || "Mission upgraded successfully");
      setOwnedMissions((prevMissions: any) => {
        const missionExists = prevMissions.some((mission: Mission) => mission.id === data?.new_mission.id);
      
        if (missionExists) {
          // If mission exists, increment the level
          return prevMissions.map((mission: Mission) =>
            mission.id === data?.new_mission.id
              ? { ...mission, mission_level: mission.mission_level + 1 }
              : mission
          );
        } else {
          // If mission doesn't exist, add the new mission
          return [...prevMissions, data?.new_mission];
        }
      });
      
      props.onOpenChange?.(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  if (!mission) return null;
  return (
    <Drawer {...props}>
      <img
        src={mission.image}
        alt={mission.name}
        className="object-contain h-32 mx-auto"
      />
      <h2 className="mt-6 text-2xl font-medium text-center">{mission.name}</h2>
      <div className="flex flex-col mx-auto mt-4 w-fit">
        <p className="text-xs text-center">Production per hour</p>
        <Price type="p" d={"d"} level={mission.mission_level} amount={mission.production_per_hour}
          className="justify-center mt-2 text-sm text-white"
        />
      </div>

      <div className="flex items-center justify-center mx-auto mt-6 space-x-1 text-white">
      <Price type="a" d={"d"} level={mission.mission_level} amount={mission.basePrice}
          className="justify-center mt-2 text-sm text-white"
        />
      </div>
      <Button
        className="w-full mt-6"
        disabled={upgradeMution.isPending || insufficientBalance}
        onClick={() => upgradeMution.mutate()}
      >
        {upgradeMution.isPending && (
          <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
        )}
        {insufficientBalance ? "Insufficient Balance" : "Go ahead"}
      </Button>
    </Drawer>
  );
}
