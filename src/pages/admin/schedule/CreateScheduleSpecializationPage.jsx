import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ScheduleSpecializationForm } from "@/components/forms/ScheduleSpecializationForm";

const scheduleFormSchema = z.object({
  doctor: z.string().min(3, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),
  specialization: z.string().min(1, "Pilih layanan spesialisasi"),
});

const CreateScheduleSpecializationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [layananSpesialisasi, setLayananSpesialisasi] = useState([])
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      doctor: "",
      specialization: "",
    },
    resolver: zodResolver(scheduleFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleCreateScheduleSpecialization = async (values) => {
    try {
      setIsLoading(true);

      const payload = {
        nama: values.doctor,
        fk_dt_layanan_spesialisasi: layananSpesialisasi.find(v => v['nama'] === values.specialization)?.id,
      }

      await axiosInstance.post("/v1/admin/data/jadwal-dokter-spesialis", payload);

      toast.success("Berhasil membuat jadwal dokter spesialisasi");
      form.reset();
      setTimeout(() => {
        navigate("/admin/schedule/specialization");
      }, 2000);
    } catch (error) {
      console.log(error)
      if(isAxiosError(error)) {
        toast.error(error.response.data.message)
      }else if(error instanceof Error) {
        toast.error(error.message)  
      }
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
    <AdminLayout title="Buat Jadwal Dokter Spesialisasi">
      {/* Form */}
      <ScheduleSpecializationForm cardTitle="Tambahkan Jadwal Dokter baru" layananSpesialisasi={layananSpesialisasi} form={form} state={isLoading} onSubmit={handleCreateScheduleSpecialization} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default CreateScheduleSpecializationPage;
