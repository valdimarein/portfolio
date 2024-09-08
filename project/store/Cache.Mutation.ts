// @ts-nocheck
import { CacheMutation } from "@utils/CacheManager";

export enum ProjectMutation {
  Harness = "harness",
}

export const projectMutations: Record<ProjectMutation, CacheMutation> = {
  [ProjectMutation.Harness]: {
    id: "harness",
    fragmentName: "setOpenQtyOnHarness",
    fragment: `
      fragment setOpenQtyOnHarness on harness {
        openQty
      }
    `,
    data: (value) => {
      const data = {
        openQty: value,
        __typename: "harness",
      };

      return data;
    },
  },
};
