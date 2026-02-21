import { useState } from 'react';
import { Code2, Play } from 'lucide-react';

const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'HashMaps',
  'LinkedLists',
  'Stacks',
  'Queues',
  'Trees',
  'Graphs',
  'Sorting',
  'Searching',
  'Dynamic Programming',
  'Recursion',
  'Backtracking',
];

interface CodeEditorProps {
  onSubmit: (code: string, topic: string) => void;
}

export default function CodeEditor({ onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState('// Write your Java code here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}');
  const [selectedTopic, setSelectedTopic] = useState('Arrays');

  const handleSubmit = () => {
    onSubmit(code, selectedTopic);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-gray-100">
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold">Java Editor</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-[#3c3c3c] text-gray-100 px-3 py-1.5 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            {DSA_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md transition-colors duration-200 font-medium text-sm"
          >
            <Play className="w-4 h-4" />
            Submit Code
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="h-full">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-[#1e1e1e] text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
            style={{
              tabSize: 4,
              caretColor: '#10b981',
            }}
          />
        </div>
      </div>

      <div className="px-4 py-2 bg-[#252526] border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <span>Topic: {selectedTopic}</span>
        <span>Lines: {code.split('\n').length}</span>
      </div>
    </div>
  );
}
