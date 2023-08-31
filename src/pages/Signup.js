import Header from '../components/Authentication/Header.js';
import Signup from '../components/Authentication/Signup.js';
import useToken from '../profile/useToken.js';

export default function SignupPage() {
  const { token, setToken } = useToken();

  return (
    <>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {!token && token !== '' && token !== undefined ? (
            <>
              <Header
                heading="Signup to create an account"
                paragraph="Already have an account? "
                linkName="Login"
                linkUrl="/"
              />
              <Signup setToken={setToken} />
            </>
          ) : (
            <>
              <Header
                heading="Signup to create an account"
                paragraph="Already have an account? "
                linkName="Login"
                linkUrl="/"
              />
              <Signup token={token} setToken={setToken} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
