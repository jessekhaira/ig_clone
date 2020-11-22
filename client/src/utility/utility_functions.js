export function setDisplay(displays, ...args) {
    for (let [i,arg] of args.entries()) {
        const display = displays[i]; 
        arg.style.display = display; 
    }
}
