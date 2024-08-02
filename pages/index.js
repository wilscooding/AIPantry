// pages/index.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pantry from './pantry';
import { Container, Typography } from '@mui/material';

const Home = () => (
  <>
    <Header />
    <Container>
     

      <Pantry />
    </Container>
    <Footer />
  </>
);

export default Home;
