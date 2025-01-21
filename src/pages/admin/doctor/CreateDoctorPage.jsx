import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DoctorForm } from "@/components/forms/DoctorForm";
import { isAxiosError } from "axios";

const doctorFormSchema = z.object({
  name: z.string().min(3, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),
  specialization: z.string().min(1, "Pilih layanan spesialisasi"),
  status: z.string().min(1, "Pilih status layanan"),
});

const CreateDoctorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [layananSpesialisasi, setLayananSpesialisasi] = useState([])
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      specialization: "",
      status: "",
    },
    resolver: zodResolver(doctorFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleCreateDoctor = async (values) => {
    try {
      setIsLoading(true);

      const payload = {
        nama: values.name,
        fk_dt_layanan_spesialisasi: layananSpesialisasi.find(v => v['nama'] === values.specialization)?.id,
        aktif: values.status === 'Aktif' ? true : false
      }
      await axiosInstance.post('/v1/admin/data/dokter', payload)

      toast.success("Berhasil membuat dokter");
      form.reset();
      setTimeout(() => {
        navigate("/admin/doctor");
      }, 2000);
    } catch (err) {
      toast.error("Gagal membuat dokter. Silakan coba lagi");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLayananSpesialisasi = async () => {
    try {
      const response = await axiosInstance.get('/v1/admin/data/layanan-spesialisasi')

      console.log(response)

      setLayananSpesialisasi(response.data.data)
    } catch (error) {
      console.log(error)
      if(isAxiosError(error)) {
        toast.error(error.response.data.message)
      }else if(error instanceof Error) {
        toast.error(error.message)  
      }
    }
  }

  useEffect(() => {
    fetchLayananSpesialisasi()
  }, [])

  return (
    <AdminLayout title="Buat Dokter Spesialis">
      {/* Form */}
      <DoctorForm cardTitle="Tambahkan Dokter baru" form={form} state={isLoading} layananSpesialisasi={layananSpesialisasi} onSubmit={handleCreateDoctor} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default CreateDoctorPage;
