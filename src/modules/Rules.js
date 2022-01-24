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

		this.checkedEmptyCells = [];
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
	}



	/*
	 * Создание массива с минами
	 */
	createRandomMines(quantityOfMines, check) {
		const array = [];
		// TODO: По окончании работ убрать проверку на check
		// Создание рандомного числа от мин до макс включая
		if (check == true) {
			return [2, 3, 4, 34, 25, 75, 8, 11, 72, 74]; // для проверок
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
					this.openCell(e.target);
				} else {
					this.openCell(e.target);
				}
			})

			// Правый клик по ячейке - установка флажка
			this.body.addEventListener("contextmenu", (e) => {
				e.preventDefault();
				if (e.target.classList.contains("miner-cell--free")) return;
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
	openCell(target, cellId = 0) {
		let curId, nodeEl;
		if (cellId != 0) {
			curId = cellId;
			nodeEl = document.querySelector(`.miner-cell[data-id="${curId}"]`);
		} else {
			nodeEl = target;
			curId = target.dataset["id"];
		}

		const cellValue = this.checkCell(curId);

		// В зависимости от того, что пришло из метода
		switch (cellValue) {
			// 1. Проигрыш
			case "bomb":
				this.loseGame(nodeEl, curId);
				break;
			// 2. Начало поиска вокруг пустой ячейки
			case "empty":
				this.minesObj[curId].empty = true;
				this.checkSiblingsCoords(curId);
				nodeEl.classList.add("miner-cell--free");
				break;
			// 3. Подстановка числа мин вокруг в ячейку
			default:
				nodeEl.innerText = cellValue;
				nodeEl.classList.add('miner-cell--free');
				break;
		}
	}



	/*
	* Проверка ячейки на 1. Мину, 2. Пустую ячейку, 3. Количество мин рядом
	*/
	checkCell(id) {
		const isBomb = this.minesObj[id].mine; // проверка на мину
		let count = this.countMinesAroundClickedCell(this.minesObj, id);
		if (isBomb) return "bomb";
		if (count == 0) return "empty";
		return count;
	}



	/*
	* Поиск всеъ пустых ячеек на поле
	*/
	findEmptyCells() {
		const result = [];
		for (let item in this.minesObj) {
			if (this.minesObj[item].empty) {
				result.push(this.minesObj[item]);
			}
		}
	}



	/*
	* Проверка всех соседей вокруг пустой ячейки
	*/
	checkSiblingsCoords(id) {
		const { x, y } = this.minesObj[id];
		this.coordsRules.forEach((item) => {
			for (let i in this.minesObj) {
				if ((this.minesObj[i].x == +x + item.x)
					&& (this.minesObj[i].y == +y + item.y)
					&& (!this.minesObj[i].empty)
					) {
					this.openCell(null, i);
				}
			}
		})
	}



	/*
	 * Проверка соседних ячеек с кликнутой на мины
	 */
	countMinesAroundClickedCell(minesObj, curId) {
		let count = 0;
		const leftTop = minesObj[+curId - +this.row - 1];
		const top = minesObj[+curId - +this.row];
		const rightTop = minesObj[+curId - +this.row + 1];
		const left = minesObj[+curId - 1];
		const right = minesObj[+curId + 1];
		const leftBottom = minesObj[+curId + +this.row - 1];
		const bottom = minesObj[+curId + +this.row];
		const rightBottom = minesObj[+curId + +this.row + 1];

		// 1 2 3
		// 4   6
		// 7 8 9

		// Подсчёт количества мин
		// 1
		if (leftTop && leftTop.mine) count++;
		// 2
		if (top && top.mine) count++;
		// 3
		if (rightTop && rightTop.mine) count++;
		// 4
		if (left && left.mine) count++;
		// 6
		if (right && right.mine) count++;
		// 7
		if (leftBottom && leftBottom.mine) count++;
		// 8
		if (bottom && bottom.mine) count++;
		// 9
		if (rightBottom && rightBottom.mine) count++;

		return count;
	}



	/*
	 * Попадание на ячейку с миной
	 */
	loseGame(target, cellID) {
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