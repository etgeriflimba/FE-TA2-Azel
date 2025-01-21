import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <main className="flex justify-center items-center w-full h-screen pt-10">
        {/* Not Found Section */}
        <section>
          <div className="container flex flex-col justify-center items-center text-center gap-6">
            <img src="/404.svg" alt="Oops! Sepertinya Anda tersesat" className="max-w-full h-auto" />
            <p className="text-xl sm:text-3xl font-bold">Oops! Sepertinya kamu tersesat</p>
            <Link to="/">
              <Button>Kembali</Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default NotFoundPage;
