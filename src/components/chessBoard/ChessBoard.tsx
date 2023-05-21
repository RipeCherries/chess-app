import React from 'react';

import "./ChessBoard.css";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

const ChessBoard = () => {
    let board = [];
    for (let i = verticalAxis.length - 1; i >= 0; --i) {
        for (let j = 0; j < horizontalAxis.length; ++j) {
            if ((j + i + 2) % 2 === 0) {
                board.push(<div className="tile white-tile"></div>)
            } else {
                board.push(<div className="tile black-tile"></div>)
            }

        }
    }

    return (
        <div className="chessboard">
            {board}
        </div>
    );
}

export default ChessBoard;