import React from 'react';
import ProductCard from '../components/ProductCard'
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/product.css"
import { connect } from 'react-redux'

class Products extends React.Component {
  state = {
    productList: [],
    categoryList:[],
    colorList:[],
    page: 1,
    maxPage: 0,
    itemPerPage:8,
    searchProductName:"",
    searchCategory:"",
    searchColor:"",
    sortProduct:"",
  }
 
  fetchproducts = () => {
    Axios.get(`${API_URL}/get-products?page=${this.state.page-1}&product_name=${this.props.userGlobal.searchProduct}`)
    .then((result) => {
      this.setState({productList: result.data},this.fetchMaxPage())
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
    })
    .catch((err)=>{
      alert(err)
  })
  }

  renderCategory = () => {
    return this.state.categoryList.map((val)=> {
      const capital = val.category.charAt(0).toUpperCase() + val.category.slice(1);
      if(this.state.searchCategory===""){
        return <li><button onClick={()=>this.categoryHandler(val.category)} className="button-second"><p>{capital}</p></button></li>
      }else{
        if(val.category===this.state.searchCategory){
          return <li><button onClick={()=>this.categoryHandler(val.category)} className="button-second selected"><p>{capital}</p></button></li>
        }else{
          return <li><button onClick={()=>this.categoryHandler(val.category)} className="button-second" style={{color:'lightgrey'}}><p>{capital}</p></button></li>
        }
      }
    })
  }

  fetchColorList = () => {
    Axios.get(`${API_URL}/get-products-color`)
    .then((result) => {
      this.setState({colorList:result.data})
    })
    .catch((err)=>{
      alert(err)
  })
  }

  renderColor = () => {
    return this.state.colorList.map((val)=> {
      const capital = val.color.charAt(0).toUpperCase() + val.color.slice(1);
      if(this.state.searchColor===""){
        return <li><button onClick={()=>this.colorHandler(val.color)} className="button-second"><p>{capital}</p></button></li>
      }else{
        if(val.color===this.state.searchColor){
          return <li><button onClick={()=>this.colorHandler(val.color)} className="button-second selected"><p>{capital}</p></button></li>
        }else{
          return <li><button onClick={()=>this.colorHandler(val.color)} className="button-second" style={{color:'lightgrey'}}><p>{capital}</p></button></li>
        }
      }
    })
  }

  fetchMaxPage = () => {
    Axios.get(`${API_URL}/get-products-max-page?category=${this.state.searchCategory}&color=${this.state.searchColor}&product_name=${this.props.userGlobal.searchProduct}`)
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

    //name dikasi kurung siku soalnya dia variabel
    this.setState({[name] : value})
  }

  sortHandler = (event) => {
    const value = event.target.value;

    this.setState({sortProduct : value},this.fetchFilteredProducts)
    this.setState({page : 1})
  }

  categoryHandler = (category) => {
    this.setState({searchCategory : category})
    this.setState({page : 1})
  }

  colorHandler = (color) => {
    this.setState({searchColor : color})
    this.setState({page : 1})
  }

  fetchFilteredProducts = () => {
    console.log("sortby",this.state.sortProduct)
    console.log("category",this.state.searchCategory)
    console.log("color",this.state.searchColor)
    console.log("product_name",this.props.userGlobal.searchProduct)
    this.fetchMaxPage()

    Axios.get(`${API_URL}/get-products?page=${this.state.page-1}&sortby=${this.state.sortProduct}&category=${this.state.searchCategory}&color=${this.state.searchColor}&product_name=${this.props.userGlobal.searchProduct}`)
    .then((result) => {
      this.setState({productList: result.data})
    })
    .catch((err)=>{
      alert(err)
    })
  }

  nextPageHandler = () => {
    this.setState({page: this.state.page + 1}, this.fetchproducts)
  }

  prevPageHandler = () => {
    this.setState({page: this.state.page - 1}, this.fetchproducts)
  }

  renderProducts = () => {
    let rawData = [...this.state.productList]
    // this.fnSort(rawData)

    return rawData.map((val)=> {
      return <ProductCard productData={val} />
    })

  }

  clearFilter=()=>{
    this.setState({searchCategory:""})
    this.setState({searchColor:""})
    this.fetchproducts()
  }

  componentDidUpdate(prevProps){
    if (prevProps.userGlobal.searchProduct !== this.props.userGlobal.searchProduct)
    {
      this.fetchFilteredProducts()
    }
  }

  componentDidMount(){
    this.fetchproducts()
    this.fetchCategoryList()
    this.fetchColorList()
    this.fetchMaxPage()
    console.log(this.props.userGlobal.searchProduct)
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
            <div>
              <button className="btn btn-dark btn-sm filter" onClick={this.fetchFilteredProducts}><p>Filter</p></button>
              <button className="btn btn-light btn-sm ms-2 filter" onClick={this.clearFilter}><p>Reset Filter</p></button>
            </div>
          </div>

          <div className="col-10 ">
              <div className="d-flex flex-direction-row align-items-center justify-content-between mb-3">
                <div className="d-flex flex-direction-row align-items-center justify-content-start col-4 px-3">
                  <select onChange={this.sortHandler} name="sortProduct" className="form-control filter-style">
                    <option value="def">SORT BY</option>
                    <option value="price_asc">Lowest price</option>
                    <option value="price_desc">Highest price</option>
                    <option value="name_asc">A to Z</option>
                    <option value="name_desc">Z to A</option>
                  </select>
                </div>
                <div className="col-4 "> </div>
                <div className="d-flex flex-direction-row align-items-center justify-content-end col-4 px-5">
                  <p>{this.state.productList.length} item(s)</p>
                </div>
              </div>

              {
                this.state.productList.length===0 ?
                <div className="d-flex align-items-center flex-row justify-content-center mt-5">
                  <h4>Sorry, none of our collections match your search. Please try again.</h4>
                </div>
                :
                <>
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
                </>
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

  export default connect(mapStateToProps)(Products);