/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { ReorderIcon } from "./Drag_icon";

interface Props {
  item: string;
}

export const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item[0]}
      dragListener={false}
      dragControls={dragControls}
    >
        <div className="max-w-2xl m-auto grid grid-cols-3 rounded-xl">
            <img id={item[0]} src={item[1]} alt={item[0] + " Image"} className="rounded-3xl w-28 p-2 m-auto" />
            <p className="m-auto font-semibold text-xl">{item[0]}</p>
            <div className="m-auto cursor-pointer">
                <ReorderIcon dragControls={dragControls} />
            </div>
        </div>
    </Reorder.Item>
  );
};
