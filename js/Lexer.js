const INSTRUCTIONS = {
	'NOP': [],
	'MOV': ['SRC', 'DEST'],
	'SWP': [],
	'SAV': [],
	'ADD': ['SRC'],
	'SUB': ['SRC'],
	'NEG': [],
	'JMP': ['LABEL'],
	'JEZ': ['LABEL'],
	'JNZ': ['LABEL'],
	'JGZ': ['LABEL'],
	'JLZ': ['LABEL'],
	'JRO': ['LABEL'],
	'HCF': []
}

class Lexer {
	constructor(line) {
		if(line.match(/[^\w\:\;\,\#\- ]/))
			throw new Error('Syntax??? ' + line)

		if(line.includes('#'))
			line = line.substring(0,line.indexOf('#'))

		let words = line.replace(/[\,\;]/g,'').toUpperCase().trim().split(' ');

		if(words[0].substr(-1) == ':') {
			this.label = words[0].slice(0,-1);
			words.shift();
		}

		if(words.length == 0)
			return

		this.operator = words[0]
		words.shift()

		if(INSTRUCTIONS[this.operator] == undefined) {
			throw new Error('Invalid operator??? ' + line)
		}

		if(INSTRUCTIONS[this.operator].length != words.length)
			throw new Error('Wrong number of params??? ' + this.operator +" "+ words.length)

		this.params = {}
		for(var i = 0; i < words.length; i++) {
			this.params[INSTRUCTIONS[this.operator][i]] = words[i]
		}

		if(this.params.SRC && !NODES.includes(this.params.SRC) && !typeof SRC == 'number')
			throw new Error('Invalid src node???')

		if(this.params.DEST && !NODES.includes(this.params.DEST))
			throw new Error('Invalid dest node???')
	}
}