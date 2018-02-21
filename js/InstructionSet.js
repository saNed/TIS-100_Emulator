class InstructionSet {
	NOP() {
		this.goToNextLine()
	}

	MOV(SRC, DEST) {
		let readVal = this.read(this.lines[this.curLine].params.SRC)
		if(readVal == "BLOCKING") {
			this.setCurLineBlockingCSS()
			this.writeDir = DEST
		}
		else {
			this.write(readVal, this.lines[this.curLine].params.DEST)
			this.goToNextLine()
		}
	}

	SWP() {
		[this.ACC, this.BAK] = [this.BAK, this.ACC]
		this.goToNextLine()
	}

	SAV() {
		this.BAK = this.ACC
		this.goToNextLine()
	}

	ADD(SRC) {
		let readVal = this.read(this.lines[this.curLine].params.SRC)
		if(readVal == "BLOCKING") {
			this.setCurLineBlockingCSS()
		}
		else {
			this.ACC += readVal
			this.clampACCValue()
			this.goToNextLine()
		}
	}

	SUB(SRC) {
		let readVal = this.read(this.lines[this.curLine].params.SRC)
		if(readVal == "BLOCKING") {
			this.setCurLineBlockingCSS()
		}
		else {
			this.ACC -= readVal
			this.clampACCValue()
			this.goToNextLine()
		}
	}

	NEG() {
		this.ACC *= -1
		this.goToNextLine()
	}

	JMP(LABEL) {
		let jmpLine = -1
		for(var i = NODE_LENGTH-1; i >= 0; i--) {
			if(this.lines[i]) {
				if(this.lines[i].label == this.lines[this.curLine].params.LABEL) {
					jmpLine = i
				}
			}
		}
		if(jmpLine != -1)
			this.curLine = jmpLine
		else
			console.log("Label not present??? Should be caught at compiletime... ", this.lines[this.curLine].params.LABEL)
	}

	JEZ(LABEL) {
		if(this.ACC == 0)
			this.JMP(LABEL)
		else
			this.goToNextLine()
	}

	JNZ(LABEL) {
		if(this.ACC != 0)
			this.JMP(LABEL)
		else
			this.goToNextLine()
	}

	JGZ(LABEL) {
		if(this.ACC > 0)
			this.JMP(LABEL)
		else
			this.goToNextLine()
	}

	JLZ(LABEL) {
		if(this.ACC < 0)
			this.JMP(LABEL)
		else
			this.goToNextLine()
	}

	JRO(SRC) {
		this.curLine = this.curLine + Number(this.lines[this.curLine].params.LABEL) - 1
	}

	HCF() {
		document.body.innerHTML = "";
	}


	read(source) {
		if(NEIGHBOR_NODES.indexOf(source) != -1) {
			if(this.neighbors[source].mode == "WRITE" && this.neighbors[source].writeTarget == this) {

				this.arrows[source].clearDisplay()
				this.mode = "EXEC"
				this.neighbors[source].mode = "EXEC"
				let writeVal = this.neighbors[source].writeVal
				delete this.neighbors[source].writeVal

				return writeVal
			}
			else if(this.mode != "READ") {
				this.mode = "READ"
				this.readDir = source
				this.readTarget = this.neighbors[source]
				this.arrows[source].displayMove(OPPOSITE_DIR[NEIGHBOR_NODES.indexOf(source)], "?")		
			}
			return "BLOCKING"
		}

		if(source == "ACC")
			return this.ACC
		if(source == "NIL")
			return 0
		if(source == "ANY" || source == "LAST")
			throw new Error("ANY and LAST not implemented!!!")
		if(typeof parseInt(source) == "number")
			return parseInt(source)

		throw new Error("Invalid src???")
	}

	write(writeVal, dest) {
		if(NEIGHBOR_NODES.indexOf(dest) != -1) {
			this.setCurLineBlockingCSS()
			this.needsToWriteToPort = true
			this.writeVal = writeVal
			this.writeDir = dest
			this.writeTarget = this.neighbors[dest]
			return
		}
		else if(dest == "ACC") {
			this.ACC = writeVal
			this.clampACCValue()
		}
		else if(dest == "NIL")
			console.log("Wrote to NIL")
		else if(dest == "ANY" || dest == "LAST")
			throw new Error("ANY and LAST not implemented!!!", dest)
		else
			throw new Error("Invalid dest???", dest)
		this.mode = "EXEC"
	}

	clampACCValue() {
		if(this.ACC > 999)
			this.ACC = 999
		if(this.ACC < -999)
			this.ACC = -999
	}
}