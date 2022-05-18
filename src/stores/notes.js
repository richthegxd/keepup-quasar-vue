/* eslint-disable max-len */
import { defineStore, storeToRefs } from "pinia";
import generateId from "src/plugins/generator";
import translit from "src/plugins/translit";
import { watch } from "vue";
import { useState } from "./state";

const appState = useState();

const { activeTab, search } = storeToRefs(appState);

/**
 * It sets the x and y position of a note based on the index of the note in the array and the length of
 * the array
 * @param note - the note object
 * @param index - The index of the note in the array.
 * @param arrayLength - The length of the array of notes.
 * @param isGridStyle - This is a boolean value that determines whether the notes are placed in a grid
 * or not.
 */
function setNotePosition(note, index, arrayLength, isGridStyle) {
  note.x = isGridStyle ? (index * 2) % 12 : 0;
  note.y = arrayLength + 12;
}

export const useNotes = defineStore("notes", {
  state: () => ({
    selectedNoteId: "",

    menuCategories: JSON.parse(localStorage.getItem("menuCategories")) || {
      default: {
        label: "Стандартные категории",

        categories: {
          common: {
            icon: "lightbulb",
            label: "Заметки",
            isEditing: false,
          },

          all: {
            icon: "bookmark",
            label: "Все заметки",
            isEditing: false,
          },

          deleted: {
            icon: "delete",
            label: "Корзина",
            isEditing: false,
          },
        },
      },

      custom: {
        label: "Пользовательские категории",

        categories: {},
      },
    },

    //* It's a nested object. It's a way to store notes in different categories.
    notes: JSON.parse(localStorage.getItem("notes")) || {
      common: [],
      all: [],
      deleted: [],
    },
  }),

  actions: {
    importData(dataObject) {
      this.menuCategories = dataObject.menuCategories;
      this.notes = dataObject.notes;

      localStorage.setItem("menuCategories", JSON.stringify(this.menuCategories));
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    addCategory(categoryName) {
      //* It's generating a unique ID for the new category.
      const formatedName = `${translit(categoryName)}-${generateId()}`;

      this.menuCategories.custom.categories[formatedName] = {
        icon: "o_label",
        label: categoryName,
        routerParams: formatedName,
        isEditing: true,
      };

      this.notes[formatedName] = [];

      appState.setActiveTab(formatedName);

      localStorage.setItem("menuCategories", JSON.stringify(this.menuCategories));
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    removeCategory(categoryId) {
      delete this.menuCategories.custom.categories[categoryId];
      delete this.notes[categoryId];

      const notesInTrash = this.notes.deleted.filter((note) => note.categoryId === categoryId);

      // * Removing notes of this category from the trash
      notesInTrash.forEach((noteInTrash) => {
        const indexOfNote = this.notes.deleted.indexOf(noteInTrash);

        if (indexOfNote > -1) {
          this.notes.deleted.splice(indexOfNote, 1);
        }
      });

      appState.setActiveTab("common");

      localStorage.setItem("menuCategories", JSON.stringify(this.menuCategories));
    },

    addNote(noteObject) {
      this.notes[activeTab.value].push(noteObject);

      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    changeNoteCategory(noteId, newCategoryId) {
      const note = this.getNoteById(noteId);

      this.removeNoteInActiveTab(noteId);

      this.notes[newCategoryId].push(note);

      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    updateNoteData(noteId, {
      images,
      title,
      description,
      background,
      backgroundImage,
      date,
      h
    } = {}) {
      const note = this.getNoteById(noteId);

      note.images = images;
      note.title = title;
      note.description = description;
      note.background = background;
      note.backgroundImage = backgroundImage;
      note.date = date;
      note.h = h;

      window.dispatchEvent(new Event("resize"));

      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    toggleFixNote(noteId) {
      const note = this.getNoteById(noteId);

      note.isFixed = !note.isFixed;

      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    removeNoteInActiveTab(noteId) {
      const note = this.getNoteById(noteId);

      const indexOfNote = this.notes[activeTab.value].indexOf(note);

      this.notes[activeTab.value].splice(indexOfNote, 1);

      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    selectNote(noteData) {
      this.selectedNoteId = noteData;
    },

    resetSelectedNote() {
      this.selectedNoteId = "";
    },

    compactNoteInActiveTab(isGridStyle) {
      const fixedNotes = this.getFixedNotes;
      const notes = this.getNotes;

      notes.forEach((note, index) => {
        setNotePosition(note, index, notes.length, isGridStyle);
      });

      fixedNotes.forEach((fixedNote, index) => {
        setNotePosition(fixedNote, index, fixedNotes.length, isGridStyle);
      });

      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    compactAllNotes(isGridStyle) {
      const { allNotes, allFixedNotes } = this.getNotesFromAllCategories;

      allNotes.forEach((note, index) => {
        setNotePosition(note, index, allNotes.length, isGridStyle);
      });

      allFixedNotes.forEach((fixedNote, index) => {
        setNotePosition(fixedNote, index, allFixedNotes.length, isGridStyle);
      });

      localStorage.setItem("notes", JSON.stringify(this.notes));
    },
  },

  getters: {
    getCategory: (state) => {
      const categories = {};
      const allCategories = Object.assign(
        categories,
        state.menuCategories.default.categories,
        state.menuCategories.custom.categories
      );

      return allCategories[activeTab.value];
    },

    getNotesFromAllCategories: (state) => {
      const commonArray = [];

      const allNotesArray = Object.values(state.notes)
        .forEach((notesArray) => commonArray.push(...notesArray));

      const allFixedNotes = commonArray.filter((note) => note.isFixed);
      const allNotes = commonArray.filter((note) => !note.isFixed);

      return {
        allFixedNotes,
        allNotes
      };
    },

    getFixedNotes: (state) => state.notes[activeTab.value].filter((note) => note.isFixed),
    getNotes: (state) => state.notes[activeTab.value].filter((note) => !note.isFixed),
    getNoteById: (state) => (noteId) => state.notes[activeTab.value].find((note) => note.id === noteId),
    getFilteredNotes: (state) => state.notes[activeTab.value].filter((note) => {
      const noteData = note.title.toLowerCase();
      return search.value !== null && search.value.length > 0 ? noteData.indexOf(search.value) > -1 : false;
    }),
    getExportData: (state) => {
      const stateData = {
        stateData: appState.getExportStateData
      };
      const notesData = {
        notesData: {
          notes: state.notes,
          categories: state.menuCategories
        }
      };

      const fullData = Object.assign(stateData, notesData);

      return JSON.stringify(fullData);
    },
  },
});
