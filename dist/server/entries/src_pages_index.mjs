import { i as import_0 } from "../chunks/chunk-il6sXMOV.js";
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { L as Link } from "../chunks/chunk-0h8FYTEx.js";
import { t as tagline3, d as description, c as ctaButton, l as logIn } from "../chunks/chunk-YOzD_9do.js";
import "react-dom/server";
import "react";
import "vike/server";
import "unstated-next";
function Page() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "bg-white", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl py-24 sm:px-6 sm:py-16 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16", children: [
    /* @__PURE__ */ jsx("h2", { className: "mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl", children: tagline3 }),
    /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col items-center justify-center gap-y-4", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "signup",
          className: "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          children: ctaButton
        }
      ),
      /* @__PURE__ */ jsx(Link, { href: "login", className: "text-sm leading-6 text-white", children: logIn })
    ] }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        viewBox: "0 0 1024 1024",
        className: "absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsx("circle", { cx: 512, cy: 512, r: 512, fill: "url(#827591b1-ce8c-4110-b064-7cb85a0b1217)", fillOpacity: "0.7" }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("radialGradient", { id: "827591b1-ce8c-4110-b064-7cb85a0b1217", children: [
            /* @__PURE__ */ jsx("stop", { stopColor: "#7775D6" }),
            /* @__PURE__ */ jsx("stop", { offset: 1, stopColor: "#E935C1" })
          ] }) })
        ]
      }
    )
  ] }) }) }) });
}
const import_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Page
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
    importPath: "/src/pages/index/+Page.tsx",
    isValueFile: true,
    exportValues: import_1
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
