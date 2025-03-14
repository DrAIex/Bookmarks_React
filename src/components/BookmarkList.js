import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import AddBookmark from './AddBookmark';

const GET_BOOKMARKS = gql`
  query GetBookmarks {
    bookmarks {
      id
      title
      url
    }
  }
`;

const DELETE_BOOKMARK = gql`
  mutation DeleteBookmark($id: ID!) {
    deleteBookmark(input: { id: $id }) {
      bookmark {
        id
      }
    }
  }
`;

const BookmarkList = () => {
  const { loading, error, data, refetch } = useQuery(GET_BOOKMARKS);
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async id => {
    await deleteBookmark({ variables: { id } });
    refetch();
  };

  return (
    <>
       <AddBookmark refetch={refetch} />
       <ul>
        {data.bookmarks.map(({ id, title, url }) => (
          <li key={id}>
            <h3>{title}</h3>
            <p>{url}</p>
            <button onClick={() => handleDelete(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>

  );
};

export default BookmarkList;