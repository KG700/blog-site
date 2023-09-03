/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      title
      content
      coverImage
      comments {
        items {
          id
          username
          content
          createdAt
          updatedAt
          postCommentsId
          owner
          __typename
        }
        nextToken
        __typename
      }
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        title
        content
        coverImage
        comments {
          nextToken
          __typename
        }
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      username
      post {
        title
        content
        coverImage
        comments {
          nextToken
          __typename
        }
        id
        createdAt
        updatedAt
        __typename
      }
      content
      createdAt
      updatedAt
      postCommentsId
      owner
      __typename
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        post {
          title
          content
          coverImage
          id
          createdAt
          updatedAt
          __typename
        }
        content
        createdAt
        updatedAt
        postCommentsId
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const commentsByIdAndUsername = /* GraphQL */ `
  query CommentsByIdAndUsername(
    $id: ID!
    $username: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByIdAndUsername(
      id: $id
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        post {
          title
          content
          coverImage
          id
          createdAt
          updatedAt
          __typename
        }
        content
        createdAt
        updatedAt
        postCommentsId
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
