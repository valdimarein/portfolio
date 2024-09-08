// @ts-nocheck
import ErrorManager from "@utils/ErrorManager";
import * as types from "@modules/project/types";

type HarnessUpdateMethod = {
  harness: types.Harness;
  update:
    | types.OptimisticUser
    | types.OptimisticTemplate
    | types.OptimisticOpenQty;
};

/* Class of Builder methods used within the Project Store */
class ProjectBuilder {
  error: ErrorManager;

  constructor(errorManager: ErrorManager) {
    this.error = errorManager;
  }

  harnessUpdate = ({ harness, update }: HarnessUpdateMethod): types.Harness => {
    try {
      const updatedHarness = { ...harness };

      Object.keys(update).forEach((key) => {
        const harnessKey = key as keyof typeof update;
        if (harnessKey in harness) {
          updatedHarness[harnessKey as keyof types.Harness] =
            update[harnessKey];
        }
      });

      return updatedHarness;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      this.error.create({
        name: "ProjectBuilder",
        message: `Failed to update harness: ${errorMessage}`,
      });

      throw error;
    }
  };

  mutationInput = (harnessUpdate: types.Harness): types.HarnessSetInput => {
    try {
      const mutationInput: types.HarnessSetInput = {
        id: harnessUpdate.id,
        order: harnessUpdate.order,
        openQty: harnessUpdate.openQty,
        userId: harnessUpdate.user.id,
        templateId: harnessUpdate.template.id,
      };

      return mutationInput;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      this.error.create({
        name: "ProjectBuilder",
        message: `Failed to create mutation input: ${errorMessage}`,
      });

      throw error;
    }
  };

  optimisticResponse = (
    harnessUpdate: types.Harness
  ): types.OptimisticResponse => {
    try {
      const { id, order, openQty, template, user } = harnessUpdate;

      const optimisticResponse = {
        __typename: "Mutation" as const,
        updateHarnessById: {
          __typename: "harness" as const,
          id: id,
          order: order,
          openQty: openQty,
          template: {
            __typename: "templateHarness" as const,
            id: template.id,
            name: template.name,
          },
          user: {
            __typename: "user" as const,
            id: user.id,
            username: user.username,
            role: user.role,
          },
        },
      };

      return optimisticResponse;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      this.error.create({
        name: "ProjectBuilder",
        message: `Failed to create optimistic response: ${errorMessage}`,
      });

      throw error;
    }
  };
}

export default ProjectBuilder;
