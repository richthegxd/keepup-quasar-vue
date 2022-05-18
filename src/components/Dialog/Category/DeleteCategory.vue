<template>
  <q-dialog v-model="model">
    <q-card style="max-width: 410px">
      <q-card-section>
        <div class="text-h6 text-weight-bold">Удаление категории</div>
      </q-card-section>

      <q-card-section>
        <p>
          Вы действительно хотите удалить категорию
          <span class="text-primary"> "{{category.label}}" </span>? <br>
          Все Ваши заметки с данной категории
          <span class="text-primary">(включая те, что в корзине)</span>
          будут безвозвратно
          <span class="text-negative">удалены</span>!
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn flat label="Удалить" color="negative" v-close-popup @click="removeCategory"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from "vue";
import { useNotes } from "src/stores/notes";

const notes = useNotes();

const props = defineProps({
  "model-value": {
    type: Boolean,
    default: false,
  },
  category: {
    type: Object,
    require: true,
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

function removeCategory() {
  notes.removeCategory(props.category.id);
}

</script>

<style>

</style>
