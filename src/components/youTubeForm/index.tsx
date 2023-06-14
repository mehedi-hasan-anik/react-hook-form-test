import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldErrors, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  userName: yup.string().required("User name is required"),
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  channel: yup.string().required("Channel name is required"),
});

type FormValues = {
  userName: string;
  email: string;
  channel: string;
};

function YouTubeForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      userName: "batman",
      email: "",
      channel: "",
    },
    resolver: yupResolver(schema),
  });
  const { register, control, handleSubmit, formState, watch, reset } = form;
  const { errors, isDirty, isSubmitting, isSubmitSuccessful } = formState;

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  return (
    <div className="youtubeFormWrapper">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="innerYoutubeFormWrapper">
          <div className="singleSection">
            <label htmlFor="userName">Username: </label>
            <input
              type="text"
              id="userName"
              {...register("userName", {
                required: {
                  value: true,
                  message: "Username is required",
                },
              })}
            />
            <p className="error">{errors?.userName?.message}</p>
          </div>

          <div className="singleSection">
            <label htmlFor="email">E-mail: </label>
            <input
              type="text"
              id="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
                validate: {
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "admin@example.com" ||
                      "Enter a different email address"
                    );
                  },
                  notBlackListed: (fieldValue) => {
                    return (
                      !fieldValue.endsWith("baddomain.com") ||
                      "This domain is not supported"
                    );
                  },
                  emailAvailable: async (fieldValue) => {
                    const response = await fetch(
                      `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                    );
                    const data = await response.json();
                    return data.length == 0 || "Email already exists";
                  },
                },
              })}
            />
            <p className="error">{errors?.email?.message}</p>
          </div>

          <div className="singleSection">
            <label htmlFor="channel">channel: </label>
            <input
              type="text"
              id="channel"
              {...register("channel", {
                required: {
                  value: true,
                  message: "Channel is required",
                },
              })}
            />
            <p className="error">{errors?.channel?.message}</p>
          </div>

          <div className="singleSection">
            <button type="submit" className="submitBtn">
              Submit
            </button>
          </div>

          <DevTool control={control} />
        </div>
      </form>
    </div>
  );
}

export default YouTubeForm;
