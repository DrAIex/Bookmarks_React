import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOKMARK, GET_BOOKMARKS } from '../apolloHelper';

const UpdateBookmark = ({ refetch }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [addBookmark] = useMutation(ADD_BOOKMARK, {
    update(cache, { data: { createBookmark } }) {
      const { bookmarks } = cache.readQuery({ query: GET_BOOKMARKS });
      cache.writeQuery({
        query: GET_BOOKMARKS,
        data: { bookmarks: bookmarks.concat([createBookmark.bookmark]) },
      });
    },
    optimisticResponse: {
      createBookmark: {
        __typename: 'Mutation',
        bookmark: {
          __typename: 'BookmarkType',
          id: Math.random().toString(),
          title,
          url,
        },
      },
    },
  });

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isValidUrl(url)) {
      alert('Please enter a valid URL');
      return;
    }
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

export default UpdateBookmark;