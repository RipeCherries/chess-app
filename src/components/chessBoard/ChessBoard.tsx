import React, {useRef, useState} from 'react';
import Tile from "../tile/Tile";

import "./ChessBoard.css";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece {
    image: string;
    x: number;
    y: number;
}

const initialBoardState: Piece[] = [];

for (let i = 0; i < horizontalAxis.length; ++i) {
    initialBoardState.push({image: "assets/images/pawn_b.png", x: i, y: 6});
}

for (let i = 0; i < horizontalAxis.length; ++i) {
    initialBoardState.push({image: "assets/images/pawn_w.png", x: i, y: 1});
}

for (let i = 0; i < 2; ++i) {
    const type = i === 0 ? "b" : "w";
    const y = i === 0 ? 7 : 0;

    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 0, y});
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 7, y});
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 1, y});
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 6, y});
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 2, y});
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 5, y});
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x: 3, y});
    initialBoardState.push({image: `assets/images/king_${type}.png`, x: 4, y});
}

const ChessBoard = () => {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessBoardRef = useRef<HTMLDivElement>(null);

    const grabPiece = (e: React.MouseEvent) => {
        const element = e.target as HTMLElement;

        if (element.classList.contains("chess-piece") && chessBoardRef.current) {
            setGridX(Math.floor((e.clientX - chessBoardRef.current.offsetLeft) / 80));
            setGridY(Math.abs(Math.ceil((e.clientY - chessBoardRef.current.offsetTop - 640) / 80)));

            const x = e.clientX - 40;
            const y = e.clientY - 40;

            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    const movePiece = (e: React.MouseEvent) => {
        if (activePiece && chessBoardRef.current) {
            const minX = chessBoardRef.current.offsetLeft - 20;
            const maxX = chessBoardRef.current.offsetLeft + chessBoardRef.current.clientWidth - 60;
            const minY = chessBoardRef.current.offsetTop - 20;
            const maxY = chessBoardRef.current.offsetTop + chessBoardRef.current.clientHeight - 60;
            const x = e.clientX - 40;
            const y = e.clientY - 40;

            activePiece.style.position = "absolute";

            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
            // activePiece.style.left = (x < minX) ? `${minX}px` : `${x}px`;
            // activePiece.style.top = (y < minY) ? `${minY}px` : `${y}px`;
        }
    }

    const dropPiece = (e: React.MouseEvent) => {
        if (activePiece && chessBoardRef.current) {
            const x = Math.floor((e.clientX - chessBoardRef.current.offsetLeft) / 80);
            const y = Math.abs(Math.ceil((e.clientY - chessBoardRef.current.offsetTop - 640) / 80));

            setPieces((prev) => {
                return prev.map((piece) => {
                    if (piece.x === gridX && piece.y === gridY) {
                        piece.x = x;
                        piece.y = y;
                    }
                    return piece;
                });
            });

            setActivePiece(null);
        }
    }

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
            ref={ chessBoardRef }
            className="chessboard"
        >
            {board}
        </div>
    );
}

export default ChessBoard;