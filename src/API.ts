/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePostInput = {
  title: string,
  summary?: string | null,
  content: string,
  coverImage?: string | null,
  author?: string | null,
  isPublished?: boolean | null,
  publishedAt?: string | null,
  id?: string | null,
};

export type ModelPostConditionInput = {
  title?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  content?: ModelStringInput | null,
  coverImage?: ModelStringInput | null,
  author?: ModelStringInput | null,
  isPublished?: ModelBooleanInput | null,
  publishedAt?: ModelStringInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Post = {
  __typename: "Post",
  title: string,
  summary?: string | null,
  content: string,
  coverImage?: string | null,
  author?: string | null,
  isPublished?: boolean | null,
  publishedAt?: string | null,
  id: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePostInput = {
  title?: string | null,
  summary?: string | null,
  content?: string | null,
  coverImage?: string | null,
  author?: string | null,
  isPublished?: boolean | null,
  publishedAt?: string | null,
  id: string,
};

export type DeletePostInput = {
  id: string,
};

export type ModelPostFilterInput = {
  title?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  content?: ModelStringInput | null,
  coverImage?: ModelStringInput | null,
  author?: ModelStringInput | null,
  isPublished?: ModelBooleanInput | null,
  publishedAt?: ModelStringInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
};

export type ModelPostConnection = {
  __typename: "ModelPostConnection",
  items:  Array<Post | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionPostFilterInput = {
  title?: ModelSubscriptionStringInput | null,
  summary?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  coverImage?: ModelSubscriptionStringInput | null,
  author?: ModelSubscriptionStringInput | null,
  isPublished?: ModelSubscriptionBooleanInput | null,
  publishedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPostFilterInput | null > | null,
  or?: Array< ModelSubscriptionPostFilterInput | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type CreatePostMutation = {
  createPost?:  {
    __typename: "Post",
    title: string,
    summary?: string | null,
    content: string,
    coverImage?: string | null,
    author?: string | null,
    isPublished?: boolean | null,
    publishedAt?: string | null,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type UpdatePostMutation = {
  updatePost?:  {
    __typename: "Post",
    title: string,
    summary?: string | null,
    content: string,
    coverImage?: string | null,
    author?: string | null,
    isPublished?: boolean | null,
    publishedAt?: string | null,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePostMutationVariables = {
  input: DeletePostInput,
  condition?: ModelPostConditionInput | null,
};

export type DeletePostMutation = {
  deletePost?:  {
    __typename: "Post",
    title: string,
    summary?: string | null,
    content: string,
    coverImage?: string | null,
    author?: string | null,
    isPublished?: boolean | null,
    publishedAt?: string | null,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type AssistWithSummaryQueryVariables = {
  summary?: string | null,
};

export type AssistWithSummaryQuery = {
  assistWithSummary?: string | null,
};

export type GetPostQueryVariables = {
  id: string,
};

export type GetPostQuery = {
  getPost?:  {
    __typename: "Post",
    title: string,
    summary?: string | null,
    content: string,
    coverImage?: string | null,
    author?: string | null,
    isPublished?: boolean | null,
    publishedAt?: string | null,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsQuery = {
  listPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      title: string,
      summary?: string | null,
      content: string,
      coverImage?: string | null,
      author?: string | null,
      isPublished?: boolean | null,
      publishedAt?: string | null,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
};

export type OnCreatePostSubscription = {
  onCreatePost?:  {
    __typename: "Post",
    title: string,
    summary?: string | null,
    content: string,
    coverImage?: string | null,
    author?: string | null,
    isPublished?: boolean | null,
    publishedAt?: string | null,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
};

export type OnUpdatePostSubscription = {
  onUpdatePost?:  {
    __typename: "Post",
    title: string,
    summary?: string | null,
    content: string,
    coverImage?: string | null,
    author?: string | null,
    isPublished?: boolean | null,
    publishedAt?: string | null,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
};

export type OnDeletePostSubscription = {
  onDeletePost?:  {
    __typename: "Post",
    title: string,
    summary?: string | null,
    content: string,
    coverImage?: string | null,
    author?: string | null,
    isPublished?: boolean | null,
    publishedAt?: string | null,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
