import React from 'react';
import "../assets/styles/cart.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import {getCartData} from '../redux/actions/cart';

import { getDistance } from 'geolib';
import { Map, GoogleApiWrapper,Marker  } from 'google-maps-react';

const mapStyles = {
    width: '20%',
    height: '40%',
  };

class Cart extends React.Component {
  state = {
    cartList:[],
    isCheckout:false,

    addressLocation:[],
    lat:0,
    long:0,
    distance:0,
    warehouseData:[],
    warehouseList:[],

    shippingPrice:18000,
    totalPrice:0,

    transactions_id:0,

    redirect:false,
    redirectNonUser:false,
  }

  fetchCartList = () => {
    Axios.get(`${API_URL}/cart/get?user_id=${this.props.userGlobal.user_id}`)
    .then((res)=> {
        this.setState({cartList:res.data})
    })
    .catch((err)=>{
        alert(err)
    })
  }

  fetchWarehouseData = () => {
    Axios.get(`${API_URL}/warehouse`)
    .then((res)=> {
        this.setState({warehouseData:res.data})
    })
    .catch((err)=>{
        alert(err)
    })
  }

  fetchAdressLocation = () => {
    Axios.get(`${API_URL}/keeplogin/address?user_id=${this.props.userGlobal.user_id}`)
    .then((res)=> {
            this.setState({addressLocation:res.data[0]})
            const sep = res.data[0].user_location.split(",")
            this.setState({lat:parseFloat(sep[0]),long:parseFloat(sep[1])})
            this.findDistance()
            this.createRequestStock()
    })
    .catch((err)=>{
        alert("address not found!")
    })
  }

  subTotalPrice = () => {
    let subTotalPrice = 0
    this.state.cartList.map((val)=> {
      subTotalPrice = subTotalPrice + val.price_sell*val.quantity
    })
    return subTotalPrice
  }

  fnTotalPrice = () => {
    this.setState({totalPrice: this.subTotalPrice()+this.state.shippingPrice})
  }

  createTransaction = () => {
    Axios.post(`${API_URL}/transaction/add`,{
      user_id: this.props.userGlobal.user_id,
      cartList: this.state.cartList
    })
    .then((res)=> {
        console.log(res.data[0].transactions_id)
        this.setState({transactions_id:res.data[0].transactions_id})
    })
    .catch((err)=>{
        alert(err)
    })
  }

  checkoutButton = () => {
    this.setState({isCheckout: true})
    this.fnTotalPrice()
    this.createTransaction()
    this.fetchAdressLocation()
  }

  findDistance = () => {
    var warehouseList = []
    this.state.warehouseData.map((val)=>{
      if(val.warehouse_name!=="superadmin"){
        let warehouseLoc = val.warehouse_location.split(",")

        let distance = getDistance(
          { latitude: this.state.lat, longitude: this.state.long },
          { latitude: parseFloat(warehouseLoc[0]), longitude:parseFloat(warehouseLoc[1]) }
        )
        warehouseList.push({
          warehouse_id: val.warehouse_id,
          warehouse_name: val.warehouse_name,
          warehouse_location: val.warehouse_location,
          warehouse_distance: distance,
        })
      }
    })

    warehouseList.sort((a,b) => {
      if(a.warehouse_distance<b.warehouse_distance){
          return -1
      } else if(a.warehouse_distance<b.warehouse_distance){
          return 1
      }
    })
    
    this.setState({warehouseList: warehouseList})
  }

  createRequestStock = () => {
    Axios.post(`${API_URL}/transaction/request`,{
      transactions_id: this.state.transactions_id,
      warehouseList: this.state.warehouseList,
      cartList: this.state.cartList
    })
    .then((res)=> {
        // console.log(res.data[0].transactions_id)
        // this.setState({transactions_id:res.data[0].transactions_id})
    })
    .catch((err)=>{
        alert(err)
    })
  }

