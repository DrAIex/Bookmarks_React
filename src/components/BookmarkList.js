import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKMARKS, DELETE_BOOKMARK } from '../apolloHelper';
import AddBookmark from './AddBookmark';
import EditBookmark from './EditBookmark';
import {
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Box,
  Dialog,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const BookmarkList = () => {
  const { loading, error, data, refetch } = useQuery(GET_BOOKMARKS);
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK);
  const [filter, setFilter] = useState('');
  const [editingBookmark, setEditingBookmark] = useState(null);

  const filteredBookmarks = data?.bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <Typography>Загрузка...</Typography>
    </Box>
  );
  
  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <Typography color="error">Ошибка: {error.message}</Typography>
    </Box>
  );

  const handleDelete = async id => {
    await deleteBookmark({ variables: { id } });
    refetch();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <AddBookmark refetch={refetch} />
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск закладок по названию"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Paper>

        <Paper elevation={2}>
          <List>
            {filteredBookmarks.map(({ id, title, url }) => (
              <ListItem
                key={id}
                divider
                sx={{
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemText
                  primary={title}
                  secondary={url}
                  primaryTypographyProps={{
                    variant: 'h6',
                    component: 'h3',
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      wordBreak: 'break-all',
                    },
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => setEditingBookmark({ id, title, url })}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog
          open={Boolean(editingBookmark)}
          onClose={() => setEditingBookmark(null)}
          maxWidth="sm"
          fullWidth
        >
          {editingBookmark && (
            <EditBookmark
              bookmark={editingBookmark}
              onClose={() => setEditingBookmark(null)}
              refetch={refetch}
            />
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default BookmarkList;