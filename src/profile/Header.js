import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header(props) {
  const navigate = useNavigate();
  function logMeOut() {
    // Use useNavigate instead of useHistory

    axios({
      method: 'POST',
      url: '/logout',
    })
      .then((response) => {
        props.token();
        navigate('/');
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  return (
    <header className="App-header">
      <button
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded "
        onClick={logMeOut}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
