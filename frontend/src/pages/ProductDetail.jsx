import React from 'react';
import Axios from 'axios'
import {API_URL} from '../constants/API'
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom'

class ProductDetail extends React.Component {
  state = {
    productData: {},
    productNotFound: false,
    productQty: 1,
  }

  fetchproducts = () => {
    console.log(this.props.match.params.product_id)
    Axios.get(`${API_URL}/get-products-available`, {
      params: {
        product_id: this.props.match.params.product_id
      }
    })
    .then((result) => {
      if(result.data.length){
        this.setState({productData: result.data[0]})
        // alert("Berhasil mengambil data produk.")
      } else {
        this.setState({productNotFound:true})
      }
    })
    .catch((err)=>{
      alert(err)
  })
  } 

  fnQuantityUp = () => {
    this.setState({productQty: this.state.productQty + 1})
  }

  fnQuantityDown = () => {
    this.setState({productQty: this.state.productQty - 1})
  }

  kasihTitik = (val) => {
    const toInt = parseInt(val)
    return toInt.toLocaleString()
  }

  componentDidMount(){
    this.fetchproducts()
  }

  render(){
    return(
      <div className="container">
        {
          this.state.productNotFound ?
          <div className="text-center m-3 p-2 alert alert-warning align-items-center">
              Produk dengan ID: {this.props.match.params.product_id} tidak ditemukan.
          </div>
        :
        <div className="row mt-3">
          <div className="col-6 d-flex justify-content-end">
            <img 
              style={{width:"70%"}}
              src={this.state.productData.product_image}
              alt="product-image" 
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center">
            <h4>{this.state.productData.product_name}</h4>
            <h5>Rp. {this.kasihTitik(this.state.productData.price_sell)}</h5>
            <p>
              {this.state.productData.product_desc} 
            </p>
            <div className="d-flex flex-row align-items-center">
              <button disabled={this.state.productQty===1} onClick={this.fnQuantityDown} className="btn btn-primary">
                -
              </button>
              <div className="mx-4">
                {this.state.productQty}
              </div>
              <button onClick={this.fnQuantityUp} className="btn btn-primary">
                +
              </button>
            </div>
            <button className="btn btn-success mt-3 col-6">
                Add to cart
            </button>
              <button className="btn btn-light mt-3 col-6">
                See Cart
              </button>
          </div>
        </div>
        }
      </div>
    )
  }
}

export default ProductDetail;