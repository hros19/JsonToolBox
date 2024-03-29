import React, { useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { toast } from 'react-toastify';

interface JsonSectionProps {
  content: string;
  setContent: (content: string) => void;
  determineFormat: (content: string) => void;
}

function JsonSection({ content, setContent, determineFormat }: JsonSectionProps) {
  const [jsonUrl, setJsonUrl] = useState('');
  const editorRef = useRef<AceEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorContent = editorRef.current.editor.getValue();
      if (content !== editorContent) {
        editorRef.current.editor.setValue(content, 1);
      }
    }
  }, [content]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJsonUrl(event.target.value);
  };

  const loadJson = async () => {
    if (!jsonUrl) return;

    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      setContent(data);
      determineFormat(data);
    } catch (error) {
      console.error('Error fetching JSON:', error);
      toast.error('Error fetching JSON');
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    determineFormat(newContent);
  };

  return (
    <div className="col-8">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter JSON or XML URL"
          value={jsonUrl}
          onChange={handleUrlChange}
        />
        <button className="btn btn-outline-secondary" type="button" onClick={loadJson}>
          Load from URL
        </button>
      </div>
      <AceEditor
        mode="json"
        theme="github"
        name="jsonEditor"
        onChange={handleContentChange}
        editorProps={{ $blockScrolling: true }}
        ref={editorRef}
        defaultValue="// Insert JSON or XML here"
        width="100%"
        height="400px"
      />
    </div>
  );
}

export default JsonSection;
