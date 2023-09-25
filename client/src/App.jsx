import { useEffect, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import ChatArea from "./ChatArea";

function Register() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("mq-user");
    setIsAuthenticated(!!user);
  }, []);

  const onNext = () => {
    if (name && name.length > 2) {
      localStorage.setItem("mq-user", name);
      setIsAuthenticated(true);
    } else {
      setError("Please input a valid name.");
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <ChatArea />
      ) : (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col justify-start rounded border border-gray-200 bg-gray-100 p-8">
            <div className="flex justify-start">
              <input
                type="text"
                value={name}
                placeholder="Input nickname"
                maxLength={10}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
              />
              <button
                className="border border-gray-200 bg-white"
                onClick={onNext}
              >
                <BiRightArrowAlt size={40} color="#4a9dfa" />
              </button>
            </div>
            {error && <div className="px-2 text-red-400">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
