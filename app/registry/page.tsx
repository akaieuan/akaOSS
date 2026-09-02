import type { Metadata } from "next";
import { InstallGuide } from "@/components/features/registry/install-guide";

export const metadata: Metadata = {
  title: "Registry · akaOSS",
  description:
    "Install any HITL Kit primitive with the shadcn CLI: the registry index, one command per component, and the accent tokens your globals.css needs first.",
};

export default function RegistryPage() {
  return <InstallGuide />;
}
