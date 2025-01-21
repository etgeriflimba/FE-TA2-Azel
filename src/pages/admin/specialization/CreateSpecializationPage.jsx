import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SpecializationForm } from "@/components/forms/SpecializationForm";
import { isAxiosError } from "axios";

const specializationFormSchema = z.object({
  image: z.any().optional(),
  specialization: z.string().min(1, "Spesialisasi tidak boleh kosong"),
  desc_time: z.string().min(1, "Jam layanan tidak boleh kosong"),
  desc_day: z.string().min(1, "Hari layanan tidak boleh kosong"),
  status: z.string().min(1, "Pilih status layanan"),
});

const CreateSpecializationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      image: "",
      specialization: "",
      desc_time: "",
      desc_day: "",
      status: "",
    },
    resolver: zodResolver(specializationFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleCreateSpecialization = async (values) => {
    try {
      setIsLoading(true);

      // const specializationResponse = await axiosInstance.get("/reservations", {
      //   params: {
      //     specialization: values.specialization,
      //   },
      // });

      // if (specializationResponse.data.length) {
      //   toast.error("Spesialisasi sudah digunakan");
      //   return;
      // }
      let payload = new FormData()
      
      payload.append('nama', values.specialization)
      payload.append('jam_mulai',`${values.desc_time}`.includes(' - ') ? `${values.desc_time}`.split(' - ')[0] : `${values.desc_time}`)
      if(`${values.desc_time}`.includes(' - ')) {
        payload.append('jam_selesai', `${values.desc_time}`.split(' - ')[1])
      }
      payload.append('hari_mulai', `${values.desc_day}`.includes(' - ') ? `${values.desc_day}`.split(' - ')[0] : `${values.desc_day}`)
      if(`${values.desc_day}`.includes(' - ')) {
        payload.append('hari_selesai', `${values.desc_day}`.split(' - ')[1])
      }
      payload.append('foto_layanan_spesialisasi', values.image)
      payload.append('aktif', values.status === 'Aktif' ? true : false)

      await axiosInstance.post("/v1/admin/data/layanan-spesialisasi", payload);

      toast.success("Berhasil membuat spesialisasi");
      form.reset();
      setTimeout(() => {
        navigate("/admin/specialization");
      }, 2000);
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

  return (
    <AdminLayout title="Buat Spesialisasi">
      {/* Form */}
      <SpecializationForm cardTitle="Tambahkan spesialisasi baru" form={form} state={isLoading} onSubmit={handleCreateSpecialization} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default CreateSpecializationPage;
