import React from 'react';
import Banner from '../components/Banner';
import FeaturedPosts from '../components/FeaturedPosts';
import AboutSection from '../components/AboutSection';

export default function Home() {
  return (
    <div className="landing-page">
      <Banner />
      <FeaturedPosts />
      <AboutSection />
    </div>
  );
}