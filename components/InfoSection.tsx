import React from 'react';

const GooglePlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.05,2.4A1.5,1.5,0,0,0,1.88,3.76L11.1,12,1.88,20.24a1.5,1.5,0,0,0,1.17,2.66L11.1,17.42,16,14.63,3.05,2.4Z" />
        <path d="M16.89,13.4,11.1,16.2V7.8l5.79,5.6Z" />
        <path d="M22.12,11.12a1.49,1.49,0,0,0-.31-2.18L18.4,6.77,16,8.89,18.4,11a2.12,2.12,0,0,1,0,2l-2.4,2.11,2.4,2.11a1.49,1.49,0,0,0,2.53-1.25,1.5,1.5,0,0,0-.43-.88Z" />
    </svg>
);

const AppStoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 384 512" fill="currentColor">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.6 0 184.2 0 241.7c0 63.6 58.2 157.1 112.5 157.1 30.3 0 54.1-18.4 83.4-18.4 27.8 0 56.6 18.4 86.4 18.4 64.9 0 113-91.2 113.3-152.1a251.4 251.4 0 0 0-6.3-45.6zM224 51.5c-30.8-29.4-44.3-33-56.1-33-14.3 0-28.2 5.3-43.1 16.3-13.7 9.8-28.2 21.6-38.3 35.5h154.3c-7.3-11.7-18.2-22.6-36.8-38.8z" />
    </svg>
);

const InfoSection: React.FC = () => {
    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-lg shadow-md mt-8 text-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">Play Free Sudoku Now!</h2>
            <p className="mb-6">Sudoku is one of the most popular puzzle games of all time. The goal of Sudoku is to fill a 9×9 grid with numbers so that each row, column and 3×3 section contain all of the digits between 1 and 9. As a logic puzzle, Sudoku is also an excellent brain game.</p>
            
            <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-3">About Sudoku</h3>
            <p className="mb-6">The modern Sudoku was designed by an American architect in 1979. It became truly popular in the mid-2000s and is now played by millions of people daily. It's a game of pure logic and requires no calculation or special math skills; all that is needed are brains and concentration.</p>

            <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-3">How to Play Sudoku</h3>
            <p className="mb-4">The goal of Sudoku is to fill in a 9×9 grid with digits so that each column, row, and 3×3 section contain the numbers between 1 to 9. At the beginning of the game, the 9×9 grid will have some of the squares filled in.</p>
            <ul className="list-disc list-inside mb-6 space-y-2 pl-4">
                <li>A number can appear only once in each row.</li>
                <li>A number can appear only once in each column.</li>
                <li>A number can appear only once in each 3x3 block.</li>
            </ul>

            <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-3">Sudoku Tips</h3>
            <p className="mb-4">If you are a beginner, here are some tips to help you improve your solving techniques:</p>
            <ul className="list-disc list-inside mb-6 space-y-2 pl-4">
                <li>Look for rows, columns, and 3x3 sections with 5 or more numbers. This makes it easier to figure out the missing numbers.</li>
                <li>Break the grid up visually into 3 columns and 3 rows. Each large column will have 3, 3x3 grids and each large row will have 3, 3x3 grids.</li>
            </ul>
        </div>
    );
};

export default InfoSection;