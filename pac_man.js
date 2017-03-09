// 	After randomizing the level, be sure to save the seed of it so that It can be shown that
//	pacman remembers the path of that level configuration.
//	This is	kind of pointless, but at the same time, it is interesting that he can
//	learn about these levels and then remember how to navigate them correctly.
//	It is nice to be able to see that there is really nothing random about the way he executes
//	a level, once it is generated, he will have the same path to completing it every time.
//
//	The same could be done with all different kinds of environments.
//	Learning what not to do after mistakes are made seems to be a good way to 
// 	understand an environment
//
//	Learning is a process that we can understand.  
//	My understanding of learning is currently broken into parts:
//
//		0)	Make a decision
//		1)	Take in information in reaction to the decision.
//		2) 	Use that information to determine if the decision was good or bad
//		3)	Store results of decisions.
//		4)	Use results and logic to determine future decisions
//

//**************//
// DATA SECTION //
//**************//
//	Initialization of all variables arrays and objects
{

	//Initialize graphics
	var jsg = new jsGraphics("canvas");
	
	//*****************//
	// WORLD VARIABLES //
	//*****************//
	var gridSize = 30;
	
	//	These variables determine where the game will take place,
	//	and the size of the grid that the game will take place on.
	//	it is measured in the amount of gridSize sized blocks
	var gridStartX = 1;
	var gridStartY = 2;
	var gridLengthX = 14;
	var gridLengthY = 18;
	
	var losses = 0;
	var timer = 0;		
	var totalTime = 0;
	
	var pause = false;
	
	var doRender = true;
	var doReset = false;
	
	var ready = false;
	
	var gameSpeed = 1000/30;
	
	
	//****************//
	// PAC MAN MEMORY //
	//****************//
	var keepGoing; // if he should keep going until he can make a move, instead of going through a wall
	var noCorners = 1;
	
	//*******************//
	// PAC MAN VARIABLES //
	//*******************//
	
	//	These variables determine which way pac man should move.
	//	0 means no movement, 1 means movement in the positive direction
	//	-1 means movement in the negative direction
	// 	for x: 1 = right; -1 = left;
	// 	for y: 1 = down;  -1 = up;
	var pacManMoveHorizontal = 0;
	var pacManMoveVertical = 0;
	
	//Literal coordinates of pacman, determined by multiplying his grid coordinate by
	//the pixel size of a grid element
	var pacManX = gridSize;
	var pacManY = gridSize;
	
	//Grid coordinates of pacman, this corresponds to an element of the grid
	var pacManIndexX = 1;
	var pacManIndexY = 2;
	
	//temporary indices to do precise movements
	var pacManTempIndexX = pacManIndexX;
	var pacManTempIndexY = pacManIndexY;
	
	//Flag to tell when a collision has been made
	var collision = 0;
	//Flag to tell if pacman should be running away from ghosts, or trying to get coins.
	var pacManRunAway = false;
			
	
	//*********************//
	// RED GHOST VARIABLES //
	//*********************//
	var redGhost = {MoveHorizontal:1,
					MoveVertical:0,
					X: gridSize,
					Y: gridSize,
					IndexX: 14,
					IndexY: 19,
					tempIndexX: 1,
					tempIndexY: 1,
					TargetX: pacManIndexX,
					TargetY: pacManIndexY,
					name: "red"};
					
					redGhost.tempIndexX = redGhost.IndexX;
					redGhost.tempIndexY = redGhost.IndexY;
					
					
					//FOR DEBUG
					//	This stack will store the decisions of the redGhost
					//	after the first game When the redGhost makes a decision it will check
					var redGhostDecisionStack = [];
					var redGhostDecisionXYStack = [];
					var redGhostDecisionIndex = 0;
					var redGhostDecisionTop = 0;
					
	var redGhost2 = {MoveHorizontal: 1,
					MoveVertical:0,
					X: gridSize,
					Y: gridSize,
					IndexX: 14,
					IndexY: 18,
					tempIndexX: 1,
					tempIndexY: 1,
					TargetX: 14,
					TargetY: 18,
					name: "black"};
					
					redGhost2.tempIndexX = redGhost2.IndexX;
					redGhost2.tempIndexY = redGhost2.IndexY;
					
	var redGhost3 = {MoveHorizontal: 1,
					MoveVertical:0,
					X: gridSize,
					Y: gridSize,
					IndexX: 14,
					IndexY: 17,
					tempIndexX: 1,
					tempIndexY: 1,
					TargetX: 14,
					TargetY: 17,
					name: "orange"};
					
					redGhost3.tempIndexX = redGhost3.IndexX;
					redGhost3.tempIndexY = redGhost3.IndexY;
					
	var redGhost4 = {MoveHorizontal: 1,
					MoveVertical:0,
					X: gridSize,
					Y: gridSize,
					IndexX: 14,
					IndexY: 16,
					tempIndexX: 1,
					tempIndexY: 1,
					TargetX: pacManIndexX,
					TargetY: pacManIndexY,
					name: "pink"};
					
					redGhost4.tempIndexX = redGhost4.IndexX;
					redGhost4.tempIndexY = redGhost4.IndexY;
	
	//***********************//
	// MAP INFORMATION ARRAY //
	//***********************//
	//Initialize a 2 dimensional array to store 1 or 0 values
	//This will tell whether a certain coordinate is accessible
	var passableLocations = new Array(17);
	var coinLocations = new Array(17);
	for(var i = 0; i < 17; i++)
	{
		//Every element of the array is an array
		//This effectively makes a 2 dimensional array of size [16][21]
		passableLocations[i] = new Array(21);
		coinLocations[i] = new Array(21);
		for(var j = 1; j < 21; j++)
		{
			//initialize every location to 0 to assume all coordinates
			//are not passable
			passableLocations[i][j] = 0;
			coinLocations[i][j] = 0;
		}
	}
	
	/*
	//	These for loops will add in the passable locations of the grid
	//	excluding the spaces outside the boundaries
	for(var i = 1; i < 15; i++)
	{
		for(var j = 2; j < 20; j++)
		{
			//initialize every location to 1 to assume all coordinates
			//are passable
			passableLocations[i][j] = 1;
			
			//initialize coins
			coinLocations[i][j] = 1;
		}
	}
	*/
	
	
	
	//Check whats in the arrays
	/*
	for(var i = 0; i < 16; i++)
	{
		for(var j = 0; j < 21; j++)
		{
			document.write(passableLocations[i][j]);
		}
		document.write("\n");
	}
	*/
	
	//maxIndex marks the top of the decision and time stacks
	var maxIndex = -1; // not reset after a loss	
	
	//currentIndex is used to execute decisions that have been made previously. 
	//starts at 0 and is incremented after each decision has been carried out.
	var currentIndex = -1;	//reset after each loss, it is incremented as decisions are reached
	//These arrays work together using the same index at all times.
	//When pacman learns he will push the decision he made onto the decision stack.
	//At the same time, he will push the time of that decision onto the time stack.
	//These two elements will share the same index across both arrays, that way they can be accessed at
	//The same time.  
	//If pac man is re-executing what he had learned in a previous life, he will start the index at 0.
	//He will execute decisions when the next time is reached, then increment the index to see the next
	//time that he has to execute a decision at.
	var timesStack = [];
	var decisionsStack = [];				
}// Data Section


//*********************//
// RESET GAME FUNCTION //
//*********************//
//	Resets all variables to the values they should be at the start of the game
//	The only thing that isn't reset is pacmans memory so that he can learn after each loss
function resetGame()
{
	doReset = false;
	
	//reset globals
	keepGoing = false;

	//reset pacman
	timer = 0;
	pacManMoveHorizontal = 0;
	pacManMoveVertical = 0;
	pacManX = gridSize;
	pacManY = gridSize;
	pacManIndexX = 1;
	pacManIndexY = 2;
	pacManTempIndexX = pacManIndexX;
	pacManTempIndexY = pacManIndexY;
	
	currentIndex = 0;
	
	collision = 0;
	
	//reset redghost
	redGhost.MoveHorizontal = 1;
	redGhost.MoveVertical = 0;
	redGhost.X = gridSize;
	redGhost.Y = gridSize;
	redGhost.IndexX = 14;
	redGhost.IndexY = 19;
	redGhost.tempIndexX = redGhost.IndexX;
	redGhost.tempIndexY = redGhost.IndexY;
	redGhost.TargetX = pacManIndexX;
	redGhost.TargetY = pacManIndexY;
	
	redGhostDecisionIndex = 0;
	
	//reset redghost2
	redGhost2.MoveHorizontal = 1;
	redGhost2.MoveVertical = 0;
	redGhost2.X = gridSize;
	redGhost2.Y = gridSize;
	redGhost2.IndexX = 14;
	redGhost2.IndexY = 18;
	redGhost2.tempIndexX = redGhost2.IndexX;
	redGhost2.tempIndexY = redGhost2.IndexY;
	redGhost2.TargetX = 14;
	redGhost2.TargetY = 18;
	
	//reset redGhost3
	redGhost3.MoveHorizontal = 1;
	redGhost3.MoveVertical = 0;
	redGhost3.X = gridSize;
	redGhost3.Y = gridSize;
	redGhost3.IndexX = 14;
	redGhost3.IndexY = 17;
	redGhost3.tempIndexX = redGhost3.IndexX;
	redGhost3.tempIndexY = redGhost3.IndexY;
	redGhost3.TargetX = 14;
	redGhost3.TargetY = 17;
	
	//reset redGhost4
	redGhost4.MoveHorizontal = 1;
	redGhost4.MoveVertical = 0;
	redGhost4.X = gridSize;
	redGhost4.Y = gridSize;
	redGhost4.IndexX = 14;
	redGhost4.IndexY = 16;
	redGhost4.tempIndexX = redGhost4.IndexX;
	redGhost4.tempIndexY = redGhost4.IndexY;
	redGhost4.TargetX = 14;
	redGhost4.TargetY = 16;
	
	
	//Reset Coins
	for(var i = 1; i < 15; i++)
	{
		for(var j = 2; j < 20; j++)
		{
			//initialize every location to 1 to assume all coordinates
			//are coins
			if(passableLocations[i][j] != 0)
				coinLocations[i][j] = 1;
		}
	}
	
}

