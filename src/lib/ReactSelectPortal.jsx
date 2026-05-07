/**
 * Drop-in wrapper for react-select that renders menus into document.body.
 * This prevents sticky table headers from covering the open dropdown menu.
 *
 * Aliased as "react-select" in vite.config.js so every existing
 * `import Select from "react-select"` picks this up automatically.
 *
 * Uses "react-select/base" to avoid a circular alias import.
 */
import BaseSelect from "react-select/base";

const Select = ({ styles, ...props }) => (
  <BaseSelect
    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
    menuPosition="fixed"
    styles={{
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      ...styles,
    }}
    {...props}
  />
);

export default Select;
