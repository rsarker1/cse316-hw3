import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, songIndex, song) {
        super();
        this.store = initStore;
        this.index = songIndex;
        this.song = song;
    }

    doTransaction() {
        this.store.deleteSong(this.index);
    }
    
    undoTransaction() {
        this.store.addSong(this.index, this.song);
    }
} 
