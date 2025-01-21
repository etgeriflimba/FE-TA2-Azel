import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IoAdd } from "react-icons/io5";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Link, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { isAxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

const ScheduleGeneralManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schedules, setSchedules] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [timeName, setTimeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(null);

  const handleNextPage = () => {
    searchParams.set("page", Number(searchParams.get("page")) + 1);

    setSearchParams(searchParams);
  };

  const handlePreviousPage = () => {
    searchParams.set("page", Number(searchParams.get("page")) - 1);

    setSearchParams(searchParams);
  };

  const searchDoctor = () => {
    if (timeName) {
      searchParams.set("search", timeName);

      setSearchParams(searchParams);
    } else {
      searchParams.delete("search");

      setSearchParams(searchParams);
    }
  };

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);

      const scheduleResponse = await axiosInstance.get("/v1/admin/data/jadwal-dokter-umum", {
        params: {
          per_page: 5,
          page: Number(searchParams.get("page")),
          waktu: searchParams.get("search"),
        },
      });

      setHasNextPage(Boolean(scheduleResponse.data.hasNext));
      setSchedules(scheduleResponse.data.data);
      setLastPage(scheduleResponse.data.last);
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

  // Mount & Update
  useEffect(() => {
    if (searchParams.get("page")) {
      fetchSchedules();
    }
  }, [searchParams.get("page"), searchParams.get("search")]);

  // Mount & Update
  useEffect(() => {
    if (!searchParams.get("page") || Number(searchParams.get("page")) < 1) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    } else if (lastPage && Number(searchParams.get("page")) > lastPage) {
      searchParams.set("page", lastPage);
      setSearchParams(searchParams);
    }
  }, [lastPage]);

  return (
    <AdminLayout
      title="Jadwal Dokter Umum"
      rightSection={
        <Link to="/admin/schedule/general/create">
          <Button className="w-28 bg-[#159030] hover:bg-green-700 mt-5 md:mt-0">
            <IoAdd className="h-6 w-6 mr-2" />
            Tambah
          </Button>
        </Link>
      }
    >
      <Toaster position="top-center" />
      {/* Search */}
      <div className="mb-8">
        <Label>Cari Waktu</Label>
        <div className="flex gap-4">
          <Input value={timeName} onChange={(e) => setTimeName(e.target.value)} className="w-[250px] lg:w-[400px]" placeholder="Cari waktu..." />
          <Button onClick={searchDoctor} className="bg-[#159030] hover:bg-green-700">
            Cari
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table className="p-4 text-center border rounded-md">
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
            <TableHead className="text-center text-black">Aksi</TableHead>
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
            {schedules.map((schedule) => {
              return (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.waktu}</TableCell>
                  <TableCell>{schedule.senin_by_dokter_nama}</TableCell>
                  <TableCell>{schedule.selasa_by_dokter_nama}</TableCell>
                  <TableCell>{schedule.rabu_by_dokter_nama}</TableCell>
                  <TableCell>{schedule.kamis_by_dokter_nama}</TableCell>
                  <TableCell>{schedule.jumat_by_dokter_nama}</TableCell>
                  <TableCell>{schedule.sabtu_by_dokter_nama}</TableCell>
                  <TableCell>{schedule.minggu_by_dokter_nama}</TableCell>
                  <TableCell>
                    <Link to={"/admin/schedule/general/edit/" + schedule.id}>
                      <Button variant="outline" size="icon" className="text-white hover:text-white bg-[#159030] hover:bg-green-700">
                        <Edit className="h-6 w-6" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>

      {/* Pagination */}
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <Button disabled={searchParams.get("page") == 1} onClick={handlePreviousPage} variant="ghost">
              <ChevronLeft className="w-6 h-6 mr-2" />
              Sebelumnya
            </Button>
          </PaginationItem>

          <PaginationItem className="mx-8 font-semibold">Halaman {searchParams.get("page")}</PaginationItem>

          <PaginationItem>
            <Button disabled={!hasNextPage} onClick={handleNextPage} variant="ghost">
              Berikutnya <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </AdminLayout>
  );
};

export default ScheduleGeneralManagementPage;
