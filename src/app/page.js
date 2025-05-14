import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
// import Testimonials from '../components/home/Testimonials';
import Gallery from '../components/home/Gallery';
import ContactForm from '../components/home/ContactForm';
import AnnouncementBanner from '../components/home/AnnouncementBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <AnnouncementBanner />
      <ServicesGrid />
      <Gallery />
      {/* <Testimonials /> */}
      <ContactForm />
    </>
  );
}
