import timer from "./utils/timer.js";
import checkTheSameRand from "./utils/checkTheSameRand.js"
import minmax from "./utils/minmax";

export default class Rules {
    constructor($root, min, max, row, column, quantityOfMines) {
		this.timerId = "";
		this.$root = $root;
		this.isGameStart = false;
		this.isGameLoose = true;

		this.min = min;
		this.max = max;
		this.row = row;
		this.column = column;
		this.quantityOfMines = quantityOfMines;

		this.arrWithRandomMines = []; // Массив с ячейками, содержащими мины
		this.minesObj = {};
		this.field = document.querySelector("#miner");
		this.body = document.getElementById("miner-body");
		this.cells = document.querySelectorAll(".miner-cell");
		this.resetBtn = document.querySelector("#reset");
		this.tablo = document.querySelector("#tablo");
    }



	/*
	* Создание массива с минами
	*/
	createRandomMines(quantityOfMines, check) {
		const array = [];
		// TODO: По окончании работ убрать проверку на check
    	// Создание рандомного числа от мин до макс включая
    	if (check == true) {
    	    return [2,3,4,34,25,75,8,11,72,74]; // для проверок
    	} else {
    	    for (let i = 0; i < quantityOfMines; i++) {
    	        array[i] = this.checkTheSameRand();
    	    }
    	    return array;
    	}
	}




