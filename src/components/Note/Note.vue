<template>
  <div
    class="note"
    :class="editing ? 'editing' : ''"
    :style="{
      background: note.background == '' ? defaultBackground : note.background,
      borderColor: note.background == '' ? defaultBorderColor : `${note.background} !important`,
      backgroundImage: `url(${note.backgroundImage})`
    }"
    v-ripple="create"
  >
    <template v-if="create">
      <div class="note__wrapper create">
        <q-btn color="primary" icon="add" flat round />
      </div>
    </template>

    <template v-else>
      <q-inner-loading :showing="isUploadingImage" style="z-index: 3">
        <q-spinner-tail size="50px" color="primary" />
      </q-inner-loading>

      <template v-if="!editing">
        <div class="note__controls bg-black">

          <template v-if="activeTab !== 'all'">
            <div class="note__controls-pin absolute-top-left">
              <q-btn
                class="pin-btn"
                :color="note.images.length > 0 ? 'primary' : 'black'"
                style="z-index: 5"
                :icon="note.isFixed ? 'push_pin' : 'o_push_pin'"
                size="sm"
                round
                dense
                @click="notes.toggleFixNote(note.id), notes.compactNoteInActiveTab(isGridStyle)"
              >
                <q-tooltip>
                  {{ note.isFixed ? 'Открепить' : 'Закрепить' }}
                </q-tooltip>
              </q-btn>
            </div>
          </template>

          <div class="note__controls-main absolute-bottom bg-black">
            <div class="note__controls-main__wrapper row items-center justify-between">
              <p>
                <template v-if="activeTab !== 'all'">
                  Создано: {{ createdAt(note.createdAt) }}
                </template>

                <template v-else>
                  Категория "{{ note.categoryLabel }}". {{ createdAt(note.createdAt) }}
                </template>
              </p>

              <template v-if="activeTab !== 'all'">
                <div class="note__controls-main__btns row">
                  <template v-if="note.isInTrash">
                    <q-btn
                      icon="undo"
                      size="sm"
                      round
                      dense
                      flat
                      @click="recoverNote"
                    >
                      <q-tooltip>
                        Восстановить
                      </q-tooltip>
                    </q-btn>
                  </template>

                  <q-btn
                    icon="delete"
                    size="sm"
                    round
                    dense
                    flat
                    @click="
                      note.isInTrash ?
                        notes.removeNoteInActiveTab(note.id):
                        openRemoveModal()
                    "
                  >
                    <q-tooltip>
                      {{ note.isInTrash ? "Полностью удалить" : "Удалить" }}
                    </q-tooltip>
                  </q-btn>

                  <q-btn
                    icon="edit"
                    size="sm"
                    round
                    dense
                    flat
                    @click="$emit('editNote'), notes.selectNote(note.id)"
                  >
                    <q-tooltip>
                      Редактировать
                    </q-tooltip>
                  </q-btn>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <template v-if="note.images.length > 0">
        <div
          class="note__images row wrap"
          :style="note.images.length == 3 ? 'justify-content: flex-end' : ''"
        >

          <template v-for="(image, index) in note.images" :key="index">
            <q-img
              :src="image.url"
              class="note__images-image"
              :style="
              note.images.length === 1 ?
                'border-radius: 10px 10px 0 0; border: none; width: 100%' :
              note.images.length === 3 && index === 2 ?
                'border-radius: 0; width: 100%' :
                ''
              "
            >

              <template v-if="editing">
                <div class="absolute-top-right">
                  <q-btn
                    class="absolute-top-right"
                    color="white"
                    icon="close"
                    size="sm"
                    round
                    dense
                    flat
                    @click="$emit('removeImage', image.path)"
                  />
                </div>
              </template>

              <template v-slot:loading>
                <q-spinner-tail color="primary"></q-spinner-tail>
              </template>

            </q-img>
          </template>
        </div>
      </template>

      <div class="note__wrapper">
        <h6 class="note__wrapper__title">
          {{ note.title }}
        </h6>
        <p class="note__wrapper__description">
          {{ note.description }}
        </p>

        <template v-if="note.date !== ''">
          <div class="note__wrapper__date">
            <q-btn
              size="sm"
              icon="o_watch_later"
              flat
              dense
              rounded
              :label="formatedDate"
              no-caps
            />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
