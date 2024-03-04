import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import success from "./files/success.json";

type LottieComponentProps = {
  file: "success" | "error" | "loading";
  loop?: boolean;
  height?: number;
  width?: number;
};

const LottieComponent = ({
  file,
  loop = false,
  height = 300,
  width = 300,
}: LottieComponentProps) => {
  const [animationData, setAnimationData] = useState(success); 

  useEffect(() => {
    switch (file) {
      case "success":
        setAnimationData(success);
        break;
      // case "error":
      //   import("./files/error.json").then((module) =>
      //     setAnimationData(module.default)
      //   );
      //   break;
      // case "loading":
      //   import("./files/loading.json").then((module) =>
      //     setAnimationData(module.default)
      //   );
      //   break;
      default:
        setAnimationData(success);
    }
  }, [file]);

  const defaultOptions = {
    loop,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default LottieComponent;
