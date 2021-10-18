import React from 'react';
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/productDetail.css"
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom'


class ProductDetail extends React.Component {
  state = {
    productData: [],
    shownData:{},
    sizeAvailable:[],
    productNotFound: false,
    productQty: 1,
    selectedSize:"",
    availableStock:1,
    disable:false
  }

  inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    //name dikasi kurung siku soalnya dia variabel
    this.setState({[name] : value.toUpperCase()})
  }

  fetchproducts = () => {
    // console.log(this.props.match.params.product_id)
    Axios.get(`${API_URL}/products/detail?product_id=${this.props.match.params.product_id}`)
    .then((result) => {
      if(result.data.length){
        this.setState({productData: result.data})
        this.setState({shownData:result.data[0]})
        this.setState({availableStock:result.data[0].available_stock})
        this.setState({selectedSize:result.data[0].size})
      } else {
        this.setState({productNotFound:true})
      }
    })
    .catch((err)=>{
      alert(err)
  })
  } 

  availableStock = (event) => {
    // console.log(event.target.value)
    this.setState({productQty:1})
    this.state.productData.map((val)=>{
      if (val.size === event.target.value){
        this.setState({selectedSize: val.size.toUpperCase()}) //ini buat nanti add to cart aja
        this.setState({availableStock: val.available_stock}) //ini buat nanti add to cart aja
 
        console.log("size:",val.size," stock:",val.available_stock)
      }
    })
  }

  renderSize = () => {
    return this.state.productData.map((val)=> {
      const capital = val.size.toUpperCase();
      // console.log("stock",this.state.availableStock)
      return <option value={val.size}>{capital}</option>
    })
  }

  fnQuantityUp = () => {
    this.setState({productQty: this.state.productQty + 1})
  }

  fnQuantityDown = () => {
    this.setState({productQty: this.state.productQty - 1})
  }

  kasihTitik = (val) => {
    const toInt = parseInt(val)
    return toInt.toLocaleString()
  }

  componentDidMount(){
    this.fetchproducts()
  }

  render(){
    return(
      <div className="container">
        {
          this.state.productNotFound ?
          <div className="text-center mx-3 mt-5 p-2 alert align-items-center d-flex flex-column">
              <h2>OOPS! </h2>
              <h3>Sorry, we dont have the page you are looking for. Please continue exploring.</h3>
              <Link className="mt-2" to={"/home"}>
                    <button className="btn btn-basic mt-2"><p>Explore products</p></button>
              </Link>
          </div>
        :
        <div className="row mt-3">
          <div className="col-6 d-flex justify-content-end">
            <img 
              className="image-card"
              style={{width:"70%"}}
              src={this.state.shownData.product_image}
              alt="product-image" 
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center">
            <h1>{this.state.shownData.product_name}</h1>
            <h2>Rp. {this.kasihTitik(this.state.shownData.price_sell)}</h2>
            <h4 className="col-10">
              {this.state.shownData.product_desc} 
            </h4>

            {
              this.state.availableStock === 0 ?
              <>
                <div className="d-flex flex-row align-items-center mt-3">
                  <div className="mx-2 col-3 d-flex flex-row align-items-center justify-content-start">
                    <p className="me-2">Select size: </p>
                    <select onChange={(event)=>this.availableStock(event)} className="selectSize" name="selectedSize" id="size">
                      {this.renderSize()}
                    </select>
                  </div>
                  <button disabled={true} onClick={this.fnQuantityDown} className="btn btn-dark btn-sm">
                    -
                  </button>
                  <div className="mx-4">
                    <h4>0</h4>
                  </div>
                  <button onClick={this.fnQuantityUp} disabled={true} className="btn btn-dark btn-sm">
                    +
                  </button>
                  <p className="warning ms-2">  Sorry, our stock for size {this.state.selectedSize.toUpperCase()} has run out.</p>

                </div>
                <button disabled={true} className="btn btn-sm btn-dark mt-3 col-6">
                    <p>Add to cart</p>
                </button>
              </>
              :
              <>
                <div className="d-flex flex-row align-items-center mt-3">
                  <div className="mx-2 col-3 d-flex flex-row align-items-center justify-content-start">
                    <p className="me-2">Select size: </p>
                    <select onChange={(event)=>this.availableStock(event)} className="selectSize" name="selectedSize" id="size">
                      {this.renderSize()}
                    </select>
                  </div>
                  <button disabled={this.state.productQty===1} onClick={this.fnQuantityDown} className="btn btn-dark btn-sm">
                    -
                  </button>
                  <div className="mx-4">
                    <h4>{this.state.productQty}</h4>
                  </div>
                  <button onClick={this.fnQuantityUp} disabled={this.state.productQty===this.state.availableStock} className="btn btn-dark btn-sm">
                    +
                  </button>
                  {
                    this.state.productQty===this.state.availableStock?
                    <p className="warning ms-2">Sorry, you have reached size {this.state.selectedSize.toUpperCase()} maximum stock.</p>
                    : null
                  }

                </div>
                <button className="btn btn-sm btn-dark mt-3 col-6">
                    <p>Add to cart</p>
                </button>
              </>
            }



              <button className="btn btn-light mt-3 col-6">
                <p>See Cart</p>
              </button>
          </div>
        </div>
        }
      </div>
    )
  }
}

export default ProductDetail;