  cancelButton = () => {
    Axios.post(`${API_URL}/transaction/cancel?transactions_id=${this.state.transactions_id}`,{
      cartList:this.state.cartList,
      warehouseList:this.state.warehouseList
    })
    .then((res)=> {
        console.log(`transaction ${this.state.transactions_id} cancelled by user`)
        this.setState({isCheckout: false,transactions_id:0})
    })
    .catch((err)=>{
        alert(err)
    })
  }

  paymentHandler = () => {
    console.log(this.state.transactions_id)
    Axios.post(`${API_URL}/transaction/continue?transactions_id=${this.state.transactions_id}&cart_id=${this.props.userGlobal.cart_id}`,{
      cartList:this.state.cartList,
      warehouseList:this.state.warehouseList
    })
    .then((res)=> {
        console.log(`transaction ${this.state.transactions_id} will be paid by user`)
        this.setState({isCheckout: false,transactions_id:0}, this.setState({redirect:true}))

    })
    .catch((err)=>{
        alert(err)
    })
  }

  renderProducts = ()=>{
    if(this.state.redirect){
      return <Redirect to="/payment" />
    }
    return this.state.cartList.map((val) =>{
      const totalPrice = val.price_sell*val.quantity
        return(
          <tr>
            <td className="align-middle">{val.product_name}</td>
            <td className="align-middle">Rp. {val.price_sell.toLocaleString()}</td>
            <td className="align-middle"><img src={API_URL + '/public' + val.product_image} className="admin-product-image" alt={val.productName}/></td>
            <td className="align-middle">
              {val.quantity}
            </td>
            <td className="align-middle">
              {val.size.toUpperCase()}
            </td>
            <td className="align-middle">
              Rp. {totalPrice.toLocaleString()}
            </td>
            <td className="align-middle">
              <button onClick={()=>{this.deleteHandler(val)}} className="btn btn-delete" >Delete</button>
            </td>
          </tr>
        )
    }
    )
  }

  refreshPage = ()=>{
    window.location.reload();
  }

  deleteHandler = (val) => {
    const confirmDelete = window.confirm(`Remove ${val.product_name} size ${val.size} from your cart?`)
    if(confirmDelete) {
        Axios.post(`${API_URL}/cart/delete`,{
            cart_id: this.props.userGlobal.cart_id,
            product_id: val.product_id,
            size: val.size.toLowerCase(),
        })
        .then(()=> {
            alert("Product removed from cart.")
            this.props.getCartData(this.props.userGlobal.user_id)
            this.refreshPage()
        })
        .catch((err)=>{
            alert(err)
        })
    }
  }

  componentDidMount(){
    if(this.props.userGlobal.auth_status==="user"){
      this.props.getCartData(this.props.userGlobal.user_id)
      this.setState({cartList: this.props.cartGlobal.cartList})
      this.fetchCartList()
      this.fetchWarehouseData()
    }else{
      this.setState({redirectNonUser:true})
    }

  }

