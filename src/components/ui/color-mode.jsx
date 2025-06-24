// 'use client'

// import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
// import { ThemeProvider, useTheme } from 'next-themes'

// import { forwardRef } from 'react'
// import { LuMoon, LuSun } from 'react-icons/lu'

// export function ColorModeProvider(props) {
//   return (
//     <ThemeProvider attribute='class' disableTransitionOnChange {...props} />
//   )
// }

// export function useColorMode() {
//   const { resolvedTheme, setTheme } = useTheme()
//   const toggleColorMode = () => {
//     setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
//   }
//   return {
//     colorMode: resolvedTheme,
//     setColorMode: setTheme,
//     toggleColorMode,
//   }
// }

// export function useColorModeValue(light, dark) {
//   const { colorMode } = useColorMode()
//   return colorMode === 'light' ? light : dark
// }

// export function ColorModeIcon() {
//   const { colorMode } = useColorMode()
//   return colorMode === 'light' ? <LuSun /> : <LuMoon />
// }

// export const ColorModeButton = forwardRef(function ColorModeButton(props, ref) {
//   const { toggleColorMode } = useColorMode()
//   return (
//     <ClientOnly fallback={<Skeleton boxSize='8' />}>
//       <IconButton
//         onClick={toggleColorMode}
//         variant='ghost'
//         aria-label='Toggle color mode'
//         size='sm'
//         ref={ref}
//         {...props}
//         css={{
//           _icon: {
//             width: '5',
//             height: '5',
//           },
//         }}
//       >
//         <ColorModeIcon />
//       </IconButton>
//     </ClientOnly>
//   )
// })

// Using only light theme
"use client";

import { ClientOnly, IconButton, Skeleton } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { forwardRef } from "react";
import { LuSun } from "react-icons/lu";

// ColorModeProvider to enforce light mode
export function ColorModeProvider(props) {
  return <ThemeProvider attribute="class" enableSystem={false} {...props} />;
}

// Custom hook to get the current color mode (always light)
export function useColorMode() {
  return {
    colorMode: "light", // Always returns light
    setColorMode: () => {}, // No-op function
    toggleColorMode: () => {}, // No-op function
  };
}

// Function to return light value since we are only using light mode
export function useColorModeValue(light, dark) {
  return light; // Always returns the light value
}

// ColorModeIcon component to show the sun icon only
export function ColorModeIcon() {
  return <LuSun />;
}

// ColorModeButton component to display a button that does nothing on click
export const ColorModeButton = forwardRef(function ColorModeButton(props, ref) {
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={() => {}} // No-op click handler
        variant="ghost"
        aria-label="Color mode is always light"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});
