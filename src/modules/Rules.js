import timer from './utils/timer.js';
import checkTheSameRand from './utils/checkTheSameRand.js'
import minmax from "./utils/minmax";

export default class Rules {
    constructor($root, min, max) {
		this.timerId = '';
		this.$root = $root;
		this.isGameStart = false;
		this.isGameLoose = true;

		this.min = min;
		this.max = max;

		this.arrWithRandomMines = []; // Массив с ячейками, содержащими мины
		this.minesObj = {};
		this.field = document.querySelector('#miner');
		this.cells = document.querySelectorAll('.miner-cell');
    }

	initDOMListeners() {
		const startBtn = document.getElementById("start");
		const resetBtn = document.getElementById("reset");
		const minerBody = document.getElementById("miner-body");

		if (startBtn) {
			startBtn.addEventListener('click', () => {
				if (this.isGameStart) return;
				this.startGame(this.$root);
			})
		}

		if (resetBtn) {
			resetBtn.addEventListener('click', () => {
				this.stopGame(this.$root);
			})
		}

		if (minerBody) {
			minerBody.addEventListener('click', (e) => {
				if (e.target.classList.contains('miner-body')) return;
				if (minerBody.classList.contains('lose')) return;

				if (!this.isGameStart) {
					this.startGame();
					this.clickOnCell(e.target, this.minesObj);
					// checkMine(e.target, arrWithRandomMines);
					// checkCell(e.target, minesObj, false); // проверка ячейки и возврат количества мин рядом
			
					// if ((numberOfMines == null) || (numberOfMines == 0)) {
					//     e.target.innerHTML = '';
					// } else {
					//     e.target.innerHTML = numberOfMines;
					// }
				} else {
					this.clickOnCell(e.target, this.minesObj);
					// checkMine(e.target, arrWithRandomMines);
					// checkCell(e.target, minesObj, false); // проверка ячейки и возврат количества мин рядом
			
					// if ((numberOfMines == null) || (numberOfMines == 0)) {
					//     e.target.innerHTML = '';
					// } else {
					//     e.target.innerHTML = numberOfMines;
					// }
				}
			})

			// Правый клик по ячейке - установка флажка
			minerBody.addEventListener('contextmenu', (e) => {
    			e.preventDefault();
				if (minerBody.classList.contains('lose')) return;

    			e.target.classList.toggle('miner-cell--bomb');
    			if (!this.isGameStart) {
    			    this.startGame();
    			    this.checkNumberOfBombs();
    			} else {
    			    this.checkNumberOfBombs();
    			}
    			return false;
			}, false);

		}
	}



	/*
	* Клик по ячейке
	*/
	clickOnCell(target, minesObj) {
		const curId = target.dataset['id'];
		const isBomb = this.isBomb(minesObj[curId].mine); // проверка на мину
		console.log('isBomb',isBomb);
        // если в ячейке бомба - проиграли
        if (isBomb) {
            this.lose(target, curId);
            return;
        } else {
            // иначе проверяем ячейки вокруг текущей
            // checkSiblings(minesObj, cellID);
            // если рядом есть мины, отменяем поиск и ставим в ячейку количество мин рядом
            // if (count > 0) {
            //     target.innerText = count;
            // } else {
            //     // поиск, если рядом нет мин
            //     console.log('Начало поиска рядом');
            //     checkMinesInSiblings(minesObj[cellID].place, cellID);
            // }
            target.classList.add('miner-cell--free');
            // return count;
        }
    }


	/*
	* Попадание на ячейку с миной
	*/
	lose(target,cellID) {
	    target.classList.add('miner-cell--error');
	    console.log('Бабах! Ячейка с миной = ', cellID);

		this.stopGame();
	    this.field.classList.add('lose');
	    // подсветка всех полей с минами
		console.log('this.minesObj',this.minesObj);
	    for (let key in this.minesObj) {
	        if (this.minesObj[key].mine == true) {
	            let loserCell = document.querySelector('.miner-cell[data-id="' + key +'"]');
	            loserCell.classList.add('miner-cell--error');
	        }
	    }
	}


	/*
	*
	*/
	isBomb(target) {
		if (target === true) {return true;} else {return false;}
	}



	/*
	* Проверка того, сколько осталось бомб
	* (Нужна для случаев победы или неправильного расположения мин)
	*/
	checkNumberOfBombs() {
		// console.log('this.cells ',this.cells );
		// if (this.cells) {
		// 	for (let element in this.cells) {
		// 		if (this.cells.hasOwnProperty(element)) {
		// 		   if (this.cells[element].classList.contains('miner-cell--bomb')) {
		// 				tempMines++;
		// 		   }
		// 		}
		// 		tablo.value = minesCount - tempMines;
		// 	}
		// 	tempMines = 0;
		// }
	}


