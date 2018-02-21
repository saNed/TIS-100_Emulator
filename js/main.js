const nodes = []

const COLS_OF_NODES = 4
const ROWS_OF_NODES = 3

var typingTimer;
var runInterval;
var currentlyExecuting = false;

const doneTypingInterval = 3000;

var consoleInterface

$(document).ready(function(){

	if(localStorage.length == 0)
		loadPresetNodes()

	for(let row = 0; row < ROWS_OF_NODES; row++) {
		nodes[row] = []
		$('#nodeSpace').append('<tr class="nr" id="nodeRow' + row + '"></tr>')
		for(let col = 0; col < COLS_OF_NODES; col++)
			createNode(col, row)
	}
	for(let row = 0; row < ROWS_OF_NODES; row++) {
		for(let col = 0; col < COLS_OF_NODES-1; col++) {
			horizontalAP = new ArrowPair(col, row, "horizontal")
			nodes[row][col].arrows.RIGHT = horizontalAP
			nodes[row][col+1].arrows.LEFT = horizontalAP
		}
	}
	for(let row = 0; row < ROWS_OF_NODES-1; row++) {
		$('#nodeRow' + row).after('<tr class="ar" id="arrowRow' + row + '"></tr>')
		for(let col = 0; col < COLS_OF_NODES; col++) {
			verticalAP = new ArrowPair(col, row, "vertical")
			nodes[row][col].arrows.DOWN = verticalAP
			nodes[row+1][col].arrows.UP = verticalAP
		}
	}

	consoleInterface = new ConsoleInterface()
});

function createNode(posX, posY) {
	nodes[posY][posX] = new ExecutionNode(posX, posY)

	if(posX != 0) {
		nodes[posY][posX].neighbors.LEFT = nodes[posY][posX-1]
		nodes[posY][posX-1].neighbors.RIGHT = nodes[posY][posX]
	}

	if(posY != 0) {
		nodes[posY][posX].neighbors.UP = nodes[posY-1][posX]
		nodes[posY-1][posX].neighbors.DOWN = nodes[posY][posX]
	}

	nodes[posY][posX].configureNodeHTML()	
}

function loadPresetNodes() {
	localStorage.setItem("node1_1","START:\nMOV ACC, DOWN\nADD 1\nSAV\nSUB 36\nJEZ RESET\nSWP\nJMP START\n\nRESET: MOV 0, ACC\nJMP START\n")
	localStorage.setItem("node1_2","MOV -2, ACC\nSAV\nSTART:\nMOV UP, ACC\nMOV ACC, RIGHT\nJEZ INC\nRETURN: SWP\nMOV ACC, RIGHT\nSAV\nJMP START\nINC:\nSWP\nADD 2\nSAV\nJMP RETURN")
	localStorage.setItem("node2_2","MOV LEFT, DOWN\nMOV LEFT, DOWN\nMOV 3, DOWN\nMOV -1, DOWN\n\nMOV RIGHT, DOWN\nMOV RIGHT, DOWN\nMOV 3, DOWN\nMOV -1, DOWN\n")
	localStorage.setItem("node3_1","RESET:\nMOV 36 ACC\nJMP START\n\nSTART:\nSUB 1\nMOV ACC, DOWN\nJEZ RESET\nJMP START")
	localStorage.setItem("node3_2","MOV 21, ACC\nSAV\nSTART:\nMOV UP, ACC\nMOV ACC LEFT\nJEZ DECREMENT\nSWP\nMOV ACC, LEFT\nSWP\nJMP START\nDECREMENT: SWP\nMOV ACC, LEFT\nSUB 2\nSAV\nJMP START")
}

function doneTyping() {
	inEachNodeCall("readFromEditor")
}

function clearTextInAllNodes() {
	for(let x = 0; x < nodes.length; x++)
		nodes[x].div.find('.editor').html("")
	localStorage.clear()
}

function inEachNodeCall(_function) {
	for(let row = 0; row < ROWS_OF_NODES; row++) {
		for(let col = 0; col < COLS_OF_NODES; col++)
			nodes[row][col][_function]()
	}
} 
