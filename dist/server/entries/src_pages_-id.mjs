import { A as AuthContainer, i as import_0 } from "../chunks/chunk-il6sXMOV.js";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { u as useData } from "../chunks/chunk-QyT9b25-.js";
import { L as Link } from "../chunks/chunk-0h8FYTEx.js";
import { t as trpc } from "../chunks/chunk-v4BBeQdd.js";
import { useState, useEffect } from "react";
import "react-dom/server";
import "vike/server";
import "unstated-next";
import "@trpc/client";
import "superjson";
function Page() {
  const [authenticated, setAuthenticated] = useState(false);
  const { authData } = AuthContainer.useContainer();
  const { id } = useData();
  useEffect(() => {
    async function fetchSession() {
      console.log("fetching session");
      const resp = await trpc.auth.getSession.mutate();
      console.log(resp);
      setAuthenticated(resp == null ? void 0 : resp.authenticated);
    }
    fetchSession();
  }, []);
  const getHref = () => {
    return `/@${id}/about`;
  };
  const onSignOutClicked = async () => {
    const handleResp = await trpc.auth.signOut.mutate();
    if (handleResp.error === "") {
      window.location.href = "/";
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Welcome" }),
    /* @__PURE__ */ jsx("b", { children: id }),
    " profile",
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: authenticated ? "authenticated" : "not authenticated" }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { className: "navitem", href: getHref(), children: [
        "About ",
        authData == null ? void 0 : authData.token
      ] }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700",
          type: "button",
          onClick: onSignOutClicked,
          children: "SignOut"
        }
      ) })
    ] })
  ] });
}
const import_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: "Module" }));
async function data(pageContext) {
  const id = pageContext.routeParams.id.replace(/^[@]/g, "");
  const page = pageContext.routeParams.page;
  return {
    id,
    page
  };
}
const import_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  data
}, Symbol.toStringTag, { value: "Module" }));
const configValuesImported = [
  {
    configName: "onRenderHtml",
    importPath: "/src/renderer/+onRenderHtml.tsx",
    isValueFile: true,
    exportValues: import_0
  },
  {
    configName: "Page",
    importPath: "/src/pages/@id/+Page.tsx",
    isValueFile: true,
    exportValues: import_1
  },
  {
    configName: "data",
    importPath: "/src/pages/@id/+data.tsx",
    isValueFile: true,
    exportValues: import_2
  }
];
const configValuesSerialized = {
  ["passToClient"]: {
    definedAt: { "files": [{ "filePathToShowToUser": "/src/renderer/+config.h.ts", "fileExportPathToShowToUser": ["default", "passToClient"] }] },
    valueSerialized: '["pageProps","urlPathname"]'
  }
};
export {
  configValuesImported,
  configValuesSerialized
};
