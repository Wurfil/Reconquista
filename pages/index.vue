<template>
  <q-layout view="hHh Lpr lff" class="h-full shadow-2 rounded-borders">
    <q-header elevated class="tw-bg-white">
      <q-toolbar>
        <q-toolbar-title class="tw-text-black tw-flex tw-items-center tw-h-[72px]">
          <q-img height="72px" width="121px" src="/rzd_icon.png" class="tw-mr-5"/>
          <div>
            Поддержка сотрудников компании
          </div>
        </q-toolbar-title>
        <div class="tw-gap-x-20 tw-flex tw-items-center tw-text-base tw-mr-5">
          <a
              class="tw-text-black hover:tw-text-[#ef3025] tw-cursor-pointer tw-transition-all"
          >
            Чат
          </a>
          <a
              class="tw-text-black hover:tw-text-[#ef3025] tw-cursor-pointer tw-transition-all"
          >
            База знаний
          </a>
          <a
              class="tw-text-black hover:tw-text-[#ef3025] tw-cursor-pointer tw-transition-all"
          >
            Профиль
          </a>

        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding>
        <NuxtLayout>
          <chat/>
        </NuxtLayout>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-toolbar {
  padding: 0 12px 0 0;
}
</style>
<script setup lang="ts">
const drawerHistory = useState('drawerHistory', () => false);

</script>
