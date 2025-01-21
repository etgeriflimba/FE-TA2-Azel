import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import SelectTime from "@/components/SelectTime";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { SignedInPage } from "@/components/guard/SignedInPage";
import { AxiosError, isAxiosError } from "axios";
import { parse, isWithinInterval } from "date-fns";

function generateTimeIntervals(jamMulai, jamSelesai, intervalMinutes = 30) {
  // Convert the start and end times to Date objects
  const startTime = new Date(`1970-01-01T${jamMulai}Z`);
  const endTime = new Date(`1970-01-01T${jamSelesai || '23:59'}Z`);

  const timeIntervals = [];

  // Normalize the start time to the next interval boundary
  const normalizedStartMinutes = Math.ceil(startTime.getMinutes() / intervalMinutes) * intervalMinutes;
  startTime.setMinutes(normalizedStartMinutes);
  startTime.setSeconds(0);

  let currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    // Format the current time as HH:MM:SS
    const formattedTime = currentTime.toISOString().substr(11, 8);
    timeIntervals.push(formattedTime);

    // Increment the current time by the interval
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }

  return timeIntervals;
}

const getAllowedDays = (hari) => {
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  if (hari.includes("-")) {
    // Handle range, e.g., "Senin - Kamis"
    const [startDay, endDay] = hari.split(" - ").map((d) => dayNames.indexOf(d.trim()));
    return Array.from({ length: 7 }, (_, i) => i).filter(
      (day) => isWithinInterval(day, { start: startDay, end: endDay })
    );
  } else {
    // Handle single day, e.g., "Senin"
    return [dayNames.indexOf(hari)];
  }
};

const reservasiFormSchema = z.object({
  date: z.date({
    required_error: "Hari reservasi dokter diperlukan",
  }),
  name: z
    .string()
    .min(3, "Nama terlalu pendek")
    .max(50, "Nama terlalu panjang")
    .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),
  age: z.string().min(1, "Umur harus diisi").max(3, "Umur tidak boleh lebih dari 3 digit"),
  phone_number: z
    .string()
    .min(10, "Nomor telepon terlalu pendek")
    .max(15, "Nomor telepon terlalu panjang")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
  address: z.string().nonempty("Alamat tidak boleh kosong"),
  gender: z.string().nonempty("Silakan pilih jenis kelamin"),
});

const ReservationDetailPage = () => {
  const params = useParams();
  const [reservation, setReservation] = useState({
    id: "",
    img: "",
    specialization: "",
    desc_day: "",
    desc_time: "",
    available_times: [],
    reserved_dates: [],
  });
  const [selectedTime, setSelectedTime] = useState(null);
  const userSelector = useSelector((state) => state.user);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      age: "",
      phone_number: "",
      address: "",
      gender: "",
    },
    resolver: zodResolver(reservasiFormSchema),
  });

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const fetchReservations = async () => {
    try {
      const reservationResponse = await axiosInstance.get("/v1/pasien/data/layanan-spesialisasi/" + params.reservationId);
      setReservation(reservationResponse.data.data);
    } catch (err) {
      console.log(err)
      if(isAxiosError(err)) {
        toast.error(err.response.data.message)
      }else if(err instanceof Error) {
        toast.error(err.message)  
      }
    }
  };

  const handleReservation = async (values) => {
    try {
      await axiosInstance.post("/v1/pasien/data/antrean", {
        tanggal: format(values.date, "yyyy-MM-dd", { locale: localeId }),
        waktu: selectedTime,
        fk_dt_pasien: userSelector.id,
        fk_dt_layanan_spesialisasi: reservation.id,
        nama_pendaftar: values.name,
        umur: values.age,
        no_handphone: values.phone_number,
        address: values.address,
        gender: values.gender 
      });

      toast.success("Berhasil membuat reservarsi");
      form.reset();
      setTimeout(() => {
        navigate("/history");
      }, 2000);
    } catch (err) {
      console.log(err)
      if(isAxiosError(err)) {
        toast.error(err.response.data.message)
      }else if(err instanceof Error) {
        toast.error(err.message)  
      }
    }
  };

  // Mount
  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <SignedInPage>
      <main className="min-h-[80vh] pt-20 pb-10 bg-gray-100">
        {/* Toaster */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Reservation Header Section */}
        <section className="bg-[#159030] text-white py-10">
          <div className="container mx-auto px-5 md:px-32 text-center">
            <h2 className="text-2xl font-semibold mb-5">Detail Spesialis</h2>

            {/* Breadcrumb */}
            <Breadcrumb className="flex justify-center items-center">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-bold">Detail Spesialis</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Reservation Content Section */}
        <section>
          <div className="container mx-auto px-5 md:px-32 mt-10">
            <div className="flex flex-wrap">
              <Form {...form}>
                <div className="w-full md:w-1/2">
                  <h2 className="font-semibold mb-3 text-[#159030]">Tanggal dan Waktu Konsultasi</h2>

                  {/* Popover & Calendar */}
                  <form onSubmit={form.handleSubmit(handleReservation)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel />
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={`w-[240px] pl-3 text-left font-normal border-[#159030] text-[#159030] bg-white hover:bg-[#159030] hover:text-white`}>
                                  {field.value ? format(field.value, "dd-MM-yyyy", { locale: localeId }) : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => !getAllowedDays(reservation.hari).includes(date.getDay()) || date < new Date("1900-01-01")} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>

                  <div className="flex flex-col columns-5">
                    <SelectTime availableTimes={generateTimeIntervals(reservation.jam_mulai, reservation.jam_selesai)} onTimeSelect={handleTimeSelect} />
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <h2 className="font-semibold mb-3 text-[#159030] text-center mt-3 md:mt-0">Data Pasien</h2>

                  <div className="w-full md:w-1/2 flex flex-col mx-auto mb-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#159030]">Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan Nama Lengkap" {...field} />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#159030]">Umur</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan Umur" {...field} />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#159030]">Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan Nomor Telepon" {...field} />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#159030]">Alamat</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan Alamat" {...field} />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="gender" className="text-[#159030]">
                            Jenis Kelamin
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                              <SelectTrigger id="gender">
                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel />
                                  <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Card */}
                  <Card className="w-2/3 flex flex-col mx-auto">
                    <CardHeader>
                      <CardTitle className="text-center text-lg">{reservation.nama}</CardTitle>
                      <CardDescription />
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <p>{reservation.hari}</p>
                      <p>{reservation.waktu}</p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button onClick={form.handleSubmit(handleReservation)} className="w-full bg-[#159030] hover:bg-green-700">
                        Buat Reservasi
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </Form>
            </div>
          </div>
        </section>
      </main>
    </SignedInPage>
  );
};

export default ReservationDetailPage;
