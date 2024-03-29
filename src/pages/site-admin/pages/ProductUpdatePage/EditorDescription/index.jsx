import { Box } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss';

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

function EditorDescription(props) {
  const { editorHtml, handleEditorChange } = props;

  return (
    <ReactQuill
      onChange={handleEditorChange}
      value={editorHtml}
      modules={modules}
      formats={formats}
      bounds={'.app'}
      placeholder="Write something"
    />
  );
}

export default EditorDescription;
