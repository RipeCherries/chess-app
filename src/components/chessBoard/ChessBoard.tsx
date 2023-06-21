import React, {useRef, useState} from 'react';
import Tile from "../tile/Tile";
import Referee from "../../referee/Referee";
import {
    GRID_SIZE,
    HORIZONTAL_AXIS,
    initialBoardState,
    Piece,
    PieceType,
    Position,
    samePosition,
    TeamType,
    VERTICAL_AXIS
} from "../../Constants";

import "./ChessBoard.css";

const ChessBoard = () => {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessBoardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

    const updateValidMoves = () => {
        setPieces((currentPieces) => {
            return currentPieces.map(piece => {
                piece.possibleMoves = referee.getValidMoves(piece, currentPieces);
                return piece;
            });
        });
    }

    const grabPiece = (e: React.MouseEvent) => {
        updateValidMoves();

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
                const validMove = referee.isValidMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces);
                const isEnPassantMove = referee.isEnPassantMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces);
                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

                if (isEnPassantMove) {
                    const updatedPieces = pieces.reduce((result, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            result.push(piece);
                        } else if (!(samePosition(piece.position, {x, y: y - pawnDirection}))) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            result.push(piece);
                        }
                        return result;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);
                } else if (validMove) {
                    const updatedPieces = pieces.reduce((result, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
                            piece.position.x = x;
                            piece.position.y = y;

                            let promotionRow = piece.team === TeamType.OUR ? 7 : 0;
                            if (y === promotionRow && piece.type === PieceType.PAWN) {
                                modalRef.current?.classList.remove("hidden");
                                setPromotionPawn(piece);
                            }
                            
                            result.push(piece);
                        } else if (!(samePosition(piece.position, {x, y}))) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = true;
                            }
                            result.push(piece);
                        }
                        return result;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);
                } else {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }

            setActivePiece(null);
        }
    }

    const promotePawn = (pieceType: PieceType) => {
        if (promotionPawn === undefined) {
            return
        }

        const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, promotionPawn.position)) {
                piece.type = pieceType;

                const teamType = piece.team === TeamType.OUR ? "w" : "b";

                let image = "";
                switch (pieceType) {
                    case PieceType.BISHOP:
                        image = "bishop";
                        break;
                    case PieceType.ROOK:
                        image = "rook";
                        break;
                    case PieceType.KNIGHT:
                        image = "knight";
                        break;
                    case PieceType.QUEEN:
                        image = "queen";
                        break;
                }

                piece.image = `assets/images/${image}_${teamType}.png`;
            }
            results.push(piece);

            return results;
        }, [] as Piece[]);

        setPieces(updatedPieces);
        modalRef.current?.classList.add("hidden");
    }

    const promotionTeamType = () => {
        return promotionPawn?.team === TeamType.OUR ? "w" : "b";
    }

    let board = [];
    for (let i = VERTICAL_AXIS.length - 1; i >= 0; --i) {
        for (let j = 0; j < HORIZONTAL_AXIS.length; ++j) {
            const piece = pieces.find(piece => samePosition(piece.position, {x: j, y: i}));
            let image = piece ? piece.image : undefined;

            let currentPiece = activePiece !== null ? pieces.find(piece => samePosition(piece.position, grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(piece => samePosition(piece, {x: j, y: i})) : false;

            board.push(<Tile key={ `${j}:${i}` } image={ image } number={ j + i + 2 } highlight={ highlight } />);
        }
    }

    return (
        <>
            <div className="pawn-promotion-modal hidden" ref={ modalRef }>
                <div className="modal-body">
                    <img onClick={ () => promotePawn(PieceType.ROOK) } src={`/assets/images/rook_${promotionTeamType()}.png`} />
                    <img onClick={ () => promotePawn(PieceType.BISHOP) } src={`/assets/images/bishop_${promotionTeamType()}.png`} />
                    <img onClick={ () => promotePawn(PieceType.KNIGHT) } src={`/assets/images/knight_${promotionTeamType()}.png`} />
                    <img onClick={ () => promotePawn(PieceType.QUEEN) } src={`/assets/images/queen_${promotionTeamType()}.png`} />
                </div>
            </div>
            <div
                onMouseDown={ e => grabPiece(e) }
                onMouseMove={ e => movePiece(e) }
                onMouseUp={ e => dropPiece(e) }
                ref={ chessBoardRef }
                className="chessboard"
            >
                {board}
            </div>
        </>
    );
}

export default ChessBoard;