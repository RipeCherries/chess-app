import React, {useEffect, useRef, useState} from "react";
import ChessBoard from "../chessBoard/ChessBoard";
import {initialBoard} from "../../Constants";
import {
    bishopMove,
    kingMove,
    knightMove,
    pawnMove,
    queenMove,
    rookMove
} from "../../referee/rules";
import {Position, Piece} from "../../models";
import {PieceType, TeamType} from "../../Types";
import {Pawn} from "../../models/Pawn";
import {Board} from "../../models/Board";

const Referee = () => {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updatePossibleMoves();
    }, [])

    const updatePossibleMoves = () => {
        board.calculateAllMoves();
    }

    const playMove = (playedPiece: Piece, destination: Position): boolean => {
        const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        let promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((prevPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }

        let playedMoveIsValid = false

        setBoard((prevBoard) => {
            playedMoveIsValid = board.playMove(enPassantMove, validMove, playedPiece, destination);
            return board.clone();
        });

        return playedMoveIsValid;
    }

    const isValidMove = (prevPosition: Position, position: Position, type: PieceType, team: TeamType): boolean => {
        let validMove = false;

        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(prevPosition, position, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(prevPosition, position, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(prevPosition, position, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(prevPosition, position, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(prevPosition, position, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(prevPosition, position, team, board.pieces);
                break;
        }

        return validMove;
    }

    const isEnPassantMove = (prevPosition: Position, position: Position, type: PieceType, team: TeamType): boolean => {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((position.x - prevPosition.x === -1 || position.x - prevPosition.x === 1) && position.y - prevPosition.y === pawnDirection) {
                const piece = board.pieces.find(piece => piece.position.x === position.x && piece.position.y === position.y - pawnDirection && (piece as Pawn).enPassant);
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

        setBoard((prevBoard) => {
            const clonedBoard = board.clone();

            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team))
                } else {
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);

            clonedBoard.calculateAllMoves();

            return clonedBoard;
        });

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
            <ChessBoard playMove={playMove} pieces={board.pieces}/>
        </>
    );
}

export default Referee;