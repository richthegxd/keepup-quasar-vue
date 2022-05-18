<template>
  <RemoveNoteModal v-model="isRemoveModal" />
  <NoteEditor v-model="isNoteEditor" :isEditing="isNoteSelected" />

  <h5 class="label">
    <template v-if="isNotEmpty(filteredNotes)">
      Результаты поиска в категории:
      <span class="text-brown-8 text-weight-bold">{{ category.label }}</span>
    </template>

    <template v-else>
      Заметки в категории: <span class="text-brown-8 text-weight-bold">{{ category.label }}</span>
    </template>
  </h5>

  <div class="notes">
    <template v-if="isNotEmpty(filteredNotes)">
      <div class="notes__wrapper" :style="filteredContainerStyle">
        <template
          v-for="(note) in filteredNotes"
          :key="note.id"
        >
          <Note
            :style="filteredItemStyle"
            :note="note"
            @editNote="toggleNoteEditor"
            @removeNote="toggleRemoveModal"
          />
        </template>
      </div>
    </template>

    <template v-else>
      <template v-if="activeTab === 'all' ? isNotEmpty(allFixedNotes) : isNotEmpty(fixedNotesList)">
        <div
          class="column no-wrap"
          :style="containerStyle"
        >
          <div class="notes__fixed">
            <h6 class="notes__placeholder">Закрепленные</h6>

            <grid-layout
              v-model:layout="fixedNotes"
              :responsive="false"
              :col-num="colNum"
              :row-height="100"
              :is-resizable="false"
              :is-draggable="isDraggable"
              :margin="[10, 20]"
              :use-css-transforms="true"
            >
              <grid-item
                v-for="(note) in activeTab === 'all' ? allFixedNotes : fixedNotesList"
                :key="note.id"
                :x="note.x"
                :y="note.y"
                :w="note.w"
                :h="note.h"
                :i="note.i"
              >
                <Note
                  :note="note"
                  @editNote="toggleNoteEditor"
                  @removeNote="toggleRemoveModal"
                />
              </grid-item>
            </grid-layout>
          </div>

          <template v-if="activeTab === 'all' ? isNotEmpty(allNotes) : isNotEmpty(notesList)">
            <div class="notes__other">
              <h6 class="notes__placeholder">Другие заметки</h6>

              <grid-layout
                v-model:layout="defaultNotes"
                :responsive="false"
                :col-num="colNum"
                :row-height="100"
                :is-resizable="false"
                :is-draggable="isDraggable"
                :margin="[10, 20]"
                :use-css-transforms="true"
              >
                <grid-item
                  v-for="(note) in activeTab === 'all' ? allNotes : notesList"
                  :key="note.id"
                  :x="note.x"
                  :y="note.y"
                  :w="note.w"
                  :h="note.h"
                  :i="note.i"
                >
                  <Note
                    :note="note"
                    @editNote="toggleNoteEditor"
                    @removeNote="toggleRemoveModal"
                  />
                </grid-item>
              </grid-layout>
            </div>
          </template>
        </div>
      </template>

      <template v-else-if="activeTab === 'all' ? isNotEmpty(allNotes) : isNotEmpty(notesList)">
        <grid-layout
          v-model:layout="defaultNotes"
          :style="containerStyle"
          :responsive="false"
          :col-num="colNum"
          :row-height="100"
          :is-resizable="false"
          :is-draggable="isDraggable"
          :margin="[10, 20]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="(note) in activeTab === 'all' ? allNotes : notesList"
            :key="note.id"
            :x="note.x"
            :y="note.y"
            :w="note.w"
            :h="note.h"
            :i="note.i"
          >
            <Note
              :note="note"
              @editNote="toggleNoteEditor"
              @removeNote="toggleRemoveModal"
            />
          </grid-item>
        </grid-layout>
      </template>

      <template v-else>
        <div class="notes__error column items-center">
          <q-icon size="120px" name="o_lightbulb" color="brown-8" />

          <h1 class="text-brown-8 text-center">Здесь будут ваши заметки.</h1>
        </div>
      </template>
    </template>
  </div>

  <template v-if="activeTab !== 'deleted' && activeTab !== 'all'">
    <q-page-sticky position="bottom-right" :offset="fabPosition">
      <q-btn
        fab
        icon="add"
        color="brown-8"
        :disable="draggingFab"
        v-touch-pan.prevent.mouse="moveFab"
        @click="toggleNoteEditor"
      />
    </q-page-sticky>
  </template>

  <template v-if="activeTab == 'deleted' || activeTab == 'all'">
    <q-page-sticky position="bottom-right" :offset="fabPosition">
      <q-btn
        fab
        icon="question_mark"
        color="brown-8"
        :disable="draggingFab"
        v-touch-pan.prevent.mouse="moveFab"
      >
        <q-tooltip max-width="300px" anchor="center left" self="center end">
          {{
            activeTab == 'deleted' ?
            `Категория 'Корзина', используется для ненужных заметок,
            которые можно восстановить в изначальную категорию.` :
            `В данной категории находятся заметки со всех категории,
            включая те, что находятся в корзине.`
          }}
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </template>
</template>

