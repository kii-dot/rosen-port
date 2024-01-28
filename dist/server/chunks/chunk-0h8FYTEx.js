import { jsx } from "react/jsx-runtime";
import { u as usePageContext } from "./chunk-il6sXMOV.js";
function Link(props) {
  const pageContext = usePageContext();
  const className = [props.className, pageContext.urlPathname === props.href && "is-active"].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("a", { ...props, className });
}
export {
  Link as L
};
