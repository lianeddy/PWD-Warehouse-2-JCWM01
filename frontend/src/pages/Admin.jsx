import React from 'react';
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/admin.css"
import { connect } from 'react-redux'

class Admin extends React.Component {
  state = {
    menu:"add",
    productList:[],
    page: 1,
    maxPage:0,
    itemPerPage:10,
    adminData:[],
    selectedWarehouse:1,
    warehouseList:[],
    
    edit_id:0,
    edit_product_id:0,
    editName:"",
    editPrice:0,
    editCategory:"",
    editColor:"",
    editImageURL:"",

    edit_stock_id:0,
    editStock:0,

    transactionData: [],
    see_detail_id:0,
    detailTransactions:[],
  }

  fetchAdminData = () => {
    Axios.get(`${API_URL}/admin/data?user_id=${this.props.userGlobal.user_id}`)
    .then((result) => {
      this.setState({adminData: result.data[0]})
      this.selectWarehouse()
    })
    .catch((err)=>{
      alert(err)
  })
  }

  selectWarehouse = () => {
    if(this.state.adminData.auth_status==="admin"){
      
      this.setState({selectedWarehouse:this.state.adminData.warehouse_id})
      this.fetchAdminProduct()
      this.fetchTransactions()
    }
  }

  fetchTransactions = () => {
    let warehouse_id = 0
    if(this.state.adminData.auth_status==="admin"){
      warehouse_id = this.state.adminData.warehouse_id
    } else { 
      warehouse_id = this.state.selectedWarehouse
    }

    Axios.get(`${API_URL}/admin/transaction?warehouse_id=${warehouse_id}`)
    .then((result) => {
      this.setState({transactionData: result.data})
    
    })
    .catch((err)=>{
      alert(err)
    })
  }

