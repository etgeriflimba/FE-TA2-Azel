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

const DoctorManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [doctorName, setDoctorName] = useState("");
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
    if (doctorName) {
      searchParams.set("search", doctorName);

      setSearchParams(searchParams);
    } else {
      searchParams.delete("search");

      setSearchParams(searchParams);
    }
  };

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);

      const doctorResponse = await axiosInstance.get("/v1/admin/data/dokter", {
        params: {
          per_page: 5,
          page: Number(searchParams.get("page")),
          name: searchParams.get("search"),
        },
      });

      setHasNextPage(Boolean(doctorResponse.data.hasNext));
      setDoctors(doctorResponse.data.data);
      setLastPage(doctorResponse.data.last);
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
      fetchDoctors();
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
      title="Daftar Dokter Spesialis"
      rightSection={
        <Link to="/admin/doctor/create">
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
        <Label>Cari Nama Dokter</Label>
        <div className="flex gap-4">
          <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-[250px] lg:w-[400px]" placeholder="Cari dokter..." />
          <Button onClick={searchDoctor} className="bg-[#159030] hover:bg-green-700">
            Cari
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table className="p-4 text-center border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-black">No</TableHead>
            <TableHead className="text-center text-black">Spesialisasi</TableHead>
            <TableHead className="text-center text-black">Nama Dokter</TableHead>
            <TableHead className="text-center text-black">Status</TableHead>
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
            {doctors.map((doctor, index) => {
              return (
                <TableRow key={doctor.id}>
                  <TableCell>{(Number(searchParams.get("page")) - 1) * 5 + index + 1}</TableCell>
                  <TableCell>{doctor.spesialisasi || '-'}</TableCell>
                  <TableCell>{doctor.nama}</TableCell>
                  <TableCell>{doctor.aktif ? 'Aktif' : 'Tidak Aktif'}</TableCell>
                  <TableCell>
                    <Link to={"/admin/doctor/edit/" + doctor.id}>
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

export default DoctorManagementPage;
