import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";

type FormValues = {
  userName: string;
  email: string;
  channel: string;
};
let renderCount = 0;

function YouTubeForm() {
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted", data);
  };
  renderCount++;

  return (
    <div className="youtubeFormWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="innerYoutubeFormWrapper">
          <h1>YouTube Form ({renderCount / 2})</h1>
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
              },
            })}
          />
          <p className="error">{errors?.email?.message}</p>

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

          <div>
            <button type="submit">Submit</button>
          </div>

          <DevTool control={control} />
        </div>
      </form>
    </div>
  );
}

export default YouTubeForm;
