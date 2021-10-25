import React from 'react';
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/productDetail.css"
import {Link,Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import {getCartData} from '../redux/actions/cart';


class ProductDetail extends React.Component {
  state = {
    productData: [],
    shownData:{},
    sizeAvailable:[],
    productNotFound: false,
    productQty: 1,
    selectedSize:"",
    availableStock:1,
    disable:false,
    redirect:false,

    cartList:[],
    cartQty:0,
    cart_id:0
  }

  alertHandler = () => {
    alert("Please login/register as user to start shopping!")
  }

  inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({[name] : value.toUpperCase()})
  }

  fetchproducts = () => {
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

  fetchCartList = () => {
    Axios.get(`${API_URL}/cart/get?user_id=${this.props.userGlobal.user_id}`)
    .then((res)=> {
        this.setState({cartList:res.data})
        this.fetchCartQty()
    })
    .catch((err)=>{
        alert(err)
    })
  }

  fetchCartID = () => {
    Axios.get(`${API_URL}/cart/id?user_id=${this.props.userGlobal.user_id}`)
    .then((res) => {
      this.setState({cart_id:res.data[0].cart_id})
     
    })
    .catch((err) => {
      console.log(err);
    });
  }

  fetchCartQty = () => {
    this.state.cartList.map((val)=>{
      if(val.product_id == this.props.match.params.product_id){
        console.log("product match")
        if(val.size == this.state.selectedSize.toLowerCase()){
          console.log("size match");
          this.setState({cartQty:val.quantity})
        }
        else{
          this.setState({cartQty:0})
        }
      }
    })
  }

  availableStock = (event) => {
    this.setState({productQty:1})
    this.state.productData.map((val)=>{
      if (val.size === event.target.value){
        this.setState({selectedSize: val.size.toUpperCase()}) 
        this.setState({availableStock: val.available_stock}) 
      }
    })
  }

  renderSize = () => {
    return this.state.productData.map((val)=> {
      const capital = val.size.toUpperCase();
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

  componentDidUpdate(prevProps,prevState){
    if (prevState.selectedSize !== this.state.selectedSize)
    {
      this.fetchCartList()
    }
  }

  componentDidMount(){
    this.fetchproducts()
    this.fetchCartList()
    this.fetchCartID()
  }

  addToCartHandler = () =>{
    Axios.post(`${API_URL}/cart/add`,{
      cart_id: this.state.cart_id,
      product_id: this.props.match.params.product_id,
      size: this.state.selectedSize.toLowerCase(),
      quantity: this.state.productQty,
    })
    .then(()=> {
      alert("Product added to cart.")
      this.props.getCartData(this.props.userGlobal.user_id)
      this.setState({productQty:1,redirect:true});

    })
    .catch((err)=>{
      alert(err)
    })


  }

  render(){
    if(this.state.redirect){
      return <Redirect to="/products" />
    }
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
              style={{width:"60%"}}
              src={API_URL + '/public' + this.state.shownData.product_image}
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
              this.state.availableStock -  this.state.cartQty === 0 ?
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
                  <button onClick={this.fnQuantityUp} disabled={this.state.productQty===this.state.availableStock -  this.state.cartQty} className="btn btn-dark btn-sm">
                    +
                  </button>
                  {
                    this.state.productQty===this.state.availableStock -  this.state.cartQty?
                    <p className="warning ms-2">Sorry, you have reached size {this.state.selectedSize.toUpperCase()} maximum stock.</p>
                    : null
                  }

                </div>
                {/* klo bukan user gabisa add to cart, keluarnya alert */}
                {
                  this.props.userGlobal.auth_status==="user"?
                  <button onClick={this.addToCartHandler} className="btn btn-sm btn-dark mt-3 col-6">
                      <p>Add to cart</p>
                  </button>
                  :
                  <button onClick={this.alertHandler} className="btn btn-sm btn-dark mt-3 col-6">
                      <p>Add to cart</p>
                  </button>

                }

              </>
            }



              <button className="btn btn-light mt-3 col-6 align-items-center">
                <Link to="/cart" className="link-see-cart">
                  See Cart
                </Link>

              </button>
          </div>
        </div>
        }
      </div>
    )
  }
}

const mapStateToProps =(state)=> {
  return{
      userGlobal: state.user,
  }
};

const mapDispatchToProps = {
  getCartData,
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductDetail);