  render(){
    if(this.state.redirectNonUser){
      return <Redirect to="/" />
    }
    return(
      <div className="p-5 cart-container">
        {
          this.state.isCheckout===false ? //kalo isCheckout true 
            <div className="row justify-content-around">
              <div className="mb-3 text-center col-9">
                <h3>You have {this.props.cartGlobal.cartList.length} item(s) in your cart.</h3>
              </div>
              <div className="col-9 text-center">
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Image</th>
                      <th>Quantity</th>
                      <th>Size</th>
                      <th>Total Price</th>
                      <th colSpan="2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderProducts()}
                  </tbody>
                  <tfoot className="bg-light">
                    <tr>
                      <td colSpan="7">
                        <button disabled={this.state.cartList.length===0} onClick={this.checkoutButton} className="btn btn-checkout">
                          Checkout
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
            </div>
          </div>
          : //kalau sudah klik checkout
          <div className="row justify-content-around">
          <div className="mb-3 text-center col-8">
            <h3>You have {this.state.cartList.length} item(s) in your cart.</h3>
          </div>
          <div className="col-3">
            
          </div>
          <div className="col-8 text-center">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th colSpan="2">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.renderProducts()}
              </tbody>
            </table>
          </div>
          <div className="col-3">
            <div className="card text-left">
              <div className="card-header text-center">
                <h4>
                  <strong>Order Summary</strong>
                </h4>
              </div>
              <div className="card-body">
                <div className="d-flex flex-row my-2 justify-content-between align-items center">
                  <p className="font-weight-bold">Subtotal Price</p>
                  <p>Rp. {this.subTotalPrice().toLocaleString()}</p>
                </div>
                <div className="d-flex flex-row my-2 justify-content-between align-items center">
                  <p className="font-weight-bold">Shipping Price</p>
                  <p>Rp. {this.state.shippingPrice.toLocaleString()}</p>
                </div>
                <div className="d-flex flex-row my-2 justify-content-between align-items center">
                  <p className="font-weight-bold">TOTAL PRICE</p>
                  <p>Rp. {this.state.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
            {
                this.state.addressLocation ?
                <>

                <div className="d-flex flex-row justify-content-between">
                    <button onClick={this.cancelButton} className="btn btn-cancel my-2">Cancel</button>
                    <button onClick={this.paymentHandler} className="btn btn-payment my-2">Continue to Payment</button>
                </div>
                <div className="d-flex flex-row mt-2 mb-5 justify-content-between align-items center">
                  {
                    this.state.warehouseList[0]?
                    <p className="centered-text" >Your products will be delivered from our <u><b>{this.state.warehouseList[0].warehouse_name}</b></u> warehouse.</p>
                    : null
                  }
                    
                </div>
                </>
                :
                <p style={{color:"red"}}>Please input address first in profile page before continue.</p>
            }



            <div className="mt-5 card-header text-center">
                <h4>
                  <strong>Recipient</strong>
                </h4>
              </div>
              <div className="card-body">
                <div className="d-flex flex-row my-2 justify-content-between align-items center">
                  <p className="font-weight-bold">Username</p>
                  <p>{this.props.userGlobal.username}</p>
                </div>
                <div className="d-flex flex-row my-2 justify-content-between align-items center">
                  <p className="font-weight-bold">Full Name</p>
                  {
                     this.props.userGlobal.fullname === "" ?
                     <p>-</p> 
                     :
                     <p>{this.props.userGlobal.fullname}</p>
                  }

                </div>
                {
                    this.state.addressLocation ?
                    <>
                        <div className="d-flex flex-row my-2 justify-content-between align-items center">
                            <p className="font-weight-bold">Address</p>
                        </div>
                        <div className="d-flex flex-row my-2 justify-content-between align-items center">
                            <p>{this.state.addressLocation.user_address}</p>
                        </div>
                        <div className="d-flex flex-row my-2 justify-content-between align-items center">
                            <p className="font-weight-bold">Map</p>
                        </div>
                        <div className="d-flex flex-row my-2 justify-content-between align-items center">
                            <Map
                                google={this.props.google}
                                zoom={3}
                                style={mapStyles}
                                initialCenter={{ 
                                    lat: -1.2404683671716086,  
                                    lng: 112.32018875937801
                                }}
                                >
                                <Marker position={{ 
                                    lat: this.state.lat, 
                                    lng: this.state.long
                                    }} 
                                />
                            </Map>
                        </div>

                    </>
                    :
                    null
                }
                
              </div>
            </div>

          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
    cartGlobal: state.cart
  }
}

const mapDispatchToProps = {
    getCartData,
  }
  

const connector = connect(mapStateToProps, mapDispatchToProps)(Cart);

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDzMPppyMnGM_KXvislVeOiGAy17Pw6yOM'
})(connector);