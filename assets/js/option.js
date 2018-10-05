const visibleFunc = (file) => {
    return true;
}

/**
 * Option class
 * @author Lucas Reis <lucas@programmer.com.br>
 */
export default class Option {
    constructor(name, click, visible = visibleFunc) {
        this.name = name;
        this.click = click;
        this.visible = visible;
    }
}