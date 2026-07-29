import {ReactNode} from "react";
import { cn } from "@/lib/utils";


interface BadgeProps{
  children: ReactNode;
  className?: string;
}


export function Badge({
  children,
  className
}: BadgeProps){


return (

<span

className={cn(
  "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700",
  className
)}

>

{children}

</span>

);

}