const visibleFunc = (file) => {
    return true;
};

/**
 * Option class
 * @author Lucas Reis <lucas@programmer.com.br>
 */
class Option {
    constructor(name, click, visible = visibleFunc) {
        this.name = name;
        this.click = click;
        this.visible = visible;
    }
}

class RenameOption extends Option {
	constructor(name, click = f => {}) {
        super(name, f => {
            this.renaming = true;
            click(f);
        }, f => {
            return !f.blank;
        });
		this.renaming = false;
    }	
}

const renameOption = new RenameOption('Rename');

export {Option, renameOption, RenameOption};
export default Option;