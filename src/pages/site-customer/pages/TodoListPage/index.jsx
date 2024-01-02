import React, { useEffect, useRef, useState } from 'react';

import { Button, IconButton, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { red } from '@mui/material/colors';

TodoListPage.propTypes = {};

function TodoListPage(props) {
  const { todos } = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    if (todo) {
      inputRef.current.value = todo.title;
    }
  });

  const handleSubmit = () => {
    const input = inputRef.current;
    const todoItem = {
      id: todo ? todo.id : Date.now(),
      title: input.value,
      completed: false,
    };

    if (todo) {
      console.log(todoItem);
      dispatch({ type: 'UPDATE_TODO', payload: todoItem });
    } else {
      dispatch({ type: 'ADD_TODO', payload: todoItem });
      setTodo(null);
    }

    input.value = '';
    input.focus();
  };

  const handleUpdateTodo = (id) => {
    const todoItem = todos.find((item) => item.id === id);

    setTodo(todoItem);
  };

  return (
    <Stack m={4}>
      <Stack direction="row" gap={2} sx={{ width: 550 }}>
        <TextField sx={{ width: 350 }} placeholder="Create todo..." inputRef={inputRef} />
        <Button variant="contained" onClick={() => handleSubmit()}>
          {todo ? 'Edit' : 'Create'}
        </Button>
      </Stack>

      <List sx={{ width: 450 }}>
        {todos?.map((todo, index) => (
          <ListItem key={index}>
            <ListItemText primary={todo.title} />
            <IconButton color="primary" onClick={() => handleUpdateTodo(todo.id)}>
              <CreateIcon />
            </IconButton>
            <IconButton sx={{ color: red[500] }} onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default TodoListPage;
