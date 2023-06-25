import {Piece, Position} from "./models";

export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const GRID_SIZE = 80;

export const samePosition = (position1: Position, position2: Position) => {
    return position1.x === position2.x && position1.y === position2.y;
}

export enum PieceType {
    PAWN = "pawn",
    BISHOP = "bishop",
    KNIGHT = "knight",
    ROOK = "rook",
    QUEEN = "queen",
    KING = "king"
}

export enum TeamType {
    OPPONENT = "b",
    OUR = "w"
}

export const initialBoardState: Piece[] = [
    new Piece(new Position(0, 6), PieceType.PAWN, TeamType.OPPONENT),
    new Piece(new Position(1, 6), PieceType.PAWN, TeamType.OPPONENT),
    new Piece(new Position(2, 6), PieceType.PAWN, TeamType.OPPONENT),
    new Piece(new Position(3, 6), PieceType.PAWN, TeamType.OPPONENT),
    new Piece(new Position(4, 6), PieceType.PAWN, TeamType.OPPONENT),
    new Piece(new Position(5, 6), PieceType.PAWN, TeamType.OPPONENT),
    new Piece(new Position(6, 6), PieceType.PAWN, TeamType.OPPONENT),
    new Piece(new Position(7, 6), PieceType.PAWN, TeamType.OPPONENT),

    new Piece(new Position(0, 1), PieceType.PAWN, TeamType.OUR),
    new Piece(new Position(1, 1), PieceType.PAWN, TeamType.OUR),
    new Piece(new Position(2, 1), PieceType.PAWN, TeamType.OUR),
    new Piece(new Position(3, 1), PieceType.PAWN, TeamType.OUR),
    new Piece(new Position(4, 1), PieceType.PAWN, TeamType.OUR),
    new Piece(new Position(5, 1), PieceType.PAWN, TeamType.OUR),
    new Piece(new Position(6, 1), PieceType.PAWN, TeamType.OUR),
    new Piece(new Position(7, 1), PieceType.PAWN, TeamType.OUR),

    new Piece(new Position(0, 7), PieceType.ROOK, TeamType.OPPONENT),
    new Piece(new Position(7, 7), PieceType.ROOK, TeamType.OPPONENT),
    new Piece(new Position(0, 0), PieceType.ROOK, TeamType.OUR),
    new Piece(new Position(7, 0), PieceType.ROOK, TeamType.OUR),

    new Piece(new Position(1, 7), PieceType.KNIGHT, TeamType.OPPONENT),
    new Piece(new Position(6, 7), PieceType.KNIGHT, TeamType.OPPONENT),
    new Piece(new Position(1, 0), PieceType.KNIGHT, TeamType.OUR),
    new Piece(new Position(6, 0), PieceType.KNIGHT, TeamType.OUR),

    new Piece(new Position(2, 7), PieceType.BISHOP, TeamType.OPPONENT),
    new Piece(new Position(5, 7), PieceType.BISHOP, TeamType.OPPONENT),
    new Piece(new Position(2, 0), PieceType.BISHOP, TeamType.OUR),
    new Piece(new Position(5, 0), PieceType.BISHOP, TeamType.OUR),

    new Piece(new Position(3, 7), PieceType.QUEEN, TeamType.OPPONENT),
    new Piece(new Position(3, 0), PieceType.QUEEN, TeamType.OUR),

    new Piece(new Position(4, 7), PieceType.KING, TeamType.OPPONENT),
    new Piece(new Position(4, 0), PieceType.KING, TeamType.OUR)
];