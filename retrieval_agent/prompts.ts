/* This is the shape of the prompt passed to the LLM. */
const prompts = {
  system: `
You are embeded in an application used to Design and Build Motorsport Wiring Harnesses.
`,
  human: `
<input>
  {input}
</input>

<context>
  {focused}
  {types}
  {lookups}
</context>
`,
};

/* This is the shape of the Focused type within the Application. This will change dynamically in response to User interactions. */
const focused = {
  harness: {
    __typeName: "Harness",
    module: {
      id: "0",
      __typeName: "ModuleDesignLookUp",
    },
  },
};

/* These are the type descriptions to guide the LLM when generating Queries. */
const types = [
  {
    types: "Module",
    description:
      "A Module represents a Control Unit operating in a Vehicle." +
      "A Module can be either a Engine Control Unit or Power Distribution Module.",
  },
  {
    types: "ModuleDesign",
    description:
      "A ModuleDesign represents a User instance of a Module related to the Design Tool within Application.",
  },
  {
    types: "ModuleDesignLookUp",
    description:
      "A ModuleDesignLookUp represents a summarised defintion of a ModuleDesign.",
  },
  {
    types: "ModuleTemplate",
    description:
      "A ModuleTemplate represents a static reuseable defintion of a Module. A ModuleTemplateLookUp is used to Query a ModuleTemplate ",
  },
  {
    types: "ModuleTemplateLookUp",
    description:
      "A ModuleTemplateLookUp represents a summarised defintion of a ModuleTemplate. ",
  },
];

/* This data would typically be queried and returned from a Vector store. */
const lookups = [
  {
    id: "1",
    __typename: "ModuleTemplateLookUp",
    tags: ["Generic", "GEN-1", "PDM", "Power Distribution Module"],
  },
  {
    id: "2",
    __typename: "ModuleTemplateLookUp",
    tags: ["Generic", "GEN-1", "ECU", "Engine Control Unit"],
  },
  {
    id: "3",
    __typename: "ModuleTemplateLookUp",
    tags: ["Generic", "GEN-2", "PDM", "Power Distribution Module"],
  },
  {
    id: "4",
    __typename: "ModuleTemplateLookUp",
    tags: ["Generic", "GEN-2", "ECU", "Engine Control Unit"],
  },
];

export { prompts, focused, lookups, types };