//********************************//
// COLLISION CHECKING FOR CORNERS //
//********************************//
//	These functions are used when pacman is about to hit a wall.  These funtions determine which way
//	he should turn so that we get a valid outcome.
//	These have a tendency to travel in the direction where pacMan will be closer to coins.
//	This way he won't be stuck in an endless loop unable to get to some coins.
//
//	Check if there is going to be a collision in the x direction
function checkHorizontal()
{
	if(passableLocations[pacManIndexX + pacManMoveHorizontal][pacManIndexY] == 0)
	{
		//Check if coins are above or below and make a decision based on that.
		for(var i = 1; i < 15; i++)
		{
			//check below
			for(var j = pacManIndexY; j < 20; j++)
			{
				
				if(coinLocations[i][j] == 1)
					pacManMoveVertical = 1;
			}
			//check above
			for(var j = pacManIndexY; j > 1; j--)
			{
				
				if(coinLocations[i][j] == 1)
					pacManMoveVertical = -1;
			}
		}
	
		
		
		//Make sure that the decision results in a possible movement direction
		if(passableLocations[pacManIndexX][pacManIndexY + pacManMoveVertical] == 0)
		{
			pacManMoveVertical *= -1;
			
			if(passableLocations[pacManIndexX][pacManIndexY + pacManMoveVertical] == 0)
			{
				pacManMoveVertical = 0;
				pacManMoveHorizontal *= -1;
			}
			else	
				pacManMoveHorizontal = 0;
		}
		else
			pacManMoveHorizontal = 0;
		
		noCorners = 0;
	}//if horizontal collision
	
}//checkHorizontal()

//	Check to see if there is going to be a collision in the y direction
function checkVertical()
{
	//Check if there is going to be a collision in the y direction
	if(passableLocations[pacManIndexX][pacManIndexY + pacManMoveVertical] == 0)
	{
		//Check if coins are above or below and make a decision based on that.
		
		//Check right
		for(var i = pacManIndexX; i < 15; i++)
		{
			for(var j = 2; j < 20; j++)
			{
				if(coinLocations[i][j] == 1)
					pacManMoveHorizontal = 1;
			}
		}
		//Check left
		for(var i = pacManIndexX; i > 0; i--)
		{
			//check below
			for(var j = 2; j < 20; j++)
			{
				if(coinLocations[i][j] == 1)
					pacManMoveHorizontal = -1;
			}
		}
		
		
		//make sure that decision results in a possible outcome
		if(passableLocations[pacManIndexX + pacManMoveHorizontal][pacManIndexY] == 0)
		{
			//if there is a wall on both sides horizontally, stop trying to move 
			//horizontally
			pacManMoveHorizontal *= -1;
			
			//Check again
			if(passableLocations[pacManIndexX + pacManMoveHorizontal][pacManIndexY] == 0)
			{
				pacManMoveHorizontal = 0;
				pacManMoveVertical *= -1;
			}
			else
				pacManMoveVertical = 0;
		}
		else
			pacManMoveVertical = 0;
			
		noCorners = 0;
	}//if vertical collision
}//checkVertical()

//Calculates distance using Pythagorean theorem
function findDistance(xLength, yLength)
{
	var distance5;	//distance from ghost to pacman measured in a straight line
	
	distance5 = Math.sqrt(Math.pow(xLength,2) + 
					 Math.pow(yLength,2));
					 
	return distance5;
}


