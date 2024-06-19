import React, { useState, useEffect } from 'react';
import './Bai3_4.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import all_bai2_img from '../Assets/all_bai2_img';

const marioPosition = { row: null, col: null };
const diamondPosition = { row: null, col: null };
const maze = [
    ["", "", "", "", "diamond", ""],
    ["", "", "", "water", "water", "water"],
    ["", "", "", "", "", ""],
    ["water", "water", "water", "water", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "water", "water", "water", "water"],
    ["", "", "", "", "", ""],
    ["", "", "", "mario", "", ""]
];

export const Bai3_4 = () => {
    const [mazeInput, setMazeInput] = useState('');
    const [mazeState, setMazeState] = useState(JSON.parse(JSON.stringify(maze)));

    useEffect(() => {
        mazeState.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 'mario') {
                    marioPosition.row = rowIndex;
                    marioPosition.col = colIndex;
                } else if (cell === 'diamond') {
                    diamondPosition.row = rowIndex;
                    diamondPosition.col = colIndex;
                }
            });
        });
    }, [mazeState]);

    const notifiError = (move) => {
        toast.error(`Bạn đã đâm vào vật cản bên ${move}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const renderBoard = () => {
        return (
            <div className="board">
                {mazeState.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className="boxes">
                                {cell === 'diamond' && <img src={all_bai2_img.diamond} alt="diamond" />}
                                {cell === 'water' && <img src={all_bai2_img.blue} alt="water" style={{ width: '100%', height: '100%' }} />}
                                {cell === 'mario' && <img src={all_bai2_img.mario} alt="mario" />}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleControl(event);
        setMazeInput('');
    };

    const showAnswer = () => {
        setMazeInput(`l\nl\nu\nu\nu\nu\nr\nr\nr\nu\nu\nl\nl\nu\nu\nr\nr`);
    }

    const handleControl = async (event) => {
        const moves = event.target.mazeData.value.split("\n");

        for (let i = 0; i < moves.length; i++) {
            const updatedMazeState = [...mazeState];
            updatedMazeState[marioPosition.row][marioPosition.col] = '';

            switch (moves[i]) {
                case 'l':
                    if (marioPosition.col > 0 && updatedMazeState[marioPosition.row][marioPosition.col - 1] !== 'water') {
                        marioPosition.col -= 1;
                    } else {
                        notifiError("trái");
                    }
                    break;
                case 'r':
                    if (marioPosition.col < updatedMazeState[0].length - 1 && updatedMazeState[marioPosition.row][marioPosition.col + 1] !== 'water') {
                        marioPosition.col += 1;
                    } else {
                        notifiError("phải");
                    }
                    break;
                case 'u':
                    if (marioPosition.row > 0 && updatedMazeState[marioPosition.row - 1][marioPosition.col] !== 'water') {
                        marioPosition.row -= 1;
                    } else {
                        notifiError("trên");
                    }
                    break;
                case 'd':
                    if (marioPosition.row < updatedMazeState.length - 1 && updatedMazeState[marioPosition.row + 1][marioPosition.col] !== 'water') {
                        marioPosition.row += 1;
                    } else {
                        notifiError("dưới");
                    }
                    break;
                default:
                    break;
            }

            updatedMazeState[marioPosition.row][marioPosition.col] = 'mario';
            setMazeState([...updatedMazeState]);

            if (marioPosition.row === diamondPosition.row && marioPosition.col === diamondPosition.col) {
                Swal.fire({
                    title: 'Chiến thắng!',
                    text: 'Mario đã tìm được kim cương',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    const handlePlayAgain = () => {
        setMazeState(JSON.parse(JSON.stringify(maze)));
        maze.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 'mario') {
                    marioPosition.row = rowIndex;
                    marioPosition.col = colIndex;
                } else if (cell === 'diamond') {
                    diamondPosition.row = rowIndex;
                    diamondPosition.col = colIndex;
                }
            });
        });
    }

    return (
        <div className="Bai3">
            <h1>Bài 3: Vẽ mê cung</h1>
            <div className="container">
                {renderBoard()}
                <form className='form' onSubmit={handleSubmit}>
                    <textarea
                        name="mazeData"
                        placeholder="Nhập dữ liệu của mê cung ở đây...
Sử dụng l,r,u,d để di chuyển"
                        rows={10}
                        cols={50}
                        value={mazeInput}
                        onChange={e => setMazeInput(e.target.value)}
                        required
                    />
                    <div className="btn-group">
                        <button className="btn" type="submit">
                            Run
                        </button>
                        <button className="btn" type="button" onClick={showAnswer}>
                            Show Answer
                        </button>
                        <button className="btn" type="button" onClick={handlePlayAgain}>
                            Play Again
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};
