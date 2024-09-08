/* Generated with graphql-codegen */
export type Project = {
  __typename: 'Query';
  getProjectById: {
    __typename: 'project';
    id: string;
    name: string;
    harnesses: Array<{
      __typename: 'harness';
      id: string;
      order: number;
      openQty: number;
      user: { __typename?: 'user'; id: string; role: string; username: string };
      template: { __typename?: 'templateHarness'; id: string; name: string };
    }>;
  };
};

export type Harness = Project['getProjectById']['harnesses'][number];

export type HarnessOpenQty = Harness['openQty'];

export type HarnessUser = Harness['user'];

export type HarnessTemplate = Harness['template'];

export type OptimisticOpenQty = { openQty: HarnessOpenQty };

export type OptimisticUser = { user: HarnessUser };

export type OptimisticTemplate = { template: HarnessTemplate };

/* Generated with graphql-codegen */
export type HarnessSetInput = {
  id: string;
  order: number;
  openQty: number;
  userId: string;
  templateId: string;
};

export type OptimisticResponse = {
  __typename: 'Mutation';
  updateHarnessById: Harness;
};
