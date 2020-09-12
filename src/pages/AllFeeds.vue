<template>
  <main>
    <div class="header">
      <h1>📔 Feeds</h1>

      <div id="create-journal-container" class="shadow">
        <!-- fix to stop page from refreshing when hitting enter:
             https://stackoverflow.com/questions/2215462/html-form-when-i-hit-enter-it-refreshes-page -->
        <form id="create-new-journal" onkeypress="return event.keyCode != 13">
          <input
            v-model="journal.title"
            required
            type="text"
            placeholder="Name of new journal"
            @keyup.enter="submit()"
          />
          <input
            name="create journal"
            value="Create Journal"
            type="button"
            @click="submit()"
          />
        </form>
      </div>
    </div>
    <div
      v-for="(item, index) in allJournals"
      :key="index"
      :journal="{ item, index }"
      class="card"
      @delete-journal="deleteJournal"
      @update-journal="updateJournalTitle"
    >
      <img src="//unsplash.it/800" alt="" class="card__img" />
      <div class="card__body">
        <h2 class="feed__title">
          <a href=""
            >{{ item.data.title }}|Feed
            titleフィードのタイトルが折り返すとどうなるFeed
            titleフィードのタイトルが折り返すとどうなる</a
          >
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud なんとかかんとか日本語版。
          日本語が続いていると結構行間が狭く見えるのではないだろうかなんとかかんとか
          日本語版。日本語が続いていると結構行間が狭く見えるのではないだろうか
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in
        </p>
      </div>
    </div>
    <div id="journals-container">
      <JournalCard
        v-for="(item, index) in allJournals"
        :key="index"
        :journal="{ item, index }"
        @delete-journal="deleteJournal"
        @update-journal="updateJournalTitle"
      />
    </div>
  </main>
</template>

<script>
import {
  createJournal,
  getJournals,
  deleteJournal,
  updateJournalTitle
} from "../models/JournalsModel";
import JournalCard from "../components/JournalCard.vue";

export default {
  components: {
    JournalCard
  },

  data: function() {
    return {
      journal: {
        title: ""
      },
      allJournals: []
    };
  },
  beforeMount() {
    getJournals()
      .then(resp => {
        console.log("Got journals from DB", resp.data);
        this.allJournals = resp.data;
      })
      .catch(err => console.error("problem getting journals", err));
  },
  methods: {
    /**
     * Sumbit a new post to db
     */
    submit() {
      createJournal(this.journal)
        .then(resp => {
          alert("New journal created");
          console.log("journal obj", resp);
          this.allJournals.push(resp);
          if (resp.msg) {
            alert(resp.message);
          }
        })
        .catch(err => {
          alert("There was a problem creating your journal");
          console.error(err);
        });
    },
    /**
     * delete journal
     *  @param {object} journal - object containing index journal and fauna db journal object
     */
    deleteJournal(journal) {
      deleteJournal(journal)
        .then(resp => {
          console.log("Journal deleted!", resp);
        })
        .catch(err => {
          console.error("problem deleting", err);
        });
    },
    /**
     * update a journal
     * @param {object} journal - object containing new journla title and fauna db journal object
     */
    updateJournalTitle({ journalRefID, newJournalTitle, index }) {
      console.log(
        "Updating new journal title to ",
        newJournalTitle,
        journalRefID
      );
      updateJournalTitle(journalRefID, newJournalTitle)
        .then(() => {
          this.allJournals[index].data.title = newJournalTitle;
        })
        .catch(err => {
          console.error("problem updating journal", err);
        });
    }
  }
};
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

main {
  padding: 0;
  margin: 0;
  font-size: 1rem;
  line-height: 1.6rem;
  display: grid;
  grid-row-gap: 2em;
  background-color: #1f1f1b;
  color: #fafafa;
  text-align: justify;
}

h2 {
  line-height: 1.6;
}

a {
  color: #f7f7f9;
}

.header,
.card {
  // in upper grids second column
  grid-column: 2;
  &__img {
    width: 100%;
    height: 10vh;
    object-fit: cover;
  }
}

p {
  margin-bottom: 2em;
}

header,
footer {
  background: #040404;
  padding: 1em;
  color: white;
  grid-column: 1 / -1;
}

// for mobile
@media only screen and (max-width: 768px) {
  body {
    grid: auto-flow / 20px 1fr 20px;
  }
  .card {
    // display: grid;
    &__img {
    }
  }
}

// for pc
@media only screen and (min-width: 768px) and (max-width: 2400px) {
  body {
    grid: auto-flow / minmax(10px, 1fr) minmax(300px, 1000px) minmax(10px, 1fr);
  }

  .card {
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
  body {
    padding: 0 5rem;
    grid: auto-flow / 1fr 1fr 1fr 1fr;
    grid-gap: 5rem;
    font-size: 1.5rem;
    line-height: 2.2;
  }

  .card {
    grid-column: auto;
  }
}

main {
  display: grid;
  grid-row-gap: 2em;
  grid: auto-flow / minmax(10px, 1fr) minmax(300px, 1000px) minmax(10px, 1fr);
}

#create-journal-container {
  background: var(--app-secondary-background-color);
  grid-column: 2;
  width: 100%;
  justify-content: center;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  #create-new-journal {
    display: flex;
    flex-direction: column;
  }

  input[type="text"] {
    background: var(--app-secondary-background-color);
  }
}

#journals-container {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: center;
}

input[type="button"] {
  border: none;
  padding: 15px;
  cursor: pointer;
  border-radius: 0 0px 15px 15px;
  background: rgb(158, 158, 158);
}
input[type="button"]:hover {
  background: rgb(112, 112, 112);
}

input[type="button"]:active {
  background: rgb(100, 100, 100);
  box-shadow: 0px 0px 0px -4px rgba(0, 0, 0, 0.75);
}
</style>
