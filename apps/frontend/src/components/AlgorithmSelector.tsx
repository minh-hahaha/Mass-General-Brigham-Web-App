import React from 'react';

interface AlgorithmSelectorProps {
    selectedAlgorithm: string;
    onChange: (algorithm: string) => void;
}

const AlgorithmSelector = ({ selectedAlgorithm, onChange }: AlgorithmSelectorProps) => {
    return (
        <div className="flex items-center gap-2">
            <label className="w-1/4">Algorithm</label>
            <select
                value={selectedAlgorithm}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white"
            >
                <option value="">Select algorithm</option>
                <option value="bfs">BFS</option>
                <option value="dfs">DFS</option>
            </select>
        </div>
    );
};

export default AlgorithmSelector;