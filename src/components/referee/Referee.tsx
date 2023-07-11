import React, {useEffect, useRef, useState} from "react";
import ChessBoard from "../chessBoard/ChessBoard";
import {initialBoard} from "../../Constants";
import {bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove} from "../../referee/rules";
import {Piece, Position} from "../../models";
import {PieceType, TeamType} from "../../Types";
import {Pawn} from "../../models/Pawn";
import {Board} from "../../models/Board";

const Referee = () => {
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        board.calculateAllMoves();
    }, [])

    const playMove = (playedPiece: Piece, destination: Position): boolean => {
        if (playedPiece.possibleMoves === undefined) {
            return false;
        }

        if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) {
            return false;
        }

        if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0) {
            return false;
        }


        const validMove = playedPiece.possibleMoves?.some(move => move.samePosition(destination));
        if (!validMove) {
            return false;
        }

        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        let playedMoveIsValid = false

        setBoard(() => {
            const clonedBoard = board.clone();

            clonedBoard.totalTurns += 1;
            playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);

            if (clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
            }

            return clonedBoard;
        });

        let promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((prevPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }

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

        setBoard(() => {
            const clonedBoard = board.clone();

            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team, true))
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

    const restartGame = () => {
        checkmateModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }

    return (
        <>
            <p style={{color: "white", fontSize: "24px"}}>{board.totalTurns}</p>
            <div className="modal hidden" ref={modalRef}>
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
            <div className="modal hidden" ref={checkmateModalRef}>
                <div className="modal-body">
                    <div className="checkmate-body">
                        <span>The winning team is {board.winningTeam === TeamType.OUR ? "white" : "black"}!</span>
                        <button onClick={restartGame}>Play again</button>
                    </div>
                </div>
            </div>
            <ChessBoard playMove={playMove} pieces={board.pieces}/>
        </>
    );
}

export default Referee;