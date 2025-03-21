import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import { $http } from "@/lib/http";
import { cn, compactNumber } from "@/lib/utils";
import { BoosterTypes } from "@/types/UserType";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import Price from "@/components/Price";
import { useStore } from "@/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
dayjs.extend(relativeTime);
dayjs.extend(duration);

// +500 energy - 1,000 - 1lvl
// +500 energy - 2,000 - 2lvl
// +500 energy - 5,000 - 3lvl
// +1000 energy - 10,000 - 4lvl
// +1000 energy - 25,000 - 5lvl
// +5000 energy - 50,000 - 6lvl
// +5000 energy - 100,000 - 7lvl
// +10000 energy - 250,000 - 8lvl
// +10000 energy - 500,000 - 9lvl
// +20000 energy - 1,000,000 - 10lvl

const boosterDetails: Record<
  BoosterTypes,
  {
    title: string;
    description: string;
    shortDescription?: string;
    image: string;
  }
> = {
  multi_tap: {
    title: "Multitap",
    description: "Increase the amount of coins you can earn per tap",
    shortDescription: "coins for tap",
    image: "/images/coin-2.png",
  },
  energy_limit: {
    title: "Energy limit",
    description: "Increase the amount of energy",
    shortDescription: "energy points",
    image: "/images/bolt.png",
  },
  full_energy: {
    title: "Full energy",
    description: "Recharge your energy to the maximum",
    image: "/images/extra-pewer.png",
  },
};

