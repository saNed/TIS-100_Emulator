class ExecutionNode extends Evaluator {
	
	constructor(posX, posY) {
		super()
		this.posX = posX
		this.posY = posY
		$('#nodeRow' + posY).append('<td id="n' + posX + '_' + posY + '"></td>')
		this.div = $('#n' + posX + '_' + posY)
	}

	configureNodeHTML() {
		// The scope inide the callback function of load() recognizes the div
		// as it's 'this' variable, so I can't use properties of ExecutionNode
		// inside. (So I declare these three here.)
		let div = this.div
		let posX = this.posX
		let posY = this.posY

		this.div.load('ExecutionNode.html', function() {

			var $input = div.find('.editor');
			$input.prop("rows", NODE_LENGTH);

			if(localStorage.getItem("node" + posX + '_' + posY) !== null) 
				$input.text(localStorage.getItem("node" + posX + '_' + posY))

			var $roe = div.find('.readOnlyEditor');
			for(var i = 0; i < NODE_LENGTH; i++)
				$roe.append('<div class="line' + i + '" />')

			//on keyup, start the countdown
			$input.on('keyup', function () {
				clearTimeout(typingTimer);
				typingTimer = setTimeout(doneTyping, doneTypingInterval);
			});

			//on keydown, clear the countdown 
			$input.on('keydown', function () {
				clearTimeout(typingTimer);
			})
		});
	}

	readFromEditor() {
		localStorage.setItem("node" + this.posX + '_' + this.posY, this.div.find('.editor').get(0).value)

	 	let linesIn = this.div.find('.editor').get(0).value.split('\n')
		for(var i = 0; i < NODE_LENGTH; i++) {

			let curLine = (i < linesIn.length) ? linesIn[i] : ""
			this.div.find('.line' + i).html(curLine.replace(/^\s+/,'&ensp;'))

			if(!(this.linesCache[i] == curLine)) {
				if(curLine.trim() == "") {
					this.lines[i] = null
					this.linesCache[i] = null
				}
				else
					this.readLine(curLine, i)
			}
		}
	}

	stopNode() {
		this.reset()

		if(this.div) {
			this.div.find( ".editor" ).css( "display", "inline-block")
			this.div.find( ".readOnlyEditor" ).css( "display", "none")

			this.div.find('.accOut').text("<" + this.ACC + ">")
			this.div.find('.bakOut').text("<" + this.BAK + ">")
			this.div.find('.lastOut').text("N/A")
			this.div.find('.modeOut').text(this.mode)
		}

		if(this.posX < COLS_OF_NODES - 1) {
			this.arrows.RIGHT.clearDisplay()
		}
		if(this.posY < ROWS_OF_NODES - 1) {
			this.arrows.DOWN.clearDisplay()
		}
	}

	updateInfobox() {	
		if(this.lines[this.curLine] != null && this.mode == "EXEC") {
			this.removeCurLineCSS()
			this.div.find('.line' + this.curLine).addClass("curLine")
		}

		this.div.find('.accOut').text(this.ACC)
		this.div.find('.bakOut').text("<" + this.BAK + ">")
		this.div.find('.modeOut').text(this.mode)
	}

	sendMoveDataToPort() {
		if(this.needsToWriteToPort == true) {
			this.mode = "WRITE"
			this.arrows[this.writeDir].displayMove(this.writeDir,this.writeVal)
			this.needsToWriteToPort = false
		}
	}

	setCurLineBlockingCSS() {
		this.removeCurLineCSS()
		this.div.find('.line' + this.curLine).addClass("curLineBlocking")
	}

	removeCurLineCSS() {
		this.div.find('.curLineBlocking').removeClass('curLineBlocking');
		this.div.find('.curLine').removeClass('curLine');
	}
}