// @ts-nocheck
import { Toast } from "primereact/toast";
import CacheManager from "@utils/CacheManager";
import ErrorManager from "@utils/ErrorManager";
import ProjectBuilder from "./Project.Builder";
import * as types from "@modules/project/types";
import { action, makeAutoObservable } from "mobx";
import * as guards from "@modules/project/types/Guards";
import { ProjectQuery as Query, projectQueries } from "./Cache.Query";
import DebounceManager, { Callback } from "@utils/debounce/DebounceManager";
import {
  ProjectMutation as Mutation,
  projectMutations,
} from "./Cache.Mutation";

type DebounceProject = {
  id: string;
  openQty: number;
  harness: types.Harness;
};

class Project {
  error: ErrorManager;
  build: ProjectBuilder;
  ctx: types.UseProjectContext | null;
  toast: React.RefObject<Toast> | null;
  cache: CacheManager<Query, Mutation>;
  debounce: DebounceManager<DebounceProject>;

  constructor() {
    this.ctx = null;
    this.toast = null;
    this.error = new ErrorManager();
    this.cache = new CacheManager(projectQueries, projectMutations);
    this.build = new ProjectBuilder(this.error);
    this.debounce = new DebounceManager<DebounceProject>({
      delay: 2000,
      error: this.error,
      callback: this.debounceProjectCallback,
    });

    makeObservable(this, {
      ctx: observable,
      toast: observable,
    });
  }

  @action
  handleTable = async (args: types.HandleTable): Promise<void> => {
    const optionHandlers: types.TableOperations = {
      template: {
        update: async ({ option: { value, row: harness } }) => {
          try {
            /* Query the cache for the new template */
            const optimisticTemplate: types.OptimisticTemplate["template"] =
              this.cache.query(Query.HarnessTemplate, value.template.id);

            /* Build a update harness object with template from cache */
            const harnessUpdate = this.build.harnessUpdate({
              harness,
              update: { template: optimisticTemplate },
            });

            /* Update the UI Optimistically & Update server */
            await this.handleHarnessPersist(harnessUpdate);
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An unexpected error occurred";
            this.error.create({
              name: "handleTable",
              message: `Error updating template: ${errorMessage}`,
            });
          }
        },
      },
      user: {
        update: async ({ option: { value, row: harness } }) => {
          try {
            const optimisticUser: types.OptimisticUser["user"] =
              this.cache.query(Query.User, value.user.id);

            const harnessUpdate = this.build.harnessUpdate({
              harness: harness,
              update: { user: optimisticUser },
            });

            await this.handleHarnessPersist(harnessUpdate);
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An unexpected error occurred";
            this.error.create({
              name: "handleTable",
              message: `Error updating user: ${errorMessage}`,
            });
          }
        },
      },
      openQty: {
        update: ({ option: { value, row: harness } }) => {
          try {
            /* Mutate the cache directly for responsive user feedback */
            this.cache.mutate(Mutation.Harness, harness.id, value.openQty);

            /* Debounce the openQty */
            this.debounce.handleDebounce({
              id: harness.id,
              openQty: value.openQty,
              harness: harness,
            });
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An unexpected error occurred";
            this.error.create({
              name: "handleTable",
              message: `Error updating open quantity: ${errorMessage}`,
            });
          }
        },
      },
      harness: {
        delete: async ({ option: { harness } }) => {
          try {
            await this.ctx?.delete.harness.execute(harness.id);

            await this.ctx?.refetch.project();
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An unexpected error occurred";
            this.error.create({
              name: "handleTable",
              message: `Error deleting harness: ${errorMessage}`,
            });
          }
        },
      },
    };

    switch (args.label) {
      case "user":
        if (guards.isUserUpdate(args)) {
          await optionHandlers.user.update(args);
        }
        break;
      case "template":
        if (guards.isTemplateUpdate(args)) {
          await optionHandlers.template.update(args);
        }
        break;
      case "openQty":
        if (guards.isOpenQtyUpdate(args)) {
          await optionHandlers.openQty.update(args);
        }
        break;
      case "harness":
        if (guards.isHarnessDelete(args)) {
          await optionHandlers.harness.delete(args);
        }
        break;
      default:
        this.error.create({
          name: "handleTable",
          message: "Invalid Label Provided",
        });
        break;
    }
  };

  debounceProjectCallback = async (
    callback: Callback<DebounceProject>
  ): Promise<void> => {
    try {
      if ("openQty" in callback.value) {
        /* Build a update harness object with debounced openQty */
        const harnessUpdate = this.build.harnessUpdate({
          harness: callback.value.harness,
          update: { openQty: callback.value.openQty },
        });

        /* Update the UI Optimistically & Update server */
        await this.handleHarnessPersist(harnessUpdate);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      this.error.create({
        name: "debounceProjectCallback",
        message: `Failed to handle debounce project callback: ${errorMessage}`,
      });
    }
  };

  handleHarnessPersist = async (
    harnessUpdate: types.Harness
  ): Promise<void> => {
    try {
      /* Build Optimistic Response Object */
      const optimisticResponse = this.build.optimisticResponse(harnessUpdate);

      /* Build Mutation Input Object */
      const mutationInput = this.build.mutationInput(harnessUpdate);

      /* Mutate server & execute optimistic update. onError: the Cache is rolled back & project refetch is called to sync with the server. */
      await this.ctx?.update.harness.execute(mutationInput, optimisticResponse);

      this.setToast({
        summary: "Updated",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      this.error.create({
        name: "handleHarnessPersist",
        message: `Failed to persist harness: ${errorMessage}`,
      });
    }
  };

  @action
  set = (
    ctx: types.UseProjectContext,
    toast: React.RefObject<Toast> | null
  ): void => {
    this.ctx = ctx;
    this.toast = toast;
  };

  @action
  setToast = ({
    severity = "info",
    summary,
    detail,
  }: types.ToastMessage): void => {
    this.toast?.current?.show({
      severity,
      summary,
      detail,
    });
  };
}

export default Project;
