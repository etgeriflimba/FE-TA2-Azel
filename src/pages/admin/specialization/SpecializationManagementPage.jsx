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

const SpecializationManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reservations, setReservations] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [specializationName, setSpecializationName] = useState("");
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

  const searchSpecialization = () => {
    if (specializationName) {
      searchParams.set("search", specializationName);

      setSearchParams(searchParams);
    } else {
      searchParams.delete("search");

      setSearchParams(searchParams);
    }
  };

  const fetchReservations = async () => {
    try {
      setIsLoading(true);

      const specializationResponse = await axiosInstance.get("/v1/admin/data/layanan-spesialisasi", {
        params: {
          per_page: 5,
          page: Number(searchParams.get("page")),
          name: searchParams.get("search"),
        },
      });

      setHasNextPage(Boolean(specializationResponse.data.hasNext));
      setReservations(specializationResponse.data.data);
      setLastPage(specializationResponse.data.last);
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
      fetchReservations();
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
      title="Daftar Layanan Spesialisasi"
      rightSection={
        <Link to="/admin/specialization/create">
          <Button className="w-28 bg-[#159030] hover:bg-green-700 mt-5 md:mt-0">
            <IoAdd className="h-6 w-6 mr-2" />
            Tambah
          </Button>
        </Link>
      }
    >
      {/* Search */}
      <div className="mb-8">
        <Label>Cari Nama Spesialisasi</Label>
        <div className="flex gap-4">
          <Input value={specializationName} onChange={(e) => setSpecializationName(e.target.value)} className="w-[250px] lg:w-[400px]" placeholder="Cari spesialisasi..." />
          <Button onClick={searchSpecialization} className="bg-[#159030] hover:bg-green-700">
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
            <TableHead className="text-center text-black">Jam Layanan</TableHead>
            <TableHead className="text-center text-black">Hari</TableHead>
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
            {reservations.map((reservation, index) => {
              return (
                <TableRow key={reservation.id}>
                  <TableCell>{(Number(searchParams.get("page")) - 1) * 5 + index + 1}</TableCell>
                  <TableCell>{reservation.nama}</TableCell>
                  <TableCell>{reservation.waktu}</TableCell>
                  <TableCell>{reservation.hari}</TableCell>
                  <TableCell>{reservation.aktif ? 'Aktif' : 'Tidak Aktif'}</TableCell>
                  <TableCell>
                    <Link to={"/admin/specialization/edit/" + reservation.id}>
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

export default SpecializationManagementPage;
