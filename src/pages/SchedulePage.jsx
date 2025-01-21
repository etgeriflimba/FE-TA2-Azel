import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { axiosInstance } from "@/lib/axios";
import { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SchedulePage = () => {
  const [scheduleGeneral, setSheduleGeneral] = useState([]);
  const [scheduleSpecialization, setScheduleSpecialization] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchScheduleGeneral = async () => {
    try {
      setIsLoading(true);

      const scheduleResponse = await axiosInstance.get("/v1/public/data/jadwal-dokter-umum");

      setSheduleGeneral(scheduleResponse.data.data);
    } catch (err) {
      if(err instanceof Error) {
        console.log(err.stack);
        toast.error(err.message)
      }else if(err instanceof AxiosError) {
        console.log(err.response.data.debug)
        console.log(err.response.data.message)
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScheduleSpecialization = async () => {
    try {
      setIsLoading(true);

      const scheduleResponse = await axiosInstance.get("/v1/public/data/jadwal-dokter-spesialis");

      setScheduleSpecialization(scheduleResponse.data.data);
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

  // Mount
  useEffect(() => {
    fetchScheduleGeneral();
    fetchScheduleSpecialization();
  }, []);

  return (
    <main className="min-h-[80vh] pt-36 pb-10 bg-gray-100">
      {/* Dokter Umum & Spesialis Section */}
      <section>
        <div className="container mx-auto px-5 md:px-32">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-[#159030]">Dokter Umum</h2>
            <p className="text-xs md:text-sm my-6">Jadwal Dokter Umum 25 November - 1 Desember 2024</p>

            {/* Table */}
            <Table className="border text-center">
              <TableCaption />
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center text-black">Waktu (WIT)</TableHead>
                  <TableHead className="text-center text-black">Senin</TableHead>
                  <TableHead className="text-center text-black">Selasa</TableHead>
                  <TableHead className="text-center text-black">Rabu</TableHead>
                  <TableHead className="text-center text-black">Kamis</TableHead>
                  <TableHead className="text-center text-black">Jumat</TableHead>
                  <TableHead className="text-center text-black">Sabtu</TableHead>
                  <TableHead className="text-center text-black">Minggu</TableHead>
                </TableRow>
              </TableHeader>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : (
                <TableBody>
                  {scheduleGeneral.map((schedule, index) => (
                    <TableRow key={`general-${schedule.id}-${index}`}>
                      <TableCell>{schedule.waktu}</TableCell>
                      <TableCell>{schedule.senin_by_dokter_nama}</TableCell>
                      <TableCell>{schedule.selasa_by_dokter_nama}</TableCell>
                      <TableCell>{schedule.rabu_by_dokter_nama}</TableCell>
                      <TableCell>{schedule.kamis_by_dokter_nama}</TableCell>
                      <TableCell>{schedule.jumat_by_dokter_nama}</TableCell>
                      <TableCell>{schedule.sabtu_by_dokter_nama}</TableCell>
                      <TableCell>{schedule.minggu_by_dokter_nama}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>

          <div className="flex flex-col justify-center items-center pt-10">
            <h2 className="text-2xl font-semibold text-[#159030]">Dokter Spesialis</h2>
            <p className="text-xs md:text-sm my-6">Jadwal Dokter Spesialis Tahun 2024</p>

            {/* Table */}
            <Table className="border text-center">
              <TableCaption />
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center text-black">Spesialis</TableHead>
                  <TableHead className="text-center text-black">Nama Dokter</TableHead>
                  <TableHead className="text-center text-black">Hari</TableHead>
                  <TableHead className="text-center text-black">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : (
                <TableBody>
                  {scheduleSpecialization.map((schedule, index) => (
                    <TableRow key={`general-${schedule.id}-${index}`}>
                      <TableCell>{schedule.spesialisasi}</TableCell>
                      <TableCell>{schedule.nama}</TableCell>
                      <TableCell>{schedule.hari}</TableCell>
                      <TableCell>{schedule.waktu}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SchedulePage;
