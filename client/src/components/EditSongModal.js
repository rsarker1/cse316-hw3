import React, { Component } from 'react';

export default class DeleteSongModal extends Component {
    render() {
        const { editSong, editSongCallback, hideEditSongModalCallback } = this.props;
        let title = "", artist = "", youTubeId = "";
        if(editSong) {
            title = editSong.title;
            artist = editSong.artist;
            youTubeId = editSong.youTubeId;
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
                                    Title: <input type="text" id="title-textbox" defaultValue={title} /> <br />
                                    Artist: <input type="text" id="artist-textbox" defaultValue={artist} /> <br />
                                    Youtube Id: <input type="text" id="youtube-textbox" defaultValue={youTubeId} /> 
                                </form> 
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                class="modal-button" 
                                onClick={editSongCallback}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                class="modal-button" 
                                onClick={hideEditSongModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}

