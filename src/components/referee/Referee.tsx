import React, {useEffect, useRef, useState} from "react";
import ChessBoard from "../chessBoard/ChessBoard";
import {initialBoardState} from "../../Constants";
import {
    bishopMove,
    getPossibleBishopMoves, getPossibleKingMove,
    getPossibleKnightMoves,
    getPossiblePawnMoves, getPossibleQueenMoves,
    getPossibleRookMoves, kingMove, knightMove, pawnMove, queenMove, rookMove
} from "../../referee/rules";
import {Position, Piece} from "../../models";
import {PieceType, TeamType} from "../../Types";
import {Pawn} from "../../models/Pawn";

const Referee = () => {
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updatePossibleMoves();
    }, [])

    const updatePossibleMoves = () => {
        setPieces((currentPieces) => {
            return currentPieces.map(piece => {
                piece.possibleMoves = getValidMoves(piece);
                return piece;
            });
        });
    }

    const playMove = (playedPiece: Piece, destination: Position): boolean => {
        const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

        if (enPassantMove) {
            const updatedPieces = pieces.reduce((result, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }

                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    result.push(piece);
                } else if (!piece.samePosition((new Position(destination.x, destination.y - pawnDirection)))) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    result.push(piece);
                }
                return result;
            }, [] as Piece[]);

            updatePossibleMoves();
            setPieces(updatedPieces);
        } else if (validMove) {
            const updatedPieces = pieces.reduce((result, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = Math.abs(playedPiece.position.y - destination.y) === 2 && piece.isPawn;
                    }
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;

                    let promotionRow = piece.team === TeamType.OUR ? 7 : 0;
                    if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
                        modalRef.current?.classList.remove("hidden");
                        setPromotionPawn(piece);
                    }

                    result.push(piece);
                } else if (!piece.samePosition(new Position(destination.x, destination.y))) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = true;
                    }
                    result.push(piece);
                }
                return result;
            }, [] as Piece[]);

            updatePossibleMoves();
            setPieces(updatedPieces);
        } else {
            return false;
        }

        return true;
    }

    const isValidMove = (prevPosition: Position, position: Position, type: PieceType, team: TeamType): boolean => {
        let validMove = false;

        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(prevPosition, position, team, pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(prevPosition, position, team, pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(prevPosition, position, team, pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(prevPosition, position, team, pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(prevPosition, position, team, pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(prevPosition, position, team, pieces);
                break;
        }

        return validMove;
    }

    const getValidMoves = (piece: Piece): Position[] => {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, pieces);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, pieces);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, pieces);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, pieces);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, pieces);
            case PieceType.KING:
                return getPossibleKingMove(piece, pieces);
            default:
                return [];
        }
    }

    const isEnPassantMove = (prevPosition: Position, position: Position, type: PieceType, team: TeamType): boolean => {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((position.x - prevPosition.x === -1 || position.x - prevPosition.x === 1) && position.y - prevPosition.y === pawnDirection) {
                const piece = pieces.find(piece => piece.position.x === position.x && piece.position.y === position.y - pawnDirection && (piece as Pawn).enPassant);
                if (piece) {
                    return true;
                }
            }
        }
        return false;
    }

    const promotePawn = (pieceType: PieceType) => {
        if (promotionPawn === undefined) {
            return;
        }

        const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.samePiecePosition(promotionPawn)) {
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

        updatePossibleMoves();
        setPieces(updatedPieces);
        modalRef.current?.classList.add("hidden");
    }

    const promotionTeamType = () => {
        return promotionPawn?.team === TeamType.OUR ? "w" : "b";
    }

    return (
        <>
            <div className="pawn-promotion-modal hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)}
                         src={`/assets/images/rook_${promotionTeamType()}.png`}/>
                    <img onClick={() => promotePawn(PieceType.BISHOP)}
                         src={`/assets/images/bishop_${promotionTeamType()}.png`}/>
                    <img onClick={() => promotePawn(PieceType.KNIGHT)}
                         src={`/assets/images/knight_${promotionTeamType()}.png`}/>
                    <img onClick={() => promotePawn(PieceType.QUEEN)}
                         src={`/assets/images/queen_${promotionTeamType()}.png`}/>
                </div>
            </div>
            <ChessBoard playMove={playMove} pieces={pieces}/>
        </>
    );
}

export default Referee;