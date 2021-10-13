import React from 'react';
import ProductCard from '../components/ProductCard'
import Axios from 'axios'
import {API_URL} from '../constants/API'
import "../assets/styles/product.css"
import { connect } from 'react-redux'

class Admin extends React.Component {
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
 
  render(){
    return(
        <div>

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