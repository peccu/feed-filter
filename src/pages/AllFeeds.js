import {
  createFeedsource,
  getFeedsources,
  deleteFeedsource,
  updateFeedsourceTitle
} from "../models/FeedSourcesModel";
import FeedArticle from "../components/FeedArticle.vue";

export default {
  components: {
    FeedArticle
  },

  data: function() {
    return {
      feedsource: {
        title: ""
      },
      allFeedsources: []
    };
  },
  beforeMount() {
    getFeedsources()
      .then(resp => {
        console.log("Got feedsources from DB", resp.data);
        this.allFeedsources = resp.data;
      })
      .catch(err => console.error("problem getting feedsources", err));
  },
  methods: {
    /**
     * Sumbit a new post to db
     */
    submit() {
      createFeedsource(this.feedsource)
        .then(resp => {
          alert("New feedsource created");
          console.log("feedsource obj", resp);
          this.allFeedsources.push(resp);
          if (resp.msg) {
            alert(resp.message);
          }
        })
        .catch(err => {
          alert("There was a problem creating your feedsource");
          console.error(err);
        });
    },
    /**
     * delete feedsource
     *  @param {object} feedsource - object containing index feedsource and fauna db feedsource object
     */
    deleteFeedsource(feedsource) {
      deleteFeedsource(feedsource)
        .then(resp => {
          console.log("Feedsource deleted!", resp);
        })
        .catch(err => {
          console.error("problem deleting", err);
        });
    },
    /**
     * update a feedsource
     * @param {object} feedsource - object containing new journla title and fauna db feedsource object
     */
    updateFeedsourceTitle({ feedsourceRefID, newFeedsourceTitle, index }) {
      console.log(
        "Updating new feedsource title to ",
        newFeedsourceTitle,
        feedsourceRefID
      );
      updateFeedsourceTitle(feedsourceRefID, newFeedsourceTitle)
        .then(() => {
          this.allFeedsources[index].data.title = newFeedsourceTitle;
        })
        .catch(err => {
          console.error("problem updating feedsource", err);
        });
    }
  }
};
