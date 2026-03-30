"use client";

import { CommandPalette, useCommandPalette } from "./CommandPalette";

export function CommandPaletteWrapper() {
  const { open, setOpen } = useCommandPalette();
  return <CommandPalette open={open} onClose={() => setOpen(false)} />;
}
