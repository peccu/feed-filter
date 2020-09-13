<template>
  <main>
    <div class="header">
      <h1>📔 Feeds</h1>
    </div>

    <FeedArticle
      v-for="(item, index) in allJournals"
      :key="index"
      :journal="{ item, index }"
    />
  </main>
</template>

<script src="./AllFeeds.js"></script>

<style lang="scss" src="./AllFeeds.scss" scoped></style>
