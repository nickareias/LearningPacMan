#This is LearningPacMan
# 
#	Pac man will learn how to beat a randomly generated stage by doing a depth first search through the possible moves in the game.  The ghosts move according to the same rules as in the arcade game.  Their paths are predetermined by the way that pac-man moves.  There is no random chance involved.
#	Pac-Man's heuristic for traversing the level is that he will always try to go in the direction that leads to the best point/movement ratio.
#	Sometimes pac man will get stuck in a loop because the branch of the search tree he goes down will go on forever.  This  depends on the way that the level is generated.  With some more work, the level generation could be changed to only allow completable levels.
