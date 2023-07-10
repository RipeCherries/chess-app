import {Position} from "./Position";
import {PieceType, TeamType} from "../Types";

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    possibleMoves?: Position[];
    hasMoved: boolean;

    constructor(position: Position, type: PieceType, team: TeamType, hasMoved: boolean, possibleMoves: Position[] = []) {
        this.image = `assets/images/${type}_${team}.png`;
        this.position = position;
        this.type = type;
        this.team = team;
        this.hasMoved = hasMoved;
        this.possibleMoves = possibleMoves;
    }

    get isPawn() {
        return this.type === PieceType.PAWN;
    }

    get isRook() {
        return this.type === PieceType.ROOK;
    }

    get isKnight() {
        return this.type === PieceType.KNIGHT;
    }

    get isBishop() {
        return this.type === PieceType.BISHOP;
    }

    get isKing() {
        return this.type === PieceType.KING;
    }

    get isQueen() {
        return this.type === PieceType.QUEEN;
    }

    samePiecePosition(otherPiece: Piece): boolean {
        return this.position.samePosition(otherPiece.position);
    }

    samePosition(otherPosition: Position): boolean {
        return this.position.samePosition(otherPosition);
    }

    clone(): Piece {
        return new Piece(this.position.clone(), this.type, this.team, this.hasMoved, this.possibleMoves?.map(move => move.clone()));
    }
}