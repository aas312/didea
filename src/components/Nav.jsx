import React from 'react'
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'

const MainNav = () => (
  <Grid fluid>
    <Navbar inverse collapseOnSelect fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">DIdea</Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer to="/create">
          <NavItem>
            Submit Idea
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/account">
          <NavItem>
            My Account
          </NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>
  </Grid>
)

export { MainNav }
