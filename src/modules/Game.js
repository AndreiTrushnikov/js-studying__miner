import Field from './Field.js'; // Create Field
import Rules from './Rules.js';

export default class Game {
	constructor(options) {
		this.options = options;
	}

	init() {
		const field = new Field(this.options.x, this.options.y);
		field.render();
	}
}
