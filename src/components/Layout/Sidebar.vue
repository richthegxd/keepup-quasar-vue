<template>
  <NewCategoryModal v-model="isPrompt" />
  <DeleteCategoryModal v-model="isConfirm" :category="categoryForDelete" />

  <q-drawer
    v-model="drawer"
    :mini="miniState"
    show-if-above
    :width="250"
    :breakpoint="700"
    bordered
  >
    <q-list>
      <template v-if="Platform.is.mobile">
        <q-item-section class="sidebar__logo">
          <div class="sidebar__logo__wrapper row items-center justify-center">
            <template v-if="Dark.isActive">
              <img src="src/assets/logo-dark.svg">
            </template>

            <template v-else>
              <img src="src/assets/logo.svg">
            </template>

            <h1 class="text-h6">KeepUp</h1>
          </div>
        </q-item-section>
      </template>

      <template v-for="(category, index) in menuCategories" :key="index">
        <q-item-label header>
          {{ category.label }}
        </q-item-label>

        <template v-for="(value, key) in category.categories" :key="key">
          <q-item
            class="text-brown-8"
            clickable
            v-ripple
            :active="key == activeTab"
            active-class="bg-orange-1"
            @click="state.setActiveTab(key)"
          >
            <q-item-section avatar>
              <q-icon :name="value.icon" />
            </q-item-section>

            <q-item-section> {{ value.label }} </q-item-section>

            <template v-if="value.isEditing">
              <q-item-section side>
                <q-btn color="brown-8" icon="more_vert" size="sm" flat round dense>
                  <q-menu>
                    <q-list>
                      <!-- <q-item clickable v-ripple>
                        <q-item-section> Переименовать </q-item-section>
                      </q-item> -->
                      <q-item clickable v-ripple>
                        <q-item-section
                          @click="toggleConfirm({id: key, label: value.label})"
                        >
                          Удалить
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </template>

            <template v-if="miniState">
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                {{ value.label }}
              </q-tooltip>
            </template>
          </q-item>
        </template>
        <template v-if="index !== 'default'">
          <q-item
            class="text-brown-8"
            clickable
            v-ripple
            @click="togglePrompt"
          >
            <q-item-section avatar>
              <q-icon name="add" />
            </q-item-section>

            <q-item-section> Создать категорию </q-item-section>

            <template v-if="miniState">
                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                  Создать категорию
                </q-tooltip>
              </template>
          </q-item>
        </template>
      </template>
    </q-list>
  </q-drawer>
</template>

<script setup>
// * Functional
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useState } from "src/stores/state";
import { useNotes } from "src/stores/notes";
import { Platform, Dark } from "quasar";

// * Modals
import NewCategoryModal from "src/components/Dialog/Category/NewCategory.vue";
import DeleteCategoryModal from "src/components/Dialog/Category/DeleteCategory.vue";

const isPrompt = ref(false);
const isConfirm = ref(false);

const state = useState();
const notes = useNotes();

const { miniState, activeTab, drawer } = storeToRefs(state);
const { menuCategories } = storeToRefs(notes);

const categoryForDelete = ref({});

function togglePrompt() {
  isPrompt.value = !isPrompt.value;
}

function toggleConfirm({ id, label } = {}) {
  categoryForDelete.value = {
    id,
    label,
  };

  isConfirm.value = true;
}

</script>

<style lang="sass" scoped>

.sidebar

  &__logo
    flex: none

    h1
      font-weight: 500

    img
      margin-right: 10px
      height: 28px
      width: 28px

</style>
