/* eslint-disable @typescript-eslint/no-explicit-any */
import MissionDrawer from "@/components/MissionDrawer";
import Price from "@/components/Price";
import UserGameDetails from "@/components/UserGameDetails";
import { $http } from "@/lib/http";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { useUserStore } from "@/store/user-store";
import { Mission } from "@/types/MissionType";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Missions() {
  const user = useUserStore();
  const { totalReferals } = useStore();
  const [activeTab, setActiveTab] = useState("owned");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [ownedMissions, setOwnedMissions] = useState<Mission[]>([]);
  const [newMissions, setNewMissions] = useState<Mission[]>([]);
  const [expiredMissions, setExpiredMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["/clicker/missions"],
    queryFn: () => $http.$get<{ all_missions: Mission[]; user_missions: Mission[] }>(`/clicker/missions`),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data) {
      setOwnedMissions(data.user_missions || []);
      setNewMissions((data.all_missions || []).filter(
        (mission) => !(data.user_missions || []).some((owned) => owned.id === mission.id) && !mission.expired
      ));
      setExpiredMissions((data.all_missions || []).filter(
        (mission) => mission.expired && !(data.user_missions || []).some((owned) => owned.id === mission.id)
      ));
    }
  }, [data]);

  useEffect(() => {
    setActiveTab("owned");
    if (data && ownedMissions.length) {
      setNewMissions((data.all_missions || []).filter(
        (mission) => !ownedMissions.some((owned) => owned.id === mission.id) && !mission.expired
      ));
    }
  }, [ownedMissions, data]);

  return (
    <div className="flex flex-col justify-end bg-slate-300 text-black flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 pb-24 mt-12 modal-body">
        <UserGameDetails className="mt-4" />
        <div className="flex items-center justify-center mt-10 space-x-1 text-gradient">
          <img src="/images/coins.png" alt="coins" className="object-contain w-14 h-14" />
          <span className="text-3xl text-black font-bold">{Math.floor(user.balance)?.toLocaleString()}</span>
        </div>
        <div className="mt-10">
          <div className="flex justify-evenly bg-black/20 backdrop-blur-sm p-2 rounded-lg">
            <button
              className={cn("text-sm font-bold uppercase", { "opacity-40": activeTab !== "owned" })}
              onClick={() => setActiveTab("owned")}
            >
              Owned Missions
            </button>
            <button
              className={cn("text-sm font-bold uppercase", { "opacity-40": activeTab !== "new" })}
              onClick={() => setActiveTab("new")}
            >
              New Missions
            </button>
            <button
              className={cn("text-sm font-bold uppercase", { "opacity-40": activeTab !== "expired" })}
              onClick={() => setActiveTab("expired")}
            >
              Expired Missions
            </button>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-full col-span-2 mt-6">
                  <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
                </div>
              ) : (
                (activeTab === "owned" ? ownedMissions : activeTab === "new" ? newMissions : expiredMissions).map((mission, key) => (
                  <div key={key} className={cn("flex flex-col py-3 px-3 bg-black/10 rounded-xl cursor-pointer")}
                    onClick={() => {
                      if (activeTab != "expired") {
                        setSelectedMission(mission);
                        setOpenDrawer(true);

                      }
                    }}>
                    <div className="flex items-start flex-1 space-x-3">
                      <img src={mission.image} alt={mission.name} className="object-contain w-16 h-16" />
                      <div className="flex flex-col">
                        <p className="text-[10px] font-bold">{mission.name}</p>
                        <p className="mt-1 text-[10px] font-medium">Profit per hour </p>
                        <Price d="a" type="p" level={mission.mission_level} amount={mission.production_per_hour || 0} className="mt-2 text-[10px]" />
                      </div>
                    </div>
                    {mission && (
                      <div className="pt-3 mt-3 border-t border-dashed border-black/50">
                        <div className="flex items-center space-x-3">
                          <p className="w-16 text-xs font-bold">LVL {mission.mission_level || 0}</p>
                          {mission.expired && activeTab === "expired" ? (
                            <button className="text-[10px] bg-gray-500 text-white px-2 py-1 rounded" disabled>
                              Expired
                            </button>
                          ) : mission.required_user_level && mission.required_user_level > user.level!.level ? (
                            <div className="flex items-center gap-2 text-[10px]">
                              <img src="/images/lock.png" alt="lock" className="object-contain w-5 h-5" />
                              <span>Mission required lvl {mission.required_user_level}</span>
                            </div>
                          ) : mission.required_friends_invitation && mission.required_friends_invitation > totalReferals ? (
                            <div className="flex items-center gap-2 text-[10px]">
                              <img src="/images/lock.png" alt="lock" className="object-contain w-5 h-5" />
                              <span>Mission required friends {mission.required_friends_invitation} invited</span>
                            </div>
                          ) : (
                            <Price d="a" type="a" amount={mission.basePrice} level={mission.mission_level} className="text-[10px]" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <MissionDrawer open={openDrawer} onOpenChange={setOpenDrawer} setOwnedMissions={setOwnedMissions} mission={selectedMission} />
    </div>
  );
}
