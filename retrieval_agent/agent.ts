import { z } from "zod";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { getModuleTemplate } from "./templates/generic";
import { prompts, focused, lookups, types } from "./prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getModuleDesignTemplate } from "./templates/generic";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

dotenv.config();

/* An API is required to run this example. */
const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) throw new Error(`Expected env var OPENAI_API_KEY`);

type Return = { input: string; output: string };

const moduleRetrievalAgent = async (input: string): Promise<Return> => {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.3,
    apiKey: openaiKey,
  });

  /* The LLM will generate an array of Queries defined in the schema when calling this Tool. */
  const query = new DynamicStructuredTool({
    name: "Query",
    description: "Used to Query a Type",
    schema: z.object({
      queries: z.array(
        z.object({
          id: z.string().describe("Id of the Type to Query"),
          __typename: z.string().describe("__typename of the Type to Query"),
        })
      ),
    }),
    /* A generated implementation could provide a unified GraphQL Resolver for all types without explicitly defining them. */
    func: async ({ queries }) => {
      const result = [];
      for (const { id, __typename } of queries) {
        switch (__typename) {
          case "ModuleTemplateLookUp":
            /* Simulate Call to API for ModuleTemplateLookUp. */
            const moduleTemplateData = getModuleTemplate(id);
            if (moduleTemplateData) {
              result.push(moduleTemplateData);
            }
            break;

          case "ModuleDesignLookUp":
            /* Simulate Call to API for ModuleDesignLookUp. */
            const moduleDesignData = getModuleDesignTemplate();
            if (moduleDesignData) {
              result.push(moduleDesignData);
            }
            break;

          default:
            return "This is not a valid Query type";
        }
      }

      return JSON.stringify(result);
    },
  });

  const tools = [query];

  /* Create an initial Prompt, the extended version is defined in file 'prompts.ts' and invoked below. */
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", prompts.system],
    ["human", prompts.human],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  /* Invoke the Agent and pass create the prompt. */
  const result = await agentExecutor.invoke({
    input: input,
    types: JSON.stringify(types),
    lookups: JSON.stringify(lookups),
    focused: JSON.stringify(focused),
  });

  return {
    input: result.input,
    output: result.output,
  };
};

export default moduleRetrievalAgent;
