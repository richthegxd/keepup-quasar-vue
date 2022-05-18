<template>
  <q-dialog
    ref="dialog"
    v-model="model"
    @before-show="refreshNote"
    @hide="notes.resetSelectedNote()"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 text-weight-bold">Редактор заметки</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form
          class="form column"
          ref="form"
        >
          <q-input
            v-model="note.title"
            placeholder="Заголовок заметки"
            :rules="[val => !!val || 'Пожалуйста, заполните это поле!']"
            autofocus
            filled
            counter
            maxlength="50"
          />

          <q-input
            v-model="note.description"
            placeholder="Описание заметки (необязательно)"
            autofocus
            filled
            counter
            maxlength="320"
          />

          <div class="form__settings row">
            <q-btn color="grey-7" size="sm" icon="event" flat round>
              <q-tooltip>
                Создать напоминание
              </q-tooltip>

              <q-menu  anchor="top left" self="center right" :offset="[20, 0]">
                <q-date v-model="note.date" range />
              </q-menu>
            </q-btn>
            <q-btn color="grey-7" size="sm" icon="palette" flat round>
              <q-tooltip>
                Настройки фона
              </q-tooltip>

              <q-menu  anchor="top left" self="center right" :offset="[60, 0]">
                <div class="form__settings__background">
                  <div class="form__settings__background__colors row">
                    <div
                      class="
                      form__settings__background__colors-item
                      column
                      justify-center
                      items-center
                      "
                      v-ripple
                      @click="note.background = ''"
                    >
                      <q-icon name="invert_colors_off" />
                      <q-tooltip>Без заливки</q-tooltip>
                    </div>

                    <template v-for="(color, index) in colorsForNote" :key="index">
                      <div
                        class="form__settings__background__colors-item"
                        :style="{ background: color.code }"
                        v-ripple
                        @click="note.background = color.code"
                      >
                        <q-tooltip>{{ color.tooltip }}</q-tooltip>
                      </div>
                    </template>
                  </div>

                  <q-separator />

                  <div class="form__settings__background__images row">
                    <div
                      class="
                      form__settings__background__images-item
                      column
                      justify-center
                      items-center
                      "
                      v-ripple
                      @click="note.backgroundImage = ''"
                    >
                      <q-icon name="no_photography" />
                      <q-tooltip>Без картинки</q-tooltip>
                    </div>

                    <template v-for="(image, index) in imagesForNote" :key="index">
                      <div
                        class="form__settings__background__images-item"
                        :style="{ backgroundImage: `url(${image.src})` }"
                        v-ripple
                        @click="note.backgroundImage = image.src"
                      >
                        <q-tooltip>{{ image.tooltip }}</q-tooltip>
                      </div>
                    </template>
                  </div>
                </div>
              </q-menu>

            </q-btn>
            <q-btn color="grey-7" size="sm" icon="image" flat round @click="fileInput.click()">
              <q-tooltip>
                Добавить изображение
              </q-tooltip>
            </q-btn>

            <input
              ref="fileInput"
              type="file"
              style="display: none"
              @input="uploadImage"
            >

          </div>
        </q-form>

      </q-card-section>

      <q-card-section class="note-preview column q-pt-none row">
        <div class="text-h6 text-weight-bold">Предпросмотр</div>

        <Note
          class="note-preview__item"
          editing
          :isUploadingImage="isUploadingImage"
          :note="note"
          @removeImage="removeImage"
        />

      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Отмена"
          color="negative"
          v-close-popup
          no-caps
        />

        <q-btn
          flat
          :label="isEditing ? 'Обновить' :'Создать'"
          color="primary"
          no-caps
          @click="isEditing ? updateNote() : addNote()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// * Functional imports
import { ref, computed } from "vue";
import { Dark } from "quasar";

// * Plugins
import { uploadFile, deleteFile } from "src/plugins/firebase";
import generateId from "src/plugins/generator";

