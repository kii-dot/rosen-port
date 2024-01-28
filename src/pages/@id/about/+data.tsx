export { data };
export type Data = Awaited<ReturnType<typeof data>>;

// Note how we use `node-fetch`; this file is only run on the server-side, thus we don't need
// to use an isomorphic (aka universal) implementation such as `cross-fetch`.

async function data(pageContext) {
  // const response = await fetch("https://api.imdb.com/api/movies/")
  // const { movies } = await response.json()
  // /* Or with an ORM:
  // const movies = Movie.findAll() */
  // /* Or with SQL:
  // const movies = sql`SELECT * FROM movies;` */
  // return {
  //     movies
  // }
  const id = pageContext.routeParams.id.replace(/^[@]/g, '');
  const page = pageContext.routeParams.page;
  return {
    id,
    page,
  };
}
