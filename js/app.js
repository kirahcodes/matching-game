/* Shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* =========================== VARIABLE DECLARATIONS =========================== */

/* Constants */
const restartButton     = document.querySelector('i.fa.fa-repeat');
const movesDisplay      = document.querySelector('.moves');
const timerDisplay      = document.querySelector('.timer');
const playButton        = document.querySelector('.play-btn');
const cardIcon          = [
                            'diamond', 'paper-plane-o', 'anchor', 'bolt', 
                            'cube', 'bicycle', 'leaf', 'bomb', 'diamond', 
                            'paper-plane-o', 'anchor', 'bolt', 'cube', 
                            'bicycle', 'leaf', 'bomb'
                        ];
const modal             = document.querySelector('.modal-container');
const stars             = [...document.querySelectorAll('li i.fa.fa-star')];
const deck              = document.querySelector('.deck');

/* Will change throughout the program */
let flippedCards,
    totalStars, 
    matches, 
    minutes, 
    seconds, 
    moves, 
    cards, 
    flip, 
    time;
    

/* ================================ GAME LOGIC ================================= */

/* Add the cards to the game board */
function createBoard() {
    cards.forEach(function (card) {
        deck.innerHTML += card;
    });
}


/*  Build cards and add them to the board  */
function createCard() {
    let shuffled = shuffle(cardIcon); // Shuffle the list of cards
    let cardHTML; // Holds the HTML for the card

    // Loop through each card and create its HTML
    for (let i = 0; i < cardIcon.length; i++) {
        cardHTML = `<li class="card animated" data-icon="${shuffled[i]}"><i class="fa fa-${shuffled[i]}"></i></li>`;
        cards.push(cardHTML); // pushes the new html into the cards array
    }
    
    return cards;
}


/*  Stars decrement by 1 every 10 moves  */
function handleStarRating(moves) {
    if (moves > 9) {
        totalStars = 4; // Decrement the star count by 1
        stars[4].classList.add('bounceOut'); // Remove the 1st filled star

        if (moves > 19) {
            totalStars = 3; // Decrement the star count by 1
            stars[3].classList.add('bounceOut'); // Remove the 2nd filled star

            if (moves > 29) {
                totalStars = 2; // Decrement the star count by 1
                stars[2].classList.add('bounceOut'); // Remove the 3rd filled star

                if (moves > 39) {
                    totalStars = 1; // Decrement the star count by 1
                    stars[1].classList.add('bounceOut'); // Remove the 4rd filled star
                }
            }
        }
    }

    return totalStars;
}

/* When all matches are found the modal will be displayed */
function displayModal() {
    let cardsArr            = [...document.querySelectorAll('.card')];
    let finalStarRating     = totalStars;
    let finalStars          = handleStarRating();
    let finalMoves          = (moves + 1);
    let finalTime           = timer();

    /* Add an animation to all cards to indicate the game has ended */
    cardsArr.forEach(function (matched) {
        matched.classList.remove('tada');
        matched.classList.add('pulse');
    });

    /* Display the results after 2 seconds */
    setTimeout(function() {
        modal.classList.remove('hide'); 
        modal.classList.add('fadeIn'); 
        document.querySelector('.finalTime').textContent = finalTime;
        document.querySelector('.finalStarRating').textContent = finalStars;
        document.querySelector('.finalMoves').textContent = finalMoves;
    }, 2500);
}

/*  Check for matches  */
function checkForMatch(cardsToCheck) {

    if (cardsToCheck[0].dataset.icon === cardsToCheck[1].dataset.icon) {
        /* Add the match class to the matched cards */
        cardsToCheck[0].classList.add('match', 'tada');
        cardsToCheck[1].classList.add('match', 'tada');
        
        /* Remove the open and show classes from the matched cards */
        cardsToCheck[0].classList.remove('open', 'show');
        cardsToCheck[1].classList.remove('open', 'show');

        /* Keep track of how many matches have been found */
        matches++;

        if (matches === 8) {
            displayModal();
        }
    }
}

