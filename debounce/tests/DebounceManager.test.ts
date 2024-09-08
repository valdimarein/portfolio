import getMocks from "./getMocks";
import ErrorManager from "../ErrorManager";
import { isValidTime } from "../types/guards";
import { validateState } from "./validateState";
import DebounceManager from "../DebounceManager";
import type * as types from "../types/index";

/*     
New Cases: 
  - An input is focused and unfocused without a user changing the value. (should not trigger a callback)
*/

function main() {
  /* Test using a number as the debounced value. */
  const config: types.Config = {
    id: "1000",
    delay: 100,
  };

  const { mocks, expected } = getMocks(config);

  const { output } = testDebounce<types.NumberTest>({
    config: config,
    mocks: mocks,
    expected: expected,
    callback: async (execute: types.Callback<types.NumberTest>) => {
      output.callbacks.push({
        value: execute.value,
        initial: execute.initial,
      });
    },
    canceled: ({ canceled }: types.Canceled<types.NumberTest>) => {
      output.canceled.push({
        id: canceled.id,
        value: canceled.value,
        remainder: canceled.remainder,
      });
    },
  });

  /* More Configs, Mocks & testDebounce function calls can be made here for different debounce cases */
}

main();

interface TestParams<T extends types.BaseDebounce> {
  config: types.Config;
  mocks: types.Mocks<T>[];
  expected: types.Expected<T>;
  callback: (execute: types.Callback<T>) => Promise<void>;
  canceled: (canceled: types.Canceled<T>) => void;
}

function testDebounce<T extends types.BaseDebounce>({
  mocks,
  config,
  callback,
  expected,
  canceled,
}: TestParams<T>) {
  /* Output callback arrays to assert an expected state in final state test  */
  const output: types.Output<T> = {
    callbacks: [],
    canceled: [],
  };

  describe("DebounceManager", () => {
    const manager = new DebounceManager<T>({
      delay: config.delay,
      callback: callback,
      canceled: canceled,
      error: new ErrorManager(),
    });

    /*
     * Test 1: Validate initial state
     * Test 2: Validate new debounce values
     * Test 3: Validate cancel values
     * Test 4: Validate callback values
     * Test 5: Validate final state
     */

    /* This Object will support calling tests in any order to handle intricate debounce cases  */
    const test: types.Tests<T> = {
      "1": {
        test: (args) =>
          it("should validate initial state", () => {
            validateState(manager, args, config);
          }),
      },
      "2": {
        test: (args) =>
          it("should validate new debounce values", () => {
            manager.handleDebounce(args.value);

            if (isValidTime(args)) {
              jest.advanceTimersByTime(args.time.hold);
            }

            validateState(manager, args, config);
          }),
      },
      "3": {
        test: (args) =>
          it("should validate cancel values", () => {
            manager.handleDebounce(args.value);

            if (isValidTime(args)) {
              jest.advanceTimersByTime(args.time.hold);
            }

            validateState(manager, args, config);
          }),
      },
      "4": {
        test: (args) =>
          it("should validate callback values", () => {
            manager.handleDebounce(args.value);

            validateState(manager, args, config);

            if (isValidTime(args)) {
              jest.advanceTimersByTime(args.time.hold);
            }
          }),
      },
      "5": {
        test: (args) =>
          it("should validate the final state", () => {
            validateState(manager, args, config);

            expect(output).toEqual(expected);

            output.callbacks = [];
            output.canceled = [];

            jest.advanceTimersByTime(100);
          }),
      },
    };

    /* Iterate over mocks and call the test by id  */
    mocks.forEach((mock) => {
      switch (mock.id) {
        case "1":
          test["1"].test(mock as types.Initial<T>);
          break;
        case "2":
          test["2"].test(mock as types.NewDebounce<T>);
          break;
        case "3":
          test["3"].test(mock as types.CancelDebounce<T>);
          break;
        case "4":
          test["4"].test(mock as types.CallbackDebounce<T>);
          break;
        case "5":
          test["5"].test(mock as types.Final<T>);
          break;
        default:
          throw new Error(`Invalid Mock Id.`);
      }
    });
  });

  return { output };
}
