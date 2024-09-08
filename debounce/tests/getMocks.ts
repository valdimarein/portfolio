import type * as types from "../types/index";

function getMocks(config: types.Config): {
  mocks: types.Mocks<types.NumberTest>[];
  expected: types.Expected<types.NumberTest>;
} {
  const initialState: types.Initial<types.NumberTest> = {
    id: "1",
    state: null,
  };

  initialState.state = {
    queue: [],
    initialValues: [],
  };

  //--------------------------------------------------------------------------------------------------------//

  const firstIteration: types.NewDebounce<types.NumberTest> = {
    id: "2",
    value: {
      id: "1000",
      number: 1,
    },
    state: null,
    time: null,
  };

  firstIteration.state = {
    queue: [
      {
        delay: config.delay,
        value: firstIteration.value,
        initial: firstIteration.value,
      },
    ],
    initialValues: [firstIteration.value],
  };

  firstIteration.time = {
    hold: 90,
    remainder: config.delay - 90,
  };

  //--------------------------------------------------------------------------------------------------------//

  const secondIteration: types.CancelDebounce<types.NumberTest> = {
    id: "3",
    value: {
      id: "1000",
      number: 2,
    },
    state: null,
    time: null,
  };

  secondIteration.state = {
    queue: [
      {
        delay: config.delay,
        value: firstIteration.value,
        initial: firstIteration.value,
      },
      {
        delay: config.delay,
        value: secondIteration.value,
        initial: firstIteration.value,
      },
    ],
    initialValues: [firstIteration.value],
  };

  secondIteration.time = {
    hold: 90,
    remainder: config.delay - 90,
  };

  //--------------------------------------------------------------------------------------------------------//

  const thirdIteration: types.CallbackDebounce<types.NumberTest> = {
    id: "4",
    value: {
      id: "1000",
      number: 3,
    },
    state: null,
    time: null,
  };

  thirdIteration.state = {
    queue: [
      {
        delay: config.delay,
        value: firstIteration.value,
        initial: firstIteration.value,
      },
      {
        delay: config.delay,
        value: secondIteration.value,
        initial: firstIteration.value,
      },
      {
        delay: config.delay,
        value: thirdIteration.value,
        initial: firstIteration.value,
      },
    ],
    initialValues: [firstIteration.value],
  };

  thirdIteration.time = {
    hold: 101,
    remainder: config.delay - 101,
  };

  //--------------------------------------------------------------------------------------------------------//

  const finalState: types.Final<types.NumberTest> = {
    id: "5",
    state: null,
  };

  finalState.state = {
    queue: [],
    initialValues: [],
  };

  const expected: types.Expected<types.NumberTest> = {
    callbacks: [
      {
        value: thirdIteration.value,
        initial: firstIteration.value,
      },
    ],
    canceled: [
      {
        id: firstIteration.value.id,
        value: firstIteration.value,
        remainder: firstIteration.time.remainder,
      },
      {
        id: secondIteration.value.id,
        value: secondIteration.value,
        remainder: secondIteration.time.remainder,
      },
    ],
  };

  return {
    expected: expected,
    mocks: [
      initialState,
      firstIteration,
      secondIteration,
      thirdIteration,
      finalState,
      initialState,
      firstIteration,
      secondIteration,
      thirdIteration,
      finalState,
    ],
  };
}

export default getMocks;
