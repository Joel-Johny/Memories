import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const JournalEditor = ({ onContentChange }) => {
  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        onChange={onContentChange}
        placeholder="Write your thoughts here..."
        className="bg-white rounded-lg"
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
          ],
        }}
      />
    </div>
  );
};

export default JournalEditor;