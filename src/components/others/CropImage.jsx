import { useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
};

const CropImage = ({
  isOpen,
  onClose,
  selectedImage,
  aspectRatio,
  onCropComplete,
}) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);
  const aspect = aspectRatio || undefined;

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result);
        document.querySelector('input[type="file"]').value = "";
      };
      reader.readAsDataURL(selectedImage);
    }
  }, [selectedImage]);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const handleCropConfirm = () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      const croppedImageFile = new File(
        [blob],
        `${blob.size}-${selectedImage.name}.png`,
        { type: "image/png" }
      );

      onCropComplete(croppedImageFile);
      handleClose();
    });
  };

  const handleClose = () => {
    setImgSrc(null);
    setCrop(null);
    setCompletedCrop(null);
    onClose();
  };

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader></DialogHeader>
        <DialogBody>
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop"
                src={imgSrc}
                style={{ maxWidth: "100%" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={handleCropConfirm}
            className="h-[30px] w-[100px] bg-teal-500 text-white rounded-md mt-4"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CropImage;
