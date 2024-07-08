import Input from "@/components/Input";
import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
        <Input />
      </main>
    </NextUIProvider>
  );
}
