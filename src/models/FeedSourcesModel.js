import { q, client } from "../helpers/init-db";

/**
 *
 * @param {object} feedsourceData - object containing the title of feedsource, could contain other data too in the future
 */
export function createFeedsource(feedsourceData) {
  const me = q.Identity();

  return client
    .query(
      q.Create(q.Collection("feed_sources"), {
        data: {
          ...feedsourceData,
          owner: me
        },
        permissions: {
          read: me,
          write: me
        }
      })
    )
    .then(resp => resp)
    .catch(error => error);
}

export function getFeedsources() {
  return client
    .query(
      q.Map(q.Paginate(q.Match(q.Ref("indexes/all_feed_sources"))), ref =>
        q.Get(ref)
      )
    )
    .then(resp => resp);
}

/**
 *
 * @param {object} feedsource - Fauna feedsource object
 */
export function deleteFeedsource(feedsource) {
  return client
    .query(
      q.Map(
        q.Paginate(
          q.Match(
            // get all the posts within a given feedsource ref
            q.Index("feed_articles_by_source"),
            q.Ref(q.Collection("feed_sources"), feedsource.ref.value.id)
          )
        ),
        // then delete all of the posts within that given feedsource ref,
        // I used a FQL Lambda here because i couldn't get an inline arrow function to work
        q.Lambda("X", q.Delete(q.Select("ref", q.Get(q.Var("X")))))
      )
    )
    .then(() => {
      // Once all of the posts in that given feedsources have been removed we delete the feedsource itself
      return client.query(q.Delete(feedsource.ref));
    })
    .catch(err => err);
}

/**
 *
 * @param {object} feedsourceRefID - faunaDb feedsource collection reference ID
 * @param {string} newTitle - new title for feedsource
 */
export function updateFeedsourceTitle(feedsourceRefID, newTitle) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("feed_sources"), feedsourceRefID), {
        //TODO - should think about spreading a feedsource object into here. See createFeedsource method.
        data: { title: newTitle }
      })
    )
    .then(resp => resp)
    .catch(err => err);
}
