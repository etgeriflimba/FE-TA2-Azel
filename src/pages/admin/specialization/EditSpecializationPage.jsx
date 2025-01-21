import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { SpecializationForm } from "@/components/forms/SpecializationForm";
import { isAxiosError } from "axios";

const specializationFormSchema = z.object({
  image: z
    .any()
    .optional(),
  specialization: z.string().min(1, "Spesialisasi tidak boleh kosong"),
  desc_time: z.string().min(1, "Jam layanan tidak boleh kosong"),
  desc_day: z.string().min(1, "Hari layanan tidak boleh kosong"),
  status: z.string().min(1, "Pilih status layanan"),
});

const EditSpecializationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [specialization, setSpecialization] = useState({
    id: "",
    image: "",
    specialization: "",
    desc_time: "",
    desc_day: "",
    status: "",
  });
  const navigate = useNavigate();
  const params = useParams();

  const form = useForm({
    defaultValues: {
      image: specialization.image || "",
      specialization: specialization.specialization || "",
      desc_time: specialization.desc_time || "",
      desc_day: specialization.desc_day || "",
      status: specialization.status || "",
    },
    resolver: zodResolver(specializationFormSchema),
    reValidateMode: "onSubmit",
  });

  const fetchSpecialization = async () => {
    try {
      const specializationResponse = await axiosInstance.get(`/v1/admin/data/layanan-spesialisasi?id=${params.specializationId}`);
      console.log(specializationResponse)
      setSpecialization(specializationResponse.data.data);
    } catch (err) {
      console.log(err)
      if(isAxiosError(err)) {
        toast.error(err.response.data.message)
      }else if(err instanceof Error) {
        toast.error(err.message)  
      }
    }
  };

  const handleEditSpecialization = async (values) => {
    try {
      setIsLoading(true);

      let payload = new FormData()

      payload.append('foto_layanan_spesialisasi', values.image)
      payload.append('nama', values.specialization)
      payload.append('jam_mulai',`${values.desc_time}`.includes(' - ') ? `${values.desc_time}`.split(' - ')[0] : `${values.desc_time}`)
      payload.append('jam_selesai',`${values.desc_time}`.includes(' - ') ? `${values.desc_time}`.split(' - ')[1] : null)
      
      payload.append('hari_mulai', `${values.desc_day}`.includes(' - ') ? `${values.desc_day}`.split(' - ')[0] : `${values.desc_day}`)
      payload.append('hari_selesai', `${values.desc_day}`.includes(' - ') ? `${values.desc_day}`.split(' - ')[1] : null)
  
      payload.append('aktif', values.status === 'Aktif' ? true : false)

      await axiosInstance.put(`/v1/admin/data/layanan-spesialisasi?id=${params.specializationId}`, payload);

      toast.success("Berhasil mengedit spesialisasi");
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

  // Mount
  useEffect(() => {
    fetchSpecialization();
  }, []);

  // Mount & Update
  useEffect(() => {
    if (specialization.id) {
      form.reset({
        specialization: specialization.nama || "",
        desc_time: `${specialization.jam_mulai}${specialization.jam_selesai !== null ? ' - '+specialization.jam_selesai : ''}` || "",
        desc_day: `${specialization.hari_mulai}${specialization.hari_selesai !== null ? ' - '+specialization.hari_selesai : ''}` || "",
        status: specialization.aktif === 1 ? 'Aktif' : 'Tidak Aktif' || "",
      });
    }
  }, [specialization, form]);

  return (
    <AdminLayout title="Edit Spesialisasi">
      {/* Form */}
      <SpecializationForm cardTitle="Edit Spesialisasi" form={form} state={isLoading} onSubmit={handleEditSpecialization} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default EditSpecializationPage;
