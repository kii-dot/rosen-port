import { i as import_0 } from "../chunks/chunk-il6sXMOV.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { L as Link } from "../chunks/chunk-0h8FYTEx.js";
import { t as trpc } from "../chunks/chunk-v4BBeQdd.js";
import "react-dom/server";
import "vike/server";
import "unstated-next";
import "@trpc/client";
import "superjson";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryInput = {
      email,
      password
    };
    const loginResp = await trpc.auth.login.mutate(queryInput);
    if ((loginResp == null ? void 0 : loginResp.id) !== null && (loginResp == null ? void 0 : loginResp.id)) {
      console.log("navigating to page");
      window.location.href = `/@${loginResp == null ? void 0 : loginResp.id}`;
    }
  };
  const renderHeading = () => {
    return /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Log in to your Totoma" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Good to have you back!" })
    ] });
  };
  const renderContent = () => {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      renderHeading(),
      /* @__PURE__ */ jsx("div", { className: "flex items-center border-b border-gray-300 py-2 mb-4", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          id: "email",
          className: "appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none",
          value: email,
          onChange: handleEmailChange,
          placeholder: "Email Address"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center border-b border-gray-300 py-2 mb-4", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          className: "appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none",
          value: password,
          onChange: handlePasswordChange,
          placeholder: "Password"
        }
      ) }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700", children: "Sign In" }),
      /* @__PURE__ */ jsxs("div", { className: "text-left pt-5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 mr-1", children: "or" }),
        /* @__PURE__ */ jsx(Link, { href: "/signup", className: "text-sm font-medium text-black-800 hover:text-black", children: "Signup" })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center min-h-screen bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-xs w-full space-y-8", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: "w-full flex flex-col", children: renderContent() }) }) });
};
const import_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LoginPage
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
    importPath: "/src/pages/login/+Page.tsx",
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
