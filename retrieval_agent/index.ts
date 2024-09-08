import moduleRetrievalAgent from "./agent";

async function main() {
  const queries = [
    /* -----------------------------------------------------------------------------\\
     * The Module is located using the tags "Generic-1" "Engine Control Unit" in the LookUps in the prompts file. (This would be a Vector Store)
     * The __typename is ModuleTemplateLookUp with the id of "2". This is passed into the Query Tool to return the ModuleTemplate from the Realational Database
     * The LLM filters the data to resolve user input.
     */
    {
      input: "Which Pin is Sensor-Ground on the Generic-1 Engine Control Unit?",
      output:
        "The Sensor-Ground pin on the Generic-1 Engine Control Unit (ECU) is located at:" +
        "- Connector A: Pin 1" +
        "- Connector B: Pin 1",
    },
    /* -----------------------------------------------------------------------------\\
     * The input contains the word "Module" and phrase "on this Harness?"
     * The LLM should infer this realtes to a User specific instance of Module using the type definitions within the <context> of the prompt.
     * The Focused Harness is available within the <context> of the prompt. This Harness has a single ModuleDesignLookUp with the id of "0".
     * This is passed into the Query Tool to return the ModuleDesign from the Realational Database and resolve User input.
     */
    {
      input: "Can you show me the Module on this Harness?",
      output:
        "Module Details" +
        "" +
        "Connectors:" +
        "" +
        "Connector A" +
        "- Pin 1: SENSOR-GROUND" +
        "- Pin 2: AVI 4" +
        "...more pins" +
        "Connector B" +
        "- Pin 1: SENSOR-GROUND" +
        "- Pin 2: AVI 4" +
        "...more pins",
    },
  ];

  for (const query of queries) {
    const result = await moduleRetrievalAgent(query.input);

    console.log({
      input: result.input,
      output: result.output,
    });
  }
}

main();
