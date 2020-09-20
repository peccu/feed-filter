<template>
  <main>
    <div class="header">
      <h1>📔 Feeds</h1>
      <div>
        <!-- fix to stop page from refreshing when hitting enter:
             https://stackoverflow.com/questions/2215462/html-form-when-i-hit-enter-it-refreshes-page -->
        <form onkeypress="return event.keyCode != 13">
          <input
            v-model="feedsource.title"
            required
            type="text"
            placeholder="Name of new feedsource"
            @keyup.enter="submit()"
          />
          <input
            name="create feedsource"
            value="Create Feedsource"
            type="button"
            @click="submit()"
          />
        </form>
      </div>
    </div>

    <FeedSource
      v-for="(item, index) in allFeedsources"
      :key="index"
      :feedsource="{ item, index }"
    />
  </main>
</template>

<script src="./AllFeeds.js"></script>

<style lang="scss" src="./AllFeeds.scss" scoped></style>
