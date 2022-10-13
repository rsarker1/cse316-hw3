import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, songArtist, songTitle, songID, songIndex) {
        super();
        this.app = initApp;
        this.oldartist = songArtist;
        this.oldtitle = songTitle;
        this.oldyouTubeId = songID;
        this.index = songIndex;
    }

    doTransaction() {
        // Replace text in textbox for current info
        let currSong = this.app.state.currentList.songs[this.index];
        currSong.artist = document.getElementById("artist-textbox").value; 
        currSong.title = document.getElementById("title-textbox").value; 
        currSong.youTubeId = document.getElementById("youtube-textbox").value; 
        this.app.setStateWithUpdatedList(this.app.state.currentList);
    }
    
    undoTransaction() {
        let currSong = this.app.state.currentList.songs[this.index];
        currSong.artist = this.oldartist;
        currSong.title = this.oldtitle;
        currSong.youTubeId = this.oldyouTubeId;
        this.app.setStateWithUpdatedList(this.app.state.currentList);
    }
}