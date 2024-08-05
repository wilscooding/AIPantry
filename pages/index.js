// pages/index.js
import Header from '../components/Header';
import Pantry from './pantry';
import { Container, Typography } from '@mui/material';

const Home = () => (
  <>
    <Container maxWidth="xl">
      <Pantry />
    </Container>
  </>
);

export default Home;
