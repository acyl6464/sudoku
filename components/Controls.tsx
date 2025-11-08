
import React, { useEffect, useState } from 'react';

const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 10h10a8 8 0 018 8v2M3 10L7 6m-4 4l4 4" /></svg>
);
const RedoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M21 10H11a8 8 0 00-8 8v2m18-10l-4-4m4 4l-4 4" /></svg>
);
const HintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);
const NotesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);


interface ControlsProps {
  onNumberClick: (num: number) => void;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  isNotesMode: boolean;
  toggleNotesMode: () => void;
  mistakes: number;
  time: number;
}

const Controls: React.FC<ControlsProps> = ({ onNumberClick, onNewGame, onUndo, onRedo, onHint, isNotesMode, toggleNotesMode, mistakes, time }) => {
    
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="w-full lg:w-72 flex flex-col items-center space-y-4">
      <div className="flex justify-between items-center w-full bg-white p-2 rounded-lg shadow">
        <div className="text-lg font-semibold text-red-500">
            Mistakes: <span className="font-bold">{mistakes}/3</span>
        </div>
        <div className="text-lg font-semibold text-gray-700">
            {formatTime(time)}
        </div>
      </div>
      
      <button 
        onClick={onNewGame}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
        New Game
      </button>

      <div className="grid grid-cols-3 gap-2 w-full">
        <ActionButton onClick={onUndo} label="Undo"><UndoIcon /></ActionButton>
        <ActionButton onClick={onRedo} label="Redo"><RedoIcon /></ActionButton>
        <ActionButton onClick={onHint} label="Hint"><HintIcon /></ActionButton>
      </div>

       <div 
        onClick={toggleNotesMode}
        className={`flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg cursor-pointer transition-colors ${isNotesMode ? 'bg-blue-200 text-blue-800' : 'bg-white text-gray-700'} shadow`}>
        <NotesIcon />
        <span className="font-semibold text-lg">{isNotesMode ? 'Notes ON' : 'Notes OFF'}</span>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full pt-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <button 
            key={i+1}
            onClick={() => onNumberClick(i + 1)}
            className="flex items-center justify-center aspect-square text-3xl font-bold bg-white text-blue-600 rounded-lg shadow hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

interface ActionButtonProps {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
}
const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label, children }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
        {children}
        <span className="text-sm font-medium text-gray-600 mt-1">{label}</span>
    </button>
)

export default Controls;
