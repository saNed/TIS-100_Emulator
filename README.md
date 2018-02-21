# TIS-100 Architecture Emulator and Assembly Interpreter

A real emulator for an imaginary CPU.

**[--> See it in action here. <--](https://saned.github.io/TIS-100_Emulator/)**

<br><br>

### What's a TIS-100?
[TIS-100](http://www.zachtronics.com/tis-100/) bills itself as "the assembly programming game you never asked for."

Its core gameplay involves programming tasks in it's own constrictive (but still Turing complete!) assembly language (detailed [here](https://steamcommunity.com/sharedfiles/filedetails/?id=456879799)). Its difficulty arises from the limitations of the resources provided. The computer is split up into 12 nodes that compute independently and can communicate with each other. Each has only two registers.

<br>

### What's in this repository?
The code in this project replicates this architecture.
* It has an interpreter for the TIS-100's assembly language
* It simulates the tesselated-nodes architecture structure
* It allows users to input values by keypad and write data to the pixels of a graphics display

<br>

### What's NOT in this repository?
* the game's puzzles
* the test cases that verify the solutions to these puzzles
* the mechanism to check user code against a test case

(These ommisions are intentional to avoid creating a market substitute.)

<br>

###  What's it written in?
I tried to avoid heavy framework/library usage, in the spirit of keeping things relatively low-level.

I ended up using jQuery, but beyond that, the project is plain HTML, CSS, and Javascript.

To avoid loading images, all the icons and arrows are made out of pure css.

<br>

### How's the code organized?

*Lexer.js*
> converts a line of inputted assembly code into a javascript object that represents the same operation.

*InstructionSet.js*
> contains a function for each assembly instruction in the language. This gets inherited by...

*Evaluator.js*
> which evaluates the code inside a node. It uses Lexer.js to turn assembly code into tokens, then applies the tokenized versions of the instructions to the functions in InstructionSet.js. This gets inherited by...

*ExecutionNode.js*
> which acts as an interface between the node's evaluator and the node's presense in the DOM.

*ArrowPair.js*
> which controls the DOM presense of the arrows that indicate communication between nodes.

*ConsoleInterface.js*
> controls the logic for the console buttons that tells nodes when to execute.

*GraphicsDisplay.js*
> controls the graphical display that can be written to.

<br>

### What if I want a larger grid or bigger nodes?

Feel free to change NODE_LENGTH, COLS_OF_NODES, and ROWS_OF_NODES to have more space to program in.

You can also change SCREEN_WIDTH and SCREEN_HEIGHT for a higher-resolution display.
