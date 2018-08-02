const visibleFunc = (file) => {
    return true;
}

export default class Option {
    constructor(name, click, visible = visibleFunc) {
        this.name = name;
        this.click = click;
        this.visible = visible;
    }
}