// * Functional
import { computed, ref } from "vue";

// * Stores
import { useNotes } from "src/stores/notes";
import { useState } from "src/stores/state";
import { storeToRefs } from "pinia";

const props = defineProps({
  note: {
    type: Object,
    require: true,
    default: () => {},
  },

  create: {
    type: Boolean,
    default: false,
  },

  editing: {
    type: Boolean,
    default: false,
  },

  isUploadingImage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["removeNote", "editNote"]);

const notes = useNotes();
const state = useState();

const { activeTab, isDarkTheme, isGridStyle } = storeToRefs(state);

const params = { year: "numeric", month: "long", day: "numeric" };

const formatedDate = computed(() => {
  if (typeof props.note.date === "object" && props.note.date) {
    const from = new Date(props.note.date.from).toLocaleString("ru-RU", params);
    const to = new Date(props.note.date.to).toLocaleString("ru-RU", params);

    return `С ${from} по ${to}`;
  }

  return new Date(props.note.date).toLocaleString("ru-RU", params);
});

const defaultBackground = computed(() => (isDarkTheme.value ? "rgba(255, 255, 255, .07)" : "rgba(255, 255, 255, .97)"));

// * The default color is not specified here because it is set in css
const defaultBorderColor = computed(() => (isDarkTheme.value ? "rgba(255, 255, 255, .3) !important" : ""));

function createdAt(timestamp) {
  return new Date(timestamp).toLocaleString("ru-RU", params);
}

function recoverNote() {
  // ! Initially, I change the value of the field in the note,
  // ! because getNoteById is looking for the application in the current directory
  const note = notes.getNoteById(props.note.id);
  note.isInTrash = false;

  // * Changing the notes catalog to a old category
  notes.changeNoteCategory(props.note.id, props.note.categoryId);
}

function openRemoveModal() {
  emit("removeNote");
  notes.selectNote(props.note.id);
}

</script>

<style lang="sass" scoped>

.editing
  max-width: 260px

.note
  width: 100%
  position: relative
  display: flex
  flex-flow: column
  background-size: cover !important
  background-position: center bottom !important
  border-radius: 12px
  transition: background .3s, border .3s
  border: 1px solid
  border-color: $primary !important

  &:hover

    .note__controls
      opacity: 1

    .note__wrapper__date
      opacity: 0

  &__images

    &-image
      border: .2px solid transparent
      width: 50%
      transition: border-radius .3s

      &:nth-child(1)
        border-radius: 10px 0 0 0

      &:nth-child(2)
        border-radius: 0 10px 0 0

      :deep(.q-img__content > div)
        border-radius: 12px
        padding: 12px

  &__controls
    transition: opacity .3s
    opacity: 0
    z-index: 5

    &-pin
      z-index: 5
      top: -.5vh
      left: -1vh

    &-main
      z-index: 5
      border-radius: 0 0 10px 10px
      padding: 5px 10px

      p
        color: #fff
        font-size: 12px
        margin: 0

      &__btns
        color: #fff
        gap: 2px

  &__wrapper
    min-height: 100px
    position: relative
    display: flex
    flex-flow: column
    padding: 10px 15px
    border-radius: 12px

    &.create
      align-items: center
      justify-content: center
      min-height: 150px
      background: rgba(0, 0, 255, .03)

    &__title
      font-weight: 600
      word-break: break-all

    &__description
      margin-top: 10px
      word-break: break-all

    &__date
      margin-top: auto
      transition: opacity .3s

    .subtitle
      font-size: 14px

</style>
