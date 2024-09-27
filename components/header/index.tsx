import { Link } from "next-view-transitions";

import { Button } from "@/components/ui/button";

import { LuGithub } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";

import Logo from "@/assets/logo.svg";

export default function Header() {
  return (
    <header className="max-w-5xl mx-auto flex justify-between items-center my-5">
      <Link href="/" className="cursor-pointer">
        <Logo />
      </Link>
      <nav className="hidden md:flex items-center gap-3">
        <Link href="/readme">
          <Button variant="link">Readme</Button>
        </Link>
        <Link href="/roadmap">
          <Button variant="link">Roadmap</Button>
        </Link>
        <Link href="/playground">
          <Button className="rounded-full">Open Playground</Button>
        </Link>
        <Link href="https://github.com/hasanharman/form-builder" target="_blank">
          <Button variant="outline" className="rounded-full p-2">
            <LuGithub className="text-lg" />
          </Button>
        </Link>
        <Link href="https://x.com/strad3r" target="_blank">
          <Button variant="outline" className="rounded-full p-2">
            <FaXTwitter className="text-lg" />
          </Button>
        </Link>
      </nav>
    </header>
  );
}
