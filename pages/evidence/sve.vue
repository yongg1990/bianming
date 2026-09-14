<template>
<!--  <svg-->
<!--    :fill="color"-->
<!--    :width="width"-->
<!--    :height="height"-->
<!--  >-->
<!--  <title>{{title}}</title>-->
<!--  <use :xlinkHref={`/sprite.svg#${name}`} />-->
<!--  </svg>-->
  <svg
      :width="width"
      :height="height"
    :aria-labelledby="title"
    aria-hidden="true">
    <use :xlink:href="'/prescription/static/sprite.svg#' + name" />
  </svg>
 </template>

<script>

export default {
    name: 'Home',
  props: {
    width: {
      type: String,
      default: '32'
    },
    height: {
      type: String,
      default: '32'
    },
    name: {
      type: String,
      required: true,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    },
    components: {},
    data() {
        return {}

    },
    mounted() {},

    methods: {},
}
</script>

<style scoped>

</style>
