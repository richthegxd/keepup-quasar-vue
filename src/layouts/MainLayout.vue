<template>
  <q-layout view="hHh Lpr lff">
    <Header />

    <Sidebar />

    <q-page-container>
      <div class="q-page-container__wrapper">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { watch } from "vue";
import { Dark } from "quasar";
import { storeToRefs } from "pinia";
import { useState } from "src/stores/state";

import Header from "src/components/Layout/Header.vue";
import Sidebar from "src/components/Layout/Sidebar.vue";

const state = useState();
const { isDarkTheme } = storeToRefs(state);

// * Changing the theme when creating a page
Dark.set(isDarkTheme.value);

watch(() => isDarkTheme.value, () => {
  Dark.toggle();
});

</script>

<style lang="sass" scoped>

.q-page-container

  &__wrapper
    padding: 40px

</style>
