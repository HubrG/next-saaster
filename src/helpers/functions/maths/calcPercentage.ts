import _ from "lodash";

export class PercentageCalculator {
  /**
   * This function calculates the percentage of a value in relation to a total value.
   * Example: If the value is 20 and the total is 100, the percentage is 20%.
   * @param value - The value to calculate the percentage
   * @param total - The total value
   * @returns The percentage of the value in relation to the total
   * @example
   * ```ts
   * const value = 20;
   * const total = 100;
   * const result = PercentageCalculator.calcPercentage(value, total);
   * console.log(result); // Output: 20
   * ```
   * */

  public calcPercentage(value: number, total: number): number {
    const numValue = _.toNumber(value);
    const numTotal = _.toNumber(total);
    if (numTotal === 0) return 0; // Évite la division par zéro
    return (numValue / numTotal) * 100;
  }

  /**
   * This function calculates the value of a percentage in relation to a total value.
   * Example: If the percentage is 20% and the total is 100, the value is 20.
   * @param percentage - The percentage to calculate the value
   * @param total - The total value
   * @returns The value of the percentage in relation to the total
   * @example
   * ```ts
   * const percentage = 20;
   * const total = 100;
   * const result = PercentageCalculator.calcValueFromPercentage(percentage, total);
   * console.log(result); // Output: 20
   * ```
   */
  public calcValueFromPercentage(percentage: number, total: number): number {
    const numPercentage = _.toNumber(percentage);
    const numTotal = _.toNumber(total);
    return (numPercentage / 100) * numTotal;
  }

  /**
   * This function increases a numeric value by adding a certain percentage of its own value.
   * @param value - The value to increase
   * @param percentage - The percentage to add to the value
   * @returns The value increased by the percentage
   * @example
   * ```ts
   * const value = 100;
   * const percentage = 10;
   * const result = PercentageCalculator.increaseValueByPercentage(value, percentage);
   * console.log(result); // Output: 110
   * ```
   */
  public increaseValueByPercentage(value: number, percentage: number): number {
    const numValue = _.toNumber(value);
    const numPercentage = _.toNumber(percentage);
    return numValue + this.calcValueFromPercentage(numPercentage, numValue);
  }

  /**
   * This function decreases a numeric value by subtracting a certain percentage of its own value.
   * @param value - The value to decrease
   * @param percentage - The percentage to subtract from the value
   * @returns The value decreased by the percentage
   * @example
   * ```ts
   * const value = 100;
   * const percentage = 10;
   * const result = PercentageCalculator.decreaseValueByPercentage(value, percentage);
   * console.log(result); // Output: 90
   * ```
   */
  public decreaseValueByPercentage(value: number, percentage: number): number {
    const numValue = _.toNumber(value);
    const numPercentage = _.toNumber(percentage);
    return numValue - this.calcValueFromPercentage(numPercentage, numValue);
  }

  /**
   * This function calculates the percentage change between an initial value and a final value.
   * Example: If the initial value is 100 and the final value is 150, the percentage change is 50%.
   * @param initialValue - The initial value
   * @param finalValue - The final value
   * @returns The percentage change between the initial value and the final value
   * @example
   * ```ts
   * const initialValue = 100;
   * const finalValue = 150;
   * const result = PercentageCalculator.calcPercentageChange(initialValue, finalValue);
   * console.log(result); // Output: 50
   * ```
   */
  public calcPercentageChange(
    initialValue: number,
    finalValue: number
  ): number {
    const numInitialValue = _.toNumber(initialValue);
    const numFinalValue = _.toNumber(finalValue);
    return this.calcPercentage(
      numFinalValue - numInitialValue,
      numInitialValue
    );
  }
}

export default PercentageCalculator;
