import jsTPS_Transaction from "../common/jsTPS.js"

export default class NewSong_Transaction extends jsTPS_Transaction {
    constructor(initApp) {
        super();
        this.app = initApp
    }

    doTransaction() {
        let baseSong = {
            artist: "Unknown",
            title: "Untitled",
            youTubeId: "dQw4w9WgXcQ"
        };
        this.app.state.currentList.songs[this.app.getPlaylistSize()] = baseSong;
        this.app.setStateWithUpdatedList(this.app.state.currentList);
    }
    
    undoTransaction() {
        this.app.state.currentList.songs.splice(this.app.getPlaylistSize() - 1, 1);
        this.app.setStateWithUpdatedList(this.app.state.currentList);
    }
}