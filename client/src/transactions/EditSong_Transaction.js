import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, songIndex, oldSong, newSong) {
        super();
        this.store = initStore;
        this.index = songIndex;
        this.oldS = oldSong;
        this.newS = newSong;
    }

    doTransaction() {
        this.store.editSong(this.index, this.newS);
    }
    
    undoTransaction() {
        this.store.editSong(this.index, this.oldS);
    }
}