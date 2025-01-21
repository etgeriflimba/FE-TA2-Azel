import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { GuestPage } from "@/components/guard/GuestPage";
import { AxiosError, isAxiosError } from "axios";

const registerFormSchema = z.object({
  name: z
    .string()
    .min(3, "Nama terlalu pendek")
    .max(50, "Nama terlalu panjang")
    .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),
  username: z
    .string()
    .min(3, "Username kurang dari 3 karakter")
    .max(16, "Username lebih dari 16 karakter")
    .regex(/^[a-z0-9]+$/, "Username hanya boleh berisi huruf kecil dan angka"),
  password: z.string().min(8, "Password kurang dari 8 karakter"),
});

const RegisterPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(registerFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleRegister = async (values) => {
    try {
      const payload = {
        nama: values.name,
        username: values.username,
        password: values.password
      }
      
      await axiosInstance.post('/v1/auth/pasien/register', payload)

      toast.success("Berhasil mendaftar");
      form.reset();
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err)
      if(isAxiosError(err)) {
        toast.error(err.response.data.message)
      }else if(err instanceof Error) {
        toast.error(err.message)  
      }
    }
  };

  return (
    <GuestPage>
      <main className="min-h-[80vh] pt-36 pb-10 bg-gray-100">
        {/* Toaster */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Registrasi Section */}
        <section>
          <div className="container mx-auto px-5 md:px-32">
            <div className="flex flex-col justify-center items-center">
              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegister)} className="w-full max-w-lg">
                  <Card className="p-5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-center text-[#159030]">
                        <h1>Registrasi</h1>
                      </CardTitle>
                      <CardDescription />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#159030]">Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan Nama Lengkap" {...field} />
                            </FormControl>
                            <FormDescription>Nama wajib diisi dan hanya boleh mengandung huruf alfabet</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#159030]">Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan Username" {...field} />
                            </FormControl>
                            <FormDescription>Username harus terdiri dari 3 hingga 16 karakter</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#159030]">Kata Sandi</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan Kata Sandi" {...field} type="password" />
                            </FormControl>
                            <FormDescription>Kata sandi harus terdiri dari minimal 8 karakter</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-col w-full">
                        <Button type="submit" className="bg-[#159030] hover:bg-green-700">
                          Registrasi
                        </Button>
                        <div className="text-center mt-4">
                          <p className="text-gray-500">
                            Sudah punya akun?
                            <Link to="/login">
                              <Button variant="link" className="p-1 text-[#159030]">
                                Masuk
                              </Button>
                            </Link>
                          </p>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </main>
    </GuestPage>
  );
};

export default RegisterPage;
