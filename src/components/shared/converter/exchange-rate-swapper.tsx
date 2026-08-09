import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftRightIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";

import { Button } from "../../ui/button";
import { useSearchParams } from "react-router";

export default function ExchangeRateSwapper() {
  const [rotation, setRotation] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = () => {
    const sendQuery = searchParams.get("send");
    const receiveQuery = searchParams.get("receive");

    setSearchParams((searchParam) => {
      if (receiveQuery) searchParam.set("send", receiveQuery);
      if (sendQuery) searchParam.set("receive", sendQuery);

      return searchParam;
    });

    setRotation((prev) => prev + 180);
  };

  return (
    <Button size="icon-xl" intent="secondary" onClick={handleClick} className="shrink-0">
      <motion.span animate={{ rotate: rotation }} transition={{ duration: 0.3, ease: "easeInOut" }} className="inline-flex rotate-90 md:rotate-0">
        <HugeiconsIcon icon={ArrowLeftRightIcon} size={20} />
      </motion.span>
    </Button>
  );
}
