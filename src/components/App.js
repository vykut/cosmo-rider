import { useSelector } from "react-redux";
import { isEmpty, isLoaded } from "react-redux-firebase";
import { Redirect, Route } from "react-router-dom";
import Home from "./HomeComponents/Home";
import LoginLogic from "./LoginComponents/LoginLogic";
import { BrowserRouter as Router } from 'react-router-dom';

function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth)
  if (!isLoaded(auth)) return <></>;
  return children
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated or if auth is not
// yet loaded
function PrivateRoute({ children, ...rest }) {
  const auth = useSelector(state => state.firebase.auth)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}



function App() {
  return (
    <>
      <AuthIsLoaded>
        <Router>
          <PrivateRoute path='/acasa'>
            <Home />
          </PrivateRoute>
          <Route path='/login'>
            <LoginLogic />
          </Route>
        </Router>
      </AuthIsLoaded>
    </>
  );
}

export default App;
