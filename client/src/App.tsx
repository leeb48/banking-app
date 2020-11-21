import React, { useContext, useEffect } from "react";
import { Landing } from "./components/layout/Landing";
import { Navbar } from "./components/layout/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Register } from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import Profile from "./components/profile/Profile";
import { Store } from "./store/Store";
import { getCurrentUser } from "./store/actions";
import { Transactions } from "./components/transaction/Transactions";
import Spending from "./components/spending/Spending";
import Alert from "./components/layout/Alert";
import { Budget } from "./components/budget/Budget";
import BudgetCreateForm from "./components/budget/BudgetCreateForm";

function App() {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  return (
    <div>
      <Router>
        <Navbar />
        <Alert />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/transactions" component={Transactions} />
          <Route exact path="/spendings" component={Spending} />
          <Route exact path="/budget" component={Budget} />
          <Route exact path="/create-budget" component={BudgetCreateForm} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
