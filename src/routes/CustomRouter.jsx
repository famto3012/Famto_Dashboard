import { BrowserRouter } from "react-router-dom";

const CustomRouter = ({ children }) => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
    </BrowserRouter>
  );
};

export default CustomRouter;
