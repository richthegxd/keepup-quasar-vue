<template>
  <q-dialog ref="dialog" v-model="model">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 text-weight-bold">Экспорт данных</div>
      </q-card-section>

      <q-card-section>
        <div class="control-zone" v-ripple @click="createFile">
          <h6>Скачать файл с данными</h6>
          <q-icon name="file_download" size="20px" color="primary"/>
        </div>
      </q-card-section>

      <p class="separator">или</p>

      <q-card-section>
        <q-input
          v-model="exportModel"
          readonly
          outlined
        >
          <template v-slot:append>
            <q-btn round icon="o_file_copy" size="sm" color="primary" @click="copyData">
              <q-tooltip anchor="bottom middle" self="top middle">
                Скопировать данные
              </q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="red" no-caps v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useState } from "src/stores/state";
import { useNotes } from "src/stores/notes";

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

const exportModel = computed({
  get() {
    return notes.getExportData;
  },
  set(value) {
    return value;
  }
});

function downloadFile(file) {
  const a = document.createElement("a");
  const date = new Date(Date.now()).toLocaleString("ru-RU", { year: "numeric", month: "numeric", day: "numeric" });
  a.download = `keepup-${date}.txt`;
  a.href = URL.createObjectURL(file);

  a.addEventListener("click", (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });

  a.click();
}

function createFile() {
  const file = new File([`${exportModel.value}`], "keepup.txt", {
    type: "text/plain",
  });

  downloadFile(file);
}

function copyData() {
  navigator.clipboard.writeText(exportModel.value);
}
</script>

<style>

</style>
