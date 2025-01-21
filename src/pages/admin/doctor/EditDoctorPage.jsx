import { AdminLayout } from "@/components/layout/AdminLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { DoctorForm } from "@/components/forms/DoctorForm";
import { isAxiosError } from "axios";

const doctorFormSchema = z.object({
  name: z.string().min(3, "Nama terlalu pendek").max(50, "Nama terlalu panjang"),
  specialization: z.string().min(1, "Spesialisasi tidak boleh kosong"),
  status: z.string().min(1, "Pilih status layanan"),
});

const EditDoctorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [layananSpesialisasi, setLayananSpesialisasi] = useState([])
  const [doctor, setDoctor] = useState({
    id: "",
    name: "",
    specialization: "",
    status: "",
  });
  const navigate = useNavigate();
  const params = useParams();

  const form = useForm({
    defaultValues: {
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      status: doctor.status || "",
    },
    resolver: zodResolver(doctorFormSchema),
    reValidateMode: "onSubmit",
  });

  const fetchDoctor = async () => {
    try {
      const doctorResponse = await axiosInstance.get(`/v1/admin/data/dokter?id=${params.doctorId}`);
      console.log(doctorResponse)
      setDoctor(doctorResponse.data.data);
    } catch (err) {
      console.log(err);
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

  const handleEditDoctor = async (values) => {
    try {
      setIsLoading(true);

      console.log(values.specialization)

      await axiosInstance.put(`/v1/admin/data/dokter?id=${params.doctorId}`, {
        nama: values.name,
        fk_dt_layanan_spesialisasi: layananSpesialisasi.find(v => v['nama'] === values.specialization)?.id,
        aktif: values.status === 'Aktif',
      });

      toast.success("Berhasil mengedit dokter");
      setTimeout(() => {
        navigate("/admin/doctor");
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

  // Mount
  useEffect(() => {
    fetchDoctor();
  }, []);

  // Mount & Update
  useEffect(() => {
    if (doctor.id) {
      form.reset({
        name: doctor.nama || "",
        specialization: doctor.spesialisasi || "",
        status: doctor.aktif ? 'Aktif' : 'Tidak Aktif' || "",
      });
    }
  }, [doctor, form]);

  return (
    <AdminLayout title="Edit Dokter Spesialis">
      {/* Form */}
      <DoctorForm cardTitle="Edit Dokter" form={form} state={isLoading} layananSpesialisasi={layananSpesialisasi} onSubmit={handleEditDoctor} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default EditDoctorPage;
