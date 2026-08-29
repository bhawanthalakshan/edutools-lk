import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCategories from '../components/FeatureCategories';
import PopularTools from '../components/PopularTools';
import EducationalResources from '../components/EducationalResources';
import LatestArticles from '../components/LatestArticles';
import CallToAction from '../components/CallToAction';

const Home = () => {
  return (
    <div className="space-y-4">
      <HeroSection />
      <FeatureCategories />
      <PopularTools />
      <EducationalResources />
      <LatestArticles />
      <CallToAction />
    </div>
  );
};

export default Home;
