import React from 'react';
import sier from "../Assets/images/card-img-sier.png";
import card from "../Assets/images/card-img.png";
import { Link } from 'react-router-dom';
import Footer from './Footer';

const VirtualCard = () => {
    return (
        <>
            <div>
                <section className="c-h-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 c-baner_text">
                                <div>
                                    <h1>The Leading Digital Business Card Platform</h1>
                                    <p>
                                        {/* Loved by millions worldwide, HiHello helps everyone—from
                                        individuals to enterprises—turn each customer touchpoint into
                                        a branded, interactive, and measurable opportunity. */}

                                        Access your online visiting card anytime, anywhere. Scan the QR code or click the link to explore your personalized digital business card.
                                    </p>
                                    <div className="c-baner_text-btn">

                                        <Link to="/signup">Sign up </Link>
                                        <Link to="/login">Login</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 c-baner_img">
                                <img src={card} alt="" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="c-section-about">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 c-about_img">
                                <img src={sier} alt="" />
                            </div>
                            <div className="col-md-5 c-about_text">
                                <div>
                                    <h2>Digital Business Cards: Empower Your Networking</h2>
                                    <p>
                                    A modern alternative to traditional printed cards, digital business cards offer a dynamic and eco-friendly way to share professional details through a QR code or unique URL. Easily accessible and always up-to-date, they simplify networking in the digital era.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default VirtualCard;
