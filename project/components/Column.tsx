// @ts-ignore
import React from "react";
// @ts-ignore
import Number from "./number";
// @ts-ignore
import Dropdown from "./dropdown";
// @ts-ignore
import * as types from "@modules/project/types";

/* 
 This is a strongly typed Column component.
 
 The Generic type Selector constrains the values for each Column.

 Usage is in getHarnessColumns.tsx

 Note: The Selectors union type can be thought of a bit like an Array of Objects. 
*/

export type ColumnInput<Selector> = {
  type: types.SelectorType<Selector>;
  label: types.SelectorLabel<Selector>;
  modifier?: types.SelectorModifier<Selector>;
  operation: types.SelectorOperation<Selector>;
  placeholder: types.SelectorPlaceholder<Selector>;
  option: {
    row: types.SelectorOptionRow<Selector>;
    value: types.SelectorOptionValue<Selector>;
  };
};

interface ColumnProps<Selector> {
  uniqueId: string;
  type: types.SelectorType<Selector>;
  row: types.SelectorOptionRow<Selector>;
  optionLabel: types.SelectorLabel<Selector>;
  placeholder: types.SelectorPlaceholder<Selector>;
  optionModifier?: types.SelectorModifier<Selector>;
  optionOperation: types.SelectorOperation<Selector>;
  handleOnChange: (args: ColumnInput<Selector>) => void;
  value: types.SelectorOptionValue<Selector>[types.SelectorLabel<Selector>];
  options?: types.SelectorOptionValue<Selector>[types.SelectorLabel<Selector>][];
}

const Column = <Selector,>({
  row,
  type,
  value,
  options,
  uniqueId,
  optionLabel,
  placeholder,
  optionModifier,
  handleOnChange,
  optionOperation,
}: ColumnProps<Selector>) => {
  const handleChange = (e: types.HandleOnChange) => {
    handleOnChange({
      type,
      label: optionLabel,
      modifier: optionModifier,
      placeholder,
      operation: optionOperation,
      option: {
        value: {
          [optionLabel]: e.value,
        } as types.SelectorOptionValue<Selector>,
        row,
      },
    });
  };

  switch (type) {
    case "dropdown":
      if (options && Array.isArray(options)) {
        return (
          <Dropdown
            value={value}
            options={options}
            uniqueId={uniqueId}
            optionLabel={optionModifier ?? optionLabel}
            placeholder={placeholder}
            handleChange={handleChange}
          />
        );
      } else {
        throw new Error(
          "An Options array must be provided for a dropdown input."
        );
      }

    case "number":
      if (typeof value === "number") {
        return (
          <Number
            value={value}
            handleChange={handleChange}
            placeholder={placeholder}
            uniqueId={uniqueId}
          />
        );
      } else {
        throw new Error("Value must be of type number for a number input.");
      }

    default:
      throw new Error("Invalid type");
  }
};

export default Column;
