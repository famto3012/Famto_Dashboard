import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";

const DeleteAddress = ({ isOpen, onClose, onConfirmDelete }) => {
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
          <DialogTitle className="font-[600] text-[18px]">
            Confirm Delete
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div>
            <div className="flex items-center">
              <p>Are you sure that you want to delete this address?</p>
            </div>
            <div className="flex justify-end gap-4 mt-5">
              <button
                className="bg-cyan-50 py-2 px-4 rounded-md"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-md"
                onClick={onConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteAddress;