  fetchAdminProduct = () => {
    Axios.get(`${API_URL}/admin/product-list?page=${this.state.page-1}&product_name=${this.props.userGlobal.searchProduct}&warehouse_id=${this.state.selectedWarehouse}`)
    .then((result) => {
      this.setState({productList: result.data}, this.fetchMaxPage())
      // console.log(this.state.productList)
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

    this.setState({selectedWarehouse : value},this.fetchTransactions,this.fetchAdminProduct)
    this.setState({page : 1})
    this.setState({see_detail_id:0})

  }

  editProducts = (val) =>{
    this.setState({edit_id:val.warehouse_stock_id})
    this.setState({edit_product_id:val.product_id})
  }

  editStock = (warehouse_stock_id) =>{
    this.setState({edit_stock_id:warehouse_stock_id})
  }

  cancelProducts = () =>{
    this.setState({edit_id:0})
    this.setState({edit_stock_id:0})
  }

  saveProducts = (e) =>{
    e.preventDefault();
    const confirmEdit = window.confirm("If you save your changes on this product, it would change the entire product data on other sizes and warehouses. Continue?")
    if(confirmEdit) {
      Axios.patch(`${API_URL}/admin/edit-product?product_id=${this.state.edit_product_id}&page=${this.state.page-1}&warehouse_id=${this.state.selectedWarehouse}`,{
        product_name: this.state.editName,
        price_sell: this.state.editPrice,
        category: this.state.editCategory,
        color: this.state.editColor,
        // product_image:  this.state.editImageURL
      })
      .then((result) => {
        console.log(result.data)
        this.fetchAdminProduct()
        this.setState({edit_id:0})
        this.setState({edit_product_id:0})
      })
      .catch((err)=>{
        console.log(err)
      })

      if (this.state.addFile) {
        let formData = new FormData() //buat kirim file

        //data yg disertakan pada image
        let obj = {
            product_id: this.state.edit_product_id,
        }

        formData.append('data', JSON.stringify(obj))
        formData.append('file', this.state.addFile)
        Axios.patch(`${API_URL}/upload/edit-image`, formData) //sesuai routing
            .then(res => {
                // this.getDataAlbum()
                alert(res.data.message)
                this.refreshPage()
            })
            .catch(err => {
                console.log(err)
            })
    }

    } 
  }

  saveStock = () =>{
    const confirmEdit = window.confirm("Continue change stock quantity?")
    if(confirmEdit) {
      Axios.patch(`${API_URL}/admin/edit-stock?warehouse_stock_id=${this.state.edit_stock_id}&page=${this.state.page-1}&warehouse_id=${this.state.selectedWarehouse}`,{
        warehouse_stock:this.state.editStock,
        user_stock:this.state.editStock,
      })
      .then((result) => {
        console.log(result.data)
        this.fetchAdminProduct()
        this.setState({edit_stock_id:0})
      })
      .catch((err)=>{
        console.log(err)
      })
    } 
  }

  hideProducts = (val) =>{
    const confirmEdit = window.confirm("You will only hide this product from user. Continue?")
    if(confirmEdit) {
      Axios.patch(`${API_URL}/admin/hide-product?product_id=${val.product_id}`)
      .then((result) => {
        console.log(result.data)
        this.fetchAdminProduct()
        alert(`Product ${val.product_name} is successfully hidden. User can't see this product anymore.`)
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  }

  showProducts = (val) =>{
    const confirmEdit = window.confirm("You will show this product to user. Continue?")
    if(confirmEdit) {
      Axios.patch(`${API_URL}/admin/show-product?product_id=${val.product_id}`)
      .then((result) => {
        console.log(result.data)
        this.fetchAdminProduct()
        alert(`Product ${val.product_name} is successfully shown. User can see this product now.`)
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  }

  renderProducts = ()=>{
    return this.state.productList.map((val) =>{
      if(val.warehouse_stock_id===this.state.edit_id){
        return(
          <tr>
            <td>
              <input className="input-admin" type="text" value={this.state.editName} placeholder={val.product_name} onChange={this.inputHandler} name="editName" />
            </td>
            <td>Rp. {val.price_buy.toLocaleString()}</td>
            <td>
              <input className="input-admin" type="number" value={this.state.editPrice} placeholder={val.price_sell} onChange={this.inputHandler} name="editPrice" />
            </td>
            <td>
              <input className="input-admin" type="text" value={this.state.editCategory} placeholder={val.category} onChange={this.inputHandler} name="editCategory" />
            </td>
            <td>
              <input className="input-admin" type="text" value={this.state.editColor} placeholder={val.color} onChange={this.inputHandler} name="editColor" />
            </td>
            <td>
              <input  ref={elemen => this.edit_product_image = elemen} type="file" className="form-control-file" id="product_image" onChange={this.onBtnEditFile} />
              <div className="imgpreview-edit-container">
                    <p>Product Image Preview</p>
                    <img className="imgpreview-edit" id="imgpreview-edit" width="25%" />
              </div>
              {/* <input className="input-admin" type="text" value={this.state.editImageURL} placeholder="Image URL" onChange={this.inputHandler} name="editImageURL" /> */}
            </td>
            <td>{val.size.toUpperCase()}</td>
            <td>{val.available_stock}</td>
            <td colSpan="2">
              <button className="btn btn-save" onClick={this.saveProducts}>Save Product</button>
            </td>
            <td>
              <button className="btn btn-cancel" onClick={this.cancelProducts}>Cancel</button>
            </td>
          </tr>
        )
      }
      if(val.warehouse_stock_id===this.state.edit_stock_id){
        return(
          <tr>
            <td>{val.product_name}</td>
            <td>Rp. {val.price_buy.toLocaleString()}</td>
            <td>Rp. {val.price_sell.toLocaleString()}</td>
            <td>{val.category}</td>
            <td>{val.color}</td>
            <td><img src={API_URL + '/public' + val.product_image} className="admin-product-image" alt={val.productName}/></td>
            <td>{val.size.toUpperCase()}</td>
            <td>
              <input className="input-admin" type="text" value={this.state.editStock} placeholder={val.available_stock} onChange={this.inputHandler} name="editStock" />
            </td>
            <td colSpan="2">
              <button className="btn btn-save" onClick={this.saveStock} >Save Stock</button>
            </td>
            <td>
              <button className="btn btn-cancel" onClick={this.cancelProducts}>Cancel</button>
            </td>
          </tr>
        )
      }
      else{
        return(
          <tr>
            <td>{val.product_name}</td>
            <td>Rp. {val.price_buy.toLocaleString()}</td>
            <td>Rp. {val.price_sell.toLocaleString()}</td>
            <td>{val.category}</td>
            <td>{val.color}</td>
            <td><img src={API_URL + '/public' + val.product_image} className="admin-product-image" alt={val.productName}/></td>
            <td>{val.size.toUpperCase()}</td>
            <td>{val.available_stock}</td>
            <td>
              <button className="btn btn-edit" onClick={()=>this.editProducts(val)}>Edit Product</button>
            </td>
            <td>
              <button className="btn btn-edit" onClick={()=>this.editStock(val.warehouse_stock_id)}>Edit Stock</button>
            </td>
            {
              val.hide===1?
              <td>
                <button className="btn btn-delete" onClick={()=>this.hideProducts(val)}>Delete</button>
              </td>
              :
              <td>
                <button className="btn btn-show" onClick={()=>this.showProducts(val)}>Show</button>
              </td>
            }

          </tr>
        )
      }

      
    })
  }

  seeDetailHandler = (val) => {
    this.setState({see_detail_id: val.transactions_id}, this.fetchTransactionItems)

  }

  renderTransactions = () => {
    return this.state.transactionData.map((val) =>{
      return(
        <tr>
            <td>{val.time.slice(0,10)}</td>
            <td>{val.time.slice(11,19)}</td>
            <td>{val.transaction_status} id: {val.transactions_id}</td>
            <td>{val.warehouse_name}</td>
            <td>{val.username}</td>
            <td>
              <button onClick={()=>this.seeDetailHandler(val)} >See Details</button>
            </td>
        </tr>
      )
    })
  }

  fetchTransactionItems = () => {
    console.log(this.state.see_detail_id)
    Axios.get(`${API_URL}/admin/transaction-items?transactions_id=${this.state.see_detail_id}`)
    .then((result) => {
      this.setState({detailTransactions: result.data})
      console.log(result.data)
    
    })
    .catch((err)=>{
      alert(err)
    })
  }

  renderTransactionItems = () =>{
    return this.state.detailTransactions.map((val)=>{
      return(
        <tr>
          <td>{val.product_name}</td>
          <td><img src={API_URL + '/public' + val.product_image} className="detail-transaction-image" alt={val.product_name}/></td>
          <td>{val.size.toUpperCase()}</td>
          <td>{val.quantity}</td>
          <td>Rp. {val.transaction_price.toLocaleString()}</td>
          <td>Rp. {(val.quantity*val.transaction_price).toLocaleString()}</td>
        </tr>
      )
    })
  }

  closeDetailHandler = () => {
    this.setState({see_detail_id:0})
  }

  refreshPage = ()=>{
    window.location.reload();
  }

  onBtAdd = (e) => {
    e.preventDefault();
    if (this.state.addFile) {
      
        let formData = new FormData() //buat kirim file

        //data yg disertakan pada image
        let obj = {
            product_name: this.input_product_name.value,
            price_buy: this.input_price_buy.value,
            price_sell: this.input_price_sell.value,
            product_desc: this.input_product_desc.value,
            category: this.input_category.value,
            color: this.input_color.value,
            warehouse_id: this.state.selectedWarehouse,
            size: this.input_size.value
        }

        formData.append('data', JSON.stringify(obj))
        formData.append('file', this.state.addFile)
        Axios.post(`${API_URL}/upload/add-product`, formData) //sesuai routing
            .then(res => {
                // this.getDataAlbum()
                alert(res.data.message)
                this.refreshPage()
            })
            .catch(err => {
                console.log(err)
            })
    }
  }

  onBtAddFile = (e) => {
    if (e.target.files[0]) {
        this.setState({ addFileName: e.target.files[0].name, addFile: e.target.files[0] })
        //untuk preview
        let preview = document.getElementById("imgpreview")
        preview.src = URL.createObjectURL(e.target.files[0])
    }
  }

  onBtnEditFile = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
        this.setState({ addFileName: e.target.files[0].name, addFile: e.target.files[0] })
        //untuk preview
        let preview = document.getElementById("imgpreview-edit")
        preview.src = URL.createObjectURL(e.target.files[0])
    }
  }

  componentDidMount = () => {
    if(this.props.userGlobal.auth_status==="superadmin"){
      this.fetchAdminProduct()
      this.fetchTransactions()
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
              <h3>You are a <u><b>{this.props.userGlobal.auth_status}</b></u>.</h3>
              <div className="mt-3 col-4 d-flex flex-row justify-content-start align-items-center">
                <p className="me-2" >Please select a warehouse</p>
                <select onChange={this.warehouseHandler} name="selectedWarehouse" className="form-control filter-style">
                  {this.renderWarehouse()}
                </select>
              </div>

            </>
            :
            <h3>You are an {this.props.userGlobal.auth_status} of warehouse: <u><b>{this.state.adminData.warehouse_name}</b></u>.</h3>
          }
          

          <div className="col-10 mt-3">
            <div className="d-flex flex-row justify-content-start">
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="add">Add Product</button>
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="products">Products List</button>
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="history">Transaction History</button>
              <button className="btn-admin" name="menu" onClick={this.inputHandler} value="requests">Stock Requests</button>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              {
                this.state.menu==="add"?
                <div className="col-12 add-product-container">
                  <div>
                    <h2>ADD PRODUCT</h2>
                    <form>
                      <div className="form-group">
                        <label htmlFor="product_name">Product Name</label>
                        <input ref={elemen => this.input_product_name = elemen} type="text" className="form-control product-input-text" id="product_name" placeholder="Product name"  />
                      </div>
                      <div className="d-flex flex-row justify-content-between">
                        <div className="form-group">
                          <label htmlFor="price_buy">Price Buy</label>
                          <input ref={elemen => this.input_price_buy = elemen} type="number" className="form-control product-input-number" id="price_buy" placeholder="Price buy"  />
                        </div>
                        <div className="form-group">
                          <label htmlFor="price_sell">Price Sell</label>
                          <input ref={elemen => this.input_price_sell = elemen} type="number" className="form-control product-input-number" id="price_sell" placeholder="Price sell"  />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="product_desc">Product Description</label>
                        <textarea  ref={elemen => this.input_product_desc = elemen} type="text" className="form-control product-input-desc" id="product_desc" placeholder="Product description"  />
                      </div>
                      <div className="form-group">
                        <label htmlFor="category">Cateogry</label>
                        <input  ref={elemen => this.input_category = elemen} type="text" className="form-control product-input-text" id="category" placeholder="Category"  />
                      </div>
                      <div className="form-group">
                        <label htmlFor="color">Color</label>
                        <input  ref={elemen => this.input_color = elemen} type="text" className="form-control product-input-text" id="color" placeholder="Color"  />
                      </div>
                      <div className="form-group">
                        <label for="size">Input sizes (separate with comma)</label>
                        <small id="sizeHelp1" class="form-text text-muted">Example 1: S,M,L,XL</small>
                        <small id="sizeHelp2" class="form-text text-muted">Example 2: 37,38,39,40</small>
                        <input  ref={elemen => this.input_size = elemen} type="text" className="form-control product-input-text" id="size" placeholder="Size, separated with comma" />
                      </div>
                      <div className="form-group">
                        <label for="product_image">Upload Product Image</label>
                        <input  ref={elemen => this.input_product_image = elemen} type="file" className="form-control-file" id="product_image" onChange={this.onBtAddFile} />
                      </div>
                      <button onClick={(e)=>this.onBtAdd(e)} className="btn btn-save">Add Product</button>
                    </form>
                  </div>
                  <div className="imgpreview-container">
                    <h4>Product Image Preview</h4>
                    <img className="imgpreview" id="imgpreview" width="100%" />
                  </div>
                </div>
                :
                this.state.menu==="products"?
                <>

                  <div className="col-12">
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
                          <th colSpan="3">Action</th>
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
                </>
                :
                this.state.menu==="history"?
                <div className="d-flex flex-direction-column justify-content-between align-items-start col-12">
                  
                  {
                    this.state.see_detail_id !==0 ?
                    <>
                    <div className="mt-3 col-6">
                      <h3>Transaction History</h3>
                      <table className="table">
                          <thead className="table-light">
                              <tr>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Transaction Status</th>
                                  <th>Warehouse Name</th>
                                  <th>Username</th>
                                  <th>Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {this.renderTransactions()}
                          </tbody>
                      </table>
                    </div>
                    <div className="mt-3 col-5">
                      <h3>Transaction Details</h3>
                      <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th>Product</th>
                                <th>Product Image</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                          {this.renderTransactionItems()}
                        </tbody>
                      </table>
                      <button onClick={this.closeDetailHandler} className="btn btn-cancel">Close</button>
                    </div>
                    </>
                    :
                    <div className="mt-3 col-10">
                      <h3>Transaction History</h3>
                      <table className="table">
                          <thead className="table-light">
                              <tr>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Transaction Status</th>
                                  <th>Warehouse Name</th>
                                  <th>Username</th>
                                  <th>Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {this.renderTransactions()}
                          </tbody>
                      </table>
                    </div>
                  }
                </div>
                :
                this.state.menu==="requests"?
                <h2>STOCK REQUESTS TABLE</h2>
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