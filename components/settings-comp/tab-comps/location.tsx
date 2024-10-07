import CustomInput from "@/components/lib/widgets/custom_inputs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countriesAndCities, location } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomSelectField from "../select_field";

type ComponentProps = {};

const schema = yup.object().shape({
  address: yup.string().required(),
  city: yup.string().required(),
  country: yup.string().required(),
  postCode: yup.string().required(),
});

const Location: React.FC<ComponentProps> = ({}) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const getFieldOptions = (fieldName: string) => {
    if (fieldName === "country") {
      return countriesAndCities.map((entry) => entry.country);
    }

    if (fieldName === "city") {
      const selectedCountry = watch("country");
      const countryData = countriesAndCities.find(
        (entry) => entry.country.value === selectedCountry,
      );
      return countryData ? countryData.cities : [];
    }

    return [];
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="block" id="location">
        <div className="max-w-4xl rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Location
              </h3>
              <p className="text-sm text-[#475467]">
                Edit your location preference
              </p>
            </div>
            <div className="fixed bottom-0 left-0 z-30 grid w-full grid-cols-2 items-center gap-3 bg-white p-4 md:static md:inline-flex md:w-min md:p-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-main-100 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 first:md:col-span-2">
            {location.map((data, index) => {
              if (data.type === "select") {
                return (
                  <CustomSelectField
                    key={data.name}
                    data={data}
                    errors={errors}
                    register={register}
                    control={control}
                    options={getFieldOptions(data.name)}
                  />
                );
              }
              return (
                <div
                  key={data.name + index}
                  className={cn(
                    "col-span-1",
                    (index === 0 || index === location?.length - 1) &&
                      "md:col-span-2",
                  )}
                >
                  <CustomInput
                    data={data}
                    errors={errors}
                    register={register}
                    control={control}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </>
  );
};

export default Location;
