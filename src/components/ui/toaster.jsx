function _optionalChain(ops) {
  let lastAccessLHS = undefined;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return undefined;
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = undefined;
    }
  }
  return value;
}
("use client");

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Text,
  Toast,
  createToaster,
  Image,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
  max: 3,
  duration: 3000,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root
            width={{ md: "sm" }}
            height={toast.image ? "auto" : "default"}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            {/* Image Section */}
            {toast.image && (
              <Image
                src={toast.image}
                alt="Toast Image"
                borderRadius="md"
                mb="2"
                maxWidth="100%"
              />
            )}

            {/* Loading Indicator or Toast Indicator */}
            {toast.type === "loading" ? (
              <Spinner size="sm" colorPalette="teal" color="teal.600" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && (
                <Toast.Title fontWeight="bold">{toast.title}</Toast.Title>
              )}
              {toast.description && (
                <Toast.Description>
                  <Text whiteSpace="pre-wrap" wordBreak="break-word">
                    {toast.description}
                  </Text>
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {_optionalChain([
              toast,
              "access",
              (_) => _.meta,
              "optionalAccess",
              (_2) => _2.closable,
            ]) && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
