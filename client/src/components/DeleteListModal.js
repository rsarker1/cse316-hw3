import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = store.listIndexDeletion ? store.listIndexDeletion.name : "";

    function handleConfirm(event) {
        store.hideDeleteListModal();
        store.deleteMarkedList();
    }
    function handleCancel(event) {
        store.hideDeleteListModal();
    }
    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <div className="modal-header">
                        Delete playlist?
                    </div>
                    <div className="dialog-header">
                        Are you sure you wish to permanently delete the <span className="named"> {name} </span> playlist?
                    </div>
                    <div id="confirm-cancel-container" className="modal-footer">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-control" 
                            onClick={handleConfirm}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="close-modal-button modal-control" 
                            onClick={handleCancel}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteListModal;
