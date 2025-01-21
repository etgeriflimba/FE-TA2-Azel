import { ContactCard } from "@/components/ContactCard";
import { IoCall, IoLocation, IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";

const ContactPage = () => {
  return (
    <main className="min-h-[80vh] pt-36 pb-10 bg-gray-100">
      {/* Hubungi Section */}
      <section>
        <div className="container mx-auto px-5 md:px-32">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-[#159030]">Hubungi Kami</h2>
            <p className="text-xs md:text-sm my-6">Hubungi kami untuk mendapatkan informasi seputar layanan di Klinik Putri</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ContactCard icon={IoCall} title="Nomor Telepon" description="+62 811-4814-142" />
              <ContactCard icon={IoLogoFacebook} title="Facebook" description="Klinik Putri Wamena" link="https://www.facebook.com/p/KLINIK-PUTRI-WAMENA-100066810593412/" />
              <ContactCard icon={IoLogoWhatsapp} title="WhatsApp" description="+62 811-4814-142" link="https://wa.me/+628114814142" />
              <ContactCard icon={IoLocation} title="Alamat" description="Jl. Trikora No.42, Wamena Kota." link="https://maps.app.goo.gl/BPf4HyvvP6REmsv98" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
