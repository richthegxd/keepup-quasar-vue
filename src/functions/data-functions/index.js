/**
 * It takes a stringified JSON object, parses it, and then imports the data into the state and notes
 * stores
 * @param obj - The data to be imported.
 * @returns A function that takes an object as an argument and returns true.
 */
import { useState } from "src/stores/state";
import { useNotes } from "src/stores/notes";

const state = useState();
const notes = useNotes();

function importDataInState(obj) {
  const parsedObject = JSON.parse(obj);

  const importedStateData = parsedObject.stateData;
  const importedNotesData = parsedObject.notesData;

  const correctState = {
    activeTab: importedStateData.activeTab || "common",
    fabPosition: importedStateData.fabPosition || [70, 70],
    isDarkTheme: importedStateData.isDarkTheme || false,
    isGridStyle: importedStateData.isGridStyle || true,
    drawer: importedStateData.drawer || false,
    miniState: importedStateData.miniState || false,
    search: importedStateData.search || "",
  };

  const correctNotes = {
    menuCategories: {
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

        categories: {
          ...importedNotesData.categories.custom.categories
        },
      },
    },

    notes: {
      common: importedNotesData.notes.common || [],
      all: importedNotesData.notes.all || [],
      deleted: importedNotesData.notes.deleted || [],
      ...importedNotesData.notes
    }
  };

  state.importData(correctState);
  notes.importData(correctNotes);

  return true;
}

export { importDataInState };
