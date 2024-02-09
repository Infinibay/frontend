import Banner from "@/components/home/Banner";
import ConfigureVideo from "@/components/home/ConfigureVideo";
import Faqs from "@/components/home/Faqs";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import Personalized from "@/components/home/Personalized";
import Steps from "@/components/home/Steps";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Personalized />
      <Steps />
      <Features />
      <ConfigureVideo />
      <Faqs />
      <Footer />
    </>
  );
}
