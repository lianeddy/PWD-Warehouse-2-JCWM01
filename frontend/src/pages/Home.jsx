import React from 'react';
import ProductCard from '../components/ProductCard'
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/home.css"

class Home extends React.Component {
  state = {
    productList: [],
    filteredProductList: [],
    page: 1,
    maxPage: 0,
    itemPerPage:8,
    searchProductName:"",
    searchCategory:"",
    sortProduct:"",
  }
 
  fetchproducts = () => {
    Axios.get(`${API_URL}/get-products-available`)
    .then((result) => {
      this.setState({productList: result.data, maxPage: Math.ceil(result.data.length/this.state.itemPerPage), filteredProductList: result.data})
      // alert("Berhasil mengambil data produk.")
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
    this.setState({page: this.state.page + 1})
  }

  prevPageHandler = () => {
    this.setState({page: this.state.page - 1})
  }

  //filter name
  fnFilterName = (input) =>{
    var keyword = this.state.searchProductName
    
    //filter
    const filterResult = input.filter((val) => {
        const nameLow = val.product_name.toLowerCase()
        const keywordLow = keyword.toLowerCase()
        
        return nameLow.includes(keywordLow)
    })
    
    return filterResult;
  }

  // filter cat
  fnFilterCat = (input) =>{
    //filter
    const filterResult = input.filter((val) => {
      return val.type.includes(this.state.searchCategory.toLowerCase())
    })
    
    return filterResult;
  }

  //filter ALL
  fnAllFilter = () => {
    let produk = this.state.productList;

    if (this.state.searchProductName !== ""){
        produk = this.fnFilterName(produk)
    } 

    if (this.state.searchCategory !== "All Items"){
        produk = this.fnFilterCat(produk)
    }

    this.setState({filteredProductList: produk, maxPage: Math.ceil(produk.length/this.state.itemPerPage),page: 1})
  }

  filterReset = () => {
    Axios.get(`${API_URL}/get-products-available`)
    .then((result) => {
      
      this.setState({filteredProductList: result.data, maxPage: Math.ceil(result.data.length/this.state.itemPerPage), page: 1})
      // alert("Berhasil mengambil data produk.")
    })
    .catch((err)=>{
      alert(err)
  })
  }

  //SORT
  fnSort = (inputData) => {
    const compareString = (a,b) => {
      if (a.product_name<b.product_name){
        return -1;
      }

      if (a.product_name>b.product_name){
        return 1;
      }

      return 0;
    }

    
    switch(this.state.sortProduct){
      case "asc":
        inputData.sort((a,b)=> a.price_sell - b.price_sell)
        break;
      case "dsc":
        inputData.sort((a,b)=> b.price_sell - a.price_sell)
        break;
      case "aToZ":
        inputData.sort(compareString)
        break;
      case "ztoA":
        inputData.sort((a,b)=> compareString(b,a))
        break;
  
      // <option value="asc">Lowest price</option>
      // <option value="dsc">Highest price</option>
      // <option value="aToZ">A to Z</option>
      // <option value="ztoA
      default:
        inputData = [...this.state.filteredProductList]
        break;
    }
  } 

  resetPage = () => {
    this.setState({page:1})
  }


  renderProducts = () => {
    //page 1 = mulai dari 0,1,2 (cut di 3)
    //page 2 = mulai dari 3,4,5 (cut di 6)
    //page 3 = mulai dari 6,7,8 (cut di 9)
    //dst
    let rawData = [...this.state.filteredProductList]
    this.fnSort(rawData)

    const beginIndex = (this.state.page-1)*this.state.itemPerPage
    const endIndex = beginIndex + this.state.itemPerPage
    const currentData = rawData.slice(beginIndex,endIndex)

    return currentData.map((val)=> {
      return <ProductCard productData={val} />
    })
  }

  componentDidMount(){
    this.fetchproducts()
  }

  render(){
    return(
      <div className=" mt-4 mb-5 container-style">
        
        <div className="row">
          <div className="col-2 filter-bar">
            {/* <div className="card">
              <div className="card-header">
                <strong>Filter Products</strong>
              </div>
              <div className="card-body">
                <label htmlFor="searchProductName">Product Name</label>
                <input type="text"
                  name="searchProductName" 
                  onChange={this.inputHandler}
                  className="form-control mb-3" 
                />
                
                <label htmlFor="searchCategory">Product Category</label>
                <select onChange={this.inputHandler} name="searchCategory" className="form-control">
                  <option value="All Items">All Items</option>
                  <option value="shirt">Shirt</option>
                  <option value="trouser">Trouser</option>
                  <option value="jeans">Jeans</option>
                  <option value="dress">Dress</option>
                  <option value="cardigan">Cardigan</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="shoes">Shoes</option>
                </select>
                <div className="align-items-center d-flex flex-row my-3 justify-content-end">
                  <button onClick={this.fnAllFilter} className="btn btn-dark mx-2">Filter</button>
                  <button onClick={this.filterReset} className="btn btn-light mx-2">Reset</button>
                </div>
              </div>
            </div>  */}
            <div>
              <h3>SHOP BY PRODUCT</h3>
              <h3>SHOP BY COLOR</h3>
            </div>

          </div>
          
          <div className="col-10">
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
                  <p>{this.state.filteredProductList.length} item(s)</p>
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
                  <button disabled={this.state.page===this.state.maxPage} onClick={this.nextPageHandler} className="btn btn-sm btn-dark">
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