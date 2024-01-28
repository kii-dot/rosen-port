import { setImportBuildGetters } from "vike/__internal/loadImportBuild";
import { partRegex } from "part-regex";
const route$1 = (pageContext) => {
  if (!partRegex`/${/@([a-zA-Z0-9_\-.]+$)/}`.test(pageContext.urlPathname)) {
    return false;
  }
  const paths = pageContext.urlPathname.split("/");
  const id = paths[1];
  return {
    routeParams: {
      id
    }
  };
};
const import_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  route: route$1
}, Symbol.toStringTag, { value: "Module" }));
const route = (pageContext) => {
  if (!partRegex`/${/@[a-zA-Z0-9_\-.]+/}/about`.test(pageContext.urlPathname)) {
    return false;
  }
  const paths = pageContext.urlPathname.split("/");
  const id = paths[1];
  const page = paths.length > 2 ? paths[2] : "";
  return {
    routeParams: {
      id,
      page
    }
  };
};
const import_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  route
}, Symbol.toStringTag, { value: "Module" }));
const pageFilesLazy = {};
const pageFilesEager = {};
const pageFilesExportNamesLazy = {};
const pageFilesExportNamesEager = {};
const pageFilesList = [];
const neverLoaded = {};
const isGeneratedFile = true;
const pageConfigsSerialized = [
  {
    pageId: "/src/pages/@id",
    isErrorPage: void 0,
    routeFilesystem: { "routeString": "/@id", "definedBy": "/src/pages/@id/" },
    loadConfigValuesAll: () => import("./entries/src_pages_-id.mjs"),
    configValuesSerialized: {
      ["isClientSideRenderable"]: {
        definedAt: { "isComputed": true },
        valueSerialized: "true"
      }
    },
    configValuesImported: [
      {
        configName: "route",
        importPath: "/src/pages/@id/+route.tsx",
        isValueFile: true,
        exportValues: import_0
      }
    ]
  },
  {
    pageId: "/src/pages/@id/about",
    isErrorPage: void 0,
    routeFilesystem: { "routeString": "/@id/about", "definedBy": "/src/pages/@id/about/" },
    loadConfigValuesAll: () => import("./entries/src_pages_-id_about.mjs"),
    configValuesSerialized: {
      ["isClientSideRenderable"]: {
        definedAt: { "isComputed": true },
        valueSerialized: "true"
      }
    },
    configValuesImported: [
      {
        configName: "route",
        importPath: "/src/pages/@id/about/+route.tsx",
        isValueFile: true,
        exportValues: import_1
      }
    ]
  },
  {
    pageId: "/src/pages/_error",
    isErrorPage: true,
    routeFilesystem: void 0,
    loadConfigValuesAll: () => import("./entries/src_pages_error.mjs"),
    configValuesSerialized: {
      ["isClientSideRenderable"]: {
        definedAt: { "isComputed": true },
        valueSerialized: "true"
      }
    },
    configValuesImported: []
  },
  {
    pageId: "/src/pages/about",
    isErrorPage: void 0,
    routeFilesystem: { "routeString": "/about", "definedBy": "/src/pages/about/" },
    loadConfigValuesAll: () => import("./entries/src_pages_about.mjs"),
    configValuesSerialized: {
      ["isClientSideRenderable"]: {
        definedAt: { "isComputed": true },
        valueSerialized: "true"
      }
    },
    configValuesImported: []
  },
  {
    pageId: "/src/pages/index",
    isErrorPage: void 0,
    routeFilesystem: { "routeString": "/", "definedBy": "/src/pages/index/" },
    loadConfigValuesAll: () => import("./entries/src_pages_index.mjs"),
    configValuesSerialized: {
      ["isClientSideRenderable"]: {
        definedAt: { "isComputed": true },
        valueSerialized: "true"
      }
    },
    configValuesImported: []
  },
  {
    pageId: "/src/pages/login",
    isErrorPage: void 0,
    routeFilesystem: { "routeString": "/login", "definedBy": "/src/pages/login/" },
    loadConfigValuesAll: () => import("./entries/src_pages_login.mjs"),
    configValuesSerialized: {
      ["isClientSideRenderable"]: {
        definedAt: { "isComputed": true },
        valueSerialized: "true"
      }
    },
    configValuesImported: []
  },
  {
    pageId: "/src/pages/signup",
    isErrorPage: void 0,
    routeFilesystem: { "routeString": "/signup", "definedBy": "/src/pages/signup/" },
    loadConfigValuesAll: () => import("./entries/src_pages_signup.mjs"),
    configValuesSerialized: {
      ["isClientSideRenderable"]: {
        definedAt: { "isComputed": true },
        valueSerialized: "true"
      }
    },
    configValuesImported: []
  }
];
const pageConfigGlobalSerialized = {
  configValuesImported: []
};
const pageFilesLazyIsomorph1 = /* @__PURE__ */ Object.assign({});
const pageFilesLazyIsomorph = { ...pageFilesLazyIsomorph1 };
pageFilesLazy[".page"] = pageFilesLazyIsomorph;
const pageFilesLazyServer1 = /* @__PURE__ */ Object.assign({});
const pageFilesLazyServer = { ...pageFilesLazyServer1 };
pageFilesLazy[".page.server"] = pageFilesLazyServer;
const pageFilesEagerRoute1 = /* @__PURE__ */ Object.assign({});
const pageFilesEagerRoute = { ...pageFilesEagerRoute1 };
pageFilesEager[".page.route"] = pageFilesEagerRoute;
const pageFilesExportNamesEagerClient1 = /* @__PURE__ */ Object.assign({});
const pageFilesExportNamesEagerClient = { ...pageFilesExportNamesEagerClient1 };
pageFilesExportNamesEager[".page.client"] = pageFilesExportNamesEagerClient;
const pageFiles = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isGeneratedFile,
  neverLoaded,
  pageConfigGlobalSerialized,
  pageConfigsSerialized,
  pageFilesEager,
  pageFilesExportNamesEager,
  pageFilesExportNamesLazy,
  pageFilesLazy,
  pageFilesList
}, Symbol.toStringTag, { value: "Module" }));
setImportBuildGetters({
  pageFiles: () => pageFiles,
  clientManifest: () => {
    return {
  "_chunk-!~{009}~.js": {
    "file": "assets/static/index.T3MbBRSn.css",
    "src": "_chunk-!~{009}~.js"
  },
  "_chunk-653igK8N.js": {
    "file": "assets/chunks/chunk-653igK8N.js",
    "imports": [
      "_chunk-_jdiyOdg.js"
    ],
    "isDynamicEntry": true
  },
  "_chunk-Lhk_X_R1.js": {
    "file": "assets/chunks/chunk-Lhk_X_R1.js",
    "imports": [
      "_chunk-_jdiyOdg.js"
    ]
  },
  "_chunk-_4Ugs1g8.js": {
    "file": "assets/chunks/chunk-_4Ugs1g8.js",
    "imports": [
      "_chunk-_jdiyOdg.js"
    ]
  },
  "_chunk-_jdiyOdg.js": {
    "css": [
      "assets/static/index.T3MbBRSn.css"
    ],
    "file": "assets/chunks/chunk-_jdiyOdg.js"
  },
  "_chunk-dMWxQK8b.js": {
    "file": "assets/chunks/chunk-dMWxQK8b.js"
  },
  "_chunk-hfk7qCst.js": {
    "file": "assets/chunks/chunk-hfk7qCst.js"
  },
  "_chunk-hlDPvxQM.js": {
    "file": "assets/chunks/chunk-hlDPvxQM.js"
  },
  "node_modules/vike/dist/esm/client/server-routing-runtime/entry.js": {
    "dynamicImports": [
      "virtual:vike:pageConfigValuesAll:client:/src/pages/@id",
      "virtual:vike:pageConfigValuesAll:client:/src/pages/@id/about",
      "virtual:vike:pageConfigValuesAll:client:/src/pages/_error",
      "virtual:vike:pageConfigValuesAll:client:/src/pages/about",
      "virtual:vike:pageConfigValuesAll:client:/src/pages/index",
      "virtual:vike:pageConfigValuesAll:client:/src/pages/login",
      "virtual:vike:pageConfigValuesAll:client:/src/pages/signup"
    ],
    "file": "assets/entries/entry-server-routing.G_WJg1Yc.js",
    "imports": [
      "_chunk-hlDPvxQM.js"
    ],
    "isEntry": true,
    "src": "node_modules/vike/dist/esm/client/server-routing-runtime/entry.js"
  },
  "src/assets/logo.svg": {
    "file": "assets/static/logo.Nv-y6PbV.svg",
    "src": "src/assets/logo.svg"
  },
  "virtual:vike:pageConfigValuesAll:client:/src/pages/@id": {
    "file": "assets/entries/src_pages_-id.582HkPyc.js",
    "imports": [
      "_chunk-_jdiyOdg.js",
      "_chunk-Lhk_X_R1.js",
      "_chunk-_4Ugs1g8.js",
      "_chunk-dMWxQK8b.js"
    ],
    "isDynamicEntry": true,
    "isEntry": true,
    "src": "virtual:vike:pageConfigValuesAll:client:/src/pages/@id"
  },
  "virtual:vike:pageConfigValuesAll:client:/src/pages/@id/about": {
    "file": "assets/entries/src_pages_-id_about.gT7NUj-x.js",
    "imports": [
      "_chunk-_jdiyOdg.js",
      "_chunk-Lhk_X_R1.js",
      "_chunk-dMWxQK8b.js"
    ],
    "isDynamicEntry": true,
    "isEntry": true,
    "src": "virtual:vike:pageConfigValuesAll:client:/src/pages/@id/about"
  },
  "virtual:vike:pageConfigValuesAll:client:/src/pages/_error": {
    "file": "assets/entries/src_pages_error.JuC2H25_.js",
    "imports": [
      "_chunk-_jdiyOdg.js"
    ],
    "isDynamicEntry": true,
    "isEntry": true,
    "src": "virtual:vike:pageConfigValuesAll:client:/src/pages/_error"
  },
  "virtual:vike:pageConfigValuesAll:client:/src/pages/about": {
    "css": [
      "assets/static/about.b-pBwgjF.css"
    ],
    "file": "assets/entries/src_pages_about.GeN926rh.js",
    "imports": [
      "_chunk-_jdiyOdg.js"
    ],
    "isDynamicEntry": true,
    "isEntry": true,
    "src": "virtual:vike:pageConfigValuesAll:client:/src/pages/about"
  },
  "virtual:vike:pageConfigValuesAll:client:/src/pages/index": {
    "file": "assets/entries/src_pages_index.2UfuER_2.js",
    "imports": [
      "_chunk-_jdiyOdg.js",
      "_chunk-_4Ugs1g8.js",
      "_chunk-hfk7qCst.js"
    ],
    "isDynamicEntry": true,
    "isEntry": true,
    "src": "virtual:vike:pageConfigValuesAll:client:/src/pages/index"
  },
  "virtual:vike:pageConfigValuesAll:client:/src/pages/login": {
    "file": "assets/entries/src_pages_login.AELfvSgJ.js",
    "imports": [
      "_chunk-_jdiyOdg.js",
      "_chunk-_4Ugs1g8.js",
      "_chunk-dMWxQK8b.js"
    ],
    "isDynamicEntry": true,
    "isEntry": true,
    "src": "virtual:vike:pageConfigValuesAll:client:/src/pages/login"
  },
  "virtual:vike:pageConfigValuesAll:client:/src/pages/signup": {
    "dynamicImports": [
      "_chunk-653igK8N.js"
    ],
    "file": "assets/entries/src_pages_signup.EghT8xzw.js",
    "imports": [
      "_chunk-_jdiyOdg.js",
      "_chunk-_4Ugs1g8.js",
      "_chunk-hfk7qCst.js",
      "_chunk-hlDPvxQM.js",
      "_chunk-dMWxQK8b.js"
    ],
    "isDynamicEntry": true,
    "isEntry": true,
    "src": "virtual:vike:pageConfigValuesAll:client:/src/pages/signup"
  }
};
  },
  pluginManifest: () => ({
    "version": "0.4.153",
    "usesClientRouter": false,
    "manifestKeyMap": {},
    "baseServer": "/",
    "baseAssets": "/",
    "includeAssetsImportedByServer": true,
    "redirects": {},
    "trailingSlash": false,
    "disableUrlNormalization": false
  })
});
