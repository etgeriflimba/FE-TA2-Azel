import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";

export const ContactCard = (props) => {
  const { icon: Icon, title, description, link } = props;
  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success(`Nomor telepon ${description} berhasil disalin`);
  };

  return (
    <>
      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Card */}
      {link ? (
        <a href={link} target="_blank">
          <Card className="w-[350px] md:w-96 h-32 shadow-md mb-5 cursor-pointer bg-[#159030] hover:bg-green-700">
            <CardHeader className="p-0">
              <CardTitle />
              <CardDescription />
            </CardHeader>
            <CardContent className="flex justify-start text-sm p-10">
              <div className="flex justify-center items-center w-12 h-12 rounded-full mr-4 bg-white">
                <Icon className="w-10 h-10 m-2 text-[#159030]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-white">{title}</h3>
                <p className="text-white">{description}</p>
              </div>
            </CardContent>
            <CardFooter />
          </Card>
        </a>
      ) : (
        <div onClick={handleCopy}>
          <a href={link} target="_blank">
            <Card className="w-[350px] md:w-96 h-32 shadow-md mb-5 cursor-pointer bg-[#159030] hover:bg-green-700">
              <CardHeader className="p-0">
                <CardTitle />
                <CardDescription />
              </CardHeader>
              <CardContent className="flex justify-start text-sm p-10">
                <div className="flex justify-center items-center w-12 h-12 rounded-full mr-4 bg-white">
                  <Icon className="w-10 h-10 m-2 text-[#159030]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">{title}</h3>
                  <p className="text-white">{description}</p>
                </div>
              </CardContent>
              <CardFooter />
            </Card>
          </a>
        </div>
      )}
    </>
  );
};