// * Components
import Note from "src/components/Note/Note.vue";

// * Stores
import { useNotes } from "src/stores/notes";
import { useState } from "src/stores/state";
import { storeToRefs } from "pinia";

// * Mock data
import colors from "src/stores/mock/colors";
import images from "src/stores/mock/images";

const notes = useNotes();
const state = useState();

const props = defineProps({
  "model-value": {
    type: Boolean,
    default: false,
  },

  isEditing: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["update:model-value"]);

// * Refs tempalate
const dialog = ref(null);
const form = ref(null);
const fileInput = ref(null);

const isUploadingImage = ref(false);

const model = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit("update:model-value", value);
  },
});

const { selectedNoteId } = storeToRefs(notes);
const { activeTab, isGridStyle } = storeToRefs(state);
const selectedNoteData = computed(() => notes.getNoteById(selectedNoteId.value));

const note = ref({});

// * Mock data
const colorsForNote = computed(() => (Dark.isActive ? colors.dark : colors.light));
const imagesForNote = computed(() => (Dark.isActive ? images.dark : images.light));

function refreshNote() {
  note.value = {
    images: props.isEditing ? selectedNoteData.value.images : [],
    title: props.isEditing ? selectedNoteData.value.title : "",
    description: props.isEditing ? selectedNoteData.value.description : "",
    background: props.isEditing ? selectedNoteData.value.background : "",
    backgroundImage: props.isEditing ? selectedNoteData.value.backgroundImage : "",
    date: props.isEditing ? selectedNoteData.value.date : "",
  };
}

async function addNote() {
  const isValidForm = await form.value.validate();

  const previewItem = document.querySelector(".note-preview__item");
  const previewItemHeight = previewItem.getBoundingClientRect().height;

  if (isValidForm) {
    notes.addNote(
      {
        // * Common data
        categoryId: activeTab.value,
        categoryLabel: notes.getCategory.label,
        id: generateId(),
        isFixed: false,
        isInTrash: false,
        ...note.value,
        createdAt: Date.now(),
        // * Grid positions
        i: generateId(),
        x: isGridStyle.value ? (notes.getNotes.length * 2) % 12 : 0,
        y: notes.getNotes.length + 12,
        w: 2,
        h: Math.round(previewItemHeight / 100),
      },
    );

    note.value = {
      images: [],
      title: "",
      description: "",
      background: "",
      backgroundImage: "",
      date: "",
    };

    dialog.value.hide();
  }
}

async function updateNote(e) {
  const isValidForm = await form.value.validate();

  const previewItem = document.querySelector(".note-preview__item");
  const previewItemHeight = previewItem.getBoundingClientRect().height;

  if (isValidForm) {
    notes.updateNoteData(
      selectedNoteId.value,
      {
        ...note.value,
        h: Math.round(previewItemHeight / 100),
      }
    );

    dialog.value.hide();
  }
}

async function uploadImage(input) {
  if (input.target.files.length) {
    isUploadingImage.value = true;

    const newImage = await uploadFile(input.target.files);
    note.value.images.push(newImage);

    isUploadingImage.value = false;
  }
}

async function removeImage(path) {
  const imageInArray = note.value.images.find((image) => image.path = path);
  const indexOfImage = note.value.images.indexOf(imageInArray);
  note.value.images.splice(indexOfImage, 1);

  await deleteFile(path);
}

</script>

<style lang="sass">
.form
  gap: 15px

  &__settings
    gap: 10px

    &__background

      &__colors, &__images
        gap: 10px
        padding: 10px 15px

        &-item
          position: relative
          cursor: pointer
          width: 32px
          height: 32px
          border-radius: 100%
          border: 1px solid $grey-7
          transition: opacity .3s
          background-size: cover
          background-position: center center

          &:hover
            opacity: .7

.note-preview

  &__item
    margin-top: 15px
    align-self: center

</style>
