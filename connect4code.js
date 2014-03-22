//Jeu de connect 4
//Humain et ordi
//Start game button: line 98
//PvP connect 4 : line 22
//CvC connect 4: bottom of page
$(document).ready(function(){

//Tracking data.
var COLONNES = 7;
var LIGNES = 6;
var gamesPlayed = 0;
var p1Wins = 0;
var p2Wins = 0;
var tie = 0;
var inGame = false;
var bg_url;					//bg_url is used to remember which image was there before the user hovered over it
//End Tracking data
//Generate a board for Aesthetics' sake

generateHTMLBoard(LIGNES, COLONNES);

/*---------------------------------------------------------------------------------------------Actual game---------------------------------------------------------------------------------------------------------------------*/
//Game variables

var NBCOLONNES = COLONNES;
var NBRANGEES = LIGNES;
var gameboard = (creeTableauVide(NBCOLONNES,NBRANGEES," "));
var joueur1 = player1Radio();
var joueur2 = player2Radio();
var playermove = "0";
var playerturn = 0;                                 // playerturn: Variable associée pour déterminer à qui le tour avec (k % 2)
var k = 0;                                          // k: Compteur de tours. k++ a chaque fois que quelqu'un joue.
var vainqueur = 0;                                  // vainqueur: lorsque vainqueur vaut 1, on declare le joueur present gagnant
var coords = [0, 0];                                // coords: sert a savoir les coordonnées de l'endroit ou le joueur joue


$(".playbox").click(function(){

var currentRow = ($(this).attr('id').charAt(0));
var currentColumn = ($(this).attr('id')).charAt(1);
console.log("playbox "+currentRow+currentColumn+" has been clicked");

if(inGame && (colonneAcoord(gameboard, parseInt(currentColumn) + 1) != 0)){ // The +1 to currentColumn is to return to the base of human intuition.

	playermove = parseInt(currentColumn) + 1;
	coords = colonneAcoord(gameboard, playermove); 	// la valeur de coords sera forcement valide
	playerturn = (k % 2);
	modifieBoard(gameboard, playerturn, coords);		// Modifie le board en memoire
	refreshPlateauDeJeu(gameboard);						// Refresh the html board
	vainqueur = verifieVainqueur(gameboard, false); 
	if(initiateWinConsequences(vainqueur, k) == 0){		//If there is a winner, end the game
		return 0;
	}	
	k++; //Increment turn counter 
	
	//IF playing against a computer, have the computer make his move.
	if(joueur1 == "o" || joueur2 == "o"){
	
		playermove = moveAI(gameboard, k);
		coords = colonneAcoord(gameboard, playermove); 	// la valeur de coords sera forcement valide
		playerturn = (k % 2);
		modifieBoard(gameboard, playerturn, coords);		// Modifie le board en memoire
		refreshPlateauDeJeu(gameboard);						// Refresh the html board
		vainqueur = verifieVainqueur(gameboard, false); 
		if(initiateWinConsequences(vainqueur, k) == 0){		//If there is a winner, end the game
			return 0;
		}
		k++;
	}
} //end if(ingame)
})//End click empty square event

/*----------------------------------------------------------------------------------------------------End actual game-----------------------------------------------------------------------------------------------------------*/

//Troubleshooting function for when things get tough
$(".playbox").click(function(){
	console.log($(this).attr("id"));
	console.log($(this).attr("class"));
});

//Run game, clear all variables when user clicks start game
$("#startgame").click(function(){
	inGame = true;
	$(".playbox").css("opacity","1.0");
	resetGameVariables();
	refreshPlateauDeJeu(gameboard);
	removeHighlights();
	
	if(joueur1 == "o" && joueur2 == "o"){	//Have computers go at it
		connect4(LIGNES, COLONNES);
		return 0;
	}
	if(joueur1 == "o" && joueur2 == "h"){	//Have a computer play the first move
		playermove = moveAI(gameboard, k);
		coords = colonneAcoord(gameboard, playermove); 	
		playerturn = 0;										// It is player 1's turn
		modifieBoard(gameboard, playerturn, coords);		// Modifie le board en memoire
		refreshPlateauDeJeu(gameboard);						// Refresh the html board
		k++;
	}
	//The case player 1 = player and player 2 = computer is taken care of by the actual game function
})

//Show where the token would be placed when one hovers the mouse over
$(".playbox").mouseenter(function(){

	
	var currentColumn = ($(this).attr('id')).charAt(1);
	var futurePlacementCoords = colonneAcoord(gameboard, parseInt(currentColumn) + 1);
	bg_url = $("#"+futurePlacementCoords[1]+futurePlacementCoords[0]).css("background-image");
	
	if(inGame && (colonneAcoord(gameboard, parseInt(currentColumn) + 1) != 0)){
		console.log(bg_url);
		colonneAcoord(gameboard, parseInt(currentColumn) + 1);
		if((k%2) == 0){	//Player 1, X, Black.
			$("#"+futurePlacementCoords[1]+futurePlacementCoords[0]).css("background-image","url(images/blackplacementsquare.png)");
			console.log("Player 1 hovered over playbox " + futurePlacementCoords[0] +""+ futurePlacementCoords[1]);
		}
		else if((k%2) == 1){	//Player 2, O, Red.
			$("#"+futurePlacementCoords[1]+futurePlacementCoords[0]).css("background-image","url(images/redplacementsquare.png)");
			console.log("Player 2 hovered over playbox " + futurePlacementCoords[0] +""+ futurePlacementCoords[1]);
		}
		
	}
});

//Remove the hovered over item's new img
$(".playbox").mouseleave(function(){

	var currentColumn = ($(this).attr('id')).charAt(1);
	var futurePlacementCoords = colonneAcoord(gameboard, parseInt(currentColumn) + 1);
	$("#"+futurePlacementCoords[1]+futurePlacementCoords[0]).css("background-image", bg_url);
});



//Function that updates the row number counter to the value of the slider, and the number of lines wanted
$("#rownumberslider").change(function(){
	$("#rownumbercounter").text($("#rownumberslider").val());
	LIGNES= $("#rownumberslider").val();
	if(!inGame){
		generateHTMLBoard(LIGNES, COLONNES);
	}
})

//Function that updates the column number counter to the value of the slider, the number of columns wanted
$("#columnnumberslider").change(function(){
	$("#columnnumbercounter").text($("#columnnumberslider").val());
	COLONNES = $("#columnnumberslider").val();
	if(!inGame){
		generateHTMLBoard(LIGNES, COLONNES);
	}
})

function removeHighlights(){
	$(".highlightbox").removeClass("highlightbox").addClass("playbox");
}
//Clear all game variables

//This function takes care of all the things to do when there is a winner
function initiateWinConsequences(vainqueur, k){

	if (vainqueur == -1){                          
        alert("Partie nulle!");
		gamesPlayed++;
		updateGamesPlayedCounter(gamesPlayed);
		tie++;
		updateTieCounter(tie);
		inGame = false;
		$(".playbox").css("opacity","0.7");
        return 0;
    }
	if(vainqueur == 1){
		if((k % 2) == 0){
			alert("\nJoueur 1 gagnant!");
			gamesPlayed++;
			updateGamesPlayedCounter(gamesPlayed);
			p1Wins++;
			updatePlayer1WinsCounter(p1Wins);
			inGame = false;
			$(".playbox").css("opacity","0.7");
			return 0;
		}
		else{
			alert("\nJoueur 2 gagnant!");
			gamesPlayed++;
			updateGamesPlayedCounter(gamesPlayed);
			p2Wins++
			updatePlayer2WinsCounter(p2Wins);
			inGame = false;
			$(".playbox").css("opacity","0.7");
			return 0;
        }
	}
	return 1;
}
function resetGameVariables(){
	 NBCOLONNES = COLONNES;
	 NBRANGEES = LIGNES;
	 gameboard = (creeTableauVide(NBCOLONNES,NBRANGEES," "));
	 joueur1 = player1Radio();
	 joueur2 = player2Radio();
	 playermove = "0";
	 playerturn = 0;                                 
	 k = 0;                                          
	 vainqueur = 0;                                  
	 coords = [0, 0];                                
}

function generateHTMLBoard(NBRANGEES, NBCOLONNES){
//Start off by resetting the width and height of leftnav, rightnav and container
				$("#container").css("width","900px");
				$("#leftnav").css("height", "400px");
				$("#rightnav").css("height","400px");
				$(".playboard").empty();
//Empty previous board
//Note: 53px and 67px represent the height and width of added squares
		if(NBRANGEES > 6){
			for(var w = 0; w < (NBRANGEES - 6); w++){
				$("#leftnav").css("height", "+=53px");
				$("#rightnav").css("height","+=53px");
			}
		}
		
		if(NBCOLONNES > 7){
			for(var w = 0; w < (NBCOLONNES - 7); w++){
				$("#container").css("width","+=67px");
			}
		}
		
	for(var i = (NBRANGEES-1) ; i >= 0 ; i--){
	
		//Each row will have its proper id
		var rowText = "<ul id='"+i+"'></ul>";
		$(".playboard").append(rowText);
		console.log(rowText);
		for(var j = 0; j < NBCOLONNES; j++){
			$("#" +i).append('<li class="playbox" id="'+i+j+'"></li>');
			console.log('<li class="playbox" id="'+i+j+'"></li>');
			
		}
	}
	console.log("Board "+NBRANGEES+"x"+NBCOLONNES+" generated");
	return 0;
}

function player1Radio(){
	return $("input[name=usertypep1]:checked").val();
}

function player2Radio(){
	return $("input[name=usertypep2]:checked").val();
}


function updateGamesPlayedCounter(games){
	$("#gamesplayed").text(games);
}
function updatePlayer1WinsCounter(Wins){
	$("#player1wins").text(Wins);
}
function updatePlayer2WinsCounter(Wins){
	$("#player2wins").text(Wins);
}
function updateTieCounter(pat){
	$("#tie").text(tie);
}
function creeTableauVide (nlignes, ncolonnes, valeur){ // Crée une matrice de la taille spécifiée (y lignes, x colonnes) 
   	var mat = [];                              // avec la valeur (valeur) a tout les points.
    for (var i = 0; i < nlignes; ++i){
        mat[i] = [];
        for (var j = 0; j <ncolonnes; ++j) {
            mat[i][j] = valeur;
        };
    };
    return(mat);
};

function independentArray2D(board){     // Cree un tableau identique et independant au tableau 2D en entree.
										// returns an array of identical size
var copyboard = Array(board.length);    // Ne fonctionne pas si le tableau contient des objets.

for(var i = 0; i < board.length; i++){
	   copyboard[i] = board[i].slice();
    }
    return(copyboard);
};

function refreshPlateauDeJeu(mat){ //Refreshes the game board in the html page
	
	for(var j = 0; j < mat.length; j++){			//Column j
		for(var i = 0; i < mat[0].length; i++){		//Row i
			if(mat[j][i] == " "){
				$("#"+i+j).css("background-image","url(images/blankquare.png)");
			}
			if(mat[j][i] == "X"){	//X is black 
				$("#"+i+j).css("background-image","url(images/blacksquare.png)");
			}
			if(mat[j][i] == "O"){ 	//O is red
				$("#"+i+j).css("background-image","url(images/redsquare.png)");
			}
			//alert("Value of j: " +j +"\n" +"Value of i: " + i);
		}
	}
};
												//For the html version this function will most likely not be useful
function affichePlateauDeJeu(mat, sep) {     	// Prend une matrice et le rend sous forme de string imprimable dans alert et prompt.
												// Inscrit toujours les axes, mais le separateur doit être spécifié.
    var imp = "";                       			// Retourne une string.
    var axeX = "  ";
	
    for (var j = (mat[0].length - 1); j >= 0; j--)
        {
        for (var i = 0; i <= (mat.length - 1 ); i++)
            { 
            if(i == (mat.length -1))
                {
                imp = imp + (sep + mat[i][j] + sep + "\n");  // Si nous sommes rendu a la fin de la ligne, insert new line,
                }                                            // et mettre en plus un separateur a la fin de la ligne.
            else if (i == 0)
                {
                imp = imp + (j+1) + " " + sep  + (mat[i][j]);// Si nous sommes au debut de la ligne, ajouter le numero de la
                }                                            // colonne
            else
                {
                imp = imp + (sep + mat[i][j]);               // Pour tout les autres cases, simplement mettre le separateur 
                };                                           // au debut de la case.
            };
        };
	
        for (var l = 0; l <= (mat.length - 1); l++)          // Cette sous-routine ajoute tout les chiffres de l'axe X
            {
            axeX = axeX + " " + (l+1);                       // Les chiffres sont chacuns separes d'un espace
            }
            
        imp = imp + "  " + (repeter(" -", (mat.length))) + "\n";   // On cree une ligne de dash au nombre de colonnes
        imp = imp + axeX;
	    
        return(imp);	//Retourne une string contenant le tableau à imprimer.
}

function repeter(input,x){      	// Prend une valeur qui est ensuite convertie en string pour la multiplier x fois
						// tout en la retournant sous forme de string
    var output = "";            
        input = input + "";
    
    for(i = 0; i < x; i++){
        output = output + input; 
    };
    return(output);
};

function colonneAcoord(board, play){          	// play = la colonne jouée
												// Retourne les coordonnées du jeu valide dans la colonne spécifiée [x, y]
var opcoords = [0, 0];                         	// Si la colonne n'est pas valide, retourne 0

    for(var j = 0; j < (board[play-1].length); j++)
        {
        if( board[play - 1][j] == " "){
        
            opcoords[0] = (play - 1);
            opcoords[1] = j;
            return(opcoords);
            };
        };
        return(0);
};

function modifieBoard(board, player, coord){   // Board est le plateau de jeu, player c'est (k % 2) et
													// coords c'est les coordonnees de l'espace ou l'on veut mettre notre jeton
    if(player == 0){                            		// Retourne un plateau de jeu modifie
        board[coord[0]][coord[1]] = "X";
        }
    else{
        board[coord[0]][coord[1]] = "O";
        }
    return(board);
};
												//If comp == 1, it is the computer who is thinking ahead.
function verifieVainqueur(board, isComp){       	// Fonction qui verifie si il y a un gagnant.
												// Retourne 1 si il y a un gagnant, 0 si il n'y en a pas -1 si c'est nul
var counter = 0;
var tieCounter = 0;

    for(var i = 0; i <= board.length - 1; i++)  // Verifie chaque [i][j] pour voir si c'est le debut d'une colonne gagnante.
        {
        for(var j = 0; j <= board[i].length - 4; j++)
            {                
            if((board[i][j] == board[i][j+1]) && 
               (board[i][j+1] == board[i][j+2]) && 
               (board[i][j+2] == board[i][j+3]) && 
               (board[i][j] != " ")){
				if(!isComp){
					$("#"+j+i).addClass("highlightbox");
					$("#"+(j+1)+i).addClass("highlightbox");
					$("#"+(j+2)+i).addClass("highlightbox");
					$("#"+(j+3)+i).addClass("highlightbox");
				}
				return(1);
                }
            }
        }
     for(var i = 0; i < board.length - 3; i++)  // Verifie chaque [i][j] pour voir si c'est une ligne gagnante
        {
        for(var j = 0; j <= board[i].length - 1; j++)
            {                
            if((board[i][j] == board[i+1][j]) && 
               (board[i+1][j] == board[i+2][j]) && 
               (board[i+2][j] == board[i+3][j]) && 
               (board[i][j] != " ")){
			   	if(!isComp){
					$("#"+j+i).addClass("highlightbox");
					$("#"+j+(i+1)).addClass("highlightbox");
					$("#"+j+(i+2)).addClass("highlightbox");
					$("#"+j+(i+3)).addClass("highlightbox");
				}
              return(1);
                }
               }
            }
    for(var i = 0; i <= board.length - 4; i++)   // Verifie chaque [i][j] pour voir si c'est le debut d'une diagonale / ->^
        {
        for(var j = 0; j <= board[i].length - 4; j++)
            {
            if((board[i+0][j+0] == board[i+1][j+1]) && 
               (board[i+1][j+1] == board[i+2][j+2]) && 
               (board[i+2][j+2] == board[i+3][j+3]) && 
               (board[i][j] != " ")){
				if(!isComp){
					$("#"+j+i).addClass("highlightbox");
					$("#"+(j+1)+(i+1)).addClass("highlightbox");
					$("#"+(j+2)+(i+2)).addClass("highlightbox");
					$("#"+(j+3)+(i+3)).addClass("highlightbox");
				}
              return(1);
                }
            }
        }
    for(var i = 0; i <= board.length - 4; i++)    // Verifie chaque [i][j] pour voir si c'est le debut d'une diagonale \ ->v
        {
        for(var j = 3; j < board[i].length; j++)
            {
            if((board[i+0][j-0] == board[i+1][j-1]) &&
               (board[i+1][j-1] == board[i+2][j-2]) &&
               (board[i+2][j-2] == board[i+3][j-3]) &&
               (board[i][j] != " ")){
   				if(!isComp){
					$("#"+j+i).addClass("highlightbox");
					$("#"+(j-1)+(i+1)).addClass("highlightbox");
					$("#"+(j-2)+(i+2)).addClass("highlightbox");
					$("#"+(j-3)+(i+3)).addClass("highlightbox");
				}
              return(1);
                }
            }
        }
    for(var i = 0; i < board.length; i++)   // Compte le nombre de cases occupees par des char qui ne sont pas " ".
        {
        for(var j = 0; j < board[i].length; j++)    
            {
            if(board[i][j] == " "){
                return(0);
                }
            if(board[i][j] != " "){
            tieCounter++;
                }
            }
        }
        if(tieCounter == ((board.length)*(board[0].length))){   // Si ce nombre est egal a la surface de la grille
            return(-1);                                         // Nous savons qu'il n'y a plus de jeu possible
            }                                                   // Alors, c'est une partie nulle.
        else{
        return(0);
        }
};

function indexOfValue(array, value){    // Retourne la position d'une valeur "value" dans une tableau array d'une dimension

for (var i = 0; i < array.length; i++) {
	if (array[i] == value) {
	return i;
		}
    }
return -1;                              // code de failure.
};

function moveAI(board, k){          // Fonction qui retourne un move qui: gagne, empeche l'autre de gagner ou rend un 
                                    // nombre au hasard.
var AImove = 0;
var validMoves = Array(board.length);
var testBoard = [];
var playerturn = (k % 2);


    for(var i = 0; i < board.length; i++)
        {
        validMoves[i] = i + 1;			// ex: validMoves = [1,2,3,4,5,6,7];
        }                               // Populer chaque case du tableau validMoves avec les chiffres de 1 a board.length
		
    for(var j = 0; j < validMoves.length; j++){
        if(colonneAcoord(board, validMoves[j]) == 0){	//Colonne a coords check pour la validité du move
            validMoves.splice(j, 1);					//Si ce n'est pas un move valide, on l'enlève
            j = -1;										//On reset la valeur de j pour retraverser le tableau validMoves
        }
    }
    if(validMoves.length == 1){     // Si il reste qu'un seul move valide, jouer ce move.
        return(validMoves[0]);
    };

    for (var x = 0; x < validMoves.length; x++){    // Pour chaque valeur dans validMoves
        testBoard = independentArray2D(board);      // Pour player 1
        modifieBoard(testBoard, playerturn, colonneAcoord(testBoard, validMoves[x]));
                                                    // Verifier si ce move provoque un vainqueur
        if(verifieVainqueur(testBoard, true) == 1){       // Si oui, retourner ce move
            return (validMoves[x]);
            };
        };
        if(playerturn == 0){                        // On veut que la prochaine fonction verifie pour le vainqueur avec les jetons adverse.
            playerturn = 1;
        }
        else{
            playerturn = 0;
        };
        
        for (var x = 0; x < validMoves.length; x++){    // Pour chaque valeur dans validMoves
        testBoard = independentArray2D(board);          // Pour player 2
        modifieBoard(testBoard,(playerturn), colonneAcoord(testBoard, validMoves[x]));
                                                    // Verifier si ce move provoque un vainqueur
        if(verifieVainqueur(testBoard, true) == 1){       // Si oui, retourner ce move
            return (validMoves[x]);
            };
        };
        return(validMoves[hasard(validMoves.length) - 1]);
}

function hasard (a){                // Retourne un nombre au hasard dans la base specifiee
    var b = Math.floor((Math.random()*(a) + 1));
    return(b);
};

function jeuValide (board, play){           // Prend comme input le plateau de jeu et la colonne jouee
var playermove = play;                      // Retourne soit 0, 1, 2

    if ((typeof(playermove) != "number") || (playermove.length == 0)){    // 0 pour "pas un nombre" 1 pour "colonne hors tableau" et 2 pour "colonne pleine"
        return (0);                         // Si le jeu est valide, return(3)
        }

    else{
        if(isNaN(play)){
        return(0);
        }
        else if ((playermove > board.length) || (playermove < 1)){
            return(1);
            }
        else if ((colonneAcoord(board, playermove)) == 0){
            return(2);
            };
		return(3);
    }
};

function texteJeuValide(c){     // Converti le code retourné par jeuValide et donne le texte correspondant.

    if(c == 0){
        return("Vous devez entrer un numero de colonne. Veuillez recommencer.");
    }
    else if(c == 1){
        return("Colonne hors du tableau. Choisissez une autre colonne.");
    }
    else if(c == 2){
        return("Colonne pleine. Choisissez une autre colonne.");
    }
    else if(c == 3){
        return(0);
    }

};

function printPlacement(k, coords){     // Procedure qui alert le jeton du joueur et ses coordonnees

    if((k % 2) == 0){
    print(">> X " + (coords[0] + 1) + " " + (coords[1] + 1));	//+1 for going from array indices to human intuition
    }
    else{
    print(">> O " + (coords[0] + 1) + " " + (coords[1] + 1));
    }
}

function alertPlacement(k, coords){     // Procedure qui alert le jeton du joueur et ses coordonnees

    if((k % 2) == 0){
    console.log(">> X " + (coords[0] + 1) + " " + (coords[1] + 1));
    }
    else{
    console.log(">> O " + (coords[0] + 1) + " " + (coords[1] + 1));
    }
}

function connect4 (LINES, COLUMNS){
var NBCOLONNES = COLUMNS;
var NBRANGEES = LINES;
var gameboard = (creeTableauVide(NBCOLONNES,NBRANGEES," "));
var joueur1 = player1Radio();
var joueur2 = player2Radio();
var playermove = "0";
var playerturn = 0;                                 // playerturn: Variable associée pour déterminer à qui le tour avec (k % 2)
var k = 0;                                          // k: Compteur de tours. k++ a chaque fois que quelqu'un joue.
var vainqueur = 0;                                  // vainqueur: lorsque vainqueur vaut 1, on declare le joueur present gagnant
var coords = [0, 0];                                // coords: sert a savoir les coordonnées de l'endroit ou le joueur joue

while (vainqueur < 1){                              // Boucle jusqu'a ce qu'un joueur gagne, ou qu'une partie es nulle.
													// Verification de si il y a une partie nulle.
    if((joueur1 == "o") && ((k % 2) == 0)){
        playermove = moveAI(gameboard,k);
    }
    else if((joueur2 == "o") && ((k % 2) == 1)){
        playermove = moveAI(gameboard,k);
    }
    else if ((k % 2) == 0){                         		//(k % 2) est soit 1 ou 0. 0 indique que c'est le tour a player 1 (X)
															// 1 indique que c'est le tour de player 2 (O)
        playermove = prompt("\n\nJoueur 1 (X) colonne?");
        if (playermove == null){return (0);}        		// Si le joueur fait cancel, on arrete le jeu.
        else{
        playermove = +playermove;                  			// On peut alors changer l'input a la forme number
        }
        while (jeuValide(gameboard, playermove) != 3){ 		// 3 est le code retourné par jeuValide pour dire que le jeu est valide
            playermove = prompt("\n\n" + (texteJeuValide(jeuValide(gameboard, playermove))));
        if (playermove == null){return (0);}         		// Si le joueur fait cancel, on arrète le jeu.
        else{
        playermove = +playermove;
            }
            }
    }
 
	else {
	
	
        playermove = prompt("\n\nJoueur 2 (O) colonne?");
        if (playermove == null){
			return (0);
		}         // Si le joueur fait cancel, on arrète le jeu.
        else{
        playermove = +playermove;
        }
        while (jeuValide(gameboard, playermove) != 3){  // 3 est le code retourné par jeuValide pour dire que le jeu est valide
        
            playermove = prompt("\n\n" + (texteJeuValide(jeuValide(gameboard, playermove))));
            if (playermove == null){return (0);}     // Si le joueur fait cancel, on arrete le jeu.
            else{
            playermove = +playermove;
                }
            }
        };
	
	coords = colonneAcoord(gameboard, playermove); 	// la valeur de coords sera forcement valide vu que playermove est testé rigoureusement
	playerturn = (k % 2);
	modifieBoard(gameboard, playerturn, coords);		// Modifie le board en memoire
	refreshPlateauDeJeu(gameboard);				// Refresh the html board
	vainqueur = verifieVainqueur(gameboard, false); 		// Retournera -1 si le jeu est plein, donc partie nulle. 
										// Retourne 1 si vainqueur.
	if(initiateWinConsequences(vainqueur, k) == 0){
		return 0;
	}
	k++;
}	//End of while
};	//End of connect4()

});

//Note: Player 1 is black (X) and Player 2 is red (O);
