import { gql, useMutation, ApolloError } from '@apollo/client';
import {
  UpdateHarnessByIdMutation,
  UpdateHarnessByIdMutationVariables,
  HarnessSetInput,
} from '@graphql-types';

import { UseGetProjectByIdData } from '@graphql-queries/GetProjectById.Apollo.Query.Remote';

const UPDATE_HARNESS_BY_ID_MUTATION = gql`
  mutation UpdateHarnessById($set: harness_set_input, $keys: harness_pk_columns_input!) {
    updateHarnessById(_set: $set, pk_columns: $keys) {
      id
      order
      openQty
      template {
        id
        name
      }
      user {
        id
        username
        role
      }
    }
  }
`;

interface UseUpdateHarnessByIdHook {
  execute: (
    input: HarnessSetInput,
    optimisticResponse: UpdateHarnessByIdMutation,
  ) => Promise<UpdateHarnessByIdMutation['updateHarnessById']>;
  data?: UpdateHarnessByIdMutation | null;
  loading: boolean;
  error?: ApolloError;
}

export function useUpdateHarnessById(project: UseGetProjectByIdData): UseUpdateHarnessByIdHook {
  const [mutateFunction, { data, loading, error }] = useMutation<
    UpdateHarnessByIdMutation,
    UpdateHarnessByIdMutationVariables
  >(UPDATE_HARNESS_BY_ID_MUTATION, {
    onError: (error) => {
      console.error('Error during mutation:', error);

      /* If the mutation fails, call refetch on the entire Project */
      project.refetch();
    },
  });

  const execute = async (
    input: HarnessSetInput,
    optimisticResponse: UpdateHarnessByIdMutation,
  ): Promise<UpdateHarnessByIdMutation['updateHarnessById']> => {
    const { id, ...set } = input;

    const response = await mutateFunction({
      variables: {
        keys: {
          id: id!,
        },
        set: set,
      },
      optimisticResponse,
    });

    return response.data?.updateHarnessById;
  };

  return { execute, data, loading, error };
}

// import { useUpdateHarnessById } from '@graphql-mutations/UpdateHarnessById.Apollo.Mutation';
// const updateHarness = useUpdateHarnessById();
