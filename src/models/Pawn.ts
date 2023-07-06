import {Piece} from "./Piece";
import {Position} from "./Position";
import {PieceType, TeamType} from "../Types";

export class Pawn extends Piece {
    enPassant?: boolean;

    constructor(position: Position, team: TeamType, enPassant?: boolean, possibleMoves: Position[] = []) {
        super(position, PieceType.PAWN, team, possibleMoves);
        this.enPassant = enPassant;
    }

    clone(): Pawn {
        return new Pawn(this.position.clone(), this.team, this.enPassant, this.possibleMoves?.map(move => move.clone()));
    }
}