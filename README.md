# Portfolio

[Click here to view the Application](https://v-einarsson.dev)

This Application is to aid in the Design & Build of Motorsport Wiring Harnesses.

A Wiring Harness can be represented as a Graph.

Nodes are: Modules, Branches & Devices. (Specification is defined using Templates)

Edges are: The distance between each Node in millimeters. (Distance is defined in the Design Route)

Using this data we can produce a Bill Of Materials with Work Instructions to Build.

## Debounce

This is the Debouncer currently used within the routes Plan & Design.

**This example will demonstrate a Utility that:**

- Debounces user input to optimize network requests.

- Contains a declarative Unit Test to support Test Driven Development.

**Future development of the Utility will support:**

- Dynamic debounce strategies to optimize network requests for Real-Time functionalities in an Application designed for Teams.

- A server-side logging system to ensure accurate state is reflected and persisted during beta.

**Note:** The Debouncer & associated Unit Test forgoes some simplicity to make allowances for future development.

## Project

**This example will demonstrate a Module that:**

- Is extendable and will serve as a code style for all Modules within the Application.

- Uses MobX State Management to provide integration with the GraphQL API and Optimistic UI updates.

- Uses Composition within the MobX Store to manage Debounce, Cache & Errors.

- Implements a strong type structure. Eg. The Generic type Selectors in the Column Component constrains the values for each Column.

## Retrieval Agent

The Application uses a type structure centered around reusable Templates (most types are subtypes of a Template type).

**This example will demonstrate a Prompt Engineering approach that:**

- Uses a vector store to produce queries for a relational database.

- Directs the LLM to query the appropriate types with consideration to the phrasing of user input.

- Outlines a structure that supports Graph RAG.

# Technologies and Tools

- **Client**

  - Next Js with App Router and Typescript.
  - Next Auth.
  - Apollo GraphQL client for WebSockets & HTTPS.

- **Drag & Drop Canvas**

  - FabricJS is currently used in the Design Route.
  - **Note:** Currently migrating away from FabricJS.
  - React Flow is a more suitable choice as nodes are treated as first-class React components. This works well with Component Streaming in the Vercel SDK.

- **UI Libaries**

  - PrimeReact is used for all UI components with the SASS API.
  - TanStack React Table is used for all Datatables.

- **State Management**

  - MobX with React Context.

- **AI**

  - LangGraph / LangChain is used with the OpenAi API.
  - Vercel AI SDK is used for streaming.

- **Databases**

  - Weviate with GraphQL is used as the vector store.
  - Postgres as the relational database.

- **Server**

  - Hasura is used as a remote schema. All GraphQL types are defined in Hasura.
  - Nexus imports GraphQL types from the remote schema. Custom resolvers can be defined here.
  - The remote Schema is stitched with the local schema using GraphQL tools.

- **Deployment & Testing**
  - Vercel
  - Jest Testing Library
