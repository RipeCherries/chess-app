import {Piece} from "./Piece";
import {Position} from "./Position";
import {PieceType, TeamType} from "../Types";

export class Pawn extends Piece {
    enPassant?: boolean;

    constructor(position: Position, team: TeamType) {
        super(position, PieceType.PAWN, team);
    }

}