//*******//
// LEARN //
//*******//
//	pac man will move forward and turn right at walls by default, but if there is a time
//	where that doesn't work, he will remember that time and do something different at that time.
//	in the next game.
//	Pac Man should also add decisions to the stack at every decision tile, this way he can optimized
//	his path and search for coins more effectively.  This will also make it easier to backtrack to
//	previous decisions in case of a collision.
//
//	Pac Man makes a decision every move he makes.  He will always try to go in the direction that will get 
//	him the most coins.  He will store each decision in a stack so that they can be executed later.
//	If he collides with an enemy and loses, he will remember the time it happened and what decision he made 
//	that led him to die.  Then the game will restart and he will execute the previous decisions he had made 
//	until he gets to the point where he has completed them all.  Then he will begin to learn again.
//
//	Learning consists of:
//		1. Assessing the situation at time of learning
//			a.	What direction was pac man moving when he collided with an enemy?
//			b.	What directions have already been tried and failed at this time?
//			c.	What direction should Pac Man move to get the most coins.
//
//		2. Updating the decision at this time to reflect what decisions are possible, ideal, and impossible.
//		3. Adding the time and decision to their respective stacks.
//
function learn(time)
{
	//Temporary workspace decision object.
	decision = {left: 0, right: 0, up: 0, down: 0};
	
	if(!collision)	//If PacMan is learning after a normal move, just trying to go after coins
	{
		//If PacMan is running from a ghost that he died to earlier, make sure he doesn't turn around
		//to run into it until he has made a turn.
		//have a global flag variable that is set to show pacman is running away, then set it to false
		//when he turns in a different direction in this function.
		/*
		if(pacManRunAway)
		{
			if(decisionsStack[maxIndex - 1].left == 1)
			{
				decision.right = -1;
			}
			if(decisionsStack[maxIndex - 1].right == 1)
			{
				decision.left = -1;
			}
			if(decisionsStack[maxIndex - 1].up == 1)
			{
				decision.down = -1;
			}
			if(decisionsStack[maxIndex - 1].down == 1)
			{
				decision.up = -1;
			}
		}
		*/
		//Check to see if there are walls around pacman.  Invalidate decisions that would make him run into a wall
		if(passableLocations[pacManIndexX + 1][pacManIndexY] == 0)
		{
			decision.right = -1;
		}
		if(passableLocations[pacManIndexX - 1][pacManIndexY] == 0)
		{
			decision.left = -1;
		}
		if(passableLocations[pacManIndexX][pacManIndexY + 1] == 0)
		{
			decision.down = -1;
		}
		if(passableLocations[pacManIndexX][pacManIndexY - 1] == 0)
		{
			decision.up = -1;
		}
	
	
	
	
		//Check which direction he should go to be the most efficient way to get coins
		//Most coins per time spent
		//Divide how many coins he can get by how many steps it takes to get there.
		//make pac man try to go in the direction with the most coins	
		
		//Only test directions which have been left open ( 0 ) as possibilities
		var coinCount = 0;
		var efficiency = 0;
		var tempDecision = "none";	//keeps track of which decision to make based on coins
		if(decision.left == 0)
		{
			var i = 1;
			var tempCoinCount = 0;
			
			//check every possible tile left of the decision tile for coins
			while((pacManIndexX - i) > 0)
			{
				if(coinLocations[(pacManIndexX - i)][pacManIndexY] == 1)
				{
					tempCoinCount++;
				}
				if(passableLocations[(pacManIndexX - i)][pacManIndexY] == 0)
					break;
				i++;
			}
			
			//How many coins there are in this direction, divided by how many steps it takes to get them
			var tempEfficiency = tempCoinCount/i;
			
			if(tempEfficiency > efficiency)
			{
				efficiency = tempEfficiency;
				tempDecision = "left";
			}
		}
		if(decision.right == 0)
		{
			var i = 1;
			var tempCoinCount = 0;
			
			//check every possible tile right of the decision tile for coins
			while((pacManIndexX + i) < 17)
			{
				if(coinLocations[(pacManIndexX + i)][pacManIndexY] == 1)
				{
					tempCoinCount++;
				}
				if(passableLocations[(pacManIndexX + i)][pacManIndexY] == 0)
					break;
				i++;
			}
			//How many coins there are in this direction, divided by how many steps it takes to get them
			var tempEfficiency = tempCoinCount/i;
			
			if(tempEfficiency > efficiency)
			{
				efficiency = tempEfficiency;
				tempDecision = "right";
			}
		}
		if(decision.up == 0)
		{
			var i = 1;
			var tempCoinCount = 0;
			
			//check every possible tile up from the decision tile for coins
			while((pacManIndexY - i) > 0)
			{
				
				if(coinLocations[(pacManIndexX)][pacManIndexY - i] == 1)
				{
					tempCoinCount++;
				}
				if(passableLocations[(pacManIndexX)][pacManIndexY - i] == 0)
					break;
				i++;
			}
			//How many coins there are in this direction, divided by how many steps it takes to get them
			var tempEfficiency = tempCoinCount/i;
			
			if(tempEfficiency > efficiency)
			{
				efficiency = tempEfficiency;
				tempDecision = "up";
			}
		}
		if(decision.down == 0)
		{
			var i = 1;
			var tempCoinCount = 0;
			
			//check every possible tile down from the decision tile for coins
			while((pacManIndexY + i) < 21)
			{
				if(coinLocations[(pacManIndexX)][pacManIndexY + i] == 1)
				{
					tempCoinCount++;
				}
				if(passableLocations[(pacManIndexX)][pacManIndexY + i] == 0)
					break;
				i++;
			}
			//How many coins there are in this direction, divided by how many steps it takes to get them
			var tempEfficiency = tempCoinCount/i;
			
			if(tempEfficiency > efficiency)
			{
				efficiency = tempEfficiency;
				tempDecision = "down";
			}
		}
	
	
		//Depending on what decision has been made, push it onto the decision stack.
		//If a decision is pushed onto the stack, also push the current time onto the times stack.
		//Also increment the maxIndex to show the top of the stacks.
		//Change pacMan's movement direction so that he can learn and make decisions at the same time.
		if(tempDecision == "left")
		{
			pacManMoveHorizontal = -1;
			pacManMoveVertical = 0;
			decision.left = 1;
			
			//Check if this decision is different than the previouos decision.
			//If it is, make pacMan not run away any more.
			if(maxIndex > 0)
			{
				if(decisionsStack[maxIndex - 1].left != 1)
				{
					pacManRunAway = false;
				}
			}
		}
		if(tempDecision == "right")
		{
			pacManMoveHorizontal = 1;
			pacManMoveVertical = 0;
			decision.right = 1;
			
			//Check if this decision is different than the previouos decision.
			//If it is, make pacMan not run away any more.
			if(maxIndex > 0)
			{
				if(decisionsStack[maxIndex - 1].right != 1)
				{
					pacManRunAway = false;
				}
			}
		}
		if(tempDecision == "up")
		{
			pacManMoveVertical = -1;
			pacManMoveHorizontal = 0;
			decision.up = 1;
			
			//Check if this decision is different than the previouos decision.
			//If it is, make pacMan not run away any more.
			if(maxIndex > 0)
			{
				if(decisionsStack[maxIndex - 1].up != 1)
				{
					pacManRunAway = false;
				}
			}
		}
		if(tempDecision == "down")
		{
			pacManMoveVertical = 1;
			pacManMoveHorizontal = 0;
			decision.down = 1;
			
			//Check if this decision is different than the previouos decision.
			//If it is, make pacMan not run away any more.
			if(maxIndex > 0)
			{
				if(decisionsStack[maxIndex - 1].down != 1)
				{
					pacManRunAway = false;
				}
			}
		}
	
		//If no decision has been made, either move straight or take a turn at a wall.
		if(tempDecision == "none")
		{
			checkHorizontal();
			checkVertical();
			
			
			//Make sure to store the correct decision
			if(pacManMoveHorizontal == -1)
			{
				decision.left = 1;
			}
			if(pacManMoveHorizontal == 1)
			{
				decision.right = 1;
			}
			if(pacManMoveVertical == -1)
			{
				decision.up = 1;
			}
			if(pacManMoveVertical == 1)
			{
				decision.down = 1;
			}
		}
	
		//Decision has been made, so push it onto the stack along with the time
		decisionsStack.push(decision);
		timesStack.push(timer);
		maxIndex++;
		currentIndex = -1;	//shows that pacMan is currently learning, not executing decisions
	
	}
	else	//If PacMan is learning from a collision with an enemy
	{
	
		//Game will reset after this learn() function is completed.
		//All that matters is that the correct decision is made.
		
		//Instead of adding a new decision to the stack, this will only modify a previous decision
		//It will see what pacMan did on his last decision that made him lose.  Then it will invalidate that
		//decision and evaluate which way pacMan should go instead.
		
		//It may be beneficial to pop a few decisions off the stack before re-evaluating.  A decision so close to a collision
		//May result in a difficult situation for PacMan.
		
		//If a decision is evaluated to have no possible options, it will be popped off the stack, and the decision previous to that
		//one will be evaluated.  This should be able to continue back until pacMan finds a valid decision.
		
		//Assign the values of the previous decision to the temporary decision of this function.
		/*
		decision.left = decisionsStack[maxIndex].left;
		decision.right = decisionsStack[maxIndex].right;
		decision.up = decisionsStack[maxIndex].up;
		decision.down = decisionsStack[maxIndex].down;
		*/
		
		//Set decision equal to decisionsStack.  This sets it equal by reference, not by value
		//That is ok because we are modifying it in place, it will stay in the stack, we will just modify it.
		decision = decisionsStack[maxIndex];
		
		//Check to see which decision was made and invalidate that decision because it made PacMan lose.
		if(decision.left == 1)
		{
			decision.left = -1;
		}
		if(decision.right == 1)
		{
			decision.right = -1;
		}
		if(decision.up == 1)
		{
			decision.up = -1;
		}
		if(decision.down == 1)
		{
			decision.down = -1;
		}
		
		//Now check which decisions are still possible and make a decision based on those.
		//This will make decisions in this order, left->right->up->down until there is no possible choice
		if(decision.left == 0)
		{
			decision.left = 1;
		}
		else if(decision.right == 0)
		{
			decision.right = 1;
		}
		else if(decision.up == 0)
		{
			decision.up = 1;
		}
		else if(decision.down == 0)
		{
			decision.down = 1;
		}
		else //No possible directions to go
		{
			//If there are no valid decisions for pacman to make at this time, we must pop this decision and time off the stack,
			//decrement the maxIndex, and evaluate the previous decision.
			
			decisionsStack.pop();
			timesStack.pop();
			maxIndex--;
			
			//After removing the invalid decision, call learn() recursively to deal with the previous decision 
			//which is now at the top of the stack
			learn(timer);
		}
		
		//If PacMan collides with an enemy, he will set a flag to say he is running away.
		//That way, when he gets to the decision to turn away from the enemy, he will know that he must
		//run away from it and not turn around into it.
		pacManRunAway = true;
	
	}//If collision				
}//learn()
			
