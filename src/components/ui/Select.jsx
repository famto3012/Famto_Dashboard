import OriginalSelect from "react-select";

const Select = ({ styles, ...props }) => (
  <OriginalSelect
    menuPortalTarget={document.body}
    menuPosition="fixed"
    styles={{
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      ...styles,
    }}
    {...props}
  />
);

export default Select;