/*  When the cards are flipped  */
function addToFlipped(flippedCard) {
    flippedCards.push(flippedCard);

    /* When 2 cards are flipped */
    if (flippedCards.length == 2) {
        /* Check if the cards in the array match */
        checkForMatch(flippedCards); 

        /* Handle the moves */
        moves++; // Increment the move counter
        movesDisplay.textContent = moves; // Update moves on page

        /* Handle the star rating based on the moves */
        handleStarRating(moves);
        
        /* When cards to match, hide them */
        setTimeout(function () {
            /* Hide all cards that are flipped and don't match */
            flippedCards.forEach(function (card) {
                card.classList.remove('open', 'show', 'flipInY');
            });

            /* Empty the flipped cards array */
            flippedCards = [];
        }, 750);
    }

    return moves;
}

/*  Show the card when it is clicked  */
function displayCard(card) {
    /* Add open and show classes to the flipped card */
    card.classList.add('open', 'show', 'flipInY');

    /* Push both flipped cards into the array of flipped cards */
    addToFlipped(card);
}

/*  Timer function  */
function timer() {
    let mins, secs, timeString;

    seconds += 1;

    /* When seconds are single digit, add a 0 */
    if (seconds < 10 ? secs = '0' + seconds : secs = seconds)

    /* When minutes are single digit, add a 0 */
    if (minutes < 10 ? mins = '0' + minutes : mins = minutes)

    /* When seconds exceed 59, increment minutes and reset seconds to 0 */
    if (seconds > 59) {
        minutes++;
        seconds = 0;
    }
    
    timeString = mins + ':' + secs;

    /* Update timer display */
    timerDisplay.textContent = timeString;

    /* Stop the timer when all matches are found */
    if (matches === 8) {
        clearInterval(time);
    }

    return timeString;
}

/*  Create event listeners for each card  */
function createEventListeners() {
    let allCards = [...document.querySelectorAll('.card')];
    
    allCards.forEach(function(card) {
        card.addEventListener('click', function() {
            flip++;

            /* Start timer when the first card is flipped */
            if (flip === 1) {
                // console.log(('Start the timer now.'));
                time = setInterval(timer, 1000);
            }

            /* If card is NOT flipped */
            if (!card.classList.contains('open') &&
                !card.classList.contains('show') &&
                !card.classList.contains('match')) {

                /* Flip the card when it is clicked */
                displayCard(card);
            }
        });
    });
}

function startGame() {
    flippedCards    = []; // Holds 2 flipped cards when they are clicked
    totalStars      = 5; // Default number of stars on the page
    minutes         = 0; // Starting mintues for the timer
    matches         = 0; // Default number of matches
    seconds         = 0; // Starting seconds for the timer
    moves           = 0; // Default number of moves
    cards           = []; // Holds all cards once they are created
    flip            = 0; // Default number of card flips

    /* Clears the deck's HTML if there is any */
    deck.innerHTML = '';

    
    /* Builds the cards */
    createCard();
    
    /* Adds the cards to the game board */
    createBoard();
    
    /* Creates the event listeners for each card */
    createEventListeners();
}

startGame();

function restartGame() {
    /* Reset the move display */
    movesDisplay.textContent = 0;

    /* Clear the interval */
    clearInterval(time);

    /* Reset the timer display */
    timerDisplay.textContent = '00:00';

    /* Reset all the stars */
    stars.forEach(function (star) {
        star.classList.remove('hide', 'bounceOut');
    });

    /* Start the game again */
    startGame();
}

/* ==================== Event listener for the restart button ==================== */
restartButton.addEventListener('click', function() {
    restartGame();
});

/* ==================== Event listener for the play again button ==================== */
playButton.addEventListener('click', function() {
    modal.classList.add('hide');
    restartGame();
});