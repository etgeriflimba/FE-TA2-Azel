import { IoCall, IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:h-36 px-5 md:px-32 py-6 md:py-0 text-gray-500">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <img src="/logo.svg" alt="Logo" width={70} className="mb-3 mx-auto md:mx-0" />
          <p>
            Jl. Trikora No.42, Wamena Kota, Distrik <br /> Wamena, Kabupaten Jayawijaya, Papua.
          </p>
        </div>

        <div className="text-center md:text-left mb-6 md:mb-0">
          <h4 className="text-xl font-semibold mb-3 text-[#159030]">Menu</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="hover:text-[#159030]">
              Beranda
            </Link>
            <Link to="/schedule" className="hover:text-[#159030]">
              Jadwal Dokter
            </Link>
            <Link to="/contact" className="hover:text-[#159030]">
              Hubungi
            </Link>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h4 className="text-xl font-semibold mb-3 text-[#159030]">Hubungi Kami</h4>
          <div className="flex flex-col gap-2">
            <p className="flex justify-center md:justify-start items-center">
              <IoCall className="w-6 h-6 mr-2" />
              +62 811-4814-142
            </p>
            <p className="flex justify-center md:justify-start items-center">
              <IoLogoWhatsapp className="w-6 h-6 mr-2" />
              +62 811-4814-142
            </p>
            <p className="flex justify-center md:justify-start items-center">
              <IoLogoFacebook className="w-6 h-6 mr-2" />
              Klinik Putri Wamena
            </p>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto flex justify-center items-center h-16 text-center px-5">
          <p>
            <span className="font-semibold">2024 Klinik Putri Wamena</span> - All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
