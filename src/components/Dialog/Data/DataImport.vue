<template>
  <q-dialog ref="dialog" v-model="model">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 text-weight-bold">Импорт данных</div>
      </q-card-section>

      <q-card-section @dragover.prevent @drop.prevent>
        <div
          ref="drag"
          class="control-zone"
          v-ripple
          @click="createFile"
          @dragover="fileDragIn"
          @dragleave="fileDragOut"
          @drop="dropFile"
        >
          <h6>Вставьте файл с данными</h6>
          <q-icon name="file_upload" size="20px" color="primary"/>
        </div>

        <template v-if="error.status">
          <p class="text-red text-center q-mt-md">{{ error.message }}</p>
        </template>
      </q-card-section>

      <p class="separator">или</p>

      <q-card-section>
        <q-form ref="form">
          <q-input
            v-model="data"
            outlined
            label="Введите данные"
            :rules="[val => validateObject(val) || 'Пожалуйста, введите корректные данные!']"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="red" no-caps v-close-popup />
        <q-btn flat label="Импорт" color="primary" no-caps @click="importData"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useState } from "src/stores/state";
import { useNotes } from "src/stores/notes";
import { validateObject } from "src/plugins/object-validator";
import { importDataInState } from "src/functions/data-functions";

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

const state = useState();
const notes = useNotes();

// * Ref templates
const dialog = ref(null);
const form = ref(null);
const drag = ref(null);

const data = ref("");
const error = ref({});

async function importData() {
  const isValidForm = await form.value.validate();
  const isValidData = validateObject(data.value);

  if (isValidForm && isValidData) {
    try {
      importDataInState(data.value);
      dialog.value.hide();
    } catch (err) {
      return err;
    }
  }
}

function fileDragIn() {
  drag.value.style.background = "rgba(25, 118, 210, .2)";
}

function fileDragOut() {
  drag.value.style.background = "rgba(25, 118, 210, .05)";
}

function validateFile({ name } = {}) {
  return /\.(txt)$/i.test(name);
}

function dropFile(e) {
  const droppedFiles = e.dataTransfer.files;
  if ((!droppedFiles || droppedFiles.length > 1)) {
    error.value = { status: true, message: "Пожалуйста, вставьте 1 файл" };
    return;
  }

  const file = droppedFiles[0];

  if (validateFile(file)) {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      try {
        importDataInState(reader.result);
        dialog.value.hide();
        error.value = { status: false, message: "" };
      } catch (err) {
        error.value = { status: true, message: err };
      }
    };
  } else {
    error.value = { status: true, message: "Вставьте файл типа .txt" };
  }

  fileDragOut();
}

</script>

<style>

</style>
