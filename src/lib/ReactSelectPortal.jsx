/**
 * Drop-in wrapper for react-select that renders menus into document.body.
 * This prevents sticky table headers and scroll containers from covering
 * the open dropdown menu.
 *
 * Aliased as "react-select" in vite.config.js so every existing
 * `import Select from "react-select"` picks this up automatically.
 *
 * Uses "real-react-select" (a second alias pointing to the actual package)
 * to avoid a circular alias loop.
 */
import RealSelect, { components } from "real-react-select";

const Select = ({ styles, ...props }) => (
  <RealSelect
    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
    menuPosition="fixed"
    styles={{
      menuPortal: (base) => ({
        ...base,
        zIndex: 2147483647,
        pointerEvents: "auto",
      }),
      ...styles,
    }}
    {...props}
  />
);

export { components };
export default Select;
