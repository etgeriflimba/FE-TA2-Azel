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
import { DoctorUmumForm } from "@/components/forms/DoctorUmumForm";

const doctorFormSchema = z.object({
  name: z.string().min(3, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),
  status: z.string().min(1, "Pilih status layanan"),
});

const CreateDoctorUmumPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [layananSpesialisasi, setLayananSpesialisasi] = useState([])
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
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
        aktif: values.status === 'Aktif' ? true : false
      }
      await axiosInstance.post('/v1/admin/data/dokter-umum', payload)

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

  return (
    <AdminLayout title="Buat Dokter Umum">
      {/* Form */}
      <DoctorUmumForm cardTitle="Tambahkan Dokter baru" form={form} state={isLoading} onSubmit={handleCreateDoctor} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default CreateDoctorUmumPage;
