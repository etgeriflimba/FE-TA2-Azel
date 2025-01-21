import { ReservationCard } from "@/components/ReservationCard";
import { ReservationGeneralCard } from "@/components/ReservationGeneralCard";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { axiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


function mergeTimeRangesSimplified(data) {
  const MAX_TIME = "23:59:59";
  const MIN_TIME = "00:00:00";

  // Extract and normalize time ranges
  const ranges = data.flatMap(item => {
    const waktu = item.waktu.split(" - ");
    if (!waktu[0] || !waktu[1]) {
      console.error(`Invalid waktu: ${item.waktu}`);
      return [];
    }
    const [start, end] = waktu;
    if (start > end) {
      // Handle overnight range
      return [
        { start, end: MAX_TIME },
        { start: MIN_TIME, end },
      ];
    } else {
      return { start, end };
    }
  });

  ranges.sort((a, b) => a.start.localeCompare(b.start));

  // Merge ranges
  const merged = [];
  ranges.forEach(range => {
    if (merged.length === 0 || merged[merged.length - 1].end < range.start) {
      merged.push(range);
    } else {
      merged[merged.length - 1].end = range.end;
    }
  });

  // Simplify to full day if applicable
  if (merged.length === 1 && merged[0].start === MIN_TIME && merged[0].end === MAX_TIME) {
    return `${MIN_TIME} - ${MAX_TIME}`;
  }

  return merged.map(range => `${range.start} - ${range.end}`).join(", ");
}

const HomePage = () => {
  const scrollToService = (e) => {
    e.preventDefault();
    const section = document.getElementById("service");
    section.scrollIntoView({ behavior: "smooth" });
  };

  const [reservations, setReservations] = useState([]);
  const [reservationUmum, setReservationUmum] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReservationUmum, setIsLoadingReservationUmum] = useState(false)

  const reservationsList = reservations.map((reservation) => {
    return <ReservationCard key={reservation.id} id={reservation.id} image={`${import.meta.env.VITE_API_URL}/v1/public/layanan-spesialisasi/foto/${reservation.id}`} specialization={reservation.nama} desc_day={reservation.hari} desc_time={reservation.waktu} status={reservation.status} />;
  });

  const fetchReservations = async () => {
    try {
      setIsLoading(true);

      const reservationsResponse = await axiosInstance.get("/v1/public/data/layanan-spesialisasi");

      setReservations(reservationsResponse.data.data);
    } catch (err) {
      console.log(err)
      if(isAxiosError(err)) {
        toast.error(err.response.data.message)
      }else if(err instanceof Error) {
        toast.error(err.message)  
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReservationsUmum = async () => {
    try {
      setIsLoadingReservationUmum(true);

      const reservationsResponse = await axiosInstance.get("/v1/public/data/jadwal-dokter-umum");

      setReservationUmum(reservationsResponse.data.data);
    } catch (err) {
      console.log(err)
      if(isAxiosError(err)) {
        toast.error(err.response.data.message)
      }else if(err instanceof Error) {
        toast.error(err.message)  
      }
    } finally {
      setIsLoadingReservationUmum(false);
    }
  }

  // Mount
  useEffect(() => {
    fetchReservations();
    fetchReservationsUmum()
  }, []);

  return (
    <main className="min-h-[80vh] pt-36 pb-10 bg-gray-100">
      {/* Hero Section */}
      <section>
        <div className="container mx-auto px-5 md:px-32">
          <div className="flex flex-wrap justify-center items-center rounded-lg py-10 bg-[#159030]">
            <div className="w-full md:w-1/2 px-5 md:px-0">
              <h1 className="text-xl md:text-4xl font-bold text-white">Reservasi Dokter dari Rumah, Lebih Mudah dan Cepat</h1>
              <p className="my-4 md:my-6 text-[12px] md:text-lg text-white">
                Akses layanan reservasi dokter kapan saja, dari mana <br /> saja, tanpa harus ke klinik.
              </p>
              <a href="#service">
                <Button onClick={scrollToService} className="w-52 text-[#159030] bg-white hover:bg-gray-200">
                  Lihat Spesialisasi
                </Button>
              </a>
            </div>

            <div className="w-full md:w-1/3">
              <img src="/main.svg" alt="Main" width={300} className="mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Spesialisasi Section */}
      <section id="service">
        <div className="container mx-auto px-5 md:px-32">
          <div className="flex flex-col">
            <h2 className="flex justify-center items-center text-2xl font-semibold pt-20 pb-5 text-[#159030]">Layanan Spesialisasi</h2>

            <div className="flex flex-wrap justify-center items-center columns-3 gap-5">
              {isLoading 
                ? <Spinner /> 
                : <>
                    {reservationsList}
                    {isLoadingReservationUmum
                      ? <Spinner />
                      : reservationUmum.length > 0
                        && <ReservationGeneralCard image={`/umum.png`} specialization={'Umum'} desc_day={'Setiap hari'} 
                          desc_time={
                            mergeTimeRangesSimplified(reservationUmum).includes(', ')
                              ? mergeTimeRangesSimplified(reservationUmum).split(', ').map(v => (
                                <>
                                  {v}
                                  <br />
                                </>
                              ))
                              : mergeTimeRangesSimplified(reservationUmum) === '00:00:00 - 23:59:59'
                                ? '24 Jam'
                                : mergeTimeRangesSimplified(reservationUmum)
                          } 
                          
                        />
                    }
                  </>
              }
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
