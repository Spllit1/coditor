import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import 'tailwindcss/tailwind.css';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { atomone } from '@uiw/codemirror-theme-atomone';
import './App.css';

const client = new W3CWebSocket('ws://localhost:3000');

const App = () => {
  const [command, setCommand] = useState('');
  const [stdin, setStdin] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('reply', dataFromServer);
      if (dataFromServer.type === 'stdout' || dataFromServer.type === 'stderr' || dataFromServer.type === 'exit') {
        setOutput(prevState => prevState + '\n' + dataFromServer.payload);
      }
    };
  }, []);

  const runCommand = () => {
    client.send(JSON.stringify({ type: 'run', payload: command }));
  };

  const sendStdin = () => {
    client.send(JSON.stringify({ type: 'stdin', payload: stdin }));
  };

  const createFile = () => {
    client.send(JSON.stringify({ type: 'create_file', payload: { fileName, content: fileContent } }));
  };

  const getAllContent = () => {
    client.send(JSON.stringify({ type: 'get_all_content' }));
  };

  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

  return (
    <div className="h-screen">
      <div className='flex h-full dark:bg-slate-800'>
        

        <div className="w-1/2 dark:bg-slate-800">
           <CodeMirror value={value} height="100vh" extensions={[javascript({ jsx: true })]} onChange={onChange} theme={atomone} />;
        </div>
        <div className="w-1/2">
          <textarea className="border p-2 mb-2 h-5/6 w-full" value={output} readOnly/>
          <input className="border p-2 mb-2" value={command} onChange={e => setCommand(e.target.value)} placeholder="Command" />
          <button className="border p-2 mb-2" onClick={runCommand}>Run Command</button>
          <input className="border p-2 mb-2" value={stdin} onChange={e => setStdin(e.target.value)} placeholder="Stdin" />
          <button className="border p-2 mb-2" onClick={sendStdin}>Send Stdin</button>
          <input className="border p-2 mb-2" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="File Name" />
          <textarea className="border p-2 mb-2" value={fileContent} onChange={e => setFileContent(e.target.value)} placeholder="File Content" />
          <button className="border p-2 mb-2" onClick={createFile}>Create File</button>
          <button className="border p-2 mb-2" onClick={getAllContent}>Get All Content</button>
        </div>
      </div>
    </div>
  );
};

export default App;