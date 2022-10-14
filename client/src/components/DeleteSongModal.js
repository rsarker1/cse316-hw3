import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let title = store.songIndexDeletion !== undefined ? store.currentList.songs[store.songIndexDeletion].title : "";

    function handleConfirm(event) {
        store.hideDeleteSongModal();
        store.deleteMarkedSong();
    }
    function handleCancel(event) {
        store.hideDeleteSongModal();
    }
    return (
        <div 
            className="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <div className="modal-header">
                        Remove song?
                    </div>
                    <div className="dialog-header">
                        Are you sure you wish to permanently remove <span className="named"> {title} </span> from the playlist?
                    </div>
                    <div id="confirm-cancel-container" className="modal-footer">
                        <input type="button" 
                            id="delete-song-confirm-button" 
                            className="modal-control" 
                            onClick={handleConfirm}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-song-cancel-button" 
                            className="close-modal-button modal-control" 
                            onClick={handleCancel}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
    
}

export default DeleteSongModal;