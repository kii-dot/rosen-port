import { i as import_0 } from "../chunks/chunk-il6sXMOV.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { L as Link } from "../chunks/chunk-0h8FYTEx.js";
import { useState } from "react";
import { s as siteNameWithBackSlash } from "../chunks/chunk-YOzD_9do.js";
import classNames from "classnames";
import { createClient } from "@supabase/supabase-js";
import { t as trpc } from "../chunks/chunk-v4BBeQdd.js";
import "react-dom/server";
import "vike/server";
import "unstated-next";
import "@trpc/client";
import "superjson";
function icOutlineCheck(props) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "1.2em", height: "1.2em", ...props, children: /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" }) });
}
function icBaselineArrowBackIos(props) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "1.2em", height: "1.2em", ...props, children: /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M11.67 3.87L9.9 2.1L0 12l9.9 9.9l1.77-1.77L3.54 12z" }) });
}
function Button({ onClick, disabled, children, className, disabledClassName }) {
  const isDisabledClass = "bg-blue-500 text-white opacity-50 cursor-not-allowed";
  const isActive = "bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700";
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: classNames({
        [isDisabledClass]: disabled,
        [isActive]: !disabled,
        [className]: !disabled,
        [disabledClassName]: disabled
      }),
      type: "button",
      onClick,
      disabled,
      children
    }
  );
}
const supabase = createClient(
  "https://ixhtcilggaakdcfecpep.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4aHRjaWxnZ2Fha2RjZmVjcGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM3NTA2MDQsImV4cCI6MjAxOTMyNjYwNH0.5z08n4W8zKmSrHz0-7rQFLf1xg6vqyqV4US0-472qGc"
);
const fetchData = async (table, select, eqCol, eqTo) => {
  const { data, error } = await supabase.from(table).select(select).eq(eqCol, eqTo);
  return { data, error };
};
const DB_TYPE = {
  uuid: "uuid",
  varchar: "varchar",
  timestamp: "timestampz"
};
const DbConstants = {
  handles: {
    name: "handles",
    columns: {
      id: {
        name: "id",
        type: DB_TYPE.uuid
      },
      handle: {
        name: "handle",
        type: DB_TYPE.varchar
      },
      created_at: {
        name: "created_at",
        type: DB_TYPE.timestamp
      }
    }
  }
};
const checkHandle = async (handle) => {
  const { data, error } = await fetchData(
    DbConstants.handles.name,
    DbConstants.handles.columns.id.name,
    DbConstants.handles.columns.handle.name,
    handle
  );
  return { data, error };
};
const ClaimLinkPage = () => {
  const [userHandle, setUserHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHandleAvailable, setIsHandleAvailable] = useState(false);
  const [isHandlePage, setIsHandlePage] = useState(true);
  const handleLinkChange = async (event) => {
    const regex = /^[a-zA-Z0-9_.-]*$/;
    if (regex.test(event.target.value)) {
      setUserHandle(event.target.value.toLowerCase());
      await isValidLink(event.target.value);
    }
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onBackClick = () => {
    setIsHandlePage(true);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const queryInput = {
        handle: userHandle,
        email,
        password
      };
      const handleResp = await trpc.auth.createHandle.mutate(queryInput);
      console.log("handle added:", handleResp);
      if (handleResp.data !== null && handleResp.data[0].handle === userHandle) {
        const userProfile = `/@${userHandle}`;
        console.log("We're navigating to" + userProfile);
        window.location.href = userProfile;
      }
    } catch (error) {
      console.error("Error adding handle:", error);
    }
  };
  const isValidLink = async (userHandle2) => {
    await checkHandle(userHandle2).then((response) => {
      if (response.data !== null && response.data.length === 0) {
        setIsHandleAvailable(true);
      } else {
        setIsHandleAvailable(false);
      }
    });
  };
  const renderHandlePage = () => {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-2", children: "First, claim your unique link" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-gray-700", children: "The good ones are still available!" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b border-gray-300 py-2 mb-4 px-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
          siteNameWithBackSlash,
          "@"
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none h-8",
            value: userHandle,
            onChange: handleLinkChange,
            placeholder: "your-name"
          }
        ),
        isHandleAvailable && /* @__PURE__ */ jsx(icOutlineCheck, { className: "text-green-500 h-8 w-8" })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          className: "bg-black text-white text-base py-2 px-4 rounded",
          onClick: () => setIsHandlePage(false),
          disabled: !isHandleAvailable,
          disabledClassName: "bg-gray-500 py-2 px-4 rounded",
          children: "Grab my Link"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "text-left pt-5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 mr-1", children: "or" }),
        /* @__PURE__ */ jsx(Link, { href: "/login", className: "text-sm font-medium text-black-800 hover:text-black", children: "Login" })
      ] })
    ] });
  };
  const renderUserDetailsPage = () => {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("button", { onClick: onBackClick, className: "w-7 justify-left mb-3 py-2 pr-2 rounded", children: /* @__PURE__ */ jsx(icBaselineArrowBackIos, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxs("p", { className: "mb-6 text-gray-700", children: [
        siteNameWithBackSlash,
        "@",
        userHandle,
        " is yours!"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-2", children: "Let's create your account." }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-gray-700", children: "We'll need your phone number and email for registration" }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center border-b border-gray-300 py-2 mb-4", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          id: "email",
          className: "appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none",
          value: email,
          onChange: handleEmailChange,
          placeholder: "email"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center border-b border-gray-300 py-2 mb-4", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          className: "appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none",
          value: password,
          onChange: handlePasswordChange,
          placeholder: "password"
        }
      ) }),
      /* @__PURE__ */ jsx("button", { className: "bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700", type: "submit", children: "Create Account" })
    ] });
  };
  const renderPage = () => {
    if (isHandlePage) {
      return renderHandlePage();
    } else {
      return renderUserDetailsPage();
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center min-h-screen bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-xs w-full space-y-8", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: "w-full flex flex-col", children: renderPage() }) }) });
};
const import_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ClaimLinkPage
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
    importPath: "/src/pages/signup/+Page.tsx",
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
