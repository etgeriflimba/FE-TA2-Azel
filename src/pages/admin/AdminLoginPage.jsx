import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { useDispatch } from "react-redux";
import { GuestPage } from "@/components/guard/GuestPage";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError, isAxiosError } from "axios";

const loginFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username kurang dari 3 karakter")
    .max(16, "Username lebih dari 16 karakter")
    .regex(/^[a-z0-9]+$/, "Username hanya boleh berisi huruf kecil dan angka"),
  password: z.string().min(8, "Password kurang dari 8 karakter"),
});

const AdminLoginPage = () => {
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleLogin = async (values) => {
    try {

      // console.log(values) 

      const userResponse = await axiosInstance.post("/v1/auth/admin/login", {
        username: values.username,
        password: values.password,
      });

      console.log(userResponse)

      dispatch({
        type: "USER_API_TOKEN",
        payload: {
          api_token_admin: userResponse.data.data
        },
      });

      toast.success('Berhasil masuk sebagai Admin!')
      localStorage.setItem("api_token_admin", userResponse.data.data);
      window.location.href = '/admin/dashboard'
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
      <Toaster 
        position="top-center"
      />
      <main className="min-h-[80vh] pt-36 pb-10 bg-gray-100">
        {/* Masuk Section */}
        <section>
          <div className="container mx-auto px-5 md:px-32">
            <div className="flex flex-col justify-center items-center">
              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="w-full max-w-lg">
                  <Card className="p-5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-center text-[#159030]">
                        <h1>Masuk</h1>
                      </CardTitle>
                      <CardDescription />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
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
                          Masuk
                        </Button>
                        <p className="text-gray-500 text-center">
                            <Link to="/login">
                              <Button variant="link" className="p-1 text-[#159030]">
                                Masuk sebagai Users
                              </Button>
                            </Link>
                          </p>
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

export default AdminLoginPage;
