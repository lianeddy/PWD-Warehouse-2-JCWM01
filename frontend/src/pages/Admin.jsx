import React from 'react';
import ProductCard from '../components/ProductCard'
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/admin.css"
import { connect } from 'react-redux'

class Admin extends React.Component {
  state = {
    menu:"products",
    productList:[],
    page: 1,
  }

  fetchAdminProduct = () => {
    Axios.get(`${API_URL}/products/admin-list?page=${this.state.page-1}&product_name=${this.props.userGlobal.searchProduct}`)
    .then((result) => {
      this.setState({productList: result.data})
    })
    .catch((err)=>{
      alert(err)
    })
  }
 
  inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({[name] : value})
  }

  renderProducts = ()=>{
    return this.state.productList.map((val,key) =>{
      return(
        <tr>
          <td>{key+1}</td>
          <td>{val.product_name}</td>
          <td>Rp. {val.price_buy.toLocaleString()}</td>
          <td>Rp. {val.price_sell.toLocaleString()}</td>
          <td>{val.category}</td>
          <td>{val.color}</td>
          <td><img src={val.product_image} className="admin-product-image" alt={val.productName}/></td>
          <td>{val.size.toUpperCase()}</td>
          <td>{val.available_stock}</td>
          <td>{val.hide}</td>
          <td>
            <button className="btn btn-edit" onClick={()=>this.editToggle(val)}>Edit</button>
          </td>
          <td>
            <button className="btn btn-delete" onClick={()=>this.fnDelete(val.id)}>Delete</button>
          </td>
        </tr>
      )
    })
  }

  nextPageHandler = () => {
    this.setState({page: this.state.page + 1}, this.fetchAdminProduct)
  }

  prevPageHandler = () => {
    this.setState({page: this.state.page - 1}, this.fetchAdminProduct)
  }

  componentDidMount = () => {
    this.fetchAdminProduct()
  }

  render(){
    return(
        <div className="admin-page">
          <h2>Hello, {this.props.userGlobal.username}!</h2>
          <h3>You are an {this.props.userGlobal.auth_status} of warehouse: DKI Jakarta.</h3>

          <div className="col-10 mt-3">
            <div className="d-flex flex-row justify-content-start">
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="products">Products</button>
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="history">Transaction History</button>
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="requests">Stock Requests</button>
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="revenue">Warehouse Revenue</button>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              {
                this.state.menu==="products"?
                <div>
                  <table className="table">
                    <thead className="table-light">
                      <tr>
                        <th>No.</th>
                        <th>Product Name</th>
                        <th>Buying Price</th>
                        <th>Selling Price</th>
                        <th>Category</th>
                        <th>Color</th>
                        <th>Image</th>
                        <th>Size</th>
                        <th>Stock</th>
                        <th>Hide?</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderProducts()}
                    </tbody>
                    <tfoot >
                        
                    </tfoot>
                  </table>
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <button className="btn-admin" disabled={this.state.page===1} onClick={this.prevPageHandler}>Previous Page</button>
                    <button className="btn-admin" onClick={this.nextPageHandler}>Next Page</button>
                  </div>
                </div>
                :
                this.state.menu==="history"?
                <h2>HISTORY TABLE</h2>
                :
                this.state.menu==="requests"?
                <h2>STOCK REQUESTS TABLE</h2>
                :
                this.state.menu==="revenue"?
                <h2>WAREHOUSE REVENUE TABLE</h2>
                :
                null
              }
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps =(state)=> {
  return{
    userGlobal: state.user,
  }
  };

  export default connect(mapStateToProps)(Admin);