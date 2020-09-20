/* idempotent operation to bootstrap database */
const faunadb = require("faunadb");
const chalk = require("chalk");

const q = faunadb.query;

function getVersion(client) {
  return client.query(
    q.Max(q.Match(q.Index("schema_version")))
  )
    .then(resp => {
      console.log(resp)
      return resp
    })
}

// create schema versioning
function setupFaunaDBv3(client) {
  getVersion(client)
  return client
    .query(
      q.Do(
        q.CreateCollection({
          name: "application"
        })
      )
    )
    .then(
      () =>
        client.query(
          q.Do(
            q.CreateIndex({
              name: "schema_version",
              source: q.Collection("application"),
              terms: [],
              values: [
                {field: ['data', 'schema_version']}
              ]
            }),
            q.Create(q.Collection("application"), {
              data: {
                schema_version: '3'
              }
            }),
            q.Delete(q.Ref("indexes/all_feed_sources")),
            q.CreateIndex({
              name: "my_all_feed_sources",
              source: q.Collection("feed_sources"),
              permissions: {
                read: q.Collection("users")
              }
            })
          )
        )
    )
}

// create feed resources
function setupFaunaDBv2(client) {
  return client
    .query(
      q.Do(
        q.CreateCollection({
          name: "feed_sources",
          permissions: {
            create: q.Collection("users")
          }
        }),
        q.CreateCollection({
          name: "feed_articles",
          permissions: {
            create: q.Collection("users")
          }
        })
      )
    )
    .then(() =>
      client.query(
        q.Do(
          q.CreateIndex({
            name: "feed_articles_by_source",
            source: q.Collection("feed_articles"),
            terms: [
              {
                field: ["data", "source"]
              }
            ],
            permissions: {
              read: q.Collection("users")
            }
          }),
          q.CreateIndex({
            // this index is optional but useful in development for browsing users
            name: `all_feed_articles`,
            source: q.Collection("feed_articles")
          }),
        )
      )
    )
}

function setupFaunaDBv1(client) {
  return client
    .query(
      q.CreateCollection({
        name: "users"
      })
    )
    .then(() =>
      client.query(
        q.Do(
          q.CreateCollection({
            name: "posts",
            permissions: {
              create: q.Collection("users")
            }
          }),
          q.CreateCollection({
            name: "journals",
            permissions: {
              create: q.Collection("users")
            }
          })
        )
      )
    )
    .then(() =>
      client.query(
        q.Do(
          q.CreateIndex({
            name: "users_by_id",
            source: q.Collection("users"),
            terms: [
              {
                field: ["data", "id"]
              }
            ],
            unique: true
          }),
          q.CreateIndex({
            // this index is optional but useful in development for browsing users
            name: `all_users`,
            source: q.Collection("users")
          }),
          q.CreateIndex({
            name: "all_posts",
            source: q.Collection("posts"),
            permissions: {
              read: q.Collection("users")
            }
          }),
          q.CreateIndex({
            name: "all_journals",
            source: q.Collection("journals"),
            permissions: {
              read: q.Collection("users")
            }
          }),
          q.CreateIndex({
            name: "posts_by_journal",
            source: q.Collection("posts"),
            terms: [
              {
                field: ["data", "journal"]
              }
            ],
            permissions: {
              read: q.Collection("users")
            }
          })
        )
      )
    )
}

/*  */
function setupFaunaDB() {
  console.log(chalk.yellow("Attempting to create the DB schemas..."));

  let key = checkForFaunaKey();

  const client = new faunadb.Client({
    secret: key
  });

  /* Based on your requirements, change the schema here */
  // create collections and indices
  return setupFaunaDBv1(client)
    .catch(e => {
      if (e.message === "instance already exists") {
        console.log("Schemas(v1) are already created... skipping");
        setupFaunaDBv2(client).catch(e => {
          if (e.message === "instance already exists") {
            console.log("Schemas(v2) are already created... skipping");
            setupFaunaDBv3(client)
              .then(() => {
                getVersion(client)
              })
              .catch(e => {
                if (e.message === "instance already exists") {
                  console.log("Schemas(v3) are already created... skipping");
                  process.exit(0);
                } else {
                  console.error("There was a problem bootstrapping the db", e);
                  throw e;
                }
              });
          } else {
            console.error("There was a problem bootstrapping the db", e);
            throw e;
          }
        });
      } else {
        console.error("There was a problem bootstrapping the db", e);
        throw e;
      }
    });
}

function checkForFaunaKey() {
  if (!process.env.FAUNADB_SERVER_SECRET) {
    console.log(
      chalk.bold.red(
        "Required 'FAUNADB_SERVER_SECRET' environment variable not found."
      )
    );
    console.log(
      chalk.yellow.bold(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~
    You can create a your fauna db server secret by following this:
      - https://docs.fauna.com/fauna/current/tutorials/authentication/user.html#setup-server-key

    Then ensure you have added the server secret into your Netlify site as an environment variable
    with the key 'FAUNADB_SERVER_SECRET'.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `)
    );
    process.exit(1);
  }

  console.log(
    chalk.green(
      `Found FAUNADB_SERVER_SECRET environment variable in Netlify site`
    )
  );
  return process.env.FAUNADB_SERVER_SECRET;
}

setupFaunaDB()
  .then(() => {
    console.log(chalk.green(`Bootstraping DB scheamas was successful!`));
  })
  .catch(err => {
    console.log(
      chalk.red.bold(
        `There was an issue bootstrapping the DB scheamas due to: ${err}`
      )
    );
    process.exit(1);
  });
