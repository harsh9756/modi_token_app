import React, { useEffect } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import CloseIcon from "../icons/CloseIcon";
import { useBlocker } from "react-router-dom";

export type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;

export default function Drawer({ children, ...props }: DrawerProps) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname && !!props.open
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      props.onOpenChange?.(false);
      blocker.reset();
    }
  }, [blocker.state]);

  return (
    <DrawerPrimitive.Root {...props}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0" />
        <DrawerPrimitive.Content className="fixed text-black bg-slate-300 mt-24 z-[99] rounded-t-[40px] bottom-0 left-0 right-0 ">
          <div className="overflow-y-auto modal-body max-h-[calc(100vh-6rem)]">
            <DrawerPrimitive.Close>
              <div className="absolute right-5 top-5 transition-all ">
                <CloseIcon className="text-black w-7 h-7" />
              </div>
            </DrawerPrimitive.Close>
            <DrawerPrimitive.Title className="invisible">
              Drawer
            </DrawerPrimitive.Title>
            <div className="px-6  py-12">{children}</div>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
