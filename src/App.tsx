import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect, useState } from "react";
import SplashScreen from "./components/partials/SplashScreen";
import FirstTimeScreen from "./components/partials/FirstTimeScreen";
import { $http, setBearerToken } from "./lib/http";
import { BoosterType, BoosterTypes, UserType } from "./types/UserType";
import { useUserStore } from "./store/user-store";
import { useStore } from "./store";
import PlayOnYourMobile from "./pages/PlayOnYourMobile";
import { toast } from "react-toastify";
import useTelegramInitData from "./hooks/useTelegramInitData";

const webApp = window.Telegram.WebApp;
const isDisktop = import.meta.env.DEV
  ? false
  : Telegram.WebApp.platform === "tdesktop";

function App() {
  const userStore = useUserStore();
  const { levels, levelUp } = useStore();
  const { user, start_param } = useTelegramInitData();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  useEffect(() => {
    webApp.setHeaderColor("#000");
    webApp.setBackgroundColor("#000");
    webApp.expand();

    return () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (token) {
        $http.post(
          "/logout",
          {}, // No body needed for logout
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
            },
          }
        )
          .then(() => {
            console.log("User logged out successfully");
          })
          .catch((error) => {
            console.error("Error logging out:", error);
          });
      } else {
        console.warn("No token found for logout request");
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      useUserStore.setState((state) => ({
        ...state, // Spread the existing state to ensure immutability
        balance: state.balance + state.production_per_hour / 3600,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userStore.balance || !userStore.level?.level) return;
    const userLevel = userStore.level.level;
    const newLevels = levels.filter(
      (level) => userStore.balance >= level.from_balance && level.level > userLevel
    );
    const maxLevel = newLevels.reduce(
      (prev, current) => (prev.level > current.level ? prev : current),
      newLevels[0]
    );
    if (
      userStore.level?.level &&
      maxLevel?.level &&
      maxLevel.level > userStore.level.level
    ) {
      useUserStore.setState((state) => {
        state.level = maxLevel;
        state.max_energy += newLevels.length * levelUp.max_energy;
        state.earn_per_tap += newLevels.length * levelUp.earn_per_tap;
        return state;
      });
      toast.success(`You have leveled up to level ${maxLevel.level}`);
    }
  }, [userStore.balance, levels]);

  useEffect(() => {
    if (!user) return () => { };
    const signIn = async () => {
      if (localStorage.getItem("token") === null) {
        const { data } = await $http.post<{
          token: string;
          first_login: boolean;
        }>("/auth/telegram-user", {
          telegram_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          username: user.username,
          referred_by: start_param,
        });
        setBearerToken(data.token);
        console.log(data);
        setIsFirstLoad(data.first_login);
      }
      const data = await $http.$get<
        {
          user: UserType;
          boosters: Record<BoosterTypes, BoosterType>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } & Record<string, any>
      >("/clicker/sync");
      useUserStore.setState({
        ...data.user,
      });
      useStore.setState({
        totalDailyRewards: data.total_daily_rewards,
        boosters: data.boosters,
        dailyResetEnergy: data.daily_booster,
        maxLevel: data.max_level,
        levels: data.levels,
        passive_earning: data.passive_earning,
        levelUp: data.level_up,
        referral: data.referral,
        totalReferals: data.total_referals,
      });
    };

    signIn().then(() => setShowSplashScreen(false));
  }, [user]);

  if (!user || isDisktop) return <PlayOnYourMobile />;

  if (showSplashScreen) return <SplashScreen />;

  if (isFirstLoad)
    return <FirstTimeScreen startGame={() => setIsFirstLoad(false)} />;

  return <RouterProvider router={router} />;
}

export default App;
