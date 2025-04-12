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
  setOwnedMissions,
  ownedMissions,
  ...props
}: DrawerProps & {
  mission: any | null;
  ownedMissions: any | null;
  setOwnedMissions: any;
}) {
  const { balance, setBalance,set_PPH } = useUserStore(); // Update balance state
  const insufficientBalance = useMemo(() => {
    if (!mission?.basePrice) return false;
    return balance < mission?.basePrice;
  }, [balance, mission?.basePrice]);

  const upgradeMutation = useMutation({
    mutationFn: () => $http.post(`/clicker/mission-levels/${mission?.id}`),
    onSuccess: ({ data }) => {
      toast.success(data.message || "Mission upgraded successfully");
      console.log("Mission upgraded successfully", data);
      // Update balance after upgrade
      setBalance(data.updated_balance);
      set_PPH(data.updated_production)
      setOwnedMissions((prevMissions: any) => {
        const missionExists = prevMissions.some(
          (mission: Mission) => mission.id === data?.new_mission.id
        );
        if (missionExists) {
          // If mission exists, increment the level
          return prevMissions.map((mission: Mission) =>
            mission.id === data?.new_mission.id
              ? { ...mission, mission_level: mission.mission_level + 1 }
              : mission
          );
        } else {
          return [...prevMissions, data?.new_mission];
        }
      });
      props.onOpenChange?.(false);
    },
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
        <Price
          type="p"
          d={"d"}
          level={mission.mission_level}
          amount={mission.production_per_hour}
          className="justify-center mt-2 text-sm"
        />
      </div>

      <div className="flex items-center justify-center mx-auto mt-6 space-x-1">
        <Price
          type="a"
          d={"d"}
          level={mission.mission_level}
          amount={mission.basePrice}
          className="justify-center mt-2 text-sm"
        />
      </div>

      <Button
        className="w-full mt-6 text-xl"
        disabled={upgradeMutation.isPending || insufficientBalance}
        onClick={() => upgradeMutation.mutate()}
      >
        {upgradeMutation.isPending && (
          <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
        )}
        {insufficientBalance ? "Insufficient Balance" : "Go ahead"}
      </Button>
    </Drawer>
  );
}
