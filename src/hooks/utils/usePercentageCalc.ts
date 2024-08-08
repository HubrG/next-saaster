import _ from "lodash";
import { useMemo } from "react";

export const usePercentageCalculator = () => {
  // Memoize the functions to avoid unnecessary re-calculations
  const calcPercentage = useMemo(() => {
    return (value: number, total: number): number => {
      const numValue = _.toNumber(value);
      const numTotal = _.toNumber(total);
      if (numTotal === 0) return 0; // Avoid division by zero
      return (numValue / numTotal) * 100;
    };
  }, []);

  const calcValueFromPercentage = useMemo(() => {
    return (percentage: number, total: number): number => {
      const numPercentage = _.toNumber(percentage);
      const numTotal = _.toNumber(total);
      return (numPercentage / 100) * numTotal;
    };
  }, []);

  const increaseValueByPercentage = useMemo(() => {
    return (value: number, percentage: number): number => {
      const numValue = _.toNumber(value);
      const numPercentage = _.toNumber(percentage);
      return numValue + calcValueFromPercentage(numPercentage, numValue);
    };
  }, [calcValueFromPercentage]);

  const decreaseValueByPercentage = useMemo(() => {
    return (value: number, percentage: number): number => {
      const numValue = _.toNumber(value);
      const numPercentage = _.toNumber(percentage);
      return numValue - calcValueFromPercentage(numPercentage, numValue);
    };
  }, [calcValueFromPercentage]);

  const calcPercentageChange = useMemo(() => {
    return (initialValue: number, finalValue: number): number => {
      const numInitialValue = _.toNumber(initialValue);
      const numFinalValue = _.toNumber(finalValue);
      return calcPercentage(numFinalValue - numInitialValue, numInitialValue);
    };
  }, [calcPercentage]);

  return {
    calcPercentage,
    calcValueFromPercentage,
    increaseValueByPercentage,
    decreaseValueByPercentage,
    calcPercentageChange,
  };
};
