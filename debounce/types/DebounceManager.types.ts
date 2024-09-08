import type * as types from "./index";
import ErrorManager from "../ErrorManager";

export type BaseDebounce = {
  /*
   * A unique identifier on the value passed into the DebounceManager. This is a minimum requirement.
   */
  id: string;
};

export type DebounceValue<T> = {
  /*
   * An internally generated id to uniquely identify each debounced value.
   */
  id: string;
  /*
   * The time remaining before the debounced value is executed or canceled.
   */
  timeout: NodeJS.Timeout | null;
  /*
   * The time the debounced value was created.
   */
  startTime: number;
  /*
   * The initial debounced value. Used to track the original value in a series of debounces.
   */
  initial: T;
  /*
   * The debounced value.
   */
  value: T;
  /*
   * The delay of the debounced
   */
  delay: number;
};

export interface IDebounceManager<T extends BaseDebounce> {
  /*
   * The delay of the debounced
   */
  readonly delay: number;
  /*
   * Error Manager.
   */
  error: ErrorManager;
  /*
   * The queue of all current debounced values.
   */
  queue: DebounceValue<T>[];
  /*
   * The initial values of all debounced values.
   */
  initialValues: DebounceValue<T>["value"][];
  /*
   * The callback to execute when a debounced value is executed.
   */
  callback: (execute: Callback<T>) => Promise<void> | void;
  /*
   * The callback to execute when a debounced value is canceled.
   */
  canceled?: (canceled: types.Canceled<T>) => void;
  /*
   * Used to Create a debounced value.
   */
  handleDebounce(current: T): void;
  /*
   * Get the reaminder of time when a debounced value is canceled. Used for Testing purposes.
   */
  getRemainder(debounceId: string): number;
}

export type Callback<T extends BaseDebounce> = {
  /*
   * The debounced value.
   */
  value: T;
  /*
   * The initial debounced value. Used to track the original value in a series of debounces.
   */
  initial: T;
};

/*
 * The constructor for the DebounceManager.
 */
export type DebounceManagerConstructor<T extends BaseDebounce> = Pick<
  IDebounceManager<T>,
  "delay" | "callback" | "canceled" | "error"
>;
