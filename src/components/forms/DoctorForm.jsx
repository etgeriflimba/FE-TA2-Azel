import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

export const DoctorForm = (props) => {
  const { cardTitle, form, state, onSubmit, layananSpesialisasi } = props;

  return (
    <Form {...form}>
      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[540px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#159030]">{cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#159030]">Layanan Spesialisasi</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={form.getValues().specialization} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih spesialisasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {layananSpesialisasi.map((v) => (
                          <SelectItem key={v['id']} value={v['nama']}>
                            {v['nama']}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#159030]">Nama Dokter</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#159030]">Status Layanan</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={form.getValues().status} defaultValue={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={state} type="submit" className="w-full bg-[#159030] hover:bg-green-700">
              {state ? "Proses..." : "Simpan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
