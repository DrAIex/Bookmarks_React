import { gql } from '@apollo/client';

export const ADD_BOOKMARK = gql`
  mutation AddBookmark($title: String!, $url: String!) {
    createBookmark(input: { title: $title, url: $url }) {
      bookmark {
        id
        title
        url
      }
    }
  }
`;

export const GET_BOOKMARKS = gql`
  query GetBookmarks {
    bookmarks {
      id
      title
      url
    }
  }
`;

export const DELETE_BOOKMARK = gql`
  mutation DeleteBookmark($id: ID!) {
    deleteBookmark(input: { id: $id }) {
      bookmark {
        id
      }
    }
  }
`;

export const UPDATE_BOOKMARK = gql`
  mutation UpdateBookmark($id: ID!, $title: String!, $url: String!) {
    updateBookmark(input: { id: $id, title: $title, url: $url }) {
      bookmark {
        id
        title
        url
      }
    }
  }
`;
