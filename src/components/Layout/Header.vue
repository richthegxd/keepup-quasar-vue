<template>
  <DataImport v-model="isImportModal" />
  <DataExport v-model="isExportModal" />

  <q-header class="header bg-orange-2" bordered>
    <q-toolbar class="header__wrapper justify-center">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="Platform.is.mobile ? state.toggleDrawer() : state.toggleMiniState()"
      >
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
          Меню
        </q-tooltip>
      </q-btn>

      <template v-if="!Platform.is.mobile">
        <q-toolbar-title class="header__logo">
          <div class="header__logo__wrapper row items-center">
              <h1 class="text-h6">KeepUp</h1>

              <template v-if="Dark.isActive">
                <img src="src/assets/logo-dark.svg">
              </template>

              <template v-else>
                <img src="src/assets/logo.svg">
              </template>
          </div>
        </q-toolbar-title>
      </template>

      <q-input
        class="header__search"
        v-model="search"
        placeholder="Поиск заметок..."
        color="brown-8"
        bg-color="orange-1"
        filled
        clearable
        clear-icon="close"
        :disable="activeTab === 'all'"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        class="header__settings"
        icon="settings"
        color="brown-8"
        round
        flat
      >
        <q-menu style="min-width: 200px">
          <q-list>
            <q-item clickable v-ripple @click="isImportModal = !isImportModal">
              <q-item-section>
                <q-item-label>Импортировать данные</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="isExportModal = !isExportModal">
              <q-item-section>
                <q-item-label>Экспортировать данные</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="state.resetFabPosition">
              <q-item-section>
                <q-item-label>Сброс кнопки "Добавить"</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Темная тема</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-toggle
                  v-model="isDarkTheme"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <template v-if="!Platform.is.mobile">
        <q-btn
          class="header__set-view"
          :icon="viewStyleBtn.icon"
          color="brown-8"
          round
          flat
          @click="state.toggleViewStyle()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            {{ viewStyleBtn.tooltip }}
          </q-tooltip>
        </q-btn>
      </template>
    </q-toolbar>
  </q-header>
</template>

<script setup>
// * Functional
import { storeToRefs } from "pinia";
import { useState } from "src/stores/state";
import { ref, computed, watch } from "vue";
import { Platform, Dark } from "quasar";

// * Modals
import DataImport from "src/components/Dialog/Data/DataImport.vue";
import DataExport from "src/components/Dialog/Data/DataExport.vue";

const state = useState();

const isImportModal = ref(false);
const isExportModal = ref(false);

const {
  isGridStyle, isDarkTheme, activeTab, search
} = storeToRefs(state);

const viewStyleBtn = computed(() => (isGridStyle.value
  ? { icon: "o_view_agenda", tooltip: "Список" }
  : { icon: "grid_view", tooltip: "Сетка" }));

watch(() => isDarkTheme.value, (val) => {
  localStorage.setItem("isDarkTheme", val);
});

</script>

<style lang="sass" scoped>

.header
  color: $brown-8

  &__wrapper
    padding: 5px 15px

  &__logo
    flex: none

    h1
      font-weight: 500

    img
      margin-left: 10px
      height: 28px
      width: 28px

  &__search
    width: 100%
    max-width: 500px
    margin-left: auto

  &__settings
    margin-left: auto

@media (max-width: 991px)
  .header

    &__search
      max-width: 260px
</style>