//*****************//
// UPDATE FUNCTION //
//*****************//
//	This function is called every iteration of the game loop
function update()
{
	

	//For any RNG based decisions
	var randomFactor = Math.random();
	
	//**************//
	// Move The Man //
	//**************//
	//	This function will take care of everything that involves moving the man
	//	It will handle collision checking and commit changes to his position
	function moveMan()
	{
	
		//This function will allow pacMan to make decisions based on the
		//results of previous games. It will allow him to learn from past mistakes
		function makeDecision()
		{
			//make an array that holds a certain number of elements, 25-50 should 
			//be enough.  remember that many moves back, but also keep an index of 
			//how many moves have been made.  This way when pacman gets up to the 
			//index of the losing decision, he can make a different one.
			//bad decisions will result in an array being filled with what decision
			//was made.
			
			//an index will be kept to show on what move the recent moves are starting
			//to be stored.
			
			//decision object will have 4 elements.  left, right, up, down
			//they will have values of 0, or 1.
			//0 if it is an invalid decision.
			//1 if it is a valid decision.
			//if a decision object has all 4 elements 0 that decision and time will
			//be popped off the stack and pac man will re-evaluate the last decision.
			if (maxIndex != -1)
			{
				var decision = decisionsStack[currentIndex];
				
				//show that a decision has been made and a corner wasn't turned
				noCorners = 1;
				/*
				//Print Decision
				var string = "left: " + decision.left + "\nright: " + decision.right + "\nup: " + decision.up + "\ndown: " + decision.down;
				alert(string);
				*/
				
				if ((decision.left == 1) && (passableLocations[pacManIndexX - 1][pacManIndexY] != 0))
				{
					pacManMoveHorizontal = -1;
					pacManMoveVertical = 0;
					keepGoing = false;
					currentIndex++;
				}
				else if((decision.up == 1) && (passableLocations[pacManIndexX][pacManIndexY -1] != 0))
				{
					pacManMoveHorizontal = 0;
					pacManMoveVertical = -1;
					keepGoing = false;
					currentIndex++;
				}
				else if((decision.right == 1) && (passableLocations[pacManIndexX + 1][pacManIndexY] != 0))
				{
					pacManMoveHorizontal = 1;
					pacManMoveVertical = 0;
					keepGoing = false;
					currentIndex++;
				}
				else if((decision.down == 1) && (passableLocations[pacManIndexX][pacManIndexY + 1] != 0))
				{
					pacManMoveHorizontal = 0;
					pacManMoveVertical = 1;
					keepGoing = false;
					currentIndex++;
				}
				//currentIndex++;
			}					
		}
		
		
		
		
		
		//if pac man has no movement instructions, give him one by default
		if(pacManMoveHorizontal == 0 && pacManMoveVertical == 0)
		{
			pacManMoveHorizontal = 1;	//start moving to the right
		}
		
		
		/*
		//Do collision checking before actually moving
		//It will explicitly only be called when it is not a decision square
		if((pacManIndexX == pacManTempIndexX) && (pacManIndexY == pacManTempIndexY))
		{
			if(passableLocations[pacManIndexX][pacManIndexY] != 2)
			{
				checkHorizontal();
				checkVertical();
			}
		}
		*/
			//if pac man gets to a time where he must make a different decision
		
		
		//If pac man has died once he must execute previous decisions.
		//He will move until the timer is equal to the next time in the time stack.
		//Then he will make the decision that is stored at the current index.
		//He will change direction according to the decision stored in the decision stack.
		//Then he will increment the current index.  The index will be pointing to the next time
		//in the stack and now we will wait until that time is reached.
		
		if(currentIndex != -1)
		{
			//KeepGoing is used to make sure pacman only makes decisions at valid X,Y values
			//This prevents him from accidentally moving through walls.
			if((timesStack[currentIndex] == timer) || keepGoing)
			{
				//ensure that he is on the correct tile
				//pacManTempIndexX = pacManIndexX;
				//pacManTempIndexY = pacManIndexY;
				keepGoing = true;
				makeDecision();	
			}
		}
		
		
		
		//Pac Man is currently learning on every square.  We will test this to see if this is a viable way to run things.
		//The stack may grow too large if we aren't careful.
		//We must also be careful when learning from a collision that we go back far enough.
		
		//If pac man has completed all instructions, allow him to learn new decisions
		//if((maxIndex >= 0) && (currentIndex > 0))
		//{
			if((timer > timesStack[maxIndex]) || (maxIndex == -1))
			{
				//if pac man is precicely on a tile
				if((pacManIndexX == pacManTempIndexX) && (pacManIndexY == pacManTempIndexY))
				{
					//if pac man is on a decision tile
					//if(passableLocations[pacManTempIndexX][pacManTempIndexY] == 2)
					//{
						//alert("LEARN FROM DECISION TILE: " + maxIndex);
						learn(timer);
					//}
				}
			}
		//}
		
		//temporary indices to do precise movements
		//pacManTempIndexX = pacManIndexX;
		//pacManTempIndexY = pacManIndexY;
		
		pacManTempIndexX += (pacManMoveHorizontal/4);
		pacManTempIndexY += (pacManMoveVertical/4);
		
		
		//If the temp index is on an even number, update the actual index
		if((pacManTempIndexX % 1) == 0)
		{
			pacManIndexX = pacManTempIndexX;
		}
		if((pacManTempIndexY % 1) == 0)
		{
			pacManIndexY = pacManTempIndexY;
		}
		
		
		
		
		/*
		//make pac man move based on his movement instructions
		pacManIndexX += (pacManMoveHorizontal);
		pacManIndexY += (pacManMoveVertical);
		*/
		
		//get coins
		coinLocations[pacManIndexX][pacManIndexY] = 0;
	
		//Check to see if pacMan has won
		if(((pacManTempIndexX % 1) == 0) && ((pacManTempIndexY % 1) == 0))
		{
		
			var noWin = false;	//assume a win
			
			//Check coins
			for(var i = 1; i < 15; i++)
			{
				for(var j = 2; j < 20; j++)
				{
					//If any location is a coin, no win
					if(coinLocations[i][j] != 0)
						noWin = true;
				}
			}
			
			
			if(!noWin)
			{
				doRender = true;
				doReset = true;
				/*
				var r = confirm("Would you like to watch the learning process for this level?\nPress OK if yes\nPress Cancel if no");
				if (r == true) {
					maxIndex = -1;
					currentIndex = -1;
					losses = 0;
				}
				*/
			}
			
			
			/*
			if(!noWin && !doRender)
			{
				doRender = true;
				resetGame();
			}
			*/
			
			
			
			//Check to see if the level was impossible to win
			if(timer > 20000)
			{
				if(!doRender)
					alert("The level that was generated was impossible because pacman got stuck");
				doRender = true;
				
			}
			if(losses > 500)
			{
				if(!doRender)
					alert("Pac man lost over 500 times, lets see whats going on");
				doRender = true;
			}
		}
	}//moveMan()
	
	//*****************//
	// MOVE THE GHOSTS //
	//*****************//
	//	All ghost's movement will be determined in this function
	//	This includes decision making, as well as committing changes to
	//	coordinates
	function moveGhosts(ghost)
	{
		//modify pac man's coordinates for the logic of the black ghost
		if(ghost.name == "black")
		{
		
			if(timer < 100)
			{
				return;
			}
			pacManIndexX += 4 * pacManMoveHorizontal;
			pacManIndexY += 4 * pacManMoveVertical;
			
		}
		
		if(ghost.name == "orange")
		{
			if(timer < 150)
			{
				return;
			}
		}
		
		if(ghost.name == "pink")
		{
			if(timer < 200)
			{
				return;
			}
		}
		
		//This function will check for collisions in the x direction and make turns
		function checkHorizontal(ghost)
		{
			if(passableLocations[ghost.IndexX + ghost.MoveHorizontal][ghost.IndexY] == 0)
			{
				//Make the ghost turn when it hits the wall
				ghost.MoveVertical = 1;
				ghost.MoveHorizontal = 0;
				
				
				//Make sure that the decision results in a possible movement direction
				if(passableLocations[ghost.IndexX][ghost.IndexY + ghost.MoveVertical] == 0)
				{
					ghost.MoveVertical *= -1;
					
					if(passableLocations[ghost.IndexX][ghost.IndexY + ghost.MoveVertical] == 0)
					{
						ghost.MoveVertical = 0;
						ghost.MoveHorizontal *= -1;
					}
					else	
						ghost.MoveHorizontal = 0;
				}
				else
					ghost.MoveHorizontal = 0;
				
				
			}//if horizontal collision
		}//checkHorizontal()
		
		//Check for collisions in the y direction and make turns
		function checkVertical(ghost)
		{
			//Check if there is going to be a collision in the y direction
			if(passableLocations[ghost.IndexX][ghost.IndexY + ghost.MoveVertical] == 0)
			{
				//Make the ghost turn when it hits the wall
				ghost.MoveHorizontal = 1;
				ghost.MoveVertical = 0;
				
				//make sure that decision results in a possible outcome
				if(passableLocations[ghost.IndexX + ghost.MoveHorizontal][ghost.IndexY] == 0)
				{
					//if there is a wall on both sides horizontally, stop trying to move 
					//horizontally
					ghost.MoveHorizontal *= -1;
					
					//Check again
					if(passableLocations[ghost.IndexX + ghost.MoveHorizontal][ghost.IndexY] == 0)
					{
						ghost.MoveHorizontal = 0;
						ghost.MoveVertical *= -1;
					}
					else
						ghost.MoveVertical = 0;
				}
				else
					ghost.MoveVertical = 0;
			}//if vertical collision
			
		}//checkVertical
		
		function makeDecision(ghost)
		{
		
			var tempMoveHorizontal = ghost.MoveHorizontal;
			var tempMoveVertical = ghost.MoveVertical;
		
			var xLeg;		//x leg of a triangle made between pacman and ghost.
			var yLeg;		//y leg of a triangle made between pacman and ghost.
			
			//When a decision is made the ghost must decide between two directions
			//It will find the distance to the target space if it moves one space 
			//in each direction seperately.
			//It will take the path that will result in the shorter distance
			
			var distance = 0;
			var distance1;	//variables used for checking multiple distances
			var distance2;	//variables used for checking multiple distances
			
			
			//Variable to tell which way to go
			var go = "";
			
			
			
		
			//	Variables to tell if the 4 directions are available to move in or not
			//	0 = not passable; 1 = passable
			var leftOpen = 0;
			var rightOpen = 0;
			var upOpen = 0;
			var downOpen = 0;
			
			function checkDirections()
			{
				//Check one to the right
				if(passableLocations[ghost.IndexX + 1][ghost.IndexY] != 0)
				{
					//ghost cant turn around the opposite direction
					if(ghost.MoveHorizontal != -1)
						rightOpen = 1;
				}
				//Check one to the left
				if(passableLocations[ghost.IndexX - 1][ghost.IndexY] != 0)
				{
					//ghost cant turn around the opposite direction
					if(ghost.MoveHorizontal != 1)
						leftOpen = 1;
				}
				//Check one to the up
				if(passableLocations[ghost.IndexX][ghost.IndexY - 1] != 0)
				{
					//ghost cant turn around the opposite direction
					if(ghost.MoveVertical != 1)
						upOpen = 1;
				}
				//Check one to the down
				if(passableLocations[ghost.IndexX][ghost.IndexY + 1] != 0)
				{
					//ghost cant turn around the opposite direction
					if(ghost.MoveVertical != -1)
						downOpen = 1;
				}
			}
		
			//find out which directions are open to test.
			checkDirections();
			
			
			//Check distance at current location
			xLeg = (ghost.TargetX - ghost.IndexX);
			yLeg = (ghost.TargetY - ghost.IndexY);
			
			distance = findDistance(xLeg,yLeg);
			//Check distances at possible movement locations
			if(rightOpen)
			{
				xLeg = (ghost.TargetX - (ghost.IndexX + 1));
				yLeg = (ghost.TargetY - ghost.IndexY);
				distance1 = findDistance(xLeg,yLeg);
				if(distance1 < distance)
				{
					distance = distance1;
					ghost.MoveHorizontal = 1;
					ghost.MoveVertical = 0;
				}
			}
			if(leftOpen)
			{
				xLeg = (ghost.TargetX - (ghost.IndexX - 1));
				yLeg = (ghost.TargetY - ghost.IndexY);
				distance1 = findDistance(xLeg,yLeg);
				if(distance1 < distance)
				{
					distance = distance1;
					ghost.MoveHorizontal = -1;
					ghost.MoveVertical = 0;
				}
			}
			if(upOpen)
			{
				xLeg = (ghost.TargetX - (ghost.IndexX));
				yLeg = (ghost.TargetY - (ghost.IndexY - 1));
				distance1 = findDistance(xLeg,yLeg);
				if(distance1 < distance)
				{
					distance = distance1;
					ghost.MoveHorizontal = 0;
					ghost.MoveVertical = -1;
				}
			}
			if(downOpen)
			{
				xLeg = (ghost.TargetX - (ghost.IndexX));
				yLeg = (ghost.TargetY - (ghost.IndexY + 1));
				distance1 = findDistance(xLeg,yLeg);
				if(distance1 < distance)
				{
					distance = distance1;
					ghost.MoveHorizontal = 0;
					ghost.MoveVertical = 1;
				}
			}
			
			/*
			// FOR DEBUG //
			//	Add decision to a stack to check for accuracy
			// 	0 = right, 1 = left, 2 = up, 3 = down.
			if(ghost.name == "red")
			{
				var tempDecision;
				
				if(ghost.MoveHorizontal == 1)
				{
					tempDecision = 0;
				}
				else if(ghost.MoveHorizontal == -1)
				{
					tempDecision = 1;
				}
				else if(ghost.MoveVertical == -1)
				{
					tempDecision = 2;
				}
				else if(ghost.MoveVertical == 1)
				{
					tempDecision = 3;
				}
			
				if(redGhostDecisionIndex >= redGhostDecisionTop)
				{
					if(ghost.MoveHorizontal == 1)
					{
						redGhostDecisionStack.push(0);
						redGhostDecisionTop++;
					}
					else if(ghost.MoveHorizontal == -1)
					{
						redGhostDecisionStack.push(1);
						redGhostDecisionTop++;
					}
					else if(ghost.MoveVertical == -1)
					{
						redGhostDecisionStack.push(2);
						redGhostDecisionTop++;
					}
					else if(ghost.MoveVertical == 1)
					{
						redGhostDecisionStack.push(3);
						redGhostDecisionTop++;
					}
					redGhostDecisionXYStack.push("(" + redGhost.X + ", " + redGhost.Y + ")");
					
				}
				else	//Else check existing decision stack against decision that was just made
				{
					if((redGhostDecisionStack[redGhostDecisionIndex] != tempDecision) || ((redGhostDecisionXYStack[redGhostDecisionIndex] != ("(" + redGhost.X + ", " + redGhost.Y + ")")) || (redGhostDecisionXYStack[redGhostDecisionIndex] != ("(" + redGhost.X + ", " + redGhost.Y + ")"))))
					{
						var string = "INCONSISTENT DECISION HAS BEEN MADE\n" + "Previous Decision: " + redGhostDecisionStack[redGhostDecisionIndex] + "\nCurrent Decision: " + tempDecision + "\nCurrent Decision Index: " + redGhostDecisionIndex + "\nX: " + redGhost.X + "\nY: " + redGhost.Y + "\n\nPrevious X,Y: " + redGhostDecisionXYStack[redGhostDecisionIndex] + "\n\nHMove before decision: " + tempMoveHorizontal + "\nVMove before decision: " + tempMoveVertical + "\nrightOpen: " + rightOpen + "\nleftOpen: " + leftOpen + "\nupOpen: " + upOpen + "\ndownOpen: " + downOpen;
						alert(string);
						
						var string2 = "Decision Stack: \n";
						for(var i = 0; i <= redGhostDecisionIndex; i++)
						{
							string2 = string2 + "\n" + i + ": " + redGhostDecisionStack[redGhostDecisionIndex];
						}
						alert(string2);
						
						pause = true;
					}
				}
				redGhostDecisionIndex++;
			}//if ghost is red
			
			//redGhostDecisionStack.push();
			*/
			
			
		}//makeDecision
	
	
		//Resets black's target because he might not ever be able to reach it
		if(ghost.name == "black" || ghost.name == "orange")
		{
			if((ghost.TargetX > 0 && ghost.TargetX < 15) && (ghost.TargetY > 0 && ghost.TargetY < 20))
			{
				if(passableLocations[ghost.TargetX][ghost.TargetY] == 0)
				{
					if(timer % 60 == 0)
					{
						ghost.TargetX = pacManIndexX;
						ghost.TargetY = pacManIndexY;
					}
				}
			}
			else if(timer % 60 == 0)
			{
				ghost.TargetX = pacManIndexX;
				ghost.TargetY = pacManIndexY;
			}
		}
		
		//Check if ghost has reached it's target space
		if(ghost.name == "red" || ghost.name == "black")
		{
			
			if((ghost.TargetX == ghost.IndexX) && (ghost.TargetY == ghost.IndexY))
			{
				ghost.TargetX = pacManIndexX;
				ghost.TargetY = pacManIndexY;
			}
		}
		
		if(ghost.name == "orange")
		{
			if((ghost.TargetX == ghost.IndexX) && (ghost.TargetY == ghost.IndexY))
			{
				//orange ghost targets a square that is double the distance between
				//pacman and the redghost.
				var tempX = pacManIndexX - redGhost.IndexX;
				var tempY = pacManIndexY - redGhost.IndexY;
				
				ghost.TargetX = redGhost.IndexX + (tempX * 2);
				ghost.TargetY = redGhost.IndexY + (tempY * 2);
			}
		}
		
		if(ghost.name == "pink")
		{
			var tempX = pacManIndexX - ghost.IndexX;
			var tempY = pacManIndexY - ghost.IndexY;
			var tempDistance = findDistance(tempX, tempY);
	
			if((ghost.TargetX == ghost.IndexX) && (ghost.TargetY == ghost.IndexY))
			{
				if(tempDistance < 8)
				{
					ghost.TargetX = 14;
					ghost.TargetY = 19;
				}
				else 
				{
					ghost.TargetX = pacManIndexX;
					ghost.TargetY = pacManIndexY;
				}
			}
		}
		
		if((ghost.IndexX == ghost.tempIndexX) && (ghost.IndexY == ghost.tempIndexY))
		{
			if(passableLocations[ghost.IndexX][ghost.IndexY] == 2)
			{
				makeDecision(ghost);
			}		
		}
		
		checkHorizontal(ghost);
		checkVertical(ghost);
	
		ghost.tempIndexX += (ghost.MoveHorizontal/4);
		ghost.tempIndexY += (ghost.MoveVertical/4);
		
		if((ghost.tempIndexX % 1) == 0)
		{
			ghost.IndexX = ghost.tempIndexX;
		}
		if((ghost.tempIndexY % 1) == 0)
		{
			ghost.IndexY = ghost.tempIndexY;
		}
	
		//reset pacMan's variables
		if(ghost.name == "black")
		{
			pacManIndexX -= 4 * pacManMoveHorizontal;
			pacManIndexY -= 4 * pacManMoveVertical
		}
	}//moveGhosts()
	
	//Figure out which way pac man should move
	moveMan();
	moveGhosts(redGhost);
	moveGhosts(redGhost2);
	moveGhosts(redGhost3);
	moveGhosts(redGhost4);
	
	
	//********
	//	After movement has been decided, figure out actual coordinates of objects
	//********
	
	
	
	//Actual coordinates of pacman.
	pacManY = gridSize * pacManTempIndexY;
	pacManX = gridSize * pacManTempIndexX;
	
	//Actual coordinates of redGhost.
	redGhost.Y = gridSize * redGhost.tempIndexY;
	redGhost.X = gridSize * redGhost.tempIndexX;
	
	//Actual coordinates of redGhost.
	redGhost2.Y = gridSize * redGhost2.tempIndexY;
	redGhost2.X = gridSize * redGhost2.tempIndexX;
	
	//Actual coordinates of redGhost.
	redGhost3.Y = gridSize * redGhost3.tempIndexY;
	redGhost3.X = gridSize * redGhost3.tempIndexX;
	
	//Actual coordinates of redGhost.
	redGhost4.Y = gridSize * redGhost4.tempIndexY;
	redGhost4.X = gridSize * redGhost4.tempIndexX;
	
	//keep track of how many game loops
	timer++;
	
	//*****************//
	// CHECK COLLISION //
	//*****************//
	//Check for collisions between pacman and ghosts
	function checkCollision(ghost)
	{
		var distance = Math.sqrt(Math.pow((pacManX - ghost.X),2) + Math.pow((pacManY - ghost.Y), 2));
		if((distance < 30) && (timer != 0))
		{
			//alert("GAME OVER");
			losses++;
			document.getElementById("top").innerHTML = "Number of losses = " + losses;
			collision = 1;
			learn(timer);
			totalTime+= timer;
			resetGame();
			
			
		}
	}
	
	checkCollision(redGhost);
	checkCollision(redGhost2);
	checkCollision(redGhost3);
	checkCollision(redGhost4);
	
	
	var nextMove;
	if((currentIndex != -1) && currentIndex < maxIndex)
	{
		if (decisionsStack[currentIndex].left == 1)
			nextMove = "left";
		else if (decisionsStack[currentIndex].right == 1)
			nextMove = "right";
		else if (decisionsStack[currentIndex].up == 1)
			nextMove = "up";
		else if (decisionsStack[currentIndex].down == 1)
			nextMove = "down";
	}
	//document.getElementById("top").innerHTML = "Current Index = " + currentIndex + " Next Move: " + nextMove + " at: " + timesStack[currentIndex] + "           Time: " + timer  + " Total Time: " + (totalTime + timer);
	
	//document.getElementById("top").innerHTML = "PacManRunAway = " + pacManRunAway;


	if(doReset)
	{
		resetGame();
	}
	

}//update()

