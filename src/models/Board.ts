import {Piece} from "./Piece";
import {Pawn} from "./Pawn";
import {Position} from "./Position";
import {PieceType, TeamType} from "../Types";
import {
    getCastlingMoves,
    getPossibleBishopMoves,
    getPossibleKingMove,
    getPossibleKnightMoves,
    getPossiblePawnMoves,
    getPossibleQueenMoves,
    getPossibleRookMoves
} from "../referee/rules";

export class Board {
    pieces: Piece[]
    totalTurns: number;
    winningTeam?: TeamType;

    constructor(pieces: Piece[], totalTurns: number) {
        this.pieces = pieces;
        this.totalTurns = totalTurns;
    }

    get currentTeam(): TeamType {
        return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
    }

    calculateAllMoves() {
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece);
        }

        for (const king of this.pieces.filter(p => p.isKing)) {
            if (king.possibleMoves === undefined) {
                continue;
            }

            king.possibleMoves = [...king.possibleMoves, ...getCastlingMoves(king, this.pieces)];
        }

        this.checkCurrentTeamMoves();

        for (const piece of this.pieces.filter(p => p.team !== this.currentTeam)) {
            piece.possibleMoves = [];
        }

        const possibleMoves = this.pieces.filter(p => p.team === this.currentTeam).some(p => p.possibleMoves !== undefined && p.possibleMoves.length > 0);

        if (possibleMoves) {
            return;
        }

        this.winningTeam = this.currentTeam === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
    }

    checkCurrentTeamMoves() {
        for (const piece of this.pieces.filter(p => p.team === this.currentTeam)) {
            if (piece.possibleMoves === undefined) {
                continue;
            }

            for (const move of piece.possibleMoves) {
                const simulatedBoard = this.clone();

                const pieceAtDestination = simulatedBoard.pieces.find(p => p.samePosition(move));
                if (pieceAtDestination !== undefined) {
                    simulatedBoard.pieces.filter(p => !p.samePosition(move));
                }

                const clonedPiece = simulatedBoard.pieces.find(p => p.samePiecePosition(piece))!;
                clonedPiece.position = move.clone();

                const clonedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === simulatedBoard.currentTeam)!;

                for (const enemy of simulatedBoard.pieces.filter(p => p.team !== simulatedBoard.currentTeam)) {
                    enemy.possibleMoves = simulatedBoard.getValidMoves(enemy);

                    if (enemy.isPawn) {
                        if (enemy.possibleMoves.some(m => m.x !== enemy.position.x && m.samePosition(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => m.samePosition(move));
                        }
                    } else {
                        if (enemy.possibleMoves.some(m => m.samePosition(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => m.samePosition(move));
                        }
                    }
                }
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
        const destinationPiece = this.pieces.find(p => p.samePosition(destination));

        if (playedPiece.isKing && destinationPiece?.isRook && destinationPiece.team === playedPiece.team) {
            const direction = destinationPiece.position.x - playedPiece.position.x > 0 ? 1 : -1;
            const newKingPosition = playedPiece.position.x + direction * 2;

            this.pieces = this.pieces.map(p => {
                if (p.samePiecePosition(playedPiece)) {
                    p.position.x = newKingPosition;
                } else if (p.samePiecePosition(destinationPiece)) {
                    p.position.x = newKingPosition - direction;
                }

                return p;
            });

            this.calculateAllMoves();
            
            return true;
        }

        if (enPassantMove) {
            this.pieces = this.pieces.reduce((result, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }

                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;

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
                    piece.hasMoved = true;

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
        return new Board(this.pieces.map(piece => piece.clone()), this.totalTurns);
    }
}