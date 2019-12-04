import React, { createContext, useReducer, useContext } from 'react';
import Board from '../Board/board.js';
import {useStoreContext} from '../../utils/GlobalState';
import {
  UPDATE_BOARD,
} from "../../utils/actions";

let player1="player1";
let player2="AI";
// adjacent spaces
let direction = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
// white == 1
// black == 2
let boards = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
let status= "";
let turn= 'White';
let winner= null;
let player= player1;
let passCounter = 0;
let startedGame = false;

function CompGame(props) {
	console.log("context", useStoreContext());
	const [{board}, dispatch] = useStoreContext();
	let squares = board;
	if (!startedGame) {
		squares = startGame(boards);	
		dispatch({type: UPDATE_BOARD, board: squares});
		console.log(squares);
		startedGame = true;
	}
	console.log("start game", squares);
	const element = (
		<div>
	        <div className="game">
	        	<h3>Score</h3>
	        	<div id="score">
	        		<p>White: <span id="score-white">{getScores(squares).white}
	        			|| Black: </span><span id="score-black">{getScores(squares).black}</span>
	        		</p>
	        	</div>
	          	<div className="game-board">
	            	<Board
	            		board = {squares}
	            		onClick = {handleClick}
	            		dispatch = {dispatch}
	            	/>
	          	</div>
	          	<div className="game-info">
	            	<h3>Turn</h3>
	            	<div id="player-turn-box">
	            	{turn}, {player}
	            	</div>
	        	</div>
	        	<div className="game-status">
	        		<h3>Status</h3>
	        		{status}
	        	</div>
	    	</div>
	    </div>
	);

	function aiTurn(board) {
		let choices = getValidMoves(board);
		console.log("Droid's choices are "+choices);
		let move = aiMove(choices);
		console.log("Droid's move is "+move);
		return move;
	}
	function aiMove(options) {
		let move = options[Math.floor(Math.random() * options.length)];
		return move;
	}

	function resetBoard(board) {
		for (var x = 0; x < board.length; x++) {
			for (var y = 0; y < board.length; y++) {
				//set square to empty
				board[x][y] = 0;
			}
		}
		return board;
	}
	function startGame(board) {
	 	resetBoard(board);
	 	//set middle 4 squares to black and white
	 	board[3][3] = 1;
	 	board[4][4] = 1;
	 	board[3][4] = 2;
	 	board[4][3] = 2;
		board = getBoardValidMoves(board);
		console.log(board);
		status = "New game with AI started. "+player+" goes first!"
		return board;
	}

	function isValidMove(board,xPos,yPos) {
		let color;
		let otherColor;
		if (turn === "White") {
			color = 1;
			otherColor = 2;
		}
		else if (turn === "Black") {
			color = 2;
			otherColor = 1;
		}
	 	if (board[xPos][yPos] != 0 && board[xPos][yPos] != 3 || !isOnBoard(xPos,yPos)) {
	 		return false;
	 	}
	 	let changedColors = [];
	 	direction.forEach(dir => {
	 		let xDir = dir[0];
	 		let yDir = dir[1];
	 		let x = xPos;
	 		let y = yPos;
	 		x += xDir;
	 		y += yDir;
	 		if (isOnBoard(x,y) && board[x][y] === otherColor) {
	 			x += xDir;
	 			y += yDir;
	 			if (!isOnBoard(x,y)) {
	 				return;
	 			}
				while (board[x][y] === otherColor && isOnBoard(x,y)) {
					x += xDir;
					y += yDir;
					if (!isOnBoard(x,y)) {
						break;
					}
	 			}
	 			if (!isOnBoard(x,y)) {
	 				return;
	 			}
	 			if (board[x][y] === color) {
	 				let matchColor = true;
	 				while (matchColor) {
	 					changedColors.push([x,y]);
	 					x -= xDir;
	 					y -= yDir;
	 					if (x === xPos && y === yPos) {
	 						changedColors.push([x,y]);
	 						break;
	 					}
	 				} 

	 			}
	 		}
	 	});
	 	board[xPos][yPos] = 0;
	 	if (changedColors.length === 0) {
	 		return false;
	 	}
	 	return changedColors;
	}

	function getBoardValidMoves(board) {
		let space;
		if (!getValidMoves(board)) {
			console.log("no valid moves");
			return board;
		}
		else {
			for (space of getValidMoves(board)) {
				let x = space[0];
				let y = space[1];
				//highlight these squares
				board[x][y] = 3;
				console.log("valid move found",[x,y]);
			}
			return board;
		}
	}

	function swapColor() {
		let newColor;
		if (turn === "White") {
			newColor = 1;
		}
		else
			newColor = 2;
		return newColor;
	}

	function getBoardSwapColors(board,array) {
		console.log(array);
		array.forEach(space => {
			let x = space[0];
			let y = space[1];
			//flip pieces
			console.log(x,y);
			board[x][y] = swapColor();
		})
		clearChoices(board);
		player = player === player1? player2: player1;
		turn = turn === 'White' ? 'Black': 'White';
		squares = board;
	}

	function clearChoices(board) {
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				if (board[x][y] === 3) {
					board[x][y] = 0;
				}
			}
		}
	}

	function getValidMoves(board) {
		let validMoves = [];
		let range = Array.from({length: 8}, (x,i) => i);
		let x,y;
		for (x of range) {
			for (y of range) {
				if (isValidMove(board,x,y)) {
					validMoves.push([x,y]);
				}
			}
		}
		if (validMoves.length === 0) {
			return null;
		}
		else
			return validMoves;
	}

	function isOnBoard(x,y) {
		if (x >= 0 && x <= 7 && y >= 0 && y <= 7 ) {
			return true;
		}
		else
			return false;
	}

	function getScores(board) {
		let scoreW = 0;
		let scoreB = 0;
		let range = Array.from({length: 8}, (x,i) => i);
		let x,y;
		//count number of colored pieces
		for (x of range) {
			for (y of range) {
				if (board[x][y] === 1) {
					scoreW++;
				}
				if (board[x][y] === 2) {
					scoreB++;
				}
			}
		}
		return {white: scoreW, black:scoreB};
	}

	function pass() {
		if (getValidMoves(squares) === null) {
			
			return true;
		}
		else {
			console.log("pass failed");
			return false;
		}
	}
	function isGameOver() {
		if (passCounter > 1 || isBoardFull()) {
			console.log("Game is Over");
			return true;
		}
		else
			return false;
	}

	function isBoardFull() {
		let range = Array.from({length: 8}, (x,i) => i);
		let x,y;
		for (x of range) {
			for (y of range) {
				if (board[x][y] === 0 || board[x][y] === 3) {return false;}
			}
		}
		console.log("Board is full");
		return true;
	}

	function rematch() {
		// const [show, setShow] = useState(false);

		// const handleClose = () => setShow(false);
		// const handleShow = () => setShow(true);

		// return (
		// <>
		//   	<Button variant="primary" onClick={handleShow}>
		//     	Launch demo modal
		//   	</Button>

		//   	<Modal show={show} onHide={handleClose}>
		//     	<Modal.Header closeButton>
		//       		<Modal.Title>Modal heading</Modal.Title>
		//     	</Modal.Header>
		//     	<Modal.Body>{status}</Modal.Body>
		//     	<Modal.Footer>
		//       		<Button variant="secondary" onClick={handleClose}>
		//         		Leave Lobby
		//       		</Button>
		//       		<Button variant="primary" onClick={handleClose}>
		//         		rematch
		//       		</Button>
		//     	</Modal.Footer>
		//   	</Modal>
		// </>
		// );
	}

	function sleep(ms) {
  		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function demo() {
  		console.log('Taking a break...');
  		await sleep(2000);
  		console.log('Two second later');
  		return true;
	}

	function handleClick(x,y,dispatch) {
		console.log(x,y);
		let wait = false;
		if (!pass() && isValidMove(squares,x,y)) {
			let moves = getValidMoves(squares);
			for (let i = 0; i < moves.length; i++) {
				if (moves[i][0] === x && moves[i][1] === y) {
					getBoardSwapColors(squares,isValidMove(squares,x,y));
					if (pass() && !isGameOver()) {
						let playerPassing = player;
						player = player === player1? player2: player1;
						turn = turn === 'White' ? 'Black': 'White';
						status = playerPassing+" has no available moves. Pass";
						passCounter++;
						console.log(status);
						console.log(passCounter);
						clearChoices(squares);
						getBoardValidMoves(squares);
						dispatch({type: UPDATE_BOARD, board: squares});
						console.log("dispatch made");
						return;
					}
					else
						getBoardValidMoves(squares);
				}
			}
			if (isGameOver()) {
				let finalScore = getScores(squares);
				let winner;
				if (finalScore.white > finalScore.black ) {
					winner = "Player 1";
				}
				else if (finalScore.white < finalScore.black) {
					winner = "Player 2";
				}
				else {
					winner = "No one";
				}
				status= "Game over! Winner is "+winner;
				dispatch({type: UPDATE_BOARD, board: squares});
				rematch();
				return;
			}
			passCounter = 0;
			console.log(squares);
			console.log(turn);
			console.log(getScores(squares));
			status='';
			dispatch({type: UPDATE_BOARD, board: squares});
			console.log("dispatch made");
			wait = demo();
			if (player === player2 && wait) {
				let move = aiTurn(squares);
				// getBoardValidMoves(squares);
				getBoardSwapColors(squares,isValidMove(squares,move[0],move[1]));
				getBoardValidMoves(squares);
				dispatch({type: UPDATE_BOARD, board: squares});
				console.log("droid move made");
			}
			return;
		}
		// else  if (pass()){
		// 	let playerPassing = player;
		// 	player = player === player1? player2: player1;
		// 	turn = turn === 'White' ? 'Black': 'White';
		// 	status = playerPassing+" has no available moves. Pass";
		// 	passCounter++;
		// 	console.log(status);
		// 	console.log(passCounter);
		// 	clearChoices(squares);
		// 	getBoardValidMoves(squares);
		// 	dispatch({type: UPDATE_BOARD, board: squares});
		// 	console.log("dispatch made");
		// 	return;
		// }
		else {
			status = "Not a valid move. Try again.";
			getBoardValidMoves(squares);
			dispatch({type: UPDATE_BOARD, board: squares});
			return;
		}

	}
	return element;
}

export default CompGame;