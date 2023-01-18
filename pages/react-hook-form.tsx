import { FieldErrors, useForm } from "react-hook-form";

interface BasicFormElements {
    username: string;
    email: string;
    password: string;
}

export default function BasicForm() {
    /**
     * register => connect input tag and state variable.
     * watch => see your form.
     */
    const { register, watch, handleSubmit, formState: { errors }, reset, resetField } = useForm<BasicFormElements>({
        mode: "onSubmit",
        defaultValues: {
            username: "Tom"
        }
    });    
    const onValid = (data: BasicFormElements) => {
        console.log("I'm a validator");
    };
    const invalid = (errors:FieldErrors) => {
        console.log(errors, "I'm a invalidator");
    };
    console.log(watch());
    return (
        <form onSubmit={handleSubmit(onValid,invalid)} className="flex flex-col space-y-2">
            <input {...register("username", {required:true, minLength: {message:"Username should be longer than 5 characters.", value: 5}})} type="text" placeholder="username" />
            {errors.username?.message}
            <input {...register("email", {required:true, validate: {notGmail:(value) => !value.includes("gmail.com") || "Gmail is not allowed."}})}  type="email" placeholder="email" />
            {errors.email?.message}
            <input {...register("password", {required:true})}  type="password" placeholder="password" />
            <input type="submit" value="Submit" />
        </form>
    );
}