import React from 'react';
import "../assets/styles/cart.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'
import {connect} from 'react-redux';
import {getCartData} from '../redux/actions/cart';

class Cart extends React.Component {
  state = {
    cartList:[],
    isCheckout:false,
    addressLocation:[],
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

  fetchAdressLocation = () => {
    Axios.get(`${API_URL}/login/address?user_id=${this.props.userGlobal.user_id}`)
    .then((res)=> {
        this.setState({addressLocation:res.data})
    })
    .catch((err)=>{
        alert(err)
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
    this.setState({totalPrice: this.subTotalPrice()})
  }

  checkoutButton = () => {
    this.setState({isCheckout: true})
    this.fnTotalPrice()
    this.fetchAdressLocation()
  }

  cancelButton = () => {
    this.setState({isCheckout: false})
  }

  renderProducts = ()=>{
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
    this.props.getCartData(this.props.userGlobal.user_id)
    this.setState({cartList: this.props.cartGlobal.cartList})
    this.fetchCartList()
    
  }

  render(){
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
                        <button onClick={this.checkoutButton} className="btn btn-checkout">
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
                  <p className="font-weight-bold">TOTAL PRICE</p>
                  <p>Rp. {this.state.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center">
                <button onClick={this.cancelButton} className="btn btn-cancel my-2">Cancel</button>
            </div>

            <div className="card-header text-center">
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
                     this.props.userGlobal.fullName === "" ?
                     <p>-</p> 
                     :
                     <p>{this.props.userGlobal.fullName}</p>
                  }

                </div>
                <div className="d-flex flex-row my-2 justify-content-between align-items center">
                  <p className="font-weight-bold">Address</p>
                  <p>{this.state.addressLocation.user_address}</p>
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center">
                <button onClick={this.cancelButton} className="btn btn-cancel my-2">Cancel</button>
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
  
  export default connect(mapStateToProps,mapDispatchToProps)(Cart);