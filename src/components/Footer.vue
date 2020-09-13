<template>
  <footer>
    made by<a href="https://twitter.com/peccul">peccu</a>. based on
    <a href="https://twitter.com/chiubaca">chiubaca</a>&apos;s
    <a href="https://github.com/chiubaca/vue-netlify-fauna-starter-kit"
      >vue-netlify-fauna-starter-kit</a
    >
    <div id="links"></div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 0;
  height: 35px;
  text-align: center;
  color: var(--primary);
  background-color: var(--app-secondary-background-color);
  a {
    text-decoration: none;
    margin-left: 5px;
    border-bottom: 2px solid lightskyblue;
  }
  a:hover {
    border-radius: 5px;
    background-color: lightskyblue;
  }
}
</style>
