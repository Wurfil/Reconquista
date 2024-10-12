<template>
  <q-dialog v-model="open" >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 tw-font-bold">{{ question }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="tw-p-1"
           v-html="text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"/>
      </q-card-section>

      <q-card-actions align="right" class="text-primary tw-flex tw-gap-x-5">
        <q-btn no-caps flat label="Закрыть" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  question: {
    type: String,
    default: ''
  }
})

watch(() => props.open, () => {
  openDialog()
})
const open = ref(false)
function openDialog() {
  open.value = true
}
</script>
