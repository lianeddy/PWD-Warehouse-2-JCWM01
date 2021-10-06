import React from 'react';
import ProductCard from '../components/ProductCard'
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/home.css"

class Home extends React.Component {
  state = {
    productList: [],
    categoryList:[],
    colorList:[],
    page: 1,
    maxPage: 0,
    itemPerPage:8,
    searchProductName:"",
    searchCategory:"",
    sortProduct:"",
  }
 
  fetchproducts = () => {
    Axios.get(`${API_URL}/get-products?page=${this.state.page-1}`)
    .then((result) => {
      this.setState({productList: result.data})
      //this.setState({page: this.state.page + result.data.length })
      // alert("Berhasil mengambil data produk.")
    })
    .catch((err)=>{
      alert(err)
  })
  }

  fetchCategoryList = () => {
    Axios.get(`${API_URL}/get-products-category`)
    .then((result) => {
      this.setState({categoryList:result.data})
      // console.log(this.state.categoryList)
    })
    .catch((err)=>{
      alert(err)
  })
  }

  renderCategory = () => {
    return this.state.categoryList.map((val)=> {
      const capital = val.category.charAt(0).toUpperCase() + val.category.slice(1);
      return <li><button className="button-second"><p>{capital}</p></button></li>
  
    })
  }

  fetchColorList = () => {
    Axios.get(`${API_URL}/get-products-color`)
    .then((result) => {
      this.setState({colorList:result.data})
      // console.log(this.state.colorList)
    })
    .catch((err)=>{
      alert(err)
  })
  }

  renderColor = () => {
    return this.state.colorList.map((val)=> {
      const capital = val.color.charAt(0).toUpperCase() + val.color.slice(1);
      return <li><button className="button-second"><p>{capital}</p></button></li>
  
    })
  }

  fetchMaxPage = () => {
    Axios.get(`${API_URL}/get-products-max-page`)
    .then((result) => {
      this.setState({maxPage: Math.ceil((result.data[0].sumProduct)/this.state.itemPerPage)})
      // console.log(result.data[0].sumProduct)
    })
    .catch((err)=>{
      alert(err)
  })
  }

  inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    //name dikasi kurung siku soalnya dia variabel
    this.setState({[name] : value})
  }

  nextPageHandler = () => {
    this.setState({page: this.state.page + 1}, this.fetchproducts)
    // console.log(this.state.page)
  }

  prevPageHandler = () => {
    this.setState({page: this.state.page - 1}, this.fetchproducts)
    // console.log(this.state.page)
  }

  renderProducts = () => {
    let rawData = [...this.state.productList]
    // this.fnSort(rawData)

    return rawData.map((val)=> {
      return <ProductCard productData={val} />
    })
  }

  componentDidMount(){
    this.fetchproducts()
    this.fetchCategoryList()
    this.fetchColorList()
    this.fetchMaxPage()
  }

  render(){
    return(
      <div className=" mt-4 mb-5 container-style">
        
        <div className="row">
          <div className="col-2 filter-bar">
            <div>
              <h3>SHOP BY PRODUCT</h3>
              <ul>
                {this.renderCategory()}
              </ul>

              <h3>SHOP BY COLOR</h3>
              <ul>
                {this.renderColor()}
              </ul>
            </div>

          </div>
          
          <div className="col-10 ">
              <div className="d-flex flex-direction-row align-items-center justify-content-between mb-3">
                <div className="d-flex flex-direction-row align-items-center justify-content-start col-4 px-3">
                  <select onChange={this.inputHandler} onClick={this.resetPage} name="sortProduct" className="form-control filter-style">
                    <option value="def">SORT BY</option>
                    <option value="asc">Lowest price</option>
                    <option value="dsc">Highest price</option>
                    <option value="aToZ">A to Z</option>
                    <option value="ztoA">Z to A</option>
                  </select>
                </div>
                <div className="col-4 "> </div>
                <div className="d-flex flex-direction-row align-items-center justify-content-end col-4 px-5">
                  <p>{this.state.productList.length} item(s)</p>
                </div>
              </div>

            
              <div className="d-flex flex-wrap  align-items-center flex-row justify-content-start">
                {/* Render Products Here */}
                {this.renderProducts()}
              </div>

              <div className="d-flex flex-direction-row align-items-center justify-content-between mt-3">
                <div className="col-4"></div>
                <div className="col-4 d-flex flex-direction-row align-items-center justify-content-center"> 
                  <button disabled={this.state.page===1} onClick={this.prevPageHandler} className="btn btn-sm btn-dark">
                    {"<"}
                  </button>
                  <p className="text-center text-page my-0 mx-2">Page {this.state.page} of {this.state.maxPage}</p>
                  <button disabled={this.state.page===this.state.maxPage}  onClick={this.nextPageHandler} className="btn btn-sm btn-dark">
                    {">"}
                  </button>
                </div>
                <div className="col-4"></div>
              </div>

          </div>


        </div>
      </div>
    )
  }
}

export default Home;