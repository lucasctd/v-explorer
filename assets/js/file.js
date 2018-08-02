/**
 * File clas
 * @author Lucas Reis <lucas@programmer.com.br>
 */
export default class File {
    constructor(id, name, index, icon = "file", blank = false) {
        this.id = id;
        this.name = name;
        this.index = index;
        this.icon = icon;
        this.blank = blank;
    }
}

export function generateBlankFile(index) {
    const file = new File(Math.random(), null, index);
    file.blank = true;
    return file;
}

/**
 * Parse array of objects to array of Files
 * 
 * @param array  list     - Array do be parsed
 * @param String idProp   - Name of the id prop
 * @param String nameProp - Name of the name prop
 */
export const fileParser = (list, idProp, nameProp) => {
    fileList = [];
    list.forEach(el => {
        fileList.push(new File(getValue(el, idProp), getValue(el, nameProp), getValue(el, "position")));
    });
    return fileList;
}

function getValue(obj, prop) {
    if(obj[prop] !== undefined){
        return obj[prop];
    }
    return null;
}