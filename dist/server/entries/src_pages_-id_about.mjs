import { i as import_0 } from "../chunks/chunk-il6sXMOV.js";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { u as useData } from "../chunks/chunk-QyT9b25-.js";
import { t as trpc } from "../chunks/chunk-v4BBeQdd.js";
import "react-dom/server";
import "react";
import "vike/server";
import "unstated-next";
import "@trpc/client";
import "superjson";
function Page() {
  const { id } = useData();
  const { greeting } = trpc.demo.query();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Welcome" }),
    "About",
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsxs("li", { children: [
        "This is about page from ",
        /* @__PURE__ */ jsx("b", { children: id })
      ] }),
      /* @__PURE__ */ jsx("li", { children: greeting })
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
    importPath: "/src/pages/@id/about/+Page.tsx",
    isValueFile: true,
    exportValues: import_1
  },
  {
    configName: "data",
    importPath: "/src/pages/@id/about/+data.tsx",
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
