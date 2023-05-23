import {PieceType, TeamType} from "../components/chessBoard/ChessBoard";

class Referee {
    isValidMove(prevX: number, prevY: number, x: number, y: number, type: PieceType, team: TeamType) {
        if (team === TeamType.OUR) {
            if (prevY === 1) {
                if (prevX === x && (y - prevY === 1 || y - prevY === 2)) {
                    return true;
                }
            } else {
                if (prevX === x && y - prevY === 1) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default Referee;