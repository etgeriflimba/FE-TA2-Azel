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
import Spinner from "@/components/ui/spinner";

function generateTimeIntervals(waktuRanges, intervalMinutes = 30) {
    const timeIntervals = [];
  
    // Ensure waktuRanges is a string and split by `, ` for multiple ranges
    const ranges = waktuRanges.includes(", ") ? waktuRanges.split(", ") : [waktuRanges];
  
    // Iterate over each range
    ranges.forEach(range => {
      const [jamMulai, jamSelesai] = range.split(" - ");
  
      // Convert the start and end times to Date objects
      const startTime = new Date(`1970-01-01T${jamMulai}Z`);
      const endTime = new Date(`1970-01-01T${jamSelesai}Z`);
  
      let currentTime = new Date(startTime);
  
      while (currentTime <= endTime) {
        // Format the current time as HH:MM:SS
        const formattedTime = currentTime.toISOString().substr(11, 8);
        timeIntervals.push(formattedTime);
  
        // Increment the current time by the interval
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
      }
    });
  
    return timeIntervals;
  }

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

  function findMatchingId(data, chosenTime) {
    const chosenDate = new Date(`1970-01-01T${chosenTime}Z`);
  
    for (const item of data) {
      let [startTime, endTime] = item.waktu.split(" - ").map(time => new Date(`1970-01-01T${time}Z`));
  
      // Handle overnight ranges
      if (endTime < startTime) {
        // If the range spans midnight, adjust the end time to the next day
        endTime = new Date(endTime);
        endTime.setDate(endTime.getDate() + 1);
  
        // Adjust chosen time if it falls after midnight
        if (chosenDate < startTime) {
          chosenDate.setDate(chosenDate.getDate() + 1);
        }
      }
  
      // Check if the chosen time is within the range
      if (chosenDate >= startTime && chosenDate <= endTime) {
        return item.id; // Return the matching ID
      }
    }
  
    return null; // Return null if no match is found
  }

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

const ReservationUmumDetailPage = () => {
  const [reservation, setReservation] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
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
        setIsLoading(true)
      const reservationResponse = await axiosInstance.get("/v1/pasien/data/jadwal-dokter-umum");
      setReservation(reservationResponse.data.data);
    } catch (err) {
      console.log(err)
      if(isAxiosError(err)) {
        toast.error(err.response.data.message)
      }else if(err instanceof Error) {
        toast.error(err.message)  
      }
    } finally {
        setIsLoading(false)
    }
  };

  const handleReservation = async (values) => {
    try {
        const payload = {
            tanggal: format(values.date, "yyyy-MM-dd", { locale: localeId }),
            waktu: selectedTime,
            fk_dt_pasien: userSelector.id,
            fk_dt_jadwal_dokter_umum: findMatchingId(reservation, selectedTime),
            nama_pendaftar: values.name,
            umur: values.age,
            no_handphone: values.phone_number,
            address: values.address,
            gender: values.gender 
        }

        if(!selectedTime) {
            return
        }
      await axiosInstance.post("/v1/pasien/data/antrean", payload);

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
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) =>  date < new Date().setHours(0, 0, 0, 0)} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>

                  <div className="flex flex-col columns-5">
                    <SelectTime 
                        availableTimes={
                            generateTimeIntervals(mergeTimeRangesSimplified(reservation))
                        } 
                        onTimeSelect={handleTimeSelect} 
                    />
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
                  {isLoading
                    ? <Spinner />
                    : (
                        <Card className="w-2/3 flex flex-col mx-auto">
                            <CardHeader>
                                <CardTitle className="text-center text-lg">Umum</CardTitle>
                                <CardDescription />
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <p>Setiap hari</p>
                                <p>{
                                        mergeTimeRangesSimplified(reservation).includes(', ')
                                        ? mergeTimeRangesSimplified(reservation).split(', ').map((v, index) => (
                                            <span key={index}>
                                            {v}
                                            <br />
                                            </span>
                                        ))
                                        : mergeTimeRangesSimplified(reservation) === '00:00:00 - 23:59:59'
                                            ? '24 Jam'
                                            : mergeTimeRangesSimplified(reservation)
                                    }</p>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button onClick={form.handleSubmit(handleReservation)} className="w-full bg-[#159030] hover:bg-green-700">
                                    Buat Reservasi
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                  }
                </div>
              </Form>
            </div>
          </div>
        </section>
      </main>
    </SignedInPage>
  );
};

export default ReservationUmumDetailPage;
