<template>
  <q-dialog ref="dialog" v-model="model">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 text-weight-bold">Новая категория</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form
          ref="form"
          @submit="addCategory"
        >
          <q-input
            v-model="name"
            label="Название категории"
            :outlined="Dark.isActive"
            autofocus
            :rules="[val => !!val || 'Пожалуйста, заполните это поле!']"
            counter
            maxlength="30"
            @keyup.enter="addCategory"
          />
        </q-form>

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
          label="Создать"
          color="primary"
          no-caps
          @click="addCategory"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useNotes } from "src/stores/notes";
import { Dark } from "quasar";

const notes = useNotes();

const props = defineProps({
  "model-value": {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:model-value"]);

const name = ref("");
const form = ref(null);
const dialog = ref(null);

const model = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit("update:model-value", value);
  },
});

async function addCategory(e) {
  e.preventDefault();
  const isValidForm = await form.value.validate();

  if (isValidForm) {
    notes.addCategory(name.value);
    name.value = "";
    dialog.value.hide();
  }
}

</script>

<style>

</style>
