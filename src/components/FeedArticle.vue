<template>
  <div class="card">
    <img src="//unsplash.it/800" alt="" class="card__img" />
    <div class="card__body">
      <h2 class="card__title">
        <a :href="feedsourceUri"
          >{{ feedsourceTitle }}|Feed
          titleフィードのタイトルが折り返すとどうなるFeed
          titleフィードのタイトルが折り返すとどうなる</a
        >
      </h2>
      <p>{{ feedsourceDescription }}</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud なんとかかんとか日本語版。
        日本語が続いていると結構行間が狭く見えるのではないだろうかなんとかかんとか
        日本語版。日本語が続いていると結構行間が狭く見えるのではないだろうか
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    feedsource: {
      type: Object
    }
  },
  data() {
    return {
      // when in edit mode, the input for title become editable and toggle the update button
      editMode: false,
      // on mounted, this hold the feedsource title and will save changes to the new title if it is edited
      feedsourceTitle: "",
      feedsourceDescription: "",
      feedsourceUri: "",
      // the card is hidden from view when the user deletes the card, this preserves component index.
      // if the index is not preserved this can cause the card state to get jumbled up and its very confusing for the end-user
      deleted: false
    };
  },
  mounted() {
    //set the feedsource title into view and into state
    this.feedsourceTitle = this.feedsource.item.data.title;
    this.feedsourceDescription = this.feedsource.item.data.description;
    this.feedsourceUri = this.feedsource.item.data.uri;
    /* this.$refs.editTitle.value = this.feedsource.item.data.title; */
  }
  /* methods: {
    *   enableEditMode() {
    *     this.editMode = true;
    *     // remove readonly mode so that the input is editable
    *     this.$refs.editTitle.removeAttribute("readonly");
    *     //set the value of the input so that the user can edit the existing title
    *     this.$refs.editTitle.value = this.feedsource.item.data.title;
    *     this.$refs.editTitle.focus();
    *   },
    *   emitNewFeedsourceTitle() {
    *     this.editMode = false;
    *     this.$refs.editTitle.setAttribute("readonly", "true");

    *     this.$emit("update-feedsource", {
    *       newFeedsourceTitle: this.feedsourceTitle,
    *       feedsourceRefID: this.feedsource.item.ref.value.id,
    *       index: this.feedsource.index
    *     });
    *   },
    *   deleteFeedsource() {
    *     this.$emit("delete-feedsource", this.feedsource.item);
    *     this.deleted = true;
    *   }
    * } */
};
</script>

<style lang="scss" scoped>
h2 {
  line-height: 1.6;
}

a {
  color: var(--primary);
}

p {
  margin-bottom: 1em;
}

.card {
  // in upper grids second column
  grid-column: 2;

  text-align: justify;
  &__img {
    width: 100%;
    height: 10vh;
    object-fit: cover;
  }
}

// for mobile
@media only screen and (max-width: 768px) {
  .card {
    font-size: 0.8rem;
    line-height: 1.2rem;
    // display: grid;
    &__img {
    }
  }
}

// for pc
@media only screen and (min-width: 768px) and (max-width: 2400px) {
  .card {
    font-size: 1rem;
    line-height: 1.6rem;

    background-color: inherit;
    display: grid;
    grid: auto-flow / 1fr 4fr;
    grid-gap: 10px;

    &__img {
      max-height: 60%;
      position: sticky;
      top: 0;
      align-self: start;
    }
    &__body {
      background-color: inherit;
    }
  }
}

// for 4K over
@media only screen and (min-width: 2400px) {
  .card {
    // in upper grids second column
    grid-column: auto;

    font-size: 1.4rem;
    line-height: 1.8;
  }
}
</style>
