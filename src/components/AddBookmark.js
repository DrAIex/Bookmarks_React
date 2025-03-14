import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const ADD_BOOKMARK = gql`
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

const AddBookmark = ({ refetch }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [addBookmark] = useMutation(ADD_BOOKMARK);

  const handleSubmit = async e => {
    e.preventDefault();
    await addBookmark({ variables: { title, url } });
    setTitle('');
    setUrl('');
    refetch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Add Bookmark</button>
    </form>
  );
};

export default AddBookmark;