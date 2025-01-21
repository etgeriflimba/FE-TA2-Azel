import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMenu, IoCloseOutline, IoPersonOutline, IoLogOutOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { LucideHistory, LucideLayoutDashboard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const userSelector = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  const handleLogout = () => {
    localStorage.clear()

    dispatch({
      type: "USER_LOGOUT",
    });

    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    
  }, [])

  return (
    <header className="fixed w-full top-0 left-0 border-b bg-white z-10">
      <div className="container mx-auto flex justify-between items-center h-20 md:justify-around relative">
        {/* Logo */}
        <Link to="/">
          <img src="/logo.svg" alt="Logo" width={70} className="hidden md:block" />
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button className="md:hidden absolute top-0 left-0 p-4 text-2xl text-gray-500 focus:outline-none" onClick={toggleMenu} aria-label={menuOpen ? "Close Menu" : "Open Menu"}>
          {menuOpen ? <IoCloseOutline className="w-10 h-10" /> : <IoMenu className="w-10 h-10" />}
        </button>

        {/* Username & Avatar (Mobile) */}
        <div className="md:hidden absolute top-0 right-0 flex items-center p-4 space-x-2">
          {userSelector.id && (
            <>
              <p className="text-sm text-gray-700">{userSelector.username}</p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={userSelector.profile_url} />
                    <AvatarFallback />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel />
                  <DropdownMenuItem onClick={handleProfile}>
                    <IoPersonOutline />
                    Profil
                  </DropdownMenuItem>
                  {userSelector.role !== "Admin" ? null : (
                    <DropdownMenuItem onClick={handleDashboard}>
                      <LucideLayoutDashboard />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleHistory}>
                    <LucideHistory />
                    Riwayat Reservasi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <IoLogOutOutline className="text-red-500" />
                    <span className="text-red-500">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Navigation (Hidden on Mobile) */}
        <nav className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center md:space-x-6 absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0`}>
          <Link to="/" className={`${isActive("/") ? "text-[#159030]" : "text-gray-500"} font-medium hover:text-[#159030] py-2 md:py-0`} onClick={toggleMenu}>
            Beranda
          </Link>
          <Link to="/schedule" className={`${isActive("/schedule") ? "text-[#159030]" : "text-gray-500"} font-medium hover:text-[#159030] py-2 md:py-0`} onClick={toggleMenu}>
            Jadwal Dokter
          </Link>
          <Link to="/contact" className={`${isActive("/contact") ? "text-[#159030]" : "text-gray-500"} font-medium hover:text-[#159030] py-2 md:py-0`} onClick={toggleMenu}>
            Hubungi
          </Link>
        </nav>

        {/* Buttons (Desktop view) */}
        <div className="hidden md:flex space-x-4">
          {userSelector.id ? (
            <>
              {/* Avatar with dropdown menu */}
              <p className="my-auto">{userSelector.username}</p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={userSelector.profile_url} />
                    <AvatarFallback />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel />
                  <DropdownMenuItem onClick={handleProfile}>
                    <IoPersonOutline />
                    Profil
                  </DropdownMenuItem>
                  {userSelector.role !== "Admin" ? null : (
                    <DropdownMenuItem onClick={handleDashboard}>
                      <LucideLayoutDashboard />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleHistory}>
                    <LucideHistory />
                    Riwayat Reservasi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <IoLogOutOutline className="text-red-500" />
                    <span className="text-red-500">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="w-28 text-[#159030] hover:text-[#159030] border-[#159030]">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button className="w-28 bg-[#159030] hover:bg-green-700">Registrasi</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-24 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 p-4">
            <Link to="/" className={`${isActive("/") ? "text-[#159030]" : "text-gray-500"} font-medium hover:text-[#159030]`} onClick={toggleMenu}>
              Beranda
            </Link>
            <Link to="/schedule" className={`${isActive("/schedule") ? "text-[#159030]" : "text-gray-500"} font-medium hover:text-[#159030]`} onClick={toggleMenu}>
              Jadwal Dokter
            </Link>
            <Link to="/contact" className={`${isActive("/contact") ? "text-[#159030]" : "text-gray-500"} font-medium hover:text-[#159030]`} onClick={toggleMenu}>
              Hubungi
            </Link>
            {userSelector.id ? null : (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full text-[#159030] hover:text-[#159030] border-[#159030]">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button className="w-full bg-[#159030] hover:bg-green-700">Registrasi</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
