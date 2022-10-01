# wordle_ga

Wordle fo General Assembly
(Wordledurdle)

## Work plan

The game looks and functions very similar to the original Wordle (minus the animation).

A hint button is added to the game for anyone who's as bad at this as me. One hint is provided per game, the button is disabled after click.

## Logic behind comparing the guess word and target word

Turning guess word and target word into a set of 5 individual letters
i.e. guess ={
0: 'C',
1: 'R',
2: 'E',
3: 'P',
4: 'E'
}
check for exact match first, the matching key and value pair will then be deleted from the set. s
