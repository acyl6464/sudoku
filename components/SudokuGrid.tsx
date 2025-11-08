
import React from 'react';
import { Grid } from '../types';

interface SudokuGridProps {
  grid: Grid;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ grid, selectedCell, onCellClick }) => {
  const getCellClasses = (row: number, col: number) => {
    let classes = 'flex items-center justify-center aspect-square text-lg md:text-2xl cursor-pointer transition-colors duration-150 ';
    const cell = grid[row][col];

    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isRelated = selectedCell && !isSelected && (
      selectedCell.row === row || 
      selectedCell.col === col || 
      (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
    );
    const isSameValue = selectedCell && grid[selectedCell.row][selectedCell.col].value && grid[selectedCell.row][selectedCell.col].value === cell.value;

    if (isSelected) {
      classes += 'bg-blue-300 ';
    } else if (isRelated) {
      classes += 'bg-blue-100 ';
    } else if (isSameValue) {
      classes += 'bg-blue-200 ';
    } else {
      classes += 'bg-white ';
    }

    if (cell.isGiven) {
      classes += 'text-gray-900 font-semibold ';
    } else if (cell.value) {
      classes += 'text-blue-700 ';
    }
    
    if (cell.isError) {
        classes += '!bg-red-200 text-red-600 ';
    }
    
    // Add borders
    if (row % 3 === 2 && row !== 8) classes += 'border-b-2 border-b-gray-600 ';
    else classes += 'border-b border-b-gray-300 ';
    if (col % 3 === 2 && col !== 8) classes += 'border-r-2 border-r-gray-600 ';
    else classes += 'border-r border-r-gray-300 ';
    if (row === 0) classes += 'border-t-2 border-t-gray-600 ';
    if (col === 0) classes += 'border-l-2 border-l-gray-600 ';

    return classes;
  };

  return (
    <div className="grid grid-cols-9 w-full max-w-[500px] lg:max-w-none mx-auto aspect-square shadow-lg rounded-md overflow-hidden">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getCellClasses(rowIndex, colIndex)}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {cell.value ? (
              <span>{cell.value}</span>
            ) : cell.notes.size > 0 ? (
              <div className="grid grid-cols-3 w-full h-full text-xs text-gray-500">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {cell.notes.has(i + 1) ? i + 1 : ''}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};

export default SudokuGrid;
