// @ts-nocheck
import { gql, useQuery, ApolloError, ApolloQueryResult } from "@apollo/client";
import {
  GetProjectByIdQuery,
  GetProjectByIdQueryVariables,
} from "@graphql-types";

const GET_PROJECT_BY_ID = gql`
  query GetProjectById($projectId: uuid!) {
    getProjectById(id: $projectId) {
      id
      name
      harnesses {
        id
        order
        status
        designId
        openQty
        user {
          id
          role
          username
        }
        template {
          id
          name
        }
      }
    }
  }
`;

/* Return type of useGetProjectById */
type UseGetProjectByIdData = {
  data: GetProjectByIdQuery["getProjectById"] | undefined;
  error: ApolloError | undefined;
  loading: boolean;
  start: (pollInterval: number) => void;
  stop: () => void;
  refetch: (
    variables?: GetProjectByIdQueryVariables
  ) => Promise<ApolloQueryResult<GetProjectByIdQuery>>;
};

export function useGetProjectById(
  id: string | undefined
): UseGetProjectByIdData {
  const { loading, error, data, startPolling, stopPolling, refetch } = useQuery<
    GetProjectByIdQuery,
    GetProjectByIdQueryVariables
  >(GET_PROJECT_BY_ID, {
    variables: {
      projectId: id!,
    },
    skip: !id,
  });

  return {
    loading,
    error,
    data: data?.getProjectById,
    start: startPolling,
    stop: stopPolling,
    refetch,
  };
}

// import { useGetProjectById } from '@graphql-queries/GetProjectById.Apollo.Query';
// const project = useGetProjectById('projectId');
