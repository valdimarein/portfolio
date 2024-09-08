// @ts-nocheck
import { Row } from "@components/DataTable";
import { DropdownChangeEvent } from "primereact/dropdown";
import { InputNumberChangeEvent } from "primereact/inputnumber";

export type HandleOnChange = DropdownChangeEvent | InputNumberChangeEvent;

/* Extract the correct field from the Selector */
export type SelectorType<Selector> = Extract<
  Selector,
  { type: string }
>["type"];

export type SelectorLabel<Selector> = Extract<
  Selector,
  { label: string }
>["label"];

export type SelectorModifier<Selector> = Extract<
  Selector,
  { modifier: string }
>["modifier"];

export type SelectorOperation<Selector> = Extract<
  Selector,
  { operation: string }
>["operation"];

export type SelectorPlaceholder<Selector> = Extract<
  Selector,
  { placeholder: string }
>["placeholder"];

export type SelectorOptionValue<Selector> = Extract<
  Selector,
  { option: { value: { [key in SelectorLabel<Selector>]: {} } } }
>["option"]["value"];

export type SelectorOptionRow<Selector> = Row<
  Extract<Selector, { option: { row: {} } }>["option"]["row"]
>["original"];
