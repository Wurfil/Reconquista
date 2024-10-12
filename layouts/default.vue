<template>
  <q-layout view="hHh Lpr lff" class="h-full shadow-2 rounded-borders">
    <q-header elevated class="tw-bg-white">
      <q-toolbar>
        <q-toolbar-title class="tw-text-black tw-flex tw-items-center tw-h-[72px]">
          <q-img height="72px" width="121px" src="/rzd_icon.png" class="tw-mr-5"/>
          <div class="laptop:tw-block tw-hidden">
            Поддержка сотрудников компании
          </div>
        </q-toolbar-title>
        <div class="tw-gap-x-20 tw-hidden tw-items-center tw-text-base tw-mr-5 tablet:tw-flex">
          <nuxt-link
              v-for="menuItem in menuList"
              :to="menuItem.link"
              class="tw-text-black hover:tw-text-[#ef3025] tw-cursor-pointer tw-transition-all"
          >
            {{ menuItem.label }}
          </nuxt-link>
        </div>
        <div class="tablet:tw-hidden tw-flex">
          <q-btn color="dark" flat @click="drawerMobileMenu = !drawerMobileMenu" round dense icon="menu"/>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
        v-model="layout"
        show-if-above
        :width="400"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit">
        <div class="tw-text-center tw-my-5 tw-text-2xl">
          Знания бота
        </div>
        <q-list>
          <template v-for="(profile, index) in menuList" :key="index">
            <q-item clickable :active="profile.label === 'Outbox'" v-ripple>
              <q-item-section avatar>
                <q-icon name="profile"/>
              </q-item-section>
              <q-item-section>
                {{ profile.name }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <drawer-menu :drawer-right="drawerMobileMenu"/>
    <q-page-container>
      <q-page padding>
        <slot/>
      </q-page>
    </q-page-container>
    <q-drawer
        v-model="layout"
        show-if-above
        :width="400"
        :breakpoint="500"
        side="right"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit">
        <div class="tw-text-center tw-my-5 tw-text-2xl">
          Профили пользователей
        </div>
        <q-list>
          <template v-for="(profile, index) in profiles" :key="index">
            <q-item @click="chooseProfile(profile)" class="mb-5" clickable :active="profile.name === choosedProfile.name" v-ripple>
              <q-item-section avatar>
                <q-icon name="account_circle" size="48px"/>
              </q-item-section>
              <q-item-section class="tw-flex tw-flex-col tw-gap-y-2">
                <div class="tw-font-bold">
                  {{ profile.name }}
                </div>
                <div>
                  Предприятие: {{ profile.enterprise }}
                </div>
                <div>
                  Стаж: {{ profile.experience }}
                </div>
                <div>
                  Личные характеристики: {{ profile.characteristic }}
                </div>
              </q-item-section>
            </q-item>
            <q-separator/>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>
<script setup>
const layout = true
const drawerMobileMenu = ref(false)
const choosedProfile = useState('choosedProfile', () => ({
  name: '',
  characteristic: '',
  experience: '',
  enterprise: '',
}))
const menuList = [
  {
    label: 'Чат',
    link: '/',
  },
  {
    label: 'База знаний',
    link: '/base',
  },
  {
    label: 'Профиль',
    link: '/profile',
  },
];
const profiles = [
  {
    name: 'Александр Михайлович Алексеев',
    characteristic: 'Инвалид 2 группы',
    experience: '15 лет',
    enterprise: 'ЦКПП',
  },
  {
    name: 'Петр Оспович Иванов',
    characteristic: 'Пенсионер',
    experience: '32 года',
    enterprise: 'БАМ',
  },
  {
    name: 'Елизавета Максимовна Полковникова',
    characteristic: 'Многодетная мать',
    experience: '3 года',
    enterprise: 'Дальневосточная железная дорога',
  }
]

function chooseProfile(profile) {
  choosedProfile.value = {...profile}
  nextTick()
}
</script>
<style scoped>
.q-toolbar {
  padding: 0 12px 0 0;
}
</style>
