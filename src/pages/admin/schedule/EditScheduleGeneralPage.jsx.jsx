import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ScheduleGeneralForm } from "@/components/forms/ScheduleGeneralForm";
import { isAxiosError } from "axios";

const scheduleFormSchema = z.object({
  time: z.string().min(1, "Waktu kerja tidak boleh kosong"),
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

const EditScheduleGeneralPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [daftarDokter, setDaftarDokter] = useState([])
  const [schedules, setSchedules] = useState({
    id: "",
    time: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });
  const navigate = useNavigate();
  const params = useParams();

  const form = useForm({
    defaultValues: {
      time: schedules.waktu || "",
      monday: schedules.senin_by_dokter_nama || "",
      tuesday: schedules.selasa_by_dokter_nama || "",
      wednesday: schedules.rabu_by_dokter_nama || "",
      thursday: schedules.kamis_by_dokter_nama || "",
      friday: schedules.jumat_by_dokter_nama || "",
      saturday: schedules.sabtu_by_dokter_nama || "",
      sunday: schedules.minggu_by_dokter_nama || "",
    },
    resolver: zodResolver(scheduleFormSchema),
    reValidateMode: "onSubmit",
  });

  const fetchSchedule = async () => {
    try {
      const scheduleResponse = await axiosInstance.get(`/v1/admin/data/jadwal-dokter-umum?id=${params.scheduleGeneralId}`);
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

  const handleEditScheduleGeneral = async (values) => {
    try {
      setIsLoading(true);

      const payload = {
        jam_mulai: `${values.time}`.includes(' - ')
          ? `${values.time}`.split(' - ')[0]
          : `${values.time}`,
        jam_selesai: `${values.time}`.includes(' - ')
          ? `${values.time}`.split(' - ')[1]
          : null,
        senin_by_fk_dt_dokter_umum: daftarDokter.find(v => v['nama'] === values.monday)?.id,
        selasa_by_fk_dt_dokter_umum: daftarDokter.find(v => v['nama'] === values.tuesday)?.id,
        rabu_by_fk_dt_dokter_umum: daftarDokter.find(v => v['nama'] === values.wednesday)?.id,
        kamis_by_fk_dt_dokter_umum: daftarDokter.find(v => v['nama'] === values.thursday)?.id,
        jumat_by_fk_dt_dokter_umum: daftarDokter.find(v => v['nama'] === values.friday)?.id,
        sabtu_by_fk_dt_dokter_umum: daftarDokter.find(v => v['nama'] === values.saturday)?.id,
        minggu_by_fk_dt_dokter_umum: daftarDokter.find(v => v['nama'] === values.sunday)?.id,
      }

      await axiosInstance.put(`/v1/admin/data/jadwal-dokter-umum?id=${params.scheduleGeneralId}`, payload);

      toast.success("Berhasil mengedit jadwal dokter umum");
      setTimeout(() => {
        navigate("/admin/schedule/general");
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

  const fetchDaftarDokter = async () => {
      try {
        const response = await axiosInstance.get('/v1/admin/data/dokter-umum')
  
        setDaftarDokter(response.data.data)
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
    fetchSchedule();
    fetchDaftarDokter()
  }, []);

  // Mount & Update
  useEffect(() => {
    if (schedules.id) {
      form.reset({
        time: schedules.waktu || "",
        monday: schedules.senin_by_dokter_nama || "",
        tuesday: schedules.selasa_by_dokter_nama || "",
        wednesday: schedules.rabu_by_dokter_nama || "",
        thursday: schedules.kamis_by_dokter_nama || "",
        friday: schedules.jumat_by_dokter_nama || "",
        saturday: schedules.sabtu_by_dokter_nama || "",
        sunday: schedules.minggu_by_dokter_nama || "",
      });
    }
  }, [schedules, form]);

  return (
    <AdminLayout title="Edit Jadwal Dokter Umum">
      {/* Form */}
      <ScheduleGeneralForm cardTitle="Edit Jadwal Dokter Umum" form={form} state={isLoading} daftarDokter={daftarDokter} onSubmit={handleEditScheduleGeneral} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default EditScheduleGeneralPage;
