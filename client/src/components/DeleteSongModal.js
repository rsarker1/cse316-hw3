import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = store.songMarkedForDeletion !== undefined ? store.currentList.songs[store.songMarkedForDeletion].title : "";

    function handleConfirm(event) {
        store.hideDeleteSongModal();
        store.deleteMarkedSong();
    }
    function handleCancel(event) {
        store.hideDeleteSongModal();
    }
    return (
        <div 
            class="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-song-root'>
                    <div class="modal-north">
                        Remove song?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently remove <span class = "span"> {name} </span> from the playlist?
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button" 
                            id="delete-song-confirm-button" 
                            class="modal-button" 
                            onClick={handleConfirm}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-song-cancel-button" 
                            class="modal-button" 
                            onClick={handleCancel}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
    
}

export default DeleteSongModal;