import React from 'react';
import Carousel from 'react-bootstrap/Carousel'
import "../assets/styles/landingPage.css"
import {Link} from 'react-router-dom'
import logo from "../assets/logo.png"

class LandingPage extends React.Component {
  render(){
    return(
        <div className="mb-5 mx-5 d-flex box justify-content-between" >
            <div className="col-3">
                <Carousel>
                    <Carousel.Item>
                        <img
                        className="carousel-card"
                        src="https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F6d%2Fa8%2F6da81fee77c7a1a331253f3d726f0ba3a392b593.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]"
                        alt="First slide"
                        />

                        <Carousel.Caption>
                        <h2>Everyday Dress</h2>
                        <p>Our collection of lovely dresses.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="carousel-card"
                        src="https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/large/5d6ece299b71485b46c83d9aeb6a9676e26a7873_xxl-1.jpg"
                        alt="Second slide"
                        />

                        <Carousel.Caption>
                        <h2>Formal Shirt</h2>
                        <p>Looking confident in our formal attire collections.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="carousel-card"
                        src="https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/large/31493e0cb7cb326b5cddff6eea7c5bd9b4924214_xxl-1.jpg"
                        alt="Third slide"
                        />

                        <Carousel.Caption>
                        <h2>Semi-formal Trousers</h2>
                        <p>Comfortable trousers for everyday use.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    </Carousel>
            </div>
            <div className="p-5 col-8 d-flex flex-column justify-content-center mb-5">
                <div className="d-flex justify-content-center align-items-center">
                    <img src={logo} alt="logo" className="big-logo" />
                </div>
                <div className="d-flex flex-column align-items-center ">
                    <h1 >Fashion is an inseparable part of our lives.</h1>
                    <h4>Explore our collections to find the exact attire for your every needs. </h4>
                    <Link className="mt-2" to={"/products"}>
                        <button className="btn btn-basic mt-2">Explore now</button>
                    </Link>
                </div>
            </div>

        </div>
      
    )
  }
}

export default LandingPage;