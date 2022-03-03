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

		this.coordsRules = [
			{
				x: -1,
				y: -1,
			},
			{
				x: 0,
				y: -1,
			},
			{
				x: +1,
				y: -1,
			},
			{
				x: -1,
				y: 0,
			},
			{
				x: +1,
				y: 0,
			},
			{
				x: -1,
				y: +1,
			},
			{
				x: 0,
				y: +1,
			},
			{
				x: +1,
				y: +1,
			}
		]
		// TODO удалить this.t
		this.t = 0;
		this.countCheckedCells = 0;
		this.leftMouseBtnPressed = false;
		this.rightMouseBtnPressed = false;
	}



	/*
	 * Создание массива с минами
	 */
	createRandomMines(quantityOfMines, check) {
		const array = [];
		// TODO: По окончании работ убрать проверку на check
		// Создание рандомного числа от мин до макс включая
		if (check == true) {
			// return [1,2]
			return [55, 2, 3, 4, 5, 75,76,77,78,79] // для проверок
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
			minesObj[i] = {
				"x": x,
				"y": y,
				mine: false,
				checked: false
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


	checkFieldOnWinLooseClasses(field) {
		if (field.classList.contains("lose")) return true;
		if (field.classList.contains("winner")) return true;

		return false;
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
			let that = this;
			let leftMouseBtnCode = 1;
			let rightMouseBtnCode = 3;

			this.body.addEventListener("contextmenu", (e) => {
				e.preventDefault();
				return false;
			}, false);

			this.body.addEventListener("mouseover", function (e) {
				if (e.target.classList.contains('miner-cell') && e.which == leftMouseBtnCode) {
					if (that.checkFieldOnWinLooseClasses(that.field)) return;

					e.target.classList.add("miner-cell--free-cur");
				}
			})

			this.body.addEventListener("mouseout", function (e) {
				if (e.target.classList.contains('miner-cell')) {
					e.target.classList.remove("miner-cell--free-cur");
				}
			})

			this.body.addEventListener("mousedown", function(e) {
				let curCell = e.target;

  			  	if (e.which == leftMouseBtnCode) {
					if (that.checkFieldOnWinLooseClasses(that.field)) return;

					that.leftMouseBtnPressed = true;

					curCell.classList.add("miner-cell--free-cur");
				}

  			  	if (e.which == rightMouseBtnCode) {
					that.rightMouseBtnPressed = true;

					if (that.leftMouseBtnPressed && curCell.classList.contains('miner-cell--free')) {
						console.log('ОБЕ!');
						that.checkTwoPressedBtnsCell(curCell, true);
					}
				}
  			});

			this.body.addEventListener("mouseup", function(e) {
				let curCell = e.target;

				if (e.which == leftMouseBtnCode) {
					console.log("Левая отпущена");
					that.leftMouseBtnPressed = false;

					curCell.classList.remove("miner-cell--free-cur");

					if (curCell.classList.contains("miner-cell--flag")) return;
					if (curCell.classList.contains("miner-cell--free")) return;

					if (!that.isGameStart) {
						that.startGame();
						that.openCell(curCell);
						that.checkWin();
					} else {
						that.openCell(curCell);
						that.checkWin();
					}
				}

				if (e.which == rightMouseBtnCode) {
					that.checkTwoPressedBtnsCell(curCell, false);
  			    	console.log("Правая отпущена");
					that.rightMouseBtnPressed = false;

					if (that.checkFieldOnWinLooseClasses(that.field)) return;
					if (!curCell.classList.contains('miner-cell')) return;
					if (curCell.classList.contains("miner-cell--free")) return;

					if (that.isGameStart) {
						curCell.classList.toggle("miner-cell--flag");
						that.checkNumberOfBombs(curCell);
						that.checkWin();
					}
				}
			});
		}
	}

	// this.coordsRules = [
	// 	{
	// 		x: -1,
	// 		y: -1,
	// 	},
	// 	{
	// 		x: 0,
	// 		y: -1,
	// 	},
	// 	{
	// 		x: +1,
	// 		y: -1,
	// 	},
	// 	{
	// 		x: -1,
	// 		y: 0,
	// 	},
	// 	{
	// 		x: +1,
	// 		y: 0,
	// 	},
	// 	{
	// 		x: -1,
	// 		y: +1,
	// 	},
	// 	{
	// 		x: 0,
	// 		y: +1,
	// 	},
	// 	{
	// 		x: +1,
	// 		y: +1,
	// 	}
	// ]

	checkTwoPressedBtnsCell(cell, isShow) {
		let id = cell.dataset['id'];
		const { x, y } = this.minesObj[id];
		let isMineNear = false;

		console.log('this.minesObj',this.minesObj);
		this.coordsRules.forEach((item) => {
			for (let i in this.minesObj) {
				if (this.minesObj[i].checked) continue;
				if ((this.minesObj[i].x == +x + item.x)	&& (this.minesObj[i].y == +y + item.y)) {
					let curCheckedCell = document.querySelector(`[data-id="${i}"]`);

					if (curCheckedCell.classList.contains('miner-cell--flag')) isMineNear = true;

					if (isShow) {
						curCheckedCell.classList.add('miner-cell--free-cur');
					} else {
						curCheckedCell.classList.remove('miner-cell--free-cur');
					}

					if (isShow && isMineNear) {
						curCheckedCell.classList.add('miner-cell--free-cur');
						this.checkSiblingsCoords(i, true);
					}
				}
			}
		})
	}



	/*
	 * Метод при выигрыше
	 */
	win() {
		this.field.classList.add("winner");
		this.resetGame(true);
		this.drawAllFlags();
	}



	/*
	* Метод для отрисовки флагов ячейках, которые не были проверены
	*/
	drawAllFlags() {
		for (let cell in this.minesObj) {
			if (this.minesObj[cell].mine) {
				document.querySelector(`[data-id="${cell}"`).classList.add('miner-cell--flag')
			}
		}
	}



	/*
	 * Проверка на выигрыш
	 */
	checkWin() {
		if (this.countCheckedCells === (this.row * this.column - this.quantityOfMines)) {
			this.win();
		}
	}



	/*
	 * Подсчёт количества бомб на табло
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
	 * Клик по ячейке
	 */
	openCell(target) {
		if (target.classList.contains('miner-cell--flag')) return;
		const curId = target.dataset["id"];
		// debugger
		const cellValue = this.checkCell(curId);

		// В зависимости от того, что пришло из метода
		switch (cellValue) {
			// 1. Проигрыш
			case -1:
				this.loseGame(target, curId);
				break;
			// 2. Начало поиска вокруг пустой ячейки
			case 0:
				this.minesObj[curId].checked = true;
				this.checkSiblingsCoords(curId, false);

				this.countCheckedCells++;

				target.classList.add("miner-cell--free");
				break;
			// 3. Подстановка числа мин вокруг в ячейку
			default:
				if (target.classList.contains('miner-cell--free')) return;

				this.minesObj[curId].checked = true;
				target.innerText = cellValue;

				this.countCheckedCells++;

				target.classList.add('miner-cell--free');
				break;
		}
	}



	/*
	* Проверка ячейки на 1. Мину, 2. Пустую ячейку, 3. Количество мин рядом
	*/
	checkCell(id) {
		let isBomb = this.minesObj[id].mine; // проверка на мину
		let count = this.countMinesAroundClickedCell(id);
		if (isBomb) return -1;
		if (count == 0) return 0;
		return count;
	}



	/*
	* Проверка всех соседей вокруг пустой ячейки
	*/
	checkSiblingsCoords(id, isTwoPressedBtnsCheck) {
		const { x, y } = this.minesObj[id];
		const count = this.countMinesAroundClickedCell(id);
		let curCount = 0;

		// debugger
		this.coordsRules.forEach((item) => {
			for (let i in this.minesObj) {
				if (this.minesObj[i].checked) continue;
				if ((this.minesObj[i].x == +x + item.x)	&& (this.minesObj[i].y == +y + item.y)) {
					if (document.querySelector(`[data-id="${i}"]`).classList.contains('miner-cell--flag')) curCount++;
					this.openCell(document.querySelector(`[data-id="${i}"]`));
				}
			}
		})

		console.log('curCount',curCount);
		console.log('count', count);
		// document.querySelector(`[data-id="${i}"]`).style.backgroundColor = 'green';
		if (isTwoPressedBtnsCheck && (count === curCount)) {
			// if (this.minesObj[i].mine) {
				console.log('!!!!!!!!!r45');
			// }
		}
	}



	/*
	 * Подсчёт мин вокруг ячейки
	 */
	countMinesAroundClickedCell(curId) {
		let count = 0;
		const { x, y } = this.minesObj[curId];

		this.coordsRules.forEach((item) => {
			for (let i in this.minesObj) {
				if ((this.minesObj[i].x == +x + item.x)
					&& (this.minesObj[i].y == +y + item.y)
					&& (this.minesObj[i].mine)) {
					count++;
				}
			}
		})
		return count;
	}



	/*
	 * Попадание на ячейку с миной
	 */
	loseGame(target) {
		this.field.classList.add("lose");
		target.classList.add("miner-cell--error-main");

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
		console.log(this.minesObj);
	}




	/*
	 * Полный сброс игры
	 */
	resetGame(isCancelActivities) {
		this.isGameStart = false;
		this.isGameLoose = true;
		this.arrWithRandomMines = [];
		this.countCheckedCells = 0;

		if (isCancelActivities) {
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
		this.field.classList.remove("winner");
		for (let cell in this.cells) {
			if (this.cells.hasOwnProperty(cell)) {
				this.cells[cell].classList.remove("miner-cell--flag");
				this.cells[cell].classList.remove("miner-cell--error");
				this.cells[cell].classList.remove("miner-cell--error-main");
				this.cells[cell].classList.remove("miner-cell--free");
				this.cells[cell].classList.remove("miner-cell--free-cur");
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