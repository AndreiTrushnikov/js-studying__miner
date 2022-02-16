// Styles, Scripts
import style from './assets/scss/index.scss'

import Game from './modules/Game';

const game = new Game({x: 9, y: 9, quantityOfMines: 10});
game.init()
