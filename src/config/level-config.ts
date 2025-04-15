const levelConfig = {
  frogs: {
    1: "/images/levels/Lvl-1.png",
    2: "/images/levels/Lvl-2.png",
    3: "/images/levels/Lvl-3.png",
    4: "/images/levels/Lvl-4.png",
    5: "/images/levels/Lvl-5.png",
  } as Record<number, string>,

  filter: {
    1: "drop-shadow(0 0 64px rgba(209, 173, 255, 0.5))",
    2: "drop-shadow(0 0 64px rgba(209, 173, 255, 0.5))",
    3: "drop-shadow(0 0 64px rgba(209, 173, 255, 0.5))",
    4: "drop-shadow(0 0 64px rgba(209, 173, 255, 0.5))",
    5: "drop-shadow(0 0 64px rgba(209, 173, 255, 0.5))",
  } as Record<number, string>,

  bg: {
    1: "/images/levels/Frog-bg.gif",
    2: "/images/levels/Frog-bg.gif",
    3: "/images/levels/Frog-bg.gif",
    4: "/images/levels/Frog-bg.gif",
    5: "/images/levels/Frog-bg.gif",
  } as Record<number, string>,
};

export default levelConfig;
