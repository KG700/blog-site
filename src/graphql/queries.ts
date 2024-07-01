/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const assistWithSummary = /* GraphQL */ `query AssistWithSummary($summary: String) {
  assistWithSummary(summary: $summary)
}
` as GeneratedQuery<
  APITypes.AssistWithSummaryQueryVariables,
  APITypes.AssistWithSummaryQuery
>;
export const getPost = /* GraphQL */ `query GetPost($id: ID!) {
  getPost(id: $id) {
    title
    summary
    content
    coverImage
    author
    publishedAt
    updatedAt
    status
    id
    createdAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPostQueryVariables, APITypes.GetPostQuery>;
export const listPosts = /* GraphQL */ `query ListPosts(
  $filter: ModelPostFilterInput
  $limit: Int
  $nextToken: String
) {
  listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      title
      summary
      content
      coverImage
      author
      publishedAt
      updatedAt
      status
      id
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListPostsQueryVariables, APITypes.ListPostsQuery>;
export const postsByStatusAndUpdatedAt = /* GraphQL */ `query PostsByStatusAndUpdatedAt(
  $status: String!
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPostFilterInput
  $limit: Int
  $nextToken: String
) {
  postsByStatusAndUpdatedAt(
    status: $status
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      title
      summary
      content
      coverImage
      author
      publishedAt
      updatedAt
      status
      id
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PostsByStatusAndUpdatedAtQueryVariables,
  APITypes.PostsByStatusAndUpdatedAtQuery
>;
