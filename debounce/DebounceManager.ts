import { v4 as uuidv4 } from "uuid";
import ErrorManager from "./ErrorManager";
import type * as types from "./types/index";

import type { Callback } from "./types/index";
export type { Callback };

/***************************************************************************
 * Notes:
 * - See IDebounceManager in the types file for information on class variables.
 *
 * Future development:
 * - A server-side logging system to ensure accurate state is reflected and persisted.
 * - Dynamic debounce strategies to optimize network requests for Real-Time functionalities in an Application designed for Teams.
 *
 * Possible improvements:
 * - Consolidate this.queue & this.initialValues into a single Map.
 *   - The Array lengths are small, so the performance gain would be minimal.
 *   - The Array's are possibly simpler / required when implementing dynamic debounce strategies.
 ***************************************************************************/

class DebounceManager<T extends types.BaseDebounce>
  implements types.IDebounceManager<T>
{
  error: ErrorManager;
  readonly delay: number;
  queue: types.DebounceValue<T>[];
  initialValues: types.DebounceValue<T>["value"][];
  canceled?: (canceled: types.Canceled<T>) => void;
  callback: (execute: types.Callback<T>) => Promise<void> | void;

  constructor({
    callback,
    canceled,
    delay,
    error,
  }: types.DebounceManagerConstructor<T>) {
    this.queue = [];
    this.delay = delay;
    this.error = error;
    this.initialValues = [];
    this.callback = callback;
    this.canceled = canceled;
  }

  public handleDebounce(current: T): void {
    if (!current || typeof current !== "object" || current.id === null) {
      return this.error.create({
        name: "handleDebounce",
        message:
          "Invalid input to handleDebounce: current must be an object with a non-null id.",
      });
    }

    /* The previous debounce needs to be canceled */
    this.cancelDebounce(current);

    this.createDebounce(current);
  }

  private cancelDebounce(current: T): void {
    this.queue.forEach((item) => {
      if (item.value.id === current.id && item.timeout) {
        /* Calculate the remainder this is used for testing  */
        const remainder = this.getRemainder(item.id);

        /* Canceled callback is used for testing purposes */
        if (this.canceled) {
          try {
            this.canceled({
              canceled: {
                id: item.value.id,
                value: item.value,
                remainder: remainder,
              },
            });
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An unexpected error occurred";
            return this.error.create({
              name: "cancelDebounce",
              message: `Error in canceled callback: ${errorMessage}`,
            });
          }
        }

        clearTimeout(item.timeout);
        item.timeout = null;
      }
    });
  }

  private createDebounce(current: T): void {
    const debounceId = uuidv4();

    const initialIndex = this.initialValues.findIndex(
      (item) => item.id === current.id
    );

    if (initialIndex === -1) {
      /* Push to initialValues if this is the first debounce in a series, to be used for all future debounces */
      this.initialValues.push({ ...current });
    }

    this.queue.push({
      id: debounceId,
      startTime: Date.now(),
      value: current,
      delay: this.delay,
      timeout: setTimeout(
        async () => await this.executeDebounce(debounceId),
        this.delay
      ),
      initial: this.initialValues.find((item) => item.id === current.id) || {
        ...current,
      },
    });
  }

  private async executeDebounce(debounceId: string): Promise<void> {
    const index = this.queue.findIndex((item) => item.id === debounceId);

    if (index === -1) {
      return this.error.create({
        name: "executeDebounce",
        message: "Debounce not found.",
      });
    }

    const debounce = this.queue[index];

    try {
      await this.callback({ value: debounce.value, initial: debounce.initial });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return this.error.create({
        name: "executeDebounce",
        message: `Error in callback: ${errorMessage}`,
      });
    }

    /* Remove the executed debounce from the queue */
    this.queue = this.queue.filter(
      (item) => item.value.id !== debounce.value.id
    );

    /* Remove the executed debounce from initialValues */
    this.initialValues = this.initialValues.filter(
      (item) => item.id !== debounce.value.id
    );
  }

  /* Calculate the remainder. Used for testing */
  getRemainder(debounceId: string): number {
    const item = this.queue.find((item) => item.id === debounceId);

    if (!item || !item.timeout) {
      this.error.create({
        name: "getRemainder",
        message: `Attempting to get remainder for non-existent or cleared debounce: ${debounceId}.`,
      });

      return 0;
    }

    const elapsed = Date.now() - item.startTime;

    return Math.max(item.delay - elapsed, 0);
  }
}

export default DebounceManager;
