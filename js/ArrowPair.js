class ArrowPair {

	constructor(posX, posY, orientation) {
		this.posX = posX
		this.posY = posY
		this.orientation = orientation


		if(orientation == "horizontal") {
			$('#n' + posX + '_' + posY).after('<td id="ah' + posX + '_' + posY + '"></td>')
			this.div = $('#ah' + posX + '_' + posY)
			$('#ah' + posX + '_' + posY).load('HorizontalArrows.html')
		}
		else if(orientation == "vertical") {
			if(posX != 0)
				$("#arrowRow" + posY).append('<td></td>')
			$("#arrowRow" + posY).append('<td id="av' + posX + '_' + posY + '"></td>')
			this.div = $('#av' + posX + '_' + posY)
			$('#av' + posX + '_' + posY).load('VerticalArrows.html')
		}
		else if(orientation == "toConsole" || orientation == "fromConsole") {
			this.div = $("." + orientation)
		}

		else
			throw new Error("Invalid arrow orientation??? " + orientation)
	}

	displayMove(ArrowDirection, valueToMove) {
		let dir = ArrowDirection.toLowerCase()
		this.div.find('.' + dir + 'arrow').find('.smallarrow').css("display", "none")
		this.div.find('.' + dir + 'MoveText').css("visibility", "visible")
		this.div.find('.' + dir + 'MoveText').text(valueToMove)
	}

	clearDisplay() {
		this.div.find(".moveText").css("visibility", "hidden")
		this.div.find(".smallarrow").css("display", "inline")
	}
}