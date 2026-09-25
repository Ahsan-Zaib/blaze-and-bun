import { useEffect, useState } from "react";
import { BranchPicker } from "./BranchPicker";
import { useStore } from "@/lib/store";

/** First-visit prompt: asks where the guest is ordering from, once. */
export function LocationGate() {
  const { ready, branchId } = useStore();
  const [open, setOpen] = useState(false);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (ready && !branchId && !asked) {
      const t = setTimeout(() => {
        setOpen(true);
        setAsked(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [ready, branchId, asked]);

  return <BranchPicker open={open} onOpenChange={setOpen} />;
}
