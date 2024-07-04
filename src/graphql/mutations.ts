/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAdminProfile = /* GraphQL */ `mutation CreateAdminProfile(
  $input: CreateAdminProfileInput!
  $condition: ModelAdminProfileConditionInput
) {
  createAdminProfile(input: $input, condition: $condition) {
    id
    displayName
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAdminProfileMutationVariables,
  APITypes.CreateAdminProfileMutation
>;
export const updateAdminProfile = /* GraphQL */ `mutation UpdateAdminProfile(
  $input: UpdateAdminProfileInput!
  $condition: ModelAdminProfileConditionInput
) {
  updateAdminProfile(input: $input, condition: $condition) {
    id
    displayName
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAdminProfileMutationVariables,
  APITypes.UpdateAdminProfileMutation
>;
export const deleteAdminProfile = /* GraphQL */ `mutation DeleteAdminProfile(
  $input: DeleteAdminProfileInput!
  $condition: ModelAdminProfileConditionInput
) {
  deleteAdminProfile(input: $input, condition: $condition) {
    id
    displayName
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAdminProfileMutationVariables,
  APITypes.DeleteAdminProfileMutation
>;
export const createPost = /* GraphQL */ `mutation CreatePost(
  $input: CreatePostInput!
  $condition: ModelPostConditionInput
) {
  createPost(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePostMutationVariables,
  APITypes.CreatePostMutation
>;
export const updatePost = /* GraphQL */ `mutation UpdatePost(
  $input: UpdatePostInput!
  $condition: ModelPostConditionInput
) {
  updatePost(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePostMutationVariables,
  APITypes.UpdatePostMutation
>;
export const deletePost = /* GraphQL */ `mutation DeletePost(
  $input: DeletePostInput!
  $condition: ModelPostConditionInput
) {
  deletePost(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePostMutationVariables,
  APITypes.DeletePostMutation
>;
