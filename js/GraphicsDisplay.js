const SCREEN_WIDTH = 36
const SCREEN_HEIGHT = 22
const COLORS = ["#000000", "#464646", "#9c9c9c", "#fafafa", "#c00b0b"]

class GraphicsDisplay {
	constructor() {
		let gdDiv = $('#gdBody')
		for(let y = 0; y < SCREEN_HEIGHT; y++) {
			let screenRow = ""
			for(let x = 0; x < SCREEN_WIDTH; x++) {
				screenRow += '<td id="pixel' + x + '_' + y + '"></td>'
			}
			gdDiv.append("<tr>" + screenRow + "</tr>")
		}
		this.resetCurrentPosition()
	}

	resetDisplay() {
		$(".toConsole").find(".downMoveText").text("")
		$(".fromConsole").find(".downMoveText").text("")
		$('#gdBody').find("td").css("background-color", COLORS[0])
		this.resetCurrentPosition()
	}

	resetCurrentPosition() {
		this.curX = -1
		this.curY = -1

	}

	step() {
		let textFromOutput = $(".toConsole").find(".downMoveText").text()
		if(textFromOutput != "") {
			$(".toConsole").find(".downMoveText").text("")
			$(".toConsole").find(".smallarrow").css("display", "inline")

			this.nodeThatOutputs.removeCurLineCSS()
			this.nodeThatOutputs.mode = "EXEC"
			var valueToUse = this.nodeThatOutputs.writeVal
			delete this.nodeThatOutputs.writeVal
		
			if(valueToUse < 0) {
				this.resetCurrentPosition()
			}
			else if(this.curX == -1) {
				this.curX = valueToUse
			}
			else if(this.curY == -1) {
				this.curY = valueToUse
			}
			else {
				let colorIndexToUse = (valueToUse < COLORS.length) ? valueToUse : 0
				$("#pixel" + this.curX + "_" + this.curY).css("background-color", COLORS[colorIndexToUse])
			}

		}
	}
}