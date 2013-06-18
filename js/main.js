/*-------------------------------------------------------------------*
 *	Title:			main.js											 *
 *	Author:			Roberto Gomez									 *
 *	Date:			6/17/13											 *
 *	Description:	A robust and versatile take on the Game of Nim	 *
 *					using JS to manipulate DOM elements.			 *
 *-------------------------------------------------------------------*/

function startGame() {
	var playButton = document.getElementById('playButton');
	playButton.style.display = 'none';						// Hide playButton link

	var maxColumns = 5;										// Maximum number of columns possible
	var maxTokens = 5;										// Maximum number of tokens possible in each column
	var dx = 400/maxColumns;								// Division sizes in pixels to draw tokens in playArea
	var dy = 350/maxTokens;									// Used for calculating pos_x and pos_y of Token objects

	var numOfCol = getRandomInt(2, maxColumns);				// Actual number of columns in this round
	var tokens = Array(numOfCol);							// Create random 2D array for storing Token objects
	for (var i=0; i<numOfCol; i++)							// First index represents the column
		tokens[i] = Array(getRandomInt(2, maxTokens));		// Second index represents the Token object in each column

	for (var i=0; i<tokens.length; i++) {
		for (var j=0; j<tokens[i].length; j++) {
			// Create Token objects and assign to tokens array
			tokens[i][j] = new Token(((20 + i * dx)), (400 - (dy + j * dy)), i, j);
			document.body.appendChild(tokens[i][j].element);	// Add token element to DOM
			tokens[i][j].element.classList.add('token');		// Apply token CSS class as specified in nim.css

			// Specify location of tokens in DOM
			tokens[i][j].element.style.left = tokens[i][j].pos_x + 'px';
			tokens[i][j].element.style.top = tokens[i][j].pos_y + 'px';

			// Add event listeners to trigger functions on click of a token
			// Need to use anonymous function in order to pass indices of
			// clicked token as arguments to removeTokens()
			tokens[i][j].element.addEventListener("click", function(){removeTokens(this.heap, this.order)}, false);
			//tokens[i][j].element.addEventListener("click", delayCompTurn, false);
		}
	}

	// Constructor function for creating token objects
	// Heap and order are sub-properties of the element property because they
	// need to be accessible using the this keyword when the event listener for
	// removeTokens() is added to the Token objects
	function Token(pos_x, pos_y, heap, order) {
		this.pos_x = pos_x;									// X position for CSS left property
		this.pos_y = pos_y;									// Y position for CSS top property
		this.element = document.createElement('div');		// HTML element placed in DOM
		this.element.heap = heap;							// Index values used for accessing the tokens
		this.element.order = order;			 				// array, eg tokens[heap][order]

		/*this.decreaseHeap = function() {
			this.element.heap = this.element.heap - 1;
		};*/
	}

	// Returns a random integer between min and max
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/*---------------------------------------------------------------*
	 * removeTokens() function										 *
	 *																 *
	 * Removes the token specified by the column and row			 *
	 * parameters from both the DOM and the tokens array.			 *
	 * DOM. Removes token elements starting from the top of the		 *
	 * column down to the specified token. To prevent invalid array	 *
	 * access and to update the number of tokens in a column the	 *
	 * Token objects are removed from the tokens array using the pop *
	 * method.														 *
	 *---------------------------------------------------------------*/

	function removeTokens(column, row) {
		console.log("[" + tokens[column][row].element.heap + "][" + tokens[column][row].element.order + "]");
		for (var j=tokens[column].length-1; j>=row; j--) {
			tokens[column][j].element.parentNode.removeChild(tokens[column][j].element);
			tokens[column].pop();
		}

		// When column is depleted of tokens, reduce the heap properties of
		// all the following columns by one, then remove the empty column
		// from the tokens array
		if (tokens[column].length == 0) {
			for (var i=column+1; i<tokens.length; i++)
				for (var j=0; j<tokens[i].length; j++)
					tokens[i][j].element.heap--;
			tokens.splice(column, 1);
		}
	}

	/*---------------------------------------------------------------*
	 * delayCompTurn() function										 *
	 *																 *
	 * Function used to call startCompTurn() after 2 sec.			 *
	 *---------------------------------------------------------------*/

	function delayCompTurn() {
		window.setTimeout(startCompTurn, 2000);
	}

	/*---------------------------------------------------------------*
	 * startCompTurn() function										 *
	 *																 *
	 * Responsible for starting the computer's turn at selecting	 *
	 * tokens. First checks if there are any tokens left to choose,	 *
	 * if not, it returns the warning message. Uses the				 *
	 * getRandomInt() function to choose random indices for a token, *
	 * then passes these indices as arguments into removeTokens().	 *
	 * The nim-sum of two or more numbers is merely the XOR between	 *
	 * them ie nim-sum = x ⊕ y ⊕ ... ⊕ z. Column size refers to the	 *
	 * number of tokens in the column.								 *
	 *---------------------------------------------------------------*/

	function startCompTurn() {
		/*var noMoreTokens = true;
		for (var i=0; i<tokens.length; i++)
			if (tokens[i] != null) noMoreTokens = false;
		if (noMoreTokens) return(console.log('No More Tokens!'));*/

		var nimSumAll = 0;								// Nim-sum of all the column sizes
		var nimSumEach = Array(tokens.length);			// Nim-sum of each column size with nimSumAll

		nimSumAll = tokens[0].length;					// Calculate nim-sum of all the column sizes
		for (var i=1; i<tokens.length; i++)
			nimSumAll ^= tokens[i].length;

		for (var i=0; i<tokens.length; i++)				// Calculate nim-sum of column sizes and nimSumAll
			nimSumEach[i] = tokens[i].length ^ nimSumAll;

		// Find a column in which nimSumEach is less than the column size
		// The nimSumEach value for that column is the number of tokens
		// that the column should be reduced to, minus one for zero-indexing
		for (var i=0; i<tokens.length; i++)	 {
			if (nimSumEach[i] < tokens[i].length) {
				selectedCol = i;
				selectedTok = nimSumEach[i] - 1;
				break;
			}
		}

		removeTokens(selectedCol, selectedTok);

		// Calculate nim-sums of the sizes of the columns with nimSumAll
		/*var selectedCol = getRandomInt(0, tokens.length-1);
		// Continually get a new column if the selected column has no tokens
		while (tokens[selectedCol] == null)						
			selectedCol = getRandomInt(0, tokens.length-1);
		var selectedTok = getRandomInt(0, tokens[selectedCol].length-1);*/
	}
}