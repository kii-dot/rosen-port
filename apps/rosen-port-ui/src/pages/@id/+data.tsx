export { data };
export type Data = Awaited<ReturnType<typeof data>>;

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