	/*
	* Создаёт объект со всеми необходимыми данными по игре
	*/
	createMinesObject(arrWithRandomMines) {
		const maxX = this.row;
		const maxY = this.column;
		const minesObj = {};
		let x = 1;
		let y = 1;
		// задание значения place объекта с минами, для обозначения,
		// где находится выбранная ячейка
		for (let i = 1; i <= maxX * maxY; i++) {
			let place = '';
			// 1
			if (i == "1") {
				place = "leftTopCorner";
			}
			// 2-8
			else if ((i>1) && (i<maxX)) {
				place = "topHorizontalLine";
			}
			// 9
			else if (i == maxX) {
				place = "rightTopCorner";
			}
			// 18,27,36 .. 72
			else if ((i % maxX == 0) && (i != maxX) && (i != maxX*maxY)) {
				place = "rightVerticalLine";
			}
			// 10,19,28,37
			else if (((i-1) % maxX == 0) && (i != maxX*maxY - (maxX-1))) {
				place = "leftVerticalLine";
			}
			// 73
			else if (i == maxX*maxY - (maxX-1)) {
				place = "leftBottomCorner";
			}
			// 74-80
			else if ((i> maxX*maxY - (maxX-1)) && (i<maxX*maxY)) {
				place = "bottomHorizontalLine";
			}
			// 81
			else if (i == maxX*maxY) {
				place = "rightBottomCorner";
			}
			else {
				place = "center";
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
	* Инициализация прослушивателей кликов
	*/
	initDOMListeners() {
		if (this.resetBtn) {
			this.resetBtn.addEventListener("click", () => {
				this.resetGame();
			})
		}

		if (this.body) {
			this.body.addEventListener("click", (e) => {
				if (e.target.classList.contains("miner-body")) return;
				if (this.field.classList.contains("lose")) return;

				if (!this.isGameStart) {
					this.startGame();
					this.clickOnCell(e.target, this.minesObj);

					// if ((numberOfMines == null) || (numberOfMines == 0)) {
					//     e.target.innerHTML = "";
					// } else {
					//     e.target.innerHTML = numberOfMines;
					// }
				} else {
					this.clickOnCell(e.target, this.minesObj);

					// if ((numberOfMines == null) || (numberOfMines == 0)) {
					//     e.target.innerHTML = "";
					// } else {
					//     e.target.innerHTML = numberOfMines;
					// }
				}
			})

			// Правый клик по ячейке - установка флажка
			this.body.addEventListener("contextmenu", (e) => {
    			e.preventDefault();
				if (this.field.classList.contains("lose")) return;

    			e.target.classList.toggle("miner-cell--flag");
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
		const curId = target.dataset["id"];
		const isBomb = minesObj[curId].mine; // проверка на мину

		// если в ячейке бомба - проиграли
        if (isBomb) {
            this.loseGame(target, curId);
            return;
        } else {
			this.checkNumberOfBombs();
			this.checkWin();
            // иначе проверяем ячейки вокруг текущей
            const count = this.checkSiblings(minesObj, curId);
            // если рядом есть мины, отменяем поиск и ставим в ячейку количество мин рядом
            if (count > 0) {
				console.log('Рядом есть бомбы!');
                target.innerText = count;
            } else {
                // поиск, если рядом нет мин
                console.log("Рядом нет бомб, ищем дальше.");
                // checkMinesInSiblings(minesObj[curId].place, curId);
            }
            target.classList.add("miner-cell--free");
            // return count;
        }
    }



	/*
	* Проверка соседних ячеек с кликнутой на мины
	*/
	checkSiblings(minesObj, curId) {
		let count = 1;
		console.log('------------Check Siblings---------');
		console.log('minesObj',minesObj);
		console.log('curId', curId);
		switch (minesObj[curId].place) {
			case "leftTopCorner":
				return;
			case "topHorizontalLine":
				return;
			case "rightTopCorner":
				return;
			case "leftVerticalLine":
				return;
			case "center":
				return;
			case "rightVerticalLine":
				return;
			case "leftBottomCorner":
				return;
			case "bottomHorizontalLine":
				return;
			case "rightBottomCorner":
				return;
			default:
				return;
		}
		return count;
	}



	/*
	* Попадание на ячейку с миной
	*/
	loseGame(target,cellID) {
		this.field.classList.add("lose");
	    target.classList.add("miner-cell--error-main");
	    console.log("Бабах! Ячейка с миной = ", cellID);

		this.resetGame(true); // True - только запрет всех действий
		this.colorAllMines();
	}



	/*
	* Подсветка всех мин на поле при проигрыше
	*/
	colorAllMines() {
		// подсветка всех полей с минами
		for (let key in this.minesObj) {
			if (this.minesObj[key].mine == true) {
				let loserCell = document.querySelector(`.miner-cell[data-id='${key}']`);
				loserCell.classList.add("miner-cell--error");
			}
		}
	}



	/*
	* Проверка того, сколько осталось бомб
	* (Нужна для случаев победы или неправильного расположения мин)
	*/
	checkNumberOfBombs() {
		let tempMines = 0;
		if (this.cells) {
			for (let element in this.cells) {
				if (this.cells.hasOwnProperty(element)) {
				   if (this.cells[element].classList.contains("miner-cell--flag")) {
						tempMines++;
				   }
				}
				this.tablo.value = this.quantityOfMines - tempMines;
			}
			tempMines = 0;
		}
	}



	/*
	* TODO: Проверка на выигрыш
	*/
	checkWin() {
		// console.log('Check Win');
	}



	/*
	* Запуск правил
	*/
	startGame() {
		console.clear();
		this.clearField();
		this.isGameStart = true;
		this.isGameLoose = false;

		// Запуск таймера
		this.startTimer(this.$root);

		// Создание массива с id мин
		this.arrWithRandomMines = this.createRandomMines(this.quantityOfMines, true);

		// Создание объекта по работе с данными на основе массива с id
		this.minesObj = this.createMinesObject(this.arrWithRandomMines);

		console.log("Game Started!");
	}




	/*
	* Полный сброс игры
	*/
	resetGame(isLoose) {
		this.isGameStart = false;
		this.isGameLoose = true;
		this.arrWithRandomMines = [];

		if (isLoose) {
			this.stopTimer(true);
			console.log("Game Just Stopped!");
		} else {
			this.stopTimer(false);
			this.clearField();
			console.log("Game Fully Reset!");
		}
	}



	/*
	* Очистка поля
	*/
	clearField() {
		this.field.classList.remove("lose");
		for (let cell in this.cells) {
			if (this.cells.hasOwnProperty(cell)) {
				this.cells[cell].classList.remove("miner-cell--flag");
				this.cells[cell].classList.remove("miner-cell--error");
				this.cells[cell].classList.remove("miner-cell--error-main");
				this.cells[cell].classList.remove("miner-cell--free");
				this.cells[cell].innerHTML = "";
			}
		}
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
	stopTimer(isLose) {
		clearInterval(this.timerId);
		isLose ? this.$root.value = this.$root.value : this.$root.value = "000";
	}



	/*
	* Инициализация правил игры
	*/
    init() {
		this.initDOMListeners(this.$root);
    }
}
