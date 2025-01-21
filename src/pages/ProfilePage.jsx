import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { SignedInPage } from "@/components/guard/SignedInPage";
import { isAxiosError } from "axios";

const ProfilePage = () => {
  const userSelector = useSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(userSelector.profile_url);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null)
  const dispatch = useDispatch();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (validImageTypes.includes(file.type)) {
        setUploadedFile(e.target.files[0])
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
          setIsDialogOpen(false);
          setImageDeleted(false);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Harap pilih file gambar yang valid");
      }
    }
  };

  const handleDelete = async () => {
    setSelectedImage("/avatar.png");
    setImageDeleted(true);
  };

  const handleSave = async () => {
    try {
      const updatedImage = imageDeleted ? "/avatar.png" : selectedImage;

      const payload = new FormData()

      payload.append('foto_profil_pasien', uploadedFile)

      await axiosInstance.put('/v1/pasien/foto-profil', payload)

      // dispatch({
      //   type: "USER_PROFILE",
      //   payload: { profile_url: updatedImage },
      // });

      toast.success("Foto profil berhasil diperbarui");
      setImageDeleted(false);
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
    <SignedInPage>
      <main className="min-h-[80vh] pt-20 pb-10 bg-gray-100">
        {/* Toaster */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Profile Header Section */}
        <section className="bg-[#159030] text-white py-10">
          <div className="container mx-auto px-5 md:px-32 text-center">
            <h2 className="text-2xl font-semibold mb-5">Profil Pengguna</h2>

            {/* Breadcrumb */}
            <Breadcrumb className="flex justify-center items-center">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-bold">Profil Pengguna</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Profile Content Section */}
        <section>
          <div className="container mx-auto px-5 md:px-32 mt-10">
            <div className="flex flex-wrap justify-center items-center rounded-lg py-20  shadow-lg bg-white">
              <div className="flex flex-nowrap gap-4 md:flex-col justify-center items-center w-full md:w-1/2">
                {/* Avatar */}
                <Avatar className="w-40 h-40 mb-3 border-2 border-white shadow-lg">
                  <AvatarImage src={selectedImage} />
                  <AvatarFallback />
                </Avatar>

                {/* AlertDialog */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-28 bg-[#159030] hover:bg-green-700">Pilih Foto</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-center">Ubah Foto Profil</AlertDialogTitle>
                      <AlertDialogDescription />
                    </AlertDialogHeader>
                    <AlertDialogFooter className="!flex !flex-col items-center gap-2">
                      <input type="file" id="file-input" className="hidden" accept="image/*" onChange={handleFileSelect} />
                      <AlertDialogAction asChild>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("file-input").click();
                          }}
                          className="bg-blue-500 hover:bg-blue-700"
                        >
                          Unggah Foto
                        </Button>
                      </AlertDialogAction>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-700">
                        Hapus Foto
                      </AlertDialogAction>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex flex-col justify-center items-start w-full md:w-1/2 gap-[33px] px-5 md:px-0">
                <div>
                  <h2 className="text-lg font-semibold">Nama Lengkap</h2>
                  <p className="text-gray-500">{userSelector.name}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Username</h2>
                  <p className="text-gray-500">{userSelector.username}</p>
                </div>

                <Button onClick={handleSave} className="w-28 bg-[#159030] hover:bg-green-700">
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SignedInPage>
  );
};

export default ProfilePage;
