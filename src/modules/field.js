import Rules from './Rules';

export default class Field {
    constructor(row, column, quantityOfMines) {
		this.row = row;
        this.column = column;
		this.min = 1;
		this.max = this.row * this.column;
		this.quantityOfMines = quantityOfMines;
        this.mainFieldContainer = document.getElementById('miner');
    }

    createHeaderInput(id, value, className = 'miner-header__btn', type = 'text', rw = true) {
        let inputEl = document.createElement('input');
        inputEl.className = className;
        inputEl.type = type;
        inputEl.readOnly = rw;
        inputEl.id = id;
        inputEl.value = value;

        return inputEl
    }

    createFieldBG() {
        let fieldContEl = document.createElement('div');
        let fieldHeaderEl = document.createElement('div');
        let fieldBody = document.createElement('div');
        let counterId = 1;

        fieldContEl.className = 'miner-wrap';
        fieldHeaderEl.className = 'miner-header';
        fieldBody.className = 'miner-body';

        fieldBody.id = 'miner-body';

        fieldHeaderEl.appendChild(this.createHeaderInput('tablo', '010'))
        fieldHeaderEl.appendChild(this.createHeaderInput('reset', '☻'))
        fieldHeaderEl.appendChild(this.createHeaderInput('timer', '000'))


        // Заполняем ячейками body
        for (let i = 1; i <= this.row; i++) {
            for (let j = 1; j <= this.column; j++) {
                fieldBody.appendChild(this.createCell(i, j, counterId))
                counterId++;
            }
        }

        fieldContEl.appendChild(fieldHeaderEl);
        fieldContEl.appendChild(fieldBody);

        this.mainFieldContainer.appendChild(fieldContEl);
    }

    createCell(counterId, className = 'miner-cell') {
        let cellEl = document.createElement('div');
        cellEl.className = className;
        cellEl.dataset.id = counterId;
        cellEl.textContent = counterId;
        return cellEl
    }

	/*
	*	Рендер поля, создание правил работы с полем
	*/
    render() {
        this.createFieldBG();
		const rules = new Rules(
			document.getElementById("timer"),
			this.min,
			this.max,
			this.row,
			this.column,
			this.quantityOfMines
		);
		rules.init();
	}
}