	/*
	* Создаёт объект со всеми необходимыми данными по игре
	*/
	createMinesObject(arrWithRandomMines, maxX, maxY) {
		const minesObj = {};
		let x = 1;
		let y = 1;
		let dataId = '';
		// задание значения place объекта с минами, для обозначения,
		// где находится выбранная ячейка
		for (var i = 1; i <= maxX * maxY; i++) {
			let place;
			// 1
			if (i == '1') {
				place = 'leftTopCorner';
			}
			// 2-8
			else if ((i>1) && (i<maxX)) {
				place = 'topHorizontalLine';
			}
			// 9
			else if (i == maxX) {
				place = 'rightTopCorner';
			}
			// 18,27,36 .. 72
			else if ((i % maxX == 0) && (i != maxX) && (i != maxX*maxY)) {
				place = 'rightVerticalLine';
			}
			// 10,19,28,37
			else if (((i-1) % maxX == 0) && (i != maxX*maxY - (maxX-1))) {
				place = 'leftVerticalLine';
			}
			// 73
			else if (i == maxX*maxY - (maxX-1)) {
				place = 'leftBottomCorner';
			}
			// 74-80
			else if ((i> maxX*maxY - (maxX-1)) && (i<maxX*maxY)) {
				place = 'bottomHorizontalLine';
			}
			// 81
			else if (i == maxX*maxY) {
				place = 'rightBottomCorner';
			}
			else {
				place = 'center';
			}

			minesObj[i] = {
				"x": x,
				"y":y,
				mine: false,
				place: place,
				isCellCheck: false,
				isSiblingCheck: false,
				dataId: i
			};
			x++;
			if (x == 10) {
				y++;
				x = 1;
			}
		}

		// добавление мин
		for (var el in minesObj) {
			if (arrWithRandomMines.includes(parseInt(el))) {
				minesObj[el].mine = true;
			}
		}

		return minesObj;
	}



	/*
	* Проверка на уникальность создаваемых id мин
	*/
	checkTheSameRand() {
		const tempRand = Math.round(minmax(this.min, this.max));
		if (this.arrWithRandomMines.includes(tempRand)) {
			this.checkTheSameRand(this.min, this.max);
		}
		return tempRand;
	}



	/*
	* Создание массива с минами
	*/
	createRandomMines(min, max, quantity, check) {
		const array = [];
		// TODO: По окончании работ убрать проверку на check
    	// Создание рандомного числа от мин до макс включая
    	if (check == true) {
    	    return [2,3,4,34,25,75,8,11,72,74]; // для проверок
    	} else {
    	    for (let i = 0; i < quantity; i++) {
    	        array[i] = this.checkTheSameRand();
    	    }
    	    return array;
    	}
	}



	/*
	* Запуск правил
	*/
	startGame() {
		console.clear();
		this.isGameStart = true;
		this.isGameLoose = false;

		// Запуск таймера
		this.startTimer(this.$root);

		// Создание массива с id мин
		this.arrWithRandomMines = this.createRandomMines(this.min, this.max, 10, true);

		// Создание объекта по работе с данными на основе массива с id
		this.minesObj = this.createMinesObject(this.arrWithRandomMines, this.min, this.max);

		console.log('Game Started!');
		console.log('this.minesObj ',this.minesObj );
	}



	/*
	* Окончание игры
	*/
	stopGame() {
		this.isGameStart = false;
		this.isGameLoose = true;

		this.stopTimer(this.$root);
		this.arrWithRandomMines = [];
		console.log('Game Stopped!');
	}



	/*
	* Очистка поля
	*/
	clearField() {
    	// for (var cell in cells) {
        // 	if (cells.hasOwnProperty(cell)) {
        // 	    cells[cell].classList.remove("miner-cell--bomb");
        // 	    cells[cell].innerHTML = '';
        // 	}
    	// }
	}



	/*
	* Запуск таймера игры
	*/
	startTimer() {
		this.timerId = setInterval(() => timer(this.$root, this.timerId), 1000);
	}



	/*
	* Окончание работы таймера игры
	*/
	stopTimer() {
		clearInterval(this.timerId);
		this.$root.value = "000";
	}



	/*
	* Инициализация правил игры
	*/
    init() {
		this.initDOMListeners(this.$root);
    }
}
