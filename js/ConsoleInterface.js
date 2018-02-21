var nodeManagerRunning = false;
var curNumpadValue = ''

class ConsoleInterface extends GraphicsDisplay {
	constructor() {
		super()
		this.createConsoleIO()

		$('#stop').click(ConsoleInterface.stopNodes)
		$('#pause').click(ConsoleInterface.pauseExecution)
		$('#step').click(ConsoleInterface.stepNodes)
		$('#run').click(ConsoleInterface.runNodes)
		$('#fast').click(ConsoleInterface.runNodesFast)

		$('#numPad button').each(function(index){
			$(this).click({num: $( this ).text()}, ConsoleInterface.numPadPress)
		})
	}

	createConsoleIO() {
		let consoleArrowString = '<div class="vertical arrows"><div>CONSOLE</div><div class="down arrow-grouping"><div class="downarrow arrow-container"><div class="arrow"></div><div class="arrow smallarrow"></div></div></div><div class="downMoveText"></div></div>'

		$('#nodeSpace').prepend('<tr class="inputRow"><td></td><td></td></tr')
		let arrowFromConsole = $(consoleArrowString)
		arrowFromConsole.addClass("fromConsole")
		$('.inputRow').append(arrowFromConsole)
		nodes[0][1].arrows.UP = new ArrowPair(-1,1,"fromConsole")
		nodes[0][1].neighbors.UP = this
		this.nodeThatInputs = nodes[0][1]

		$('#nodeSpace').append('<tr class="outputRow"></tr>')
		let outputRow = $('.outputRow')
		for(let row = 0; row < (COLS_OF_NODES-2) * 2; row++)
			outputRow.append("<td></td>")
		let arrowToConsole = $(consoleArrowString)
		arrowToConsole.addClass("toConsole")
		outputRow.append(arrowToConsole)
		nodes[ROWS_OF_NODES-1][COLS_OF_NODES-2].arrows.DOWN = new ArrowPair(ROWS_OF_NODES,COLS_OF_NODES-2, "toConsole")
		nodes[ROWS_OF_NODES-1][COLS_OF_NODES-2].neighbors.DOWN = this
		this.nodeThatOutputs = nodes[ROWS_OF_NODES-1][COLS_OF_NODES-2]
	}

	static numPadPress(key) {
		if(key.data.num == "ENTER") {
			consoleInterface.mode = "WRITE"
			consoleInterface.writeTarget = consoleInterface.nodeThatInputs
			consoleInterface.writeVal = curNumpadValue
			consoleInterface.nodeThatInputs.arrows.UP.displayMove("down", curNumpadValue)
			curNumpadValue = ''
		}
		else {
			curNumpadValue += key.data.num
		}
	}

	static stopNodes() {
		ConsoleInterface.pauseExecution()
		inEachNodeCall("stopNode")
		consoleInterface.resetDisplay()
		nodeManagerRunning = false
	}

	static pauseExecution() {
		clearInterval(runInterval)
		$('#step').css("display", "inline")
		$('#pause').css("display", "none")
	}

	static stepNodes() {
		if(!nodeManagerRunning) {
			clearTimeout(typingTimer);
			doneTyping();
			nodeManagerRunning = true
			$(".node").each(function() {
				$(this).find( ".editor" ).css( "display", "none" );
				$(this).find( ".readOnlyEditor" ).css( "display", "inline-block" );
			})
		}
		consoleInterface.step()
		inEachNodeCall("step")
		inEachNodeCall("sendMoveDataToPort")
		inEachNodeCall("updateInfobox")
	}

	static runNodes (speed) {
		clearInterval(runInterval)
		runInterval = setInterval(ConsoleInterface.stepNodes, (1000 / speed) || (1000 / 50))
		$('#pause').css("display", "inline")
		$('#step').css("display", "none")
	}

	static runNodesFast() {
		ConsoleInterface.runNodes(5000)
	}
}

