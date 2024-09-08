import * as types from "./Index";

/* Strongly typed options for the Table Operations */
export type Selectors =
  | {
      type: "number";
      label: "openQty";
      operation: "update";
      placeholder: "Quantity";
      option: {
        value: {
          openQty: types.HarnessOpenQty;
        };
        row: types.Harness;
      };
    }
  | {
      type: "dropdown";
      label: "user";
      operation: "update";
      modifier: "username";
      placeholder: "Select a User";
      option: {
        value: {
          user: types.HarnessUser;
        };
        row: types.Harness;
      };
    }
  | {
      type: "dropdown";
      label: "template";
      operation: "update";
      modifier: "name";
      placeholder: "Select a Template";
      option: {
        value: {
          template: types.HarnessTemplate;
        };
        row: types.Harness;
      };
    }
  | {
      label: "harness";
      operation: "delete";
      option: {
        harness: types.Harness;
      };
    };

export type HandleTable = {
  /*
   * Option is the unique Cell data for each Handler.
   */
  option: Extract<Selectors, { option: {} }>["option"];
  /*
   * The type of input component for the Cell. (number, dropdown, etc.)
   */
  type?: Extract<Selectors, { type: string }>["type"];
  /*
   * The Field for the Cell on the Table.
   */
  label: Extract<Selectors, { label: string }>["label"];
  /*
   * Used to overwrite the name for the Handler if required.
   */
  modifier?: Extract<Selectors, { modifier: string }>["modifier"];
  /*
   *  The type of operation for the Cell. (update, delete, etc.)
   */
  operation: Extract<Selectors, { operation: string }>["operation"];
  /*
   * The placeholder for the input component for the Cell.
   */
  placeholder?: Extract<Selectors, { placeholder: string }>["placeholder"];
};

export type TableOperations = {
  user: {
    update: (args: Extract<Selectors, { label: "user" }>) => void;
  };
  template: {
    update: (args: Extract<Selectors, { label: "template" }>) => void;
  };
  openQty: {
    update: (args: Extract<Selectors, { label: "openQty" }>) => void;
  };
  harness: {
    delete: (args: Extract<Selectors, { label: "harness" }>) => void;
  };
};
