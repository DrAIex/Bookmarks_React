import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOKMARK, GET_BOOKMARKS } from '../apolloHelper';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AddBookmark = ({ refetch }) => {
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
      alert('Пожалуйста, введите корректный URL');
      return;
    }
    await addBookmark({ variables: { title, url } });
    setTitle('');
    setUrl('');
    refetch();
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Добавить новую закладку
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Добавить закладку
        </Button>
      </Box>
    </Paper>
  );
};

export default AddBookmark;