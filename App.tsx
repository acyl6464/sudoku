import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, Mode, Grid, Cell } from './types';
import { generatePuzzle, checkConflicts, isGridSolved } from './services/sudokuService';
import SudokuGrid from './components/SudokuGrid';
import Controls from './components/Controls';
import InfoSection from './components/InfoSection';

// Helper function to properly deep copy the grid state, preserving Sets
const deepCopyGrid = (grid: Grid): Grid => {
    return grid.map(row => 
        row.map(cell => ({
            ...cell,
            notes: new Set(cell.notes),
        }))
    );
};

const App: React.FC = () => {
    const [grid, setGrid] = useState<Grid | null>(null);
    const [solution, setSolution] = useState<Grid | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
    const [mode, setMode] = useState<Mode>(Mode.Classic);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [mistakes, setMistakes] = useState(0);
    const [time, setTime] = useState(0);
    const [isNotesMode, setIsNotesMode] = useState(false);
    const [history, setHistory] = useState<Grid[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isSolved, setIsSolved] = useState(false);
    const [loading, setLoading] = useState(true);

    const timerRef = useRef<number | null>(null);

    const startNewGame = useCallback(() => {
        setLoading(true);
        setIsSolved(false);
        setMistakes(0);
        setTime(0);
        setSelectedCell(null);
        
        // Use a timeout to allow the loading state to render
        setTimeout(() => {
            const { puzzle, solution: newSolution } = generatePuzzle(difficulty);
            setGrid(puzzle);
            setSolution(newSolution);
            setHistory([puzzle]);
            setHistoryIndex(0);
            setLoading(false);
        }, 50);
    }, [difficulty]);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        if (!isSolved && !loading) {
            timerRef.current = window.setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isSolved, loading]);

    const handleCellClick = (row: number, col: number) => {
        if(isSolved) return;
        setSelectedCell({ row, col });
    };

    const updateGrid = (newGrid: Grid) => {
        setGrid(newGrid);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newGrid);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleNumberInput = (num: number) => {
        if (!selectedCell || !grid || !solution || isSolved) return;

        const { row, col } = selectedCell;
        const cell = grid[row][col];
        if (cell.isGiven) return;

        const newGrid = deepCopyGrid(grid);
        
        // Clear previous errors
        newGrid.forEach((r: Cell[]) => r.forEach((c: Cell) => c.isError = false));

        if (isNotesMode) {
            const notes = newGrid[row][col].notes;
            if (notes.has(num)) {
                notes.delete(num);
            } else {
                notes.add(num);
            }
            newGrid[row][col].value = null;
        } else {
            newGrid[row][col].value = num;
            newGrid[row][col].notes.clear();

            if (num !== solution[row][col].value) {
                setMistakes(m => m + 1);
                newGrid[row][col].isError = true;
                const conflicts = checkConflicts(newGrid, row, col, num);
                conflicts.forEach(c => newGrid[c.row][c.col].isError = true);
            }
        }
        
        updateGrid(newGrid);

        if (!isNotesMode && isGridSolved(newGrid, solution)) {
            setIsSolved(true);
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setGrid(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setGrid(history[historyIndex + 1]);
        }
    };
    
    const handleHint = () => {
        if (!grid || !solution || isSolved) return;

        const emptyCells: {row: number, col: number}[] = [];
        for (let r=0; r<9; r++) {
            for (let c=0; c<9; c++) {
                if (!grid[r][c].value) {
                    emptyCells.push({row: r, col: c});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const { row, col } = randomCell;
            const correctValue = solution[row][col].value!;
            
            const newGrid = deepCopyGrid(grid);
            newGrid[row][col].value = correctValue;
            newGrid[row][col].notes.clear();
            newGrid.forEach((r: Cell[]) => r.forEach((c: Cell) => c.isError = false));
            
            updateGrid(newGrid);
            
            if (isGridSolved(newGrid, solution)) {
                setIsSolved(true);
            }
        }
    };


    const DifficultySelector = () => (
        <div className="flex flex-wrap justify-center gap-1 md:gap-2 bg-blue-100 p-1 rounded-full">
            {Object.values(Difficulty).map(d => (
                <button 
                    key={d} 
                    onClick={() => {
                        setDifficulty(d);
                    }}
                    className={`px-3 py-1.5 md:px-4 text-sm md:text-base font-semibold rounded-full transition-colors ${difficulty === d ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-200'}`}
                >
                    {d}
                </button>
            ))}
        </div>
    );
    
    const ModeSelector = () => (
         <div className="flex justify-center gap-2 bg-gray-200 p-1 rounded-full">
            {Object.values(Mode).map(m => (
                <button 
                    key={m} 
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 text-sm md:text-base font-semibold rounded-full transition-colors ${mode === m ? 'bg-white text-gray-800 shadow' : 'text-gray-600'}`}
                >
                    {m}
                </button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 md:p-6">
            <header className="max-w-7xl mx-auto mb-4">
                 <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-4">Sudoku</h1>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                    <DifficultySelector />
                    <ModeSelector />
                 </div>
            </header>
            
            <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:flex-1 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
                            <p className="text-xl font-semibold text-blue-700">Generating New Puzzle...</p>
                        </div>
                    )}
                    {isSolved && (
                         <div className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center z-10 rounded-md text-white">
                            <h2 className="text-4xl font-bold mb-2">Congratulations!</h2>
                            <p className="text-lg">You solved the puzzle!</p>
                        </div>
                    )}
                    {grid && (
                        <SudokuGrid 
                            grid={grid} 
                            selectedCell={selectedCell} 
                            onCellClick={handleCellClick} 
                        />
                    )}
                </div>
                
                <div className="w-full lg:w-auto">
                   <Controls
                        onNumberClick={handleNumberInput}
                        onNewGame={startNewGame}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        onHint={handleHint}
                        isNotesMode={isNotesMode}
                        toggleNotesMode={() => setIsNotesMode(!isNotesMode)}
                        mistakes={mistakes}
                        time={time}
                   />
                </div>
            </main>

            <footer className="max-w-7xl mx-auto">
                <InfoSection />
                <div className="text-center text-gray-500 py-4 space-y-2">
                   <p>
                       Join our Discord server: <a href="https://discord.gg/FqZKVRStQt" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://discord.gg/FqZKVRStQt</a>
                   </p>
                   <p>© {new Date().getFullYear()} Crimson. | Made with love</p>
                </div>
            </footer>
        </div>
    );
};

export default App;