import type * as types from "./index";
import DebounceManager from "../DebounceManager";
export type { DebounceManager as DebounceManager };

/*
 * A Test that uses a number as the debounced value.
 */
export type NumberTest = types.BaseDebounce & {
  number: number;
};

export type Config = {
  id: string;
  delay: number;
};

/*
 * Types to validate the output of each Test.
 */
export type Output<T> = {
  callbacks: {
    value: T;
    initial: T;
  }[];
  canceled: {
    id: Canceled<T>["canceled"]["id"];
    value: Canceled<T>["canceled"]["value"];
    remainder: Canceled<T>["canceled"]["remainder"];
  }[];
};

export type Expected<T> = {
  callbacks: {
    value: T;
    initial: T;
  }[];
  canceled: {
    id: Canceled<T>["canceled"]["id"];
    value: Canceled<T>["canceled"]["value"];
    remainder: Canceled<T>["canceled"]["remainder"];
  }[];
};

export type Canceled<T> = {
  canceled: {
    id: string;
    value: T;
    remainder: number;
  };
};

/*
 * Types to create Mock data for each Test.
 */
export type State<T> = {
  queue: {
    delay: number;
    value: T;
    initial: T;
  }[];
  initialValues: T[];
};

export type Time = {
  hold: number;
  remainder: number;
};

export type Initial<T> = {
  id: "1";
  state: State<T> | null;
};

export type NewDebounce<T> = {
  id: "2";
  value: T;
  state: State<T> | null;
  time: Time | null;
};

export type CancelDebounce<T> = {
  id: "3";
  value: T;
  state: State<T> | null;
  time: Time | null;
};

export type CallbackDebounce<T> = {
  id: "4";
  value: T;
  state: State<T> | null;
  time: Time | null;
};

export type Final<T> = {
  id: "5";
  state: State<T> | null;
};

export type Mocks<T> =
  | Initial<T>
  | NewDebounce<T>
  | CancelDebounce<T>
  | CallbackDebounce<T>
  | Final<T>;

type Test<T> = {
  test: (args: T) => void;
};

export type Tests<T> = {
  [K in Mocks<T> as K["id"]]: Test<K>;
};
