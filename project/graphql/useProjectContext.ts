// @ts-nocheck
import { Session } from "@types-common/session.types";
import { useCurrentHarnessContext } from "@hooks/useCurrentHarnessContext";
import { useGetUsers } from "@graphql-queries/GetUsers.Apollo.Query.Remote";
import { useCreateHarness } from "@graphql-mutations/CreateHarness.Apollo.Mutation.Remote";
import { useDeleteHarnessById } from "@graphql-mutations/DeleteHarnessById.Apollo.Mutation";
import { useUpdateHarnessById } from "@graphql-mutations/UpdateHarnessById.Apollo.Mutation";
import { useGetTemplateHarnesses } from "@graphql-queries/GetTemplateHarnesses.Apollo.Query.Remote";

/* Consolidate GraphQL Query & Mutation Hooks into single context */
export const useProjectContext = (
  session: Session,
  projectId: string | undefined
) => {
  const { user, project, updateUserStatus } = useCurrentHarnessContext(
    session,
    projectId
  );

  const users = useGetUsers();

  const createHarness = useCreateHarness();

  const deleteHarness = useDeleteHarnessById();

  const updateHarness = useUpdateHarnessById(project);

  const templateHarnesses = useGetTemplateHarnesses();

  return {
    userId: session.user.id,
    userStatusId: user.data?.status?.id,
    projectId: projectId,
    session: session,
    data: {
      project: project.data,
      users: users.data,
      harnesses: project.data?.harnesses,
      templateHarnesses: templateHarnesses.data,
      userHarness: user.data?.status,
    },
    refetch: {
      project: project.refetch,
      harnesses: project.refetch,
      users: users.refetch,
      userHarness: user.refetch,
    },
    create: {
      harness: {
        execute: createHarness.execute,
        loading: createHarness.loading,
        error: createHarness.error,
        data: createHarness.data,
      },
    },
    update: {
      harness: {
        execute: updateHarness.execute,
        loading: updateHarness.loading,
        error: updateHarness.error,
        data: updateHarness.data,
      },
      userHarness: {
        execute: updateUserStatus.execute,
      },
    },
    delete: {
      harness: {
        execute: deleteHarness.execute,
        loading: deleteHarness.loading,
        error: deleteHarness.error,
        data: deleteHarness.data,
      },
    },
    loading: {
      states: [project.loading, users.loading, templateHarnesses.loading],
      errors: [project.error, users.error, templateHarnesses.error],
    },
  };
};
