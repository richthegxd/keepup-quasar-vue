<template>
  <q-dialog ref="dialog" v-model="model" @hide="notes.resetSelectedNote()">
    <q-card style="max-width: 350px">
      <q-card-section>
        <div class="text-h6 text-weight-bold">Выберите действие</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Вы можете перенести заметку в <b>корзину</b>,
        это даст Вам возможность восстановить заметку в случае необходимости.
        Так же Вы можете полностью удалить заметку без возможности <b>восстановить</b> ее.
      </q-card-section>

      <q-card-section>
        <div class="actions row justify-center">
          <q-btn
            icon="delete"
            label="В корзину"
            stack
            color="primary"
            flat
            no-caps
            padding="30px 0"
            @click="moveNoteToTrash"
          >
            <q-tooltip>
              Заметка будет перенеса во вкладку "Корзина".
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="close"
            label="Удалить"
            stack
            color="negative"
            flat
            no-caps
            padding="30px 0"
            @click="removeNote"
          >
            <q-tooltip>
              Заметка будет полностью удалена!
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" no-caps v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from "vue";

// * Stores
import { useNotes } from "src/stores/notes";
import { storeToRefs } from "pinia";

const props = defineProps({
  "model-value": {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:model-value"]);

const model = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit("update:model-value", value);
  },
});

const notes = useNotes();
const dialog = ref(null);

const { selectedNoteId } = storeToRefs(notes);

function removeNote() {
  notes.removeNoteInActiveTab(selectedNoteId.value);

  dialog.value.hide();
}

function moveNoteToTrash() {
  // ! Initially, I change the value of the field in the note,
  // ! because getNoteById is looking for the application in the current directory

  const note = notes.getNoteById(selectedNoteId.value);
  note.isInTrash = true;

  // * Changing the notes catalog to a trash
  notes.changeNoteCategory(selectedNoteId.value, "deleted");

  dialog.value.hide();
}

</script>

<style lang="sass" scoped>

.actions
  gap: 15px

  :deep(.q-btn)
    background: rgba(0, 0, 0, 0.02)
    width: 100%
    max-width: 130px
    border-radius: 8px

</style>
