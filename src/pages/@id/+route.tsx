import { partRegex } from 'part-regex';

const route = (pageContext) => {
  // In index, we have to filter between available routes only
  //
  // A. Get UserId as part of route.
  //  - if a route has an @ in front of it, its a userid
  //  - if a route has special characters [@,+=/\|//!#$%^&*()-`~<>;:'"/[/]/{/}]
  //  then it should not pass at all, and give it as an invalid username.
  //  Basically, only allowed characters are [._]
  // if (!partRegex`/${/@[a-zA-Z0-9]/}`.test(pageContext.urlPathname))
  if (!partRegex`/${/@([a-zA-Z0-9_\-.]+$)/}`.test(pageContext.urlPathname)) {
    return false;
  }

  // const regexForUserId = /@([a-z0-9_\-.]+)/i
  // const id = pageContext.urlPathname.match(regexForUserId)
  const paths = pageContext.urlPathname.split('/');
  const id = paths[1];

  return {
    routeParams: {
      id,
    },
  };
};

export { route };
