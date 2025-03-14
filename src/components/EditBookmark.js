import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_BOOKMARK, GET_BOOKMARKS } from '../apolloHelper';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

const EditBookmark = ({ bookmark, onClose, refetch }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
  }, [bookmark]);

  const [updateBookmark] = useMutation(UPDATE_BOOKMARK, {
    update(cache, { data: { updateBookmark } }) {
      const { bookmarks } = cache.readQuery({ query: GET_BOOKMARKS });
      cache.writeQuery({
        query: GET_BOOKMARKS,
        data: {
          bookmarks: bookmarks.map(bookmark =>
            bookmark.id === updateBookmark.bookmark.id
              ? updateBookmark.bookmark
              : bookmark
          ),
        },
      });
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
    await updateBookmark({
      variables: {
        id: bookmark.id,
        title,
        url,
      },
    });
    onClose();
    refetch();
  };

  return (
    <>
      <DialogTitle>Редактировать закладку</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </>
  );
};

export default EditBookmark; 