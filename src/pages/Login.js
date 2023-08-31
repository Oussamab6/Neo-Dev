import Header from '../components/Authentication/Header.js';
import Login from '../components/Authentication/Login.js';
import useToken from '../profile/useToken.js';

export default function LoginPage() {
  const { token,setToken } = useToken();

  return (
    <>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {!token && token !== '' && token !== undefined ? (
            <>
              <Header
                heading="Login to your account"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/signup"
              />
              <Login setToken={setToken} />
            </>
          ) : (
            <>
              <Header
                heading="Login to your account"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/signup"
              />
              <Login token={token} setToken={setToken} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
