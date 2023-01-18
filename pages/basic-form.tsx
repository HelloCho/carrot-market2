import React, { useState } from "react";

export default function BasicForm() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");

    const onUsernameChange = (event:React.SyntheticEvent<HTMLInputElement>) => {
        const {
            currentTarget: {value}
        } = event;  
        setUsername(value);
    };
    const onEmailChange = (event:React.SyntheticEvent<HTMLInputElement>) => {
        const {
            currentTarget: {value}
        } = event;  
        setEmail(value);
    };
    const onPasswordChange = (event:React.SyntheticEvent<HTMLInputElement>) => {
        const {
            currentTarget: {value}
        } = event;  
        setPassword(value);
    };
    const onSubmit = (event:React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        // (username, email, password);
        if(username === "" || email === "" || password === "") {
            // failed
            setErrors("All fields are required.")
        }
    };
    // console.log(username, email, password);
    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-2">
            <input required type="text" onChange={onUsernameChange} value={username} placeholder="username" />
            <input required type="email" onChange={onEmailChange} value={email} placeholder="email" />
            <input required type="password" onChange={onPasswordChange} value={password} placeholder="password" />
            <input type="submit" value="Submit" />
        </form>
    );
}