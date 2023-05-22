import React from 'react';
import Tile from "../tile/Tile";

import "./ChessBoard.css";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece {
    image: string;
    x: number;
    y: number;
}

const pieces: Piece[] = [];

for (let i = 0; i < horizontalAxis.length; ++i) {
    pieces.push({image: "assets/images/pawn_b.png", x: i, y: 6});
}

for (let i = 0; i < horizontalAxis.length; ++i) {
    pieces.push({image: "assets/images/pawn_w.png", x: i, y: 1});
}

for (let i = 0; i < 2; ++i) {
    const type = i === 0 ? "b" : "w";
    const y = i === 0 ? 7 : 0;

    pieces.push({image: `assets/images/rook_${type}.png`, x: 0, y});
    pieces.push({image: `assets/images/rook_${type}.png`, x: 7, y});
    pieces.push({image: `assets/images/knight_${type}.png`, x: 1, y});
    pieces.push({image: `assets/images/knight_${type}.png`, x: 6, y});
    pieces.push({image: `assets/images/bishop_${type}.png`, x: 2, y});
    pieces.push({image: `assets/images/bishop_${type}.png`, x: 5, y});
    pieces.push({image: `assets/images/queen_${type}.png`, x: 3, y});
    pieces.push({image: `assets/images/king_${type}.png`, x: 4, y});
}

let activePiece: HTMLElement | null = null;

const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;

    if (element.classList.contains("chess-piece")) {
        const x = e.clientX - 40;
        const y = e.clientY - 40;

        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        activePiece = element;
    }
}

const movePiece = (e: React.MouseEvent) => {
    if (activePiece) {
        const x = e.clientX - 40;
        const y = e.clientY - 40;

        activePiece.style.position = "absolute";
        activePiece.style.left = `${x}px`;
        activePiece.style.top = `${y}px`;
    }
}

const dropPiece = (e: React.MouseEvent) => {
    if (activePiece) {
        activePiece = null;
    }
}
const ChessBoard = () => {
    let board = [];
    for (let i = verticalAxis.length - 1; i >= 0; --i) {
        for (let j = 0; j < horizontalAxis.length; ++j) {
            let image = undefined;

            pieces.forEach(piece => {
                if (piece.x === j && piece.y === i) {
                    image = piece.image;
                }
            });

            board.push(<Tile key={ `${j}:${i}` } image={ image } number={ j + i + 2 }/>);
        }
    }

    return (
        <div
            onMouseDown={ e => grabPiece(e) }
            onMouseMove={ e => movePiece(e) }
            onMouseUp={ e => dropPiece(e) }
            className="chessboard"
        >
            {board}
        </div>
    );
}

export default ChessBoard;