const NEIGHBOR_NODES = ['LEFT', 'RIGHT', 'UP', 'DOWN']
const OPPOSITE_DIR = ['RIGHT', 'LEFT', 'DOWN', 'UP']
const NODES = NEIGHBOR_NODES + ['ACC', 'NIL', 'ANY', 'LAST']
const NODE_LENGTH = 15

class Evaluator extends InstructionSet {
	constructor() {
		super()
		this.reset()
		this.lines = Array(NODE_LENGTH).fill(null)
		this.linesCache = Array(NODE_LENGTH).fill(null)
		
		this.neighbors = {
			LEFT: null,
			RIGHT: null,
			UP: null,
			DOWN: null
		}

		this.arrows = {
			LEFT: null,
			RIGHT: null,
			UP: null,
			DOWN: null
		}
	}

	reset() {
		this.ACC = 0
		this.BAK = 0
		this.curLine = 0
		this.mode = "IDLE"
		this.needsToWriteToPort == false
	}

	readLine(str, lineNum) {
		try {
			this.lines[lineNum] = new Lexer(str)
			this.linesCache[lineNum] = str
		} catch(e) {
			console.log("Caught Error: " + e.message)
		}
	}

	step() {
		if(this.mode == "IDLE") {
			if(this.lines.reduce((acc, cur) => acc = acc || cur, false) == null) {
				//console.log("No lines???")
			}
			else
				this.mode = "EXEC"		
			return
		}

		if(this.mode == "WRITE")
			return

		if(!this.lines[this.curLine].operator)
			this.goToNextLine()
		this[this.lines[this.curLine].operator]()
	}

	goToNextLine() {
		this.curLine = (this.curLine + 1) % NODE_LENGTH
		while(!this.lines[this.curLine] || !this.lines[this.curLine].operator)
			this.curLine = (this.curLine + 1) % NODE_LENGTH		
	}
}