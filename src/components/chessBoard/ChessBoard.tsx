import React, {useRef, useState} from 'react';
import Tile from "../tile/Tile";
import {
    GRID_SIZE,
    HORIZONTAL_AXIS,
    Piece,
    Position,
    samePosition,
    VERTICAL_AXIS
} from "../../Constants";

import "./ChessBoard.css";

interface Props {
    playMove: (piece: Piece, position: Position) => boolean;
    pieces: Piece[];
}

const ChessBoard = ({playMove, pieces}: Props) => {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});
    const chessBoardRef = useRef<HTMLDivElement>(null);

    const grabPiece = (e: React.MouseEvent) => {
        const element = e.target as HTMLElement;

        if (element.classList.contains("chess-piece") && chessBoardRef.current) {
            const grabX = Math.floor((e.clientX - chessBoardRef.current.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessBoardRef.current.offsetTop - 640) / GRID_SIZE));
            setGrabPosition({x: grabX, y: grabY});

            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;

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
        }
    }

    const dropPiece = (e: React.MouseEvent) => {
        if (activePiece && chessBoardRef.current) {
            const x = Math.floor((e.clientX - chessBoardRef.current.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessBoardRef.current.offsetTop - 640) / GRID_SIZE));

            const currentPiece = pieces.find(piece => samePosition(piece.position, grabPosition));

            if (currentPiece) {
                const success = playMove(currentPiece, {x, y});
                if (!success) {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }

            setActivePiece(null);
        }
    }

    let board = [];
    for (let i = VERTICAL_AXIS.length - 1; i >= 0; --i) {
        for (let j = 0; j < HORIZONTAL_AXIS.length; ++j) {
            const piece = pieces.find(piece => samePosition(piece.position, {x: j, y: i}));
            let image = piece ? piece.image : undefined;

            let currentPiece = activePiece !== null ? pieces.find(piece => samePosition(piece.position, grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(piece => samePosition(piece, {
                x: j,
                y: i
            })) : false;

            board.push(<Tile key={`${j}:${i}`} image={image} number={j + i + 2} highlight={highlight}/>);
        }
    }

    return (
        <>
            <div
                onMouseDown={e => grabPiece(e)}
                onMouseMove={e => movePiece(e)}
                onMouseUp={e => dropPiece(e)}
                ref={chessBoardRef}
                className="chessboard"
            >
                {board}
            </div>
        </>
    );
}

export default ChessBoard;