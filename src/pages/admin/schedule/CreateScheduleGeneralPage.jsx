import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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

const CreateScheduleGeneralPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [daftarDokter, setDaftarDokter] = useState([])
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      time: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    resolver: zodResolver(scheduleFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleCreateScheduleGeneral = async (values) => {
    try {
      setIsLoading(true);
      // console.log(daftarDokter)
      // console.log(values)
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

      await axiosInstance.post("/v1/admin/data/jadwal-dokter-umum", payload);

      toast.success("Berhasil membuat jadwal dokter umum");
      form.reset();
      setTimeout(() => {
        navigate("/admin/schedule/general");
      }, 2000);
    } catch (err) {
      toast.error("Gagal membuat jadwal dokter umum. Silakan coba lagi");
      console.log(err);
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

  useEffect(() => {
    fetchDaftarDokter()
  }, [])

  return (
    <AdminLayout title="Buat Jadwal Dokter Umum">
      {/* Form */}
      <ScheduleGeneralForm cardTitle="Tambahkan Jadwal Dokter baru" form={form} daftarDokter={daftarDokter} state={isLoading} onSubmit={handleCreateScheduleGeneral} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default CreateScheduleGeneralPage;
