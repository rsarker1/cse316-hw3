import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initapp, songArtist, songTitle, songID, songIndex) {
        super();
        this.app = initapp;
        this.artist = songArtist;
        this.title = songTitle;
        this.youTubeId = songID;
        this.index = songIndex;
    }

    doTransaction() {
        // Delete song from playlist and update
        this.app.state.currentList.songs.splice(this.index, 1);
        this.app.setStateWithUpdatedList(this.app.state.currentList);
    }
    
    undoTransaction() {
        let reSong = {
            artist: this.artist,
            title: this.title,
            youTubeId: this.youTubeId
        };
        this.app.state.currentList.songs.splice(this.index, 0, reSong);
        this.app.setStateWithUpdatedList(this.app.state.currentList);
    }
} 
// DOESNT WORK NEEDS FIXING