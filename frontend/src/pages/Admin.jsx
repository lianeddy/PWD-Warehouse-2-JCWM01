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
    itemPerPage:10,
    adminData:[],
    selectedWarehouse:1,
    warehouseList:[]
  }

  fetchAdminData = () => {
    Axios.get(`${API_URL}/admin/data?user_id=${this.props.userGlobal.user_id}`)
    .then((result) => {
      this.setState({adminData: result.data[0]})
      // console.log("adminData", this.state.adminData)
      this.selectWarehouse()
    
    })
    .catch((err)=>{
      alert(err)
  })
  }

  selectWarehouse = () => {
    // console.log("authstatus",this.state.adminData.auth_status)
  
    if(this.state.adminData.auth_status==="admin"){
      
      this.setState({selectedWarehouse:this.state.adminData.warehouse_id})
      this.fetchAdminProduct()
    }

  }

  fetchAdminProduct = () => {
    Axios.get(`${API_URL}/admin/product-list?page=${this.state.page-1}&product_name=${this.props.userGlobal.searchProduct}&warehouse_id=${this.state.selectedWarehouse}`)
    .then((result) => {
      this.setState({productList: result.data}, this.fetchMaxPage())
    })
    .catch((err)=>{
      alert(err)
    })
  }

  fetchMaxPage = () => {
    Axios.get(`${API_URL}/admin/product-max-page?product_name=${this.props.userGlobal.searchProduct}&warehouse_id=${this.state.selectedWarehouse}`)
    .then((result) => {
      this.setState({maxPage: Math.ceil((result.data[0].sumProduct)/this.state.itemPerPage)})
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

  fetchWarehouseList = () => {
    Axios.get(`${API_URL}/admin/warehouse`)
    .then((result) => {
      this.setState({warehouseList:result.data})
    })
    .catch((err)=>{
      alert(err)
  })
  }

  renderWarehouse = () => {
    return this.state.warehouseList.map((val)=> {
      if(val.warehouse_name!=="superadmin"){
        return <option value={val.warehouse_id}>{val.warehouse_name}</option>
      }
    })
  }

  warehouseHandler = (event) => {
    const value = event.target.value;

    this.setState({selectedWarehouse : value},this.fetchAdminProduct)
    this.setState({page : 1})

  }

  componentDidMount = () => {
    if(this.props.userGlobal.auth_status==="superadmin"){
      this.fetchAdminProduct()
    }
    this.fetchAdminData()
    this.fetchWarehouseList()
  }

  render(){
    return(
        <div className="admin-page">
          <h2>Hello, {this.props.userGlobal.username}!</h2>

          {
            this.props.userGlobal.auth_status==="superadmin"?
            <>
              <h3>You are a {this.props.userGlobal.auth_status}.</h3>
              <div className="mt-3 col-4 d-flex flex-row justify-content-start align-items-center">
                <p className="me-2" >Please select a warehouse</p>
                <select onChange={this.warehouseHandler} name="selectedWarehouse" className="form-control filter-style">
                  {this.renderWarehouse()}
                </select>
              </div>

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