//****************//
// GENERATE LEVEL //
//****************//
//	This function will send out a "snake" to create a path through the level.
//	The tiles that the snke passes through will become passable locations
//	while the ones it doesn't touch will become obstacles.
//	This function will make sure that there is a complete path through the level
function generateLevel()
{
	
	var snakeOneX = 1;
	var snakeOneY = 2;
	var snakeOneMoveHorizontal = 1;		//1 is right
	var snakeOneMoveVertical = 0;		//1 is down
	var snakeOneHistory = [];			//a stack that stores the previous locations that snakeOne has been in
	var snakeOneHistoryTop = 0;
	
	var snakeOneLocation = {x: snakeOneX, y: snakeOneY};//Object to store the x and y coordinates of the snake
	snakeOneHistory.push(snakeOneLocation);				//Pushes the starting location of snakeOne onto the stack
	snakeOneHistoryTop++;
	
	var snakeTwoX = 14;					//starts at Max X
	var snakeTwoY = 19;					//starts at Max Y
	var snakeTwoMoveHorizontal = -1;	//-1 is left
	var snakeTwoMoveVertical = 0;		//-1 is up
	var snakeTwoHistory = [];			//a stack that stores the previous locations that snakeTwo has been in
	var snakeTwoHistoryTop = 0;
	
	var snakeTwoLocation = {x: snakeTwoX, y: snakeTwoY};//Object to store the x and y coordinates of the snake
	snakeTwoHistory.push(snakeTwoLocation);				//Pushes the starting location of snakeTwo onto the stack
	snakeTwoHistoryTop++;
	
	var snakeSteps = 0;
	var snakesConnected = false;
	var randomFactor = Math.random();
	
	var returnToStartOne = false;
	var returnToStartTwo = false;	//The snakes must return to their starting position at least once for it to be considered a circuit
	
	var goOne = true;
	var goTwo = true;
	
	//both snakes must return to the original space at least once in order for it to be a circuit
	

	//Main while loop, this loop will execute until both snakes have made circuit paths that have a length
	//greater than 30.  Both paths must have at least one point where they are connected.
	while(goOne || goTwo)
	{
		
		//Check if either of the two snakes are on a tile that the opposite snake has traveled on.
		if(!snakesConnected)
		{
			
			//Check through snakeOnes history and see if snakeTwo is on one of those spots
			for(var i = 0; i < snakeOneHistoryTop; i++)
			{
				
				if(snakeOneHistory[i].x == snakeTwoX && snakeOneHistory[i].y == snakeTwoY)
				{
					snakesConnected = true;
				}
			}
			
			//Check through snakeTwo's history and see if snakeOne is on one of those spots
			for(var i = 0; i < snakeTwoHistoryTop; i++)
			{
				if(snakeTwoHistory[i].x == snakeOneX && snakeTwoHistory[i].y == snakeOneY)
				{
					snakesConnected = true;
				}
			}
		}//if !snakesConnected
		
		//******************//
		// HANDLE SNAKE ONE //
		//******************//
		if(goOne)
		{
			randomFactor = Math.random();
	
			//****************//
			// CHECK FOR TURN //
			//****************//
			//Snake will always travel forward, but there is a chance that it can make a turn
			if(randomFactor < 0.2)	//turn
			{
				if(randomFactor < 0.1) 	//turn left
				{
					
					if(snakeOneMoveHorizontal != 0)
					{
						snakeOneMoveVertical = snakeOneMoveHorizontal * -1;
						snakeOneMoveHorizontal = 0;
						
						//turn around if necessary
						if((snakeOneY + snakeOneMoveVertical < 2) || (snakeOneY + snakeOneMoveVertical > 19))
							snakeOneMoveVertical *= -1;
					}
					else if(snakeOneMoveVertical != 0)
					{
						snakeOneMoveHorizontal = snakeOneMoveVertical * -1;
						snakeOneMoveVertical = 0;
						
						//turn around if necessary
						if((snakeOneX + snakeOneMoveHorizontal < 1) || (snakeOneX + snakeOneMoveHorizontal > 14))
							snakeOneMoveHorizontal *= -1;
					}
					
				}
				else						//turn right
				{
					if(snakeOneMoveHorizontal != 0)
					{
						snakeOneMoveVertical = snakeOneMoveHorizontal;
						snakeOneMoveHorizontal = 0;
						
						//turn around if necessary
						if((snakeOneY + snakeOneMoveVertical < 2) || (snakeOneY + snakeOneMoveVertical > 19))
							snakeOneMoveVertical *= -1;
					}
					
					else if(snakeOneMoveVertical != 0)
					{
						snakeOneMoveHorizontal = snakeOneMoveVertical;
						snakeOneMoveVertical = 0;
						
						//turn around if necessary
						if((snakeOneX + snakeOneMoveHorizontal < 1) || (snakeOneX + snakeOneMoveHorizontal > 14))
							snakeOneMoveHorizontal *= -1;
					}
				}
			}
			
			//**************//
			// MOVE FORWARD //
			//**************//
			//If the snake will run into a wall make him turn around
			if((snakeOneX + snakeOneMoveHorizontal < 1) || (snakeOneX + snakeOneMoveHorizontal > 14))
			{
				
				//if snake can move up, make its direction up.
				if(snakeOneY - 1 > 1)
				{
					snakeOneMoveHorizontal = 0;
					snakeOneMoveVertical = -1;
				}
				else //if it cant, then move down
				{
					snakeOneMoveHorizontal = 0;
					snakeOneMoveVertical = 1;
				}
				
				snakeOneY += snakeOneMoveVertical;
			}
			else if((snakeOneY + snakeOneMoveVertical < 2) || (snakeOneY + snakeOneMoveVertical > 19))
			{
				//if snake can move left, make its direction left.
				if(snakeOneX - 1 > 0)
				{
					snakeOneMoveHorizontal = -1;
					snakeOneMoveVertical = 0;
				}
				else //if it cant, then move down
				{
					snakeOneMoveHorizontal = 1;
					snakeOneMoveVertical = 0;
				}
				
				snakeOneX += snakeOneMoveHorizontal;
			}
			//else go forward
			else
			{
				snakeOneX += snakeOneMoveHorizontal;
				snakeOneY += snakeOneMoveVertical;
			}
			
			//******************//
			// CHECK COMPLETION //
			//******************//
			//Check to see if first snake is done
			if(snakeSteps > 30)
			{
				//if the two paths have connected at some point
				if((snakesConnected) && (returnToStartOne))
				{
					//if the snake has returned to a passable space to create a circuit
					if(passableLocations[snakeOneX][snakeOneY] == 1)
					{
						//Then first snake is done
						goOne = false;
					}
				}
			}
			
			if((snakeOneX == 1) && (snakeOneY == 2))				
				returnToStartOne = true;
			
			
			//*****************//
			// CONSTRUCT LEVEL //
			//*****************//
			passableLocations[snakeOneX][snakeOneY] = 1;
				
			//Store history of snakeOne's locations
			var tempLocation = {x: snakeOneX, y: snakeOneY};
			snakeOneHistory.push(tempLocation);
			snakeOneHistoryTop++;
			
			
		}//snakeOne
		
		//******************//
		// HANDLE SNAKE TWO //
		//******************//
		if(goTwo)
		{					
			randomFactor = Math.random();
	
			//****************//
			// CHECK FOR TURN //
			//****************//
			//Snake will always travel forward, but there is a chance that it can make a turn
			if(randomFactor < 0.2)	//turn
			{
				if(randomFactor < 0.1) 	//turn left
				{
					
					if(snakeTwoMoveHorizontal != 0)
					{
						snakeTwoMoveVertical = snakeTwoMoveHorizontal * -1;
						snakeTwoMoveHorizontal = 0;
						
						//turn around if necessary
						if((snakeTwoY + snakeTwoMoveVertical < 2) || (snakeTwoY + snakeTwoMoveVertical > 19))
							snakeTwoMoveVertical *= -1;
					}
					else if(snakeTwoMoveVertical != 0)
					{
						snakeTwoMoveHorizontal = snakeTwoMoveVertical * -1;
						snakeTwoMoveVertical = 0;
						
						//turn around if necessary
						if((snakeTwoX + snakeTwoMoveHorizontal < 1) || (snakeTwoX + snakeTwoMoveHorizontal > 14))
							snakeTwoMoveHorizontal *= -1;
					}
					
				}
				else						//turn right
				{
					if(snakeTwoMoveHorizontal != 0)
					{
						snakeTwoMoveVertical = snakeTwoMoveHorizontal;
						snakeTwoMoveHorizontal = 0;
						
						//turn around if necessary
						if((snakeTwoY + snakeTwoMoveVertical < 2) || (snakeTwoY + snakeTwoMoveVertical > 19))
							snakeTwoMoveVertical *= -1;
					}
					
					else if(snakeTwoMoveVertical != 0)
					{
						snakeTwoMoveHorizontal = snakeTwoMoveVertical;
						snakeTwoMoveVertical = 0;
						
						//turn around if necessary
						if((snakeTwoX + snakeTwoMoveHorizontal < 1) || (snakeTwoX + snakeTwoMoveHorizontal > 14))
							snakeTwoMoveHorizontal *= -1;
					}
				}
			}
			
			//**************//
			// MOVE FORWARD //
			//**************//
			//If the snake will run into a wall make him turn around
			if((snakeTwoX + snakeTwoMoveHorizontal < 1) || (snakeTwoX + snakeTwoMoveHorizontal > 14))
			{
				//if snake can move down, make its direction down.
				if(snakeTwoY + 1 < 20)
				{
					snakeTwoMoveHorizontal = 0;
					snakeTwoMoveVertical = 1;
				}
				else //if it cant, then move up
				{
					snakeTwoMoveHorizontal = 0;
					snakeTwoMoveVertical = -1;
				}
				
				snakeTwoY += snakeTwoMoveVertical;
			}
			else if((snakeTwoY + snakeTwoMoveVertical < 2) || (snakeTwoY + snakeTwoMoveVertical > 19))
			{
				//if snake can move right, make its direction right.
				if(snakeTwoX + 1 < 15)
				{
					snakeTwoMoveHorizontal = 1;
					snakeTwoMoveVertical = 0;
				}
				else //if it cant, then move left
				{
					snakeTwoMoveHorizontal = -1;
					snakeTwoMoveVertical = 0;
				}
				
				snakeTwoX += snakeTwoMoveHorizontal;
			}
			//else go forward
			else
			{
				snakeTwoX += snakeTwoMoveHorizontal;
				snakeTwoY += snakeTwoMoveVertical;
			}
			
			//******************//
			// CHECK COMPLETION //
			//******************//
			//Check to see if first snake is done
			if(snakeSteps > 30)
			{
				//if the two paths have connected at some point
				if(snakesConnected && returnToStartTwo)
				{
					//if the snake has returned to a passable space to create a circuit
					if(passableLocations[snakeTwoX][snakeTwoY] == 1)
					{
						//Then first snake is done
						goTwo = false;
					}
				}
			}
			
			if((snakeTwoX == 14) && (snakeTwoY == 19))
				returnToStartTwo = true;
			
			
			//*****************//
			// CONSTRUCT LEVEL //
			//*****************//
			passableLocations[snakeTwoX][snakeTwoY] = 1;
				
			//Store history of snakeTwo's locations
			var tempLocation = {x: snakeTwoX, y: snakeTwoY};
			snakeTwoHistory.push(tempLocation);
			snakeTwoHistoryTop++;
									
		}
		snakeSteps++;
		
	}//Main While loop
	
	//Now the snakes have moved through the grid and created passable spaces.
	//All spaces that aren't passable will become obstacles.
	
	//*********************//
	// MAKE DECISION TILES //
	//*********************//
	//The next step is to determine which spaces are decision spaces.
	//Decision spaces will be any passable location that has more than 2 adjacent passable locations
	for(var i = 1; i < 16; i++)
	{
		for(var j = 2; j < 21; j++)
		{
			
			if(passableLocations[i][j] == 1)
			{
				var adjacent = 0;
				
				//Check how many adjacent spaces there are to this one
				if((passableLocations[i+1][j] == 1) || (passableLocations[i+1][j] == 2))
					adjacent++;
				if((passableLocations[i-1][j] == 1) || (passableLocations[i-1][j] == 2))
					adjacent++;
				if((passableLocations[i][j+1] == 1) || (passableLocations[i][j+1] == 2))
					adjacent++;
				if((passableLocations[i][j-1] == 1) || (passableLocations[i][j-1] == 2))
					adjacent++;
					
				//if there are more than 2 adjacent open spaces make this space a decision tile
				if(adjacent > 2)
				{
					passableLocations[i][j] = 2;
				}
				
				
				//Now if there is only one adjacent space next to one of these passable locations
				//Then it is a dead end, and this must be fixed.
				//There can't be any dead ends, The level must be made of complete circuits
				if(adjacent == 1)
				{
					var tempSnakeX = i;
					var tempSnakeY = j;
					var tempSnakeMoveHorizontal = -1; //move to the left by default
					var tempSnakeMoveVertical = 0;
					var tempGo = true;
					
					/*
					while(tempGo)
					{
						if((i + tempSnakeMoveHorizontal > 0) && (i + tempSnakeMoveHorizontal < 15))
						{
							if((j + tempSnakeMoveVertical > 1) && (j + tempSnakeMoveVertical < 20))
							{
								if(passableLocations[i + tempSnakeMoveHorizontal][j + tempSnakeMoveVertical] == 0)
								{
									tempSnakeX += tempSnakeMoveHorizontal;
									tempSnakeY += tempSnakeMoveVertical;
									
									passableLocations[tempSnakeX][tempSnakeY] = 1;
								}
								else
								{
									tempGo = false;
								}
							}
							else // else turn
							{
								//if snake can move left go left
								if(tempSnakeX - 1 > 0)
								{
									tempSnakeMoveHorizontal = -1;
									tempSnakeMoveVertical = 0;
								}
								else //if it cant, then move right
								{
									tempSnakeMoveHorizontal = 1;
									tempSnakeMoveVertical = 0;
								}
							}
						}
						else // else turn
						{
							//if snake can move up go up
							if(tempSnakeY + 1 > 1)
							{
								tempSnakeMoveHorizontal = 0;
								tempSnakeMoveVertical = -1;
							}
							else //if it cant, then move down
							{
								tempSnakeMoveHorizontal = 0;
								tempSnakeMoveVertical = 1;
							}
						}
					}//while tempGo;
					*/
				}
			}
		}
	}
	
	
	//Make sure there is a 4x2 box at the bottom right so that the ghosts can be placed there at the start
	passableLocations[14][19] = 1;
	passableLocations[14][18] = 1;
	passableLocations[14][17] = 1;
	passableLocations[14][16] = 1;
	passableLocations[13][19] = 1;
	passableLocations[13][18] = 1;
	passableLocations[13][17] = 1;
	passableLocations[13][16] = 1;
	
	//Initialize Coin Locations
	for(var i = 1; i < 15; i++)
	{
		for(var j = 2; j < 20; j++)
		{
			//initialize every location to 1 to assume all coordinates
			//are coins
			if(passableLocations[i][j] != 0)
				coinLocations[i][j] = 1;
		}
	}
	
	
	
	
}//generateLevel()

