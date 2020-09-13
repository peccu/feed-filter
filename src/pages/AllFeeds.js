import {
  createJournal,
  getJournals,
  deleteJournal,
  updateJournalTitle
} from "../models/JournalsModel";
import JournalCard from "../components/JournalCard.vue";
import FeedArticle from "../components/FeedArticle.vue";

export default {
  components: {
    JournalCard,
    FeedArticle
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
