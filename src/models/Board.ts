import {Piece} from "./Piece";
import {Pawn} from "./Pawn";
import {Position} from "./Position";
import {PieceType, TeamType} from "../Types";
import {
    getPossibleBishopMoves,
    getPossibleKingMove,
    getPossibleKnightMoves,
    getPossiblePawnMoves,
    getPossibleQueenMoves,
    getPossibleRookMoves
} from "../referee/rules";

export class Board {
    pieces: Piece[];

    constructor(pieces: Piece[]) {
        this.pieces = pieces;
    }

    calculateAllMoves() {
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece);
        }

        this.checkKingMoves();
    }

    checkKingMoves() {
        const king = this.pieces.find(piece => piece.isKing && piece.team === TeamType.OPPONENT);
        if (king?.possibleMoves === undefined) {
            return;
        }

        for (const move of king.possibleMoves) {
            const simulatedBoard = this.clone();

            const pieceAtDestination = simulatedBoard.pieces.find(p => p.samePosition(move));
            if (pieceAtDestination !== undefined) {
                simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));
            }

            const simulatedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === TeamType.OPPONENT);
            simulatedKing!.position = move;

            for (const enemy of simulatedBoard.pieces.filter(p => p.team === TeamType.OUR)) {
                enemy.possibleMoves = simulatedBoard.getValidMoves(enemy)
            }

            let safe = true;

            for (const piece of simulatedBoard.pieces) {
                if (piece.team === TeamType.OPPONENT) {
                    continue;
                }
                if (piece.isPawn) {
                    const possiblePawnMoves = simulatedBoard.getValidMoves(piece);

                    if (possiblePawnMoves.some(p => p.samePosition(move))) {
                        safe = false;
                        break;
                    }
                } else if (piece.possibleMoves?.some(p => p.x !== piece.position.x && p.samePosition(move))) {
                    safe = false;
                    break;
                }
            }

            if (!safe) {
                king.possibleMoves = king.possibleMoves?.filter(m => !m.samePosition(move));
            }
        }
    }

    getValidMoves = (piece: Piece): Position[] => {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, this.pieces);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, this.pieces);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, this.pieces);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, this.pieces);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, this.pieces);
            case PieceType.KING:
                return getPossibleKingMove(piece, this.pieces);
            default:
                return [];
        }
    }

    playMove(enPassantMove: boolean, validMove: boolean, playedPiece: Piece, destination: Position): boolean {
        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

        if (enPassantMove) {
            this.pieces = this.pieces.reduce((result, piece) => {
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

            this.calculateAllMoves();
        } else if (validMove) {
            this.pieces = this.pieces.reduce((result, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = Math.abs(playedPiece.position.y - destination.y) === 2 && piece.isPawn;
                    }
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;

                    result.push(piece);
                } else if (!piece.samePosition(destination)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = true;
                    }
                    result.push(piece);
                }
                return result;
            }, [] as Piece[]);

            this.calculateAllMoves();
        } else {
            return false;
        }

        return true;
    }

    clone(): Board {
        return new Board(this.pieces.map(piece => piece.clone()));
    }
}