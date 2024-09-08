// @ts-nocheck
import { CacheQuery } from "@utils/CacheManager";

export enum ProjectQuery {
  HarnessTemplate = "templateHarness",
  User = "user",
  Harness = "harness",
}

export const projectQueries: Record<ProjectQuery, CacheQuery> = {
  [ProjectQuery.HarnessTemplate]: {
    id: "templateHarness",
    fragmentName: "getHarnessTemplateByIdCache",
    fragment: `
      fragment getHarnessTemplateByIdCache on templateHarness {
        id
        name
      }
    `,
  },
  [ProjectQuery.User]: {
    id: "user",
    fragmentName: "getUserByIdCache",
    fragment: `
      fragment getUserByIdCache on user {
        id
        username
        role
      }
    `,
  },
  [ProjectQuery.Harness]: {
    id: "harness",
    fragmentName: "getUserByIdCache",
    fragment: `
     fragment getHarnessById on harness {
        id
        order
        status
        openQty
        user {
          __typename
          id
          role
          username
        }
        template {
          __typename
          id
          name
        }
      }
    `,
  },
};
