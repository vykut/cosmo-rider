import { useSelector } from "react-redux";
import { isEmpty, isLoaded } from "react-redux-firebase";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./HomeComponents/Home";
import OrdersLogic from "./HomeComponents/OrdersLogic";
import LoginLogic from "./LoginComponents/LoginLogic";
import { BrowserRouter as Router } from 'react-router-dom';
import Header from "./HeaderComponents/Header";
import OrderDetails from "./HomeComponents/OrderDetails";
import ProductPage from "./HomeComponents/ProductPage";
import OrdersView from "./HomeComponents/OrdersView";
import AccountOverview from "./AccountComponents/AccountOverview";


function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth)
  if (!isLoaded(auth)) {
    return <></>;
  }
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
        !isEmpty(auth) ? (
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
          <Header />
          <Switch>
            {/* <PrivateRoute path='/acasa'> */}
            {/* <Home /> */}
            {/* <Redirect to='/comenzi' /> */}
            {/* </PrivateRoute> */}
            <PrivateRoute exact path='/produs/:productID'>
              <ProductPage />
            </PrivateRoute>
            <PrivateRoute exact path='/comenzi/:orderID/detalii'>
              <OrderDetails />
            </PrivateRoute>
            <PrivateRoute path='/comenzi'>
              <OrdersView />
            </PrivateRoute>
            <PrivateRoute path='/contul-meu'>
              <AccountOverview />
            </PrivateRoute>
            <Route path='/login'>
              <LoginLogic />
            </Route>
            <Redirect to='/comenzi' />
          </Switch>
        </Router>
      </AuthIsLoaded>
    </>
  );
}

export default App;