<script setup>
// * Functional
import {
  computed, defineComponent, ref, onMounted, watch
} from "vue";
import { storeToRefs } from "pinia";
import { useNotes } from "src/stores/notes";
import { useState } from "src/stores/state";
import { Platform } from "quasar";

// * Components
import NoteEditor from "src/components/Dialog/Note/NoteEditor.vue";
import RemoveNoteModal from "src/components/Dialog/Note/DeleteNote.vue";

import Note from "src/components/Note/Note.vue";

const state = useState();
const notes = useNotes();

const { isGridStyle, activeTab, fabPosition } = storeToRefs(state);
const { selectedNoteId } = storeToRefs(notes);

const category = computed(() => notes.getCategory);

// ! Such a computed record is used, because when you move a note,
// ! its data changes. With a regular entry, there
// ! are warnings that the computed properties cannot be changed

// * Variables for "all" category
const allNotes = computed({
  get() {
    return notes.getNotesFromAllCategories.allNotes;
  },

  set(value) {
    return value;
  }
});

const allFixedNotes = computed({
  get() {
    return notes.getNotesFromAllCategories.allFixedNotes;
  },

  set(value) {
    return value;
  }
});

// * Variables for filtered notes
const filteredNotes = computed({
  get() {
    return notes.getFilteredNotes;
  },

  set(value) {
    return value;
  }
});

// * Variables for the selected category
const notesList = computed({
  get() {
    return notes.getNotes;
  },

  set(value) {
    return value;
  }
});

const fixedNotesList = computed({
  get() {
    return notes.getFixedNotes;
  },

  set(value) {
    return value;
  }
});

// * Layouts model
const fixedNotes = computed({
  get() {
    return activeTab.value === "all" ? allFixedNotes.value : fixedNotesList.value;
  },

  set(value) {
    return value;
  }
});

const defaultNotes = computed({
  get() {
    return activeTab.value === "all" ? allNotes.value : notesList.value;
  },

  set(value) {
    return value;
  }
});

const isRemoveModal = ref(false);
const isNoteEditor = ref(false);
const isNoteSelected = computed(() => selectedNoteId.value !== "");
const isDraggable = computed(() => activeTab.value !== "all");
const colNum = computed(() => (isGridStyle.value ? 12 : 1));
const containerStyle = computed(() => (isGridStyle.value ? "max-width: 100%" : "max-width: 500px; margin: 0 auto"));
const filteredContainerStyle = computed(() => (isGridStyle.value ? "flex-flow: row wrap" : "flex-flow: column; align-items: center"));
const filteredItemStyle = computed(() => (isGridStyle.value ? "max-width: 260px" : "max-width: 480px"));

const draggingFab = ref(false);

function toggleRemoveModal() {
  isRemoveModal.value = !isRemoveModal.value;
}

function toggleNoteEditor() {
  isNoteEditor.value = !isNoteEditor.value;
}

function moveFab(ev) {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true;

  fabPosition.value = [
    fabPosition.value[0] - ev.delta.x,
    fabPosition.value[1] - ev.delta.y
  ];

  localStorage.setItem("fabPosition", JSON.stringify(fabPosition.value));
}

function isNotEmpty(array) {
  return array.length > 0;
}

onMounted(() => (Platform.is.mobile
  ? notes.compactAllNotes(false) : notes.compactAllNotes(isGridStyle.value)));

// ! Since the position of the notes is tied to their category, when opening the "all"
// ! category, their position is overwritten for correct display
// ! (so that they do not remain in the position of their category),
// ! when we exit the "all" category, the notes are assigned their position
// ! in the category back

watch(() => activeTab.value, (val) => (val === "all"
  ? notes.compactAllNotes(isGridStyle.value)
  : notes.compactNoteInActiveTab(isGridStyle.value)));

watch(() => isGridStyle.value, (val) => {
  notes.compactAllNotes(val);
});

</script>

<style lang="sass" scoped>

:deep(.vue-grid-placeholder)
  display: none !important

.notes
  margin-top: 50px
  padding: 0 15px

  .column
    gap: 70px

  &__wrapper
    width: 100%
    display: flex
    gap: 20px

  &__placeholder
    padding: 0 0 10px 15px
    color: #5f6368
    font-size: .6875rem
    font-weight: 500
    line-height: 1rem
    text-transform: uppercase

  &__error
    margin-top: 150px

    &.column
      gap: 0

    h1
      margin-top: 20px
      font-size: 1.375rem
      font-weight: 400
      letter-spacing: 0
      line-height: 1.75rem

</style>
