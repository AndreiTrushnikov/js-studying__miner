import Field from './Field.js'; // Create Field

export default class Game {
	constructor(options) {
		this.options = options;
	}

	init() {
		const field = new Field(this.options.x, this.options.y, this.options.quantityOfMines);
		field.render();
	}
}
