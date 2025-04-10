import { cn } from "@/lib/utils";
import React from "react";

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
  amount: number | string;
  level: number | string;
  type: string;
  d: string;
};

export default function Price({ amount, className, level=0, d, type, ...props }: Props) {
  let numericLevel = Number(level);
  let numericAmount = 0;
  if (amount !== "Free") {
    numericAmount = Number(amount);
  }
  let calculatedAmount: number | string = 0;
  // Calculate amount based on the type
  if (numericLevel > 0) {
    calculatedAmount = type === "a"
      ? numericAmount * Math.pow(2, numericLevel + 1) // Double the amount per level for type "a"
      : type === "p"
      ? numericAmount * Math.pow(1.25, numericLevel + 1) // Increase by 1.25 times per level for type "p"
      : numericAmount; // Default case if type isn't "a" or "p"
  } else {
    calculatedAmount = numericAmount;
  }
  if (amount === "Free") {
    calculatedAmount = "Free";
  }
  return (
    <div className={cn("flex items-center space-x-1 text-black", className)} {...props}>
      <img
        src="/images/coin.png"
        alt="coin"
        className="object-contain w-5 h-5"
      />
      <span className="font-bold">{type === "p" ? "+" : ""}{typeof calculatedAmount === "number" ? calculatedAmount.toLocaleString("en-US", { maximumFractionDigits: 3 }) : calculatedAmount}</span>
    </div>
  );
}