<template>
  <q-dialog v-model="open" >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Создание базы документов</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="name" autofocus @keyup.enter="open = false" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary tw-flex tw-gap-x-5">
        <q-btn no-caps flat label="Отмена" v-close-popup />
        <q-btn no-caps color="primary" label="Добавить" @click="createConfirm" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['create'])
watch(() => props.open, () => {
  openDialog()
})
const open = ref(false)
const name = ref('')
function createConfirm() {
  emits('create', name.value)
  name.value = ''
}
function openDialog() {
  open.value = true
}
</script>
