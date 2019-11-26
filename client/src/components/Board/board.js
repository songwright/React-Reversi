import React from 'react';
import './board.css';
import Square from './square.js';


function Board() {

    const board = [];
    let subArr;
    for (let i = 0; i < 8; i++) {
        subArr = []
        for (let j = 0; j < 8; j++) {
        subArr.push([0])
            // subArr.push(0)
            if (j === 7) {
                board.push(subArr)
            }
        }
    }
    console.log(board)
    // for (let i = 0; i < 8; i++) {
    //     const squareRows = [];
    //     for (let j = 0; j < 8; j++) {
    //         squareRows.push(this.renderSquare((i * 8) + j));
    //     }
    //     board.push(<div className="board-row">{squareRows}</div>)
    //     console.log()
    // }
    return (
        <div>
            {board.map(row => {
                return <div className='row'>
                    {row.map(piece => {
                        return <Square color={piece[0]}></Square>
                    })}
                </div>
            })}
        </div>
    );


}
export default Board;