import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { HomePage } from './pages/Home';
import { CreateIdeaPage } from './pages/CreateIdea'
import { AccountIdeas } from './pages/AccountIdeas'
import { AccountPage } from './pages/Account'
import { MainNav } from './components/Nav'
import { IdeaPage } from './pages/Idea'
import { VotedIdeas } from './pages/VotedIdeas'
import { UpdateIdeaPage } from './pages/UpdateIdea'

const Routes = () => (
  <Router>
    <div>
      <MainNav />
      <div className="container">
        <Route exact path="/" component={HomePage} />
        <Route exact path="/ideas/:index" component={IdeaPage} />
        <Route exact path="/edit/:index" component={UpdateIdeaPage} />
        <Route exact path="/create" component={CreateIdeaPage} />
        <Route exact path="/account" component={AccountPage} />
        <Route exact path="/voted" component={VotedIdeas} />
        <Route exact path="/account/ideas" component={AccountIdeas} />
      </div>
    </div>
  </Router>
);

export default Routes;