//*****************//
// RENDER FUNCTION //
//*****************//
function render()
{
	jsg.clear();	//clear screen before every new render
	
	//	while loop for temporary grid-lines.
	//	Lines will only be drawn if the index of the loop is within the bounds
	//	of the grid for X and Y respectively.
	var i = 0;				
	while((i <= (gridStartY + gridLengthY)) || (i <= (gridStartX + gridLengthX)))
	{
	
		jsg.setColor("yellow");
		
		
		//vertical lines
		if((i <= (gridStartX + gridLengthX)) && (i > gridStartX))
			jsg.drawLine(gridSize * i, gridSize * gridStartY, 
						gridSize * i, gridSize * (gridStartY + gridLengthY));
		
		//horizontal lines
		if((i <= (gridStartY + gridLengthY)) && (i > gridStartY))
			jsg.drawLine(gridSize * gridStartX, gridSize * i, 
						gridSize * (gridStartX + gridLengthX), gridSize * i);
						
		i++;
	}
	
	
	//*************************//
	// Outer edges of the game //
	//*************************//
	//	The bounds are set by the start of the grid and the length of the grid
	jsg.setColor("blue");
	//top wall
	jsg.drawLine(gridSize * gridStartX, gridSize * gridStartY, 
				gridSize * (gridStartX + gridLengthX), gridSize * gridStartY);
	//left wall
	jsg.drawLine(gridSize * gridStartX, gridSize * gridStartY, 
				gridSize * gridStartX, gridSize * (gridStartY + gridLengthY));
	//right wall
	jsg.drawLine(gridSize * (gridStartX + gridLengthX), 
				gridSize * gridStartY, gridSize * (gridStartX + gridLengthX), 
				gridSize * (gridStartY + gridLengthY));
	//bottom wall
	jsg.drawLine(gridSize * gridStartX, gridSize * (gridStartY + gridLengthY), 
				gridSize * (gridStartX + gridLengthX), 
				gridSize * (gridStartY + gridLengthY));
	
	//******************//
	// Obstacle Section //
	//******************//
	//	Every time an obstacle is created, the spaces that it blocks will be
	// 	removed to the passableLocations[x][y] array by changing the values of
	// 	those coordinates to 0
	
	
	
	//	This function will do the work of creating an obstacle and removing its
	//	coordinates from the passableLocations array
	function makeObstacle(startX, startY, lengthX, lengthY)
	{					
		//	Draws the rectangle according to the grid size
		jsg.fillRect(gridSize * startX, 
					gridSize * startY, 
					gridSize * lengthX, 
					gridSize * lengthY);
		
		//	These for loops execute a number of times based on how big the obstacle is
		//	They will go through every coordinate of the obstacle and remove those
		// 	from the passableLocations array
		for(var i = startX; i < (startX + lengthX); i++)
		{
			for(var j = startY; j < (startY + lengthY); j++)
			{
				passableLocations[i][j] = 0;	//No longer passable
				coinLocations[i][j] = 0;
			}
		}
	}

	/*
	//Call makeObstacle
	makeObstacle(7,2,2,3);
	makeObstacle(7,6,2,2);
	makeObstacle(7,9,2,2);
	makeObstacle(2,3,4,2);
	makeObstacle(2,6,4,2);
	makeObstacle(10,3,4,2);
	makeObstacle(10,6,4,2);
	makeObstacle(2,9,4,2);
	makeObstacle(10,9,4,2);
	makeObstacle(1,12,14,1);
	*/
	
	
	//	Make "Decision" tiles at spaces where a turn could be made
	//	This will designate certain grid coordinates as "decision" tiles
	//	When a ghost is in one of these spaces it will be told to make a decision
	//	It will then decide which way it should turn based on its target space
	//	a Decision tile will have a value of 2 in the passableLocations array
	function makeDecisionTile(xCoord, yCoord)
	{
		jsg.setColor("#FFEBFF");
		passableLocations[xCoord][yCoord] = 2;
		jsg.fillRect(xCoord * gridSize, yCoord * gridSize,gridSize,gridSize);
	}
	
	/*
	makeDecisionTile(1,5);
	makeDecisionTile(1,8);
	makeDecisionTile(6,5);
	makeDecisionTile(6,8);
	makeDecisionTile(9,5);
	makeDecisionTile(9,8);
	makeDecisionTile(14,5);
	makeDecisionTile(14,8);
	//makeDecisionTile(6,2);
	//makeDecisionTile(9,2);
	makeDecisionTile(6,11);
	makeDecisionTile(9,11);
	*/
	
	
	
	
	//passableLocations[8][2] = 0;
	//passableLocations[8][3] = 0;
	//passableLocations[8][4] = 0;
	
	/*
	//render the coins
	//	These for loops will go through the elements of the grid and add coins
	for(var i = 1; i < 15; i++)
	{
		for(var j = 2; j < 20; j++)
		{
			
			if(coinLocations[i][j] == 1)
			{
				jsg.setColor("gold");
				jsg.fillEllipse(i * gridSize + gridSize  * 3/8, j * gridSize + gridSize * 3/8, gridSize / 4, gridSize / 4);
			}
		}
	}
	*/
		
	//Draw all elements of the level
	//level is 16 x 21 grid.  It will be randomly constructed with a path and obstacles.
	//Then this loop will go through and see which tile is which and draw the appropriate tile
	for(var i = 0; i < 16; i++)
	{
		for(var j = 0; j < 21; j++)
		{
			//Obstacle Tiles
			if(passableLocations[i][j] == 0)
			{
				jsg.setColor("#00129C");
				jsg.fillRect(gridSize * i, 
							gridSize * j, 
							gridSize, 
							gridSize);
			}
			/*
			//Decision Tiles
			else if(passableLocations[i][j] == 2)
			{
				jsg.setColor("#FFEBFF");
				jsg.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
			}
			*/
			//Coins
			if(coinLocations[i][j] == 1)
			{
				jsg.setColor("#9C6300");
				jsg.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
			}
			
		}
	}
	
	/*
	//Shows target square of red ghost
	jsg.setColor("#FF8A8A");
	jsg.fillRect(redGhost.TargetX * gridSize, redGhost.TargetY * gridSize,gridSize,gridSize);
	
	//Shows target square of red ghost2
	jsg.setColor("#828282");
	jsg.fillRect(redGhost2.TargetX * gridSize, redGhost2.TargetY * gridSize,gridSize,gridSize);
	*/
	
	//Draw the man
	jsg.setColor("yellow");
	jsg.fillEllipse(Math.floor(pacManX), Math.floor(pacManY),gridSize,gridSize);
	//jsg.fillEllipse(pacManX + gridSize / 6, pacManY + gridSize / 6, gridSize / 3, gridSize / 3);
	
	//Draw red ghost
	jsg.setColor("red");
	jsg.fillEllipse(redGhost.X, redGhost.Y,gridSize,gridSize);

	//Draw red ghost 2
	jsg.setColor("black");
	jsg.fillEllipse(redGhost2.X, redGhost2.Y,gridSize,gridSize);
	
	//Draw red ghost 3
	jsg.setColor("orange");
	jsg.fillEllipse(redGhost3.X, redGhost3.Y,gridSize,gridSize);
	
	//Draw red ghost 2
	jsg.setColor("pink");
	jsg.fillEllipse(redGhost4.X, redGhost4.Y,gridSize,gridSize);

	//Commit to painting all drawings on the screen
	jsg.paint();
}//render()

/*
//Check user input
function checkButtons()
{
	if(document.getElementById("yes").checked)
	{
		doRender = true;
		ready = true;
	}
	else if(document.getElementById("no").checked)
	{
		doRender = false;
		ready = true;
	}
	
}
*/


function game()
{
	update();
	render();
}

//**************************//
// START OF FUNCTIONAL CODE //
//**************************//

//Check if user wants to see pacman learn or not
var r = confirm("Press Ok to see PacMan Learn\nPress Cancel to skip watching the learning process");
if (r == true) {
	doRender = true;
} else {
	doRender = false;
}

//Initial start of game
generateLevel();



//Main loop of game
//If we don't want to see the learning process we will just have pacman
//learn in the background before we render anything
while(!doRender)
{
	update();
}

//After PacMan has learned, we will watch it happen.
setInterval(function(){
	game();
}, gameSpeed);