import type * as types from "../types/index";

export function validateState<T extends types.BaseDebounce>(
  manager: types.DebounceManager<T>,
  args: types.Mocks<T>,
  config: types.Config
) {
  expect({
    queue: {
      value: validateQueue(manager.queue, config, args.state?.queue),
      length: manager.queue.length,
    },
    initialValues: {
      value: manager.initialValues,
      length: manager.initialValues.length,
    },
  }).toEqual({
    queue: {
      value: true,
      length: args.state?.queue.length,
    },
    initialValues: {
      value: args.state?.initialValues,
      length: args.state?.initialValues.length,
    },
  });
}

function validateQueue<T extends types.BaseDebounce>(
  queue: types.DebounceManager<T>["queue"],
  config: types.Config,
  state?: types.State<T>["queue"]
): boolean {
  for (let index = 0; index < queue.length; index++) {
    try {
      expect({
        value: queue[index].value,
        initial: queue[index].initial,
      }).toEqual({
        value: state && state[index].value,
        initial: state && state[index].initial,
      });

      expect(typeof queue[index].id).toBe("string");
      expect(queue[index].delay).toEqual(config.delay);
      expect(new Date(queue[index].startTime).toString()).not.toBe(
        "Invalid Date"
      );

      expect(
        queue[index].timeout === null ||
          typeof queue[index].timeout === "object"
      ).toBe(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(`Validation failed at index ${index}: ${errorMessage}`);
    }
  }

  return true;
}
