import {
  ethnicityOptions,
  genderOptions,
  otherInfo,
  primaryLanguageOptions,
  religionOptions,
  spokenLanguageOptions,
} from "@/utils";
import CustomSelectField from "../select_field";
import DatePicker from "../date_picker";

const getOptionsByName = (name: string) => {
  switch (name) {
    case "gender1":
      return genderOptions;
    case "religion":
      return religionOptions;
    case "ethnicity":
      return ethnicityOptions;
    case "primaryLanguage":
      return primaryLanguageOptions;
    case "spokenLanguage":
      return spokenLanguageOptions;
    default:
      return [];
  }
};

const OtherPersonalInfo: React.FC<any> = ({ errors, register, control }) => {
  return (
    <div className="mt-8 rounded-2xl bg-white p-6">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-[#101828]">
          Other info
        </h3>
        <p className="text-sm text-[#475467]">Edit your location preference</p>
      </div>
      <div className="space-y-4 md:mt-8 md:grid md:grid-cols-2 md:gap-x-[18px] md:gap-y-6 md:space-y-0">
        {otherInfo.map((data, index) => {
          if (data.type === "date") {
            return (
              <DatePicker
                key={data.name}
                data={data}
                errors={errors}
                register={register}
                control={control}
              />
            );
          }

          return (
            <CustomSelectField
              key={data.name + index}
              data={data}
              errors={errors}
              register={register}
              control={control}
              options={getOptionsByName(data.name)}
            />
          );
        })}
      </div>
    </div>
  );
};
export default OtherPersonalInfo;
