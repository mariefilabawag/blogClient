import React from 'react';

export default function AboutSection() {
  return (
    <section className="about-section py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-12">
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-robot display-4 me-3"></i>
              <h2 className="mb-0">About The Noobs</h2>
            </div>
            <p className="lead">
              Welcome to The Noob Feeds—a friendly corner of the internet where it's 100% okay not to know everything about tech (yet). Whether you're curious about AI, just starting to code, or wondering what the heck "the cloud" actually is, you're in the right place.
            </p>
            <p>
              I created this blog because I am you. I'm not a tech guru or a coding wizard—I'm just someone who got curious, got confused, and kept Googling until things started making sense. Along the way, I discovered how AI tools can help me learn, create content, and stay updated with less stress—and I want to share those tips with you too.
            </p>
            <p>
              Here, you'll find:
            </p>
            <ul className="list-unstyled">
              <li><i className="bi bi-check-circle-fill text-primary me-2"></i>Beginner-friendly explainers that don't assume you're an engineer</li>
              <li><i className="bi bi-check-circle-fill text-primary me-2"></i>Easy-to-digest news from the world of AI and tech</li>
              <li><i className="bi bi-check-circle-fill text-primary me-2"></i>Cool tools and how-tos for everyday tech use, including how to use AI yourself</li>
              <li><i className="bi bi-check-circle-fill text-primary me-2"></i>A safe space to be a noob and ask questions without feeling dumb</li>
            </ul>
            <p className="lead">
               So grab a coffee (or bubble tea), scroll through, and let's explore the tech world together—no pressure, no pretense, just progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 