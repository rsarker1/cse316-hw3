import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal()  {
    const { store } = useContext(GlobalStoreContext);
    let name = store.listMarkedForDeletion ? store.listMarkedForDeletion.name : "";

    function handleConfirm(event) {
        store.hideDeleteListModal();
        store.deleteMarkedList();
    }
    function handleCancel(event) {
        store.hideDeleteListModal();
    }
    return (
        <div 
            class="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-edit-song-root'>
                    <div class="modal-north">
                        Edit song?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            <form>
                                Title: <input type="text" id="title-textbox"  /> <br />
                                Artist: <input type="text" id="artist-textbox"  /> <br />
                                Youtube Id: <input type="text" id="youtube-textbox"  /> 
                            </form> 
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button" 
                            id="edit-song-confirm-button" 
                            class="modal-button" 
                            onClick={handleConfirm}
                            value='Confirm' />
                        <input type="button" 
                            id="edit-song-cancel-button" 
                            class="modal-button" 
                            onClick={handleCancel}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
    
}

export default EditSongModal;