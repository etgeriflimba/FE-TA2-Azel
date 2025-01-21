import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ScheduleSpecializationForm } from "@/components/forms/ScheduleSpecializationForm";
import { isAxiosError } from "axios";

const scheduleFormSchema = z.object({
  doctor: z.string().min(3, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),
  specialization: z.string().min(1, "Spesialisasi tidak boleh kosong"),
});

const EditScheduleSpecializationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [layananSpesialisasi, setLayananSpesialisasi] = useState([])
  const [schedules, setSchedules] = useState({
    id: "",
    doctor: "",
    specialization: "",
  });
  const navigate = useNavigate();
  const params = useParams();

  const form = useForm({
    defaultValues: {
      doctor: schedules.doctor || "",
      specialization: schedules.specialization || "",
    },
    resolver: zodResolver(scheduleFormSchema),
    reValidateMode: "onSubmit",
  });

  const fetchSchedule = async () => {
    try {
      const scheduleResponse = await axiosInstance.get(`/v1/admin/data/jadwal-dokter-spesialis?id=${params.scheduleSpecializationId}`);
      console.log(scheduleResponse.data.data)
      setSchedules(scheduleResponse.data.data);
    } catch (error) {
      console.log(error)
      if(isAxiosError(error)) {
        toast.error(error.response.data.message)
      }else if(error instanceof Error) {
        toast.error(error.message)  
      }
    }
  };

  const handleEditScheduleSpecialization = async (values) => {
    try {
      console.log(values)
      setIsLoading(true);


      const payload = {
        nama: values.doctor,
        fk_dt_layanan_spesialisasi: layananSpesialisasi.find(v => v['nama'] === values.specialization)?.id,
      }

      console.log(payload)

      await axiosInstance.put(`/v1/admin/data/jadwal-dokter-spesialis?id=${params.scheduleSpecializationId}`, payload);

      toast.success("Berhasil mengedit jadwal dokter spesialisasi");
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
  // Mount
  useEffect(() => {
    fetchLayananSpesialisasi()
    fetchSchedule();
  }, []);

  // Mount & Update
  useEffect(() => {
    if (schedules.id) {
      form.reset({
        doctor: schedules.nama || "",
        specialization: schedules.spesialisasi || ""
      });
    }
  }, [schedules, form]);

  return (
    <AdminLayout title="Edit Jadwal Dokter Spesialisasi">
      {/* Form */}
      <ScheduleSpecializationForm cardTitle="Edit Jadwal Dokter Spesialisasi" layananSpesialisasi={layananSpesialisasi} form={form} state={isLoading} onSubmit={handleEditScheduleSpecialization} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default EditScheduleSpecializationPage;