export default function Boost() {
  const [open, setOpen] = useState(false);
  const [activeBooster, setActiveBooster] = useState<BoosterTypes>("multi_tap");
  const { boosters, dailyResetEnergy, maxDailyResetEnergy, setDailyResetEnergy } = useStore();
  const { balance } = useUserStore();

  const canUseDailyResetEnergy = useMemo(
    () => dayjs().isAfter(dailyResetEnergy.next_available_at),
    [dailyResetEnergy.next_available_at]
  );

  const insufficientBalance = useMemo(() => {
    if (!boosters?.[activeBooster]?.cost) return false;
    return balance < boosters[activeBooster].cost;
  }, [balance, boosters, activeBooster]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyResetEnergy((prev) => ({
        ...prev,
        next_available_at: dayjs(prev.next_available_at).subtract(1, 'second').toISOString(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [setDailyResetEnergy]);

  const buyBoost = useMutation({
    mutationFn: (boost: BoosterTypes) =>
      boost !== "full_energy"
        ? $http.post("/clicker/buy-booster", { booster_type: boost })
        : $http.post("/clicker/use-daily-booster"),
    onSuccess: (response) => {
      toast.success(response.data.message);
      setOpen(false);

      if (activeBooster !== "full_energy") {
        useUserStore.setState({
          earn_per_tap: response.data.earn_per_tap,
          balance: response.data.balance,
          max_energy: response.data.max_energy,
        });

        useStore.setState((state) => {
          state.boosters[activeBooster].level += 1;
          const level = state.boosters[activeBooster].level;
          state.boosters[activeBooster].cost = 1000 * (level * (level + 1)) / 2;
          return state;
        });
      } else {
        useUserStore.setState({
          available_energy: response.data.current_energy,
        });
        useStore.setState((state) => {
          state.dailyResetEnergy.uses_today = response.data.daily_booster_uses;
          state.dailyResetEnergy.next_available_at =
            response.data.next_available_at;
          return state;
        });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Something went wrong"),
  });

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="min-h-[600px] w-full modal-body py-8 px-6">
        <h1 className="text-2xl font-bold text-center uppercase">
          Boost your game
        </h1>
        <p className="mt-8 text-sm font-bold text-center uppercase">
          Free Daily Booster
        </p>
        <div className="mt-4">
          <button
            className="flex items-center w-full gap-4 px-4 py-2 bg-white/10 rounded-xl"
            onClick={() => {
              setOpen(true);
              setActiveBooster("full_energy");
            }}
            disabled={!canUseDailyResetEnergy}
          >
            <img
              src="/images/extra-pewer.png"
              alt="extra-power"
              className="object-contain w-9 h-9 mix-blend-screen"
            />
            <div className="text-sm font-medium text-left">
              <p>Full energyyy</p>
              <p className={cn({ "text-white/80": !canUseDailyResetEnergy })}>
                {maxDailyResetEnergy - dailyResetEnergy.uses_today}/
                {maxDailyResetEnergy} available
              </p>
            </div>
            {!canUseDailyResetEnergy && (
              <div className="self-end h-full ml-auto text-sm text-white/80">
                <span>
                  {dayjs.duration(dayjs(dailyResetEnergy.next_available_at).diff(dayjs())).format("HH:mm:ss")} left
                </span>
              </div>
            )}
          </button>
        </div>
        <p className="mt-8 text-sm font-bold text-center uppercase">Boosters</p>
        <div className="mt-4 space-y-2">
          <button
            className="flex items-center w-full gap-4 px-4 py-2 bg-white/10 rounded-xl"
            onClick={() => {
              setOpen(true);
              setActiveBooster("multi_tap");
            }}
          >
            <img
              src="/images/coin-2.png"
              alt="coin-2"
              className="object-contain w-9 h-9 mix-blend-screen"
            />
            <div className="text-sm font-medium text-left">
              <p>Multi tap</p>
              <div className="flex items-center space-x-1">
                <img
                  src="/images/coin.png"
                  alt="coin"
                  className="object-contain w-5 h-5"
                />
                <span className="font-bold">
                  {compactNumber(boosters.multi_tap.cost)}
                </span>
                <span className="text-sm">{boosters.multi_tap.level} LVL</span>
              </div>
            </div>
          </button>
          <button
            className="flex items-center w-full gap-4 px-4 py-2 bg-white/10 rounded-xl"
            onClick={() => {
              setOpen(true);
              setActiveBooster("energy_limit");
            }}
          >
            <img
              src="/images/bolt.png"
              alt="bolt"
              className="object-contain w-9 h-9 mix-blend-screen"
            />
            <div className="text-sm font-medium text-left">
              <p>Energy limit</p>
              <div className="flex items-center space-x-1">
                <img
                  src="/images/coin.png"
                  alt="coin"
                  className="object-contain w-5 h-5"
                />
                <span className="font-bold">
                  {compactNumber(boosters.energy_limit.cost)}
                </span>
                <span className="text-sm">
                  {boosters.energy_limit.level} LVL
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="relative space-y-6">
          <h4 className="text-2xl font-bold text-center">
            {boosterDetails[activeBooster].title}
          </h4>
          <img
            src={boosterDetails[activeBooster].image}
            alt={activeBooster}
            className="object-contain w-24 h-24 mx-auto"
          />

          <div className="text-sm font-medium text-center">
            <p className="">{boosterDetails[activeBooster].description}</p>
            {activeBooster !== "full_energy" && (
              <p className="mt-2">
                +{compactNumber(boosters[activeBooster].increase_by)}{" "}
                {boosterDetails[activeBooster].shortDescription} for level{" "}
                {boosters[activeBooster].level}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-1">
            <Price level={"o"} type={"o"} d={"0"} className="text-lg text-white"
              amount={
                activeBooster !== "full_energy"
                  ? boosters[activeBooster].cost
                  : "Free"
              }
            />{" "}
            {activeBooster !== "full_energy" && (
              <span className="text-gray-500">
                • {boosters[activeBooster].level} lvl
              </span>
            )}
          </div>
          <Button
            className="w-full"
            onClick={() => buyBoost.mutate(activeBooster)}
            disabled={buyBoost.isPending || insufficientBalance}
          >
            {buyBoost.isPending && (
              <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
            )}
            {insufficientBalance ? "Insufficient Balance" : "Go Ahead"}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
