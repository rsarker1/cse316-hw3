import { createContext, useState, useEffect, useCallback } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction.js';
import EditSong_Transaction from '../transactions/EditSong_Transaction.js';
import NewSong_Transaction from '../transactions/NewSong_Transaction.js';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    MARK_SONG_FOR_EDITING: "MARK_SONG_FOR_EDITING"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    openModal: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIndexDeletion: payload,
                    openModal: true
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    openModal: false
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songIndexDeletion: payload,
                    openModal: true
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_EDITING: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songIndexEditing: payload,
                    openModal: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylist(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }
    // Creates a new list
    store.createNewList = function() {
        let playlist = {
            name: `Untitled ${store.newListCounter}`,
            songs: [],
        };
        async function asyncCreateNewList() {
            let res = await api.createPlaylist(playlist);
            if(res.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: res.data.playlist,
                });
                store.history.push("/playlist/" + res.data.playlist._id);
            }
        }
        asyncCreateNewList();
    }
    // Deletes Specific list
    store.deleteMarkedList = function() {
        async function asyncDeleteMarkedList() {
            let response = await api.deletePlaylist(store.listIndexDeletion._id);
            if (response.data.success)
                store.loadIdNamePairs();
        }
        asyncDeleteMarkedList();
    }
    // Makes a new song asyncronously 
    store.addSong = function(index, song) {
        if(song == null) {
            song = {
                artist: "Unknown",
                title: "Untitled",
                youTubeId: "dQw4w9WgXcQ"
            };
        }
        async function asyncAddSong() {
            let currList = store.currentList;   
            currList.songs.splice(index, 0, song);
            let res = await api.updatePlaylist(store.currentList._id, currList);
            if (res.data.success) 
                store.setCurrentList(res.data.id);
        }
        asyncAddSong();
    }

    store.deleteSong = function(index) {
        async function asyncDeleteSong() {
            store.currentList.songs.splice(index, 1);
            store.updatePlaylist();
        }
        asyncDeleteSong();
    }

    store.editSong = function(index, newSong) {
        store.currentList.songs[index] = newSong;
        store.updatePlaylist();
    }

    store.moveSong = function(start, end) {
        if (start < end) {
            let tmp = store.currentList.songs[start];
            for (let i = start; i < end; i++) 
                store.currentList.songs[i] = store.currentList.songs[i + 1];
    
            store.currentList.songs[end] = tmp;
        }
        else if (start > end) {
            let tmp = store.currentList.songs[start];
            for (let i = start; i > end; i--) 
                store.currentList.songs[i] = store.currentList.songs[i - 1];
            
            store.currentList.songs[end] = tmp;
        }
        store.updatePlaylist();
    }

    store.deleteMarkedSong = function() {
        store.deleteSongTransaction(store.songIndexDeletion, store.currentList.songs[store.songIndexDeletion]);
    }

    store.editMarkedSong = function(editedSong) {
        let song = store.currentList.songs[store.songIndexEditing];
        store.editSongTransaction(store.songIndexEditing, song, editedSong);
    }

    store.addSongTransaction = function() {
        let addTTr = new NewSong_Transaction(this);
        tps.addTransaction(addTTr);
    }
    store.deleteSongTransaction = function(index, song) {
        let delTTr = new DeleteSong_Transaction(this, index, song);
        tps.addTransaction(delTTr);
    }
    store.editSongTransaction = function(index, oldSong, newSong) {
        let editTTr = new EditSong_Transaction(this, index, oldSong, newSong);
        tps.addTransaction(editTTr);
    }
    store.moveSongTransaction = function(start, end) {
        let mvTTr = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(mvTTr);
    }
    // Delete List Modal stuff
    store.showDeleteListModal = function(idNamePair) {
        let modal = document.getElementById('delete-list-modal');
        modal.classList.add('is-visible');
        document.getElementById("add-list-button").disabled = true;
        document.getElementById("add-list-button").className = "playlister-button-disabled"
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION, 
            payload: idNamePair
        });
    }
    store.hideDeleteListModal = function() {
        let modal = document.getElementById('delete-list-modal');
        modal.classList.remove('is-visible');
        document.getElementById("add-list-button").disabled = false;
        document.getElementById("add-list-button").className = "playlister-button"
    }
    // Delete Song Modal stuff
    store.showDeleteSongModal = function(index) {
        let modal = document.getElementById('delete-song-modal');
        modal.classList.add('is-visible');
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION, 
            payload: index
        });
    }
    store.hideDeleteSongModal = function() {
        let modal = document.getElementById('delete-song-modal');
        modal.classList.remove('is-visible');
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST, 
            payload: store.currentList
        });
    }
    // Editing modal stuff
    store.showEditSongModal = function(index) {
        let modal = document.getElementById('edit-song-modal');
        modal.classList.add('is-visible');
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDITING, 
            payload: index
        });
    }
    store.hideEditSongModal = function() {
        let modal = document.getElementById('edit-song-modal');
        modal.classList.remove('is-visible');
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST, 
            payload: store.currentList
        });
    }
    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }
    // Change playlist for editing, adding, and deleting
    store.updatePlaylist = function() {
        async function asyncUpdatePlaylist() {
            const res = await api.updatePlaylist(store.currentList._id, store.currentList);
            if(res.data.success) 
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
        }
        asyncUpdatePlaylist();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.hasUndo = tps.hasTransactionToUndo();
    store.hasRedo = tps.hasTransactionToRedo();

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}