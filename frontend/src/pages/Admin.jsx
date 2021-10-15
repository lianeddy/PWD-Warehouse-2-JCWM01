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
    maxPage:0,
    itemPerPage:5,
    adminData:[],
    selectedWarehouse:1,
  }

  fetchAdminProduct = () => {
    console.log("selected wh product",this.state.selectedWarehouse)
    Axios.get(`${API_URL}/admin/product-list?page=${this.state.page-1}&product_name=${this.props.userGlobal.searchProduct}&warehouse_id=1`)
    .then((result) => {
      this.setState({productList: result.data})
    })
    .catch((err)=>{
      alert(err)
    })
  }

  fetchMaxPage = () => {
    console.log("selected wh maxpage",this.state.selectedWarehouse)
    Axios.get(`${API_URL}/admin/product-max-page?product_name=${this.props.userGlobal.searchProduct}&warehouse_id=1`)
    .then((result) => {
      this.setState({maxPage: Math.ceil((result.data[0].sumProduct)/this.state.itemPerPage)})
      console.log(this.state.maxPage)
    })
    .catch((err)=>{
      alert(err)
  })
  }

  fetchAdminData = () => {
    Axios.get(`${API_URL}/admin/data?user_id=2`)
    .then((result) => {
      this.setState({adminData: result.data[0]})
      console.log(this.state.adminData)
      this.fetchSelectedWarehouse(this.state.adminData)
    })
    .catch((err)=>{
      alert(err)
  })
  }
  
  fetchSelectedWarehouse = (adminData) => {
    if(adminData.auth_status==="admin"){
      this.setState({selectedWarehouse:adminData.warehouse_id})
    }
    else{
      this.setState({selectedWarehouse:1})
    }
  }

 
  inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({[name] : value})
  }

  renderProducts = ()=>{
    return this.state.productList.map((val) =>{
      return(
        <tr>
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
    this.fetchAdminData()
    this.fetchMaxPage()
    this.fetchAdminProduct()
    // this.fetchAdminData()
  }

  render(){
    return(
        <div className="admin-page">
          <h2>Hello, {this.props.userGlobal.username}!</h2>

          {
            this.props.userGlobal.auth_status==="superadmin"?
            <>
              <h3>You are a {this.props.userGlobal.auth_status}.</h3>
              <h3>Please select a warehouse</h3>
            </>
            :
            <h3>You are an {this.props.userGlobal.auth_status} of warehouse: {this.state.adminData.warehouse_name}.</h3>
          }
          

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
                    <p>Page {this.state.page} of {this.state.maxPage}</p>
                    <button className="btn-admin" disabled={this.state.page===this.state.maxPage} onClick={this.nextPageHandler}>Next Page</button>
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