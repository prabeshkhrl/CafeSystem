import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import UserDropdown from "./UserDropdown";
import AuthButtons from "./AuthButtons";
import MobileNav from "./MobileNav";
import IconButton from "../ui/IconButton";
import useAuthStore from "../../store/useAuthStore";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo />
          <DesktopNav user={user} />

          <div className="flex items-center gap-2">
            <SearchBar />
            <CartButton />
            {user ? <UserDropdown /> : <AuthButtons />}
            <IconButton
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </IconButton>
          </div>
        </div>
      </div>

      {mobileOpen && <MobileNav user={user} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}