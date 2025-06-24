import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";

const EnlargeImage = ({ isOpen, onClose, source }) => {
  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
      size="lg"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <DialogBody>
          <figure className="h-[500px] w-full">
            <img
              src={source}
              alt="Enlarge"
              className="h-full w-full object-contain"
            />
          </figure>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EnlargeImage;
