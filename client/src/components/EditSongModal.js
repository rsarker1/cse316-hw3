import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal()  {
    const { store } = useContext(GlobalStoreContext);
    if (store.songIndexEditing !== undefined) {
        let song = store.currentList.songs[store.songIndexEditing];
        document.getElementById("modal-edit-title").value = song.title;
        document.getElementById("modal-edit-artist").value = song.artist;
        document.getElementById("modal-edit-youTubeId").value = song.youTubeId;
    }

    function handleConfirm(event) {
        let editSong = {
            title: document.getElementById("modal-edit-title").value,
            artist: document.getElementById("modal-edit-artist").value,
            youTubeId: document.getElementById("modal-edit-youTubeId").value
        }
        store.editMarkedSong(editSong);
        store.hideEditSongModal();
    }
    function handleCancel(event) {
        store.hideEditSongModal();
    }
    return (
        <div 
            className="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <div className="modal-header">
                        Edit song?
                    </div>
                    <div className="modal-input">
                        <div className="modal-edit-prompt">
                            Title: 
                        </div>
                        <input type="text" id="modal-edit-title" ></input>
                        <div className="modal-edit-prompt">
                            Artist: 
                        </div>
                        <input type="text" id="modal-edit-artist" ></input>
                        <div className="modal-edit-prompt">
                            YouTube Id: 
                        </div>
                        <input type="text" id="modal-edit-youTubeId" ></input>
                    </div>
                    <div id="confirm-cancel-container" className="modal-footer">
                        <button id="edit-song-confirm-button" className="modal-control" onClick={handleConfirm}>
                            <b>Confirm</b>
                        </button>
                        <button id="edit-song-cancel-button" className="close-modal-button modal-control" onClick={handleCancel}>
                            <b>Cancel</b>
                        </button>
                    </div>
                </div>
        </div>
    );
    
}

export default EditSongModal;