import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Spinner from "@/components/ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SignedInPage } from "@/components/guard/SignedInPage";
import { isAxiosError } from "axios";

const HistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state.user);

  const handleDeleteHistory = async (historyId) => {
    try {
      await axiosInstance.delete(`/v1/pasien/data/antrean?id=${historyId}`);

      toast.success("Berhasil menghapus");
      fetchHistory();
    } catch (err) {
      if(err instanceof Error) {
        console.log(err.stack);
        toast.error(err.message)
      }else if(err instanceof AxiosError) {
        console.log(err.response.data.debug)
        console.log(err.response.data.message)
      }
      console.log(err);
    }
  };

  const handleCancel = async (historyId) => {
    try {
      await axiosInstance.put("/v1/pasien/data/antrean", {
        id: historyId,
        payload: {
          status: 'Batal'
        },
      });

      toast.success("Reservasi berhasil dibatalkan");
      fetchHistory();
    } catch (err) {
      if(err instanceof Error) {
        console.log(err.stack);
        toast.error(err.message)
      }else if(err instanceof AxiosError) {
        console.log(err.response.data.debug)
        console.log(err.response.data.message)
      }
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);

      const historyResponse = await axiosInstance.get("/v1/pasien/data/antrean");

      setHistories(historyResponse.data.data);
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
    fetchHistory();
  }, []);

  return (
    <SignedInPage>
      <Toaster 
        position="top-center"
      />
      <main className="min-h-[80vh] pt-20 pb-10 bg-gray-100">
        {/* Toaster */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* History Header Section */}
        <section className="bg-[#159030] text-white py-10">
          <div className="container mx-auto px-5 md:px-32 text-center">
            <h2 className="text-2xl font-semibold mb-5">Riwayat Reservasi</h2>

            {/* Breadcrumb */}
            <Breadcrumb className="flex justify-center items-center">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-bold">Riwayat Reservasi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* History Content Section */}
        <section>
          <div className="container mx-auto px-5 md:px-32 mt-10">
            {/* Table */}
            <Table className="border text-center">
              <TableCaption />
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center text-black">Tanggal</TableHead>
                  <TableHead className="text-center text-black">Waktu</TableHead>
                  <TableHead className="text-center text-black">Spesialisasi</TableHead>
                  <TableHead className="text-center text-black">Nama</TableHead>
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
                  {histories.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.tanggal}</TableCell>
                      <TableCell>{history.waktu}</TableCell>
                      <TableCell>{history.nama_spesialisasi}</TableCell>
                      <TableCell>{history.nama_pendaftar}</TableCell>
                      <TableCell>{history.status}</TableCell>
                      <TableCell>
                        {history.status === "Selesai" ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="w-28 bg-[#159030] hover:bg-green-700">Hapus</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Reservarsi</AlertDialogTitle>
                                <AlertDialogDescription>Apakah Anda yakin ingin menghapus?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={() => {
                                    handleDeleteHistory(history.id);
                                  }}
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button disabled={history.status === "Batal"} onClick={() => handleCancel(history.id)} className="w-28 bg-[#159030] hover:bg-green-700">
                            Batalkan
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </section>
      </main>
    </SignedInPage>
  );
};

export default HistoryPage;
