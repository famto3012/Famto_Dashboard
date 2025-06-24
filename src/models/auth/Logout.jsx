import { useContext } from "react";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import AuthContext from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = ({ isOpen, onClose }) => {
  const { clearStorage } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold">
            Logout
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Are you sure that you want to logout?</DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => clearStorage()}
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default Logout;
