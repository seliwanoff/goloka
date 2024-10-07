import { Button } from "@/components/ui/button";
import { passwordFormData } from "@/utils";
import PasswordInput from "../password_input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required("Input your old password"),
  password: yup
    .string()
    .required("Input your new password")
    .min(8, "Password must be at least 8 characters long"),
  passwordAgain: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Input your confirm password"),
});

const ChangePassword: React.FC<any> = ({}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="block max-w-4xl"
        id="password-reset"
      >
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Password
              </h3>
              <p className="text-sm text-[#475467]">
                Please enter your current password to change your password.
              </p>
            </div>
            <div className="flex items-center gap-3">
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {passwordFormData.map((data: any, index: number) => {
              return (
                <PasswordInput
                  key={data?.name + index}
                  data={data}
                  errors={errors}
                  register={register}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
