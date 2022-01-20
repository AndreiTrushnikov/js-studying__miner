// Styles, Scripts
import style from './assets/scss/index.scss'
import component from './assets/images.js';

// import closed from '../img/closed.svg'
// import flag from '../img/flag.png'
// import bg from '../img/nums_background.svg'


import Game from './modules/Game';

const game = new Game({x: 9, y: 9, quantityOfMines: 10});
game.init()
