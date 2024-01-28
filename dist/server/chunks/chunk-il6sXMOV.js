import { jsx } from "react/jsx-runtime";
import ReactDOMServer from "react-dom/server";
import React, { useContext, useState } from "react";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import { createContainer } from "unstated-next";
const Context = React.createContext(void 0);
function PageContextProvider({ pageContext, children }) {
  return /* @__PURE__ */ jsx(Context.Provider, { value: pageContext, children });
}
function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
function PageShell({ children, pageContext }) {
  return /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(PageContextProvider, { pageContext, children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Content, { children }) }) }) });
}
function Layout({ children }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        margin: "auto"
      },
      children
    }
  );
}
function Content({ children }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        borderLeft: "2px solid #eee",
        minHeight: "100vh"
      },
      children
    }
  );
}
const logoUrl = "/assets/static/logo.Nv-y6PbV.svg";
function useAuth(initialState = null) {
  const [authData, setAuthData] = useState({ token: "gorillaToken" });
  const login = (data) => {
    setAuthData(data);
  };
  const logout = () => {
    setAuthData(null);
  };
  return { authData, login, logout };
}
const AuthContainer = createContainer(useAuth);
const onRenderHtml = async (pageContext) => {
  const { Page, pageProps } = pageContext;
  if (!Page)
    throw new Error("My render() hook expects pageContext.Page to be defined");
  const pageHtml = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(AuthContainer.Provider, { children: /* @__PURE__ */ jsx(PageShell, { pageContext, children: /* @__PURE__ */ jsx(Page, { ...pageProps }) }) })
  );
  const { documentProps } = pageContext.exports;
  const title = documentProps && documentProps.title || "Totoma";
  const desc = documentProps && documentProps.description || "Simple Profile for business";
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    }
  };
};
const import_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  onRenderHtml
}, Symbol.toStringTag, { value: "Module" }));
export {
  AuthContainer as A,
  import_0 as i,
  usePageContext as u
};
