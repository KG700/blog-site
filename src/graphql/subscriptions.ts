/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAdminProfile = /* GraphQL */ `subscription OnCreateAdminProfile(
  $filter: ModelSubscriptionAdminProfileFilterInput
) {
  onCreateAdminProfile(filter: $filter) {
    id
    displayName
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAdminProfileSubscriptionVariables,
  APITypes.OnCreateAdminProfileSubscription
>;
export const onUpdateAdminProfile = /* GraphQL */ `subscription OnUpdateAdminProfile(
  $filter: ModelSubscriptionAdminProfileFilterInput
) {
  onUpdateAdminProfile(filter: $filter) {
    id
    displayName
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAdminProfileSubscriptionVariables,
  APITypes.OnUpdateAdminProfileSubscription
>;
export const onDeleteAdminProfile = /* GraphQL */ `subscription OnDeleteAdminProfile(
  $filter: ModelSubscriptionAdminProfileFilterInput
) {
  onDeleteAdminProfile(filter: $filter) {
    id
    displayName
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAdminProfileSubscriptionVariables,
  APITypes.OnDeleteAdminProfileSubscription
>;
export const onCreatePost = /* GraphQL */ `subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
  onCreatePost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePostSubscriptionVariables,
  APITypes.OnCreatePostSubscription
>;
export const onUpdatePost = /* GraphQL */ `subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
  onUpdatePost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePostSubscriptionVariables,
  APITypes.OnUpdatePostSubscription
>;
export const onDeletePost = /* GraphQL */ `subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
  onDeletePost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePostSubscriptionVariables,
  APITypes.OnDeletePostSubscription
>;
