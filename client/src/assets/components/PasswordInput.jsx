import { useState } from "react";

const PasswordInput = ({ name, placeholder }) => {
    const [isPassVisible, setIsPassVisible] = useState(false);

    return (
        <span>
            <input className="password" id={name} type={isPassVisible ? "text" : "password"} name={name} placeholder={placeholder} />

            {
                isPassVisible ?
                    <i onClick={() => setIsPassVisible(prev => prev = !prev)} className="fa-solid fa-eye-slash"></i> :
                    <i onClick={() => setIsPassVisible(prev => prev = !prev)} className="fa-solid fa-eye"></i>
            }
        </span>
    );
}

export default PasswordInput;