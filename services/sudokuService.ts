
import { Grid, Difficulty, Cell } from '../types';

const SIZE = 9;
const BOX_SIZE = 3;

const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const createEmptyGrid = (): Grid => {
    return Array.from({ length: SIZE }, () => 
        Array.from({ length: SIZE }, () => ({
            value: null,
            notes: new Set(),
            isGiven: false,
            isError: false,
        }))
    );
};

const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
    for (let x = 0; x < SIZE; x++) {
        if (grid[row][x] === num || grid[x][col] === num) {
            return false;
        }
    }

    const startRow = row - (row % BOX_SIZE);
    const startCol = col - (col % BOX_SIZE);
    for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
            if (grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }

    return true;
};

const solveSudoku = (grid: number[][]): boolean => {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (grid[row][col] === 0) {
                const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (const num of numbers) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solveSudoku(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

// A simplified way to count solutions for puzzle validation.
const countSolutions = (grid: number[][]): number => {
    let count = 0;
    const findEmpty = (): [number, number] | null => {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (grid[i][j] === 0) return [i, j];
            }
        }
        return null;
    };

    const solve = () => {
        const empty = findEmpty();
        if (!empty) {
            count++;
            return;
        }
        const [row, col] = empty;
        for (let num = 1; num <= 9 && count < 2; num++) {
            if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                solve();
                grid[row][col] = 0; 
            }
        }
    };
    
    solve();
    return count;
};

export const generatePuzzle = (difficulty: Difficulty): { puzzle: Grid; solution: Grid } => {
    const emptyGridForSolver = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    solveSudoku(emptyGridForSolver);
    
    const solutionGrid = JSON.parse(JSON.stringify(emptyGridForSolver));

    const cellsToRemove: { [key in Difficulty]: number } = {
        [Difficulty.Easy]: 30,
        [Difficulty.Medium]: 40,
        [Difficulty.Hard]: 50,
        [Difficulty.Expert]: 55,
        [Difficulty.Master]: 60,
        [Difficulty.Extreme]: 64,
    };

    let attempts = 5;
    let puzzleGridNumbers = JSON.parse(JSON.stringify(solutionGrid));
    
    while (attempts > 0) {
        puzzleGridNumbers = JSON.parse(JSON.stringify(solutionGrid));
        let removed = 0;
        const positions = [];
        for (let r=0; r<SIZE; r++) for(let c=0; c<SIZE; c++) positions.push([r,c]);
        shuffle(positions);

        while (removed < cellsToRemove[difficulty] && positions.length > 0) {
            const [row, col] = positions.pop()!;
            const temp = puzzleGridNumbers[row][col];
            puzzleGridNumbers[row][col] = 0;

            const tempGridForCount = JSON.parse(JSON.stringify(puzzleGridNumbers));
            if (countSolutions(tempGridForCount) !== 1) {
                puzzleGridNumbers[row][col] = temp;
            } else {
                removed++;
            }
        }
        
        if (removed >= cellsToRemove[difficulty]) break;
        attempts--;
    }


    const puzzle: Grid = createEmptyGrid();
    const solution: Grid = createEmptyGrid();
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            solution[r][c].value = solutionGrid[r][c];
            if (puzzleGridNumbers[r][c] !== 0) {
                puzzle[r][c] = {
                    value: puzzleGridNumbers[r][c],
                    notes: new Set(),
                    isGiven: true,
                    isError: false,
                };
            }
        }
    }
    
    return { puzzle, solution };
};

export const checkConflicts = (grid: Grid, row: number, col: number, value: number): {row: number, col: number}[] => {
    const conflicts: {row: number, col: number}[] = [];
    
    for (let i = 0; i < SIZE; i++) {
        if (i !== col && grid[row][i].value === value) {
            conflicts.push({row, col: i});
        }
        if (i !== row && grid[i][col].value === value) {
            conflicts.push({row: i, col});
        }
    }

    const boxStartRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxStartCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    for (let r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
        for (let c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
            if (r !== row && c !== col && grid[r][c].value === value) {
                conflicts.push({row: r, col: c});
            }
        }
    }
    return conflicts;
};

export const isGridSolved = (grid: Grid, solution: Grid): boolean => {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c].value !== solution[r][c].value) {
                return false;
            }
        }
    }
    return true